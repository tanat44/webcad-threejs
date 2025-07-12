import {
  Box3,
  OrthographicCamera,
  Plane,
  Quaternion,
  Raycaster,
  ShaderMaterial,
  Vector2,
  Vector3,
} from "three";
import { Graphic } from "./Graphic";

const ORBIT_RADIUS = 100;

export class OrthoOrbit {
  private camera: OrthographicCamera;
  private domElement: HTMLElement;
  private rayCaster: Raycaster;
  private graphic: Graphic;

  private cameraStartPosition: Vector3 | null = null;
  private mouseDownScreen: Vector2 | null = null;
  private viewCenter: Vector3 | null = null;
  private zoom: number = 1;

  constructor(camera: OrthographicCamera, graphic: Graphic) {
    this.camera = camera;
    this.domElement = graphic.renderer.domElement;
    this.rayCaster = new Raycaster();
    this.graphic = graphic;

    this.domElement.addEventListener("mousedown", this.onMouseDown.bind(this));
    this.domElement.addEventListener("mousemove", this.onMouseMove.bind(this));
    this.domElement.addEventListener("mouseup", this.onMouseUp.bind(this));
    this.domElement.addEventListener("wheel", this.onWheel.bind(this), {
      passive: true,
    });
    window.addEventListener("resize", this.onWindowResize.bind(this));
  }

  render() {}

  private onMouseDown(event: MouseEvent): void {
    this.mouseDownScreen = this.getMouseScreenPosition(event);
    this.viewCenter = this.findGroundIntersection(new Vector2());
    this.cameraStartPosition = this.camera.position.clone();
  }

  private onMouseMove(event: MouseEvent): void {
    if (!this.mouseDownScreen) return;

    const newScreenPos = this.getMouseScreenPosition(event);
    const newWorldPos = this.unproject(newScreenPos);
    if (!newWorldPos) return;

    const button = event.buttons;
    if (button == 1) {
      // left click = rotate

      const screenMove = newScreenPos.clone().sub(this.mouseDownScreen);

      // yaw
      const YAW_SPEED = 5;
      const rotYaw = new Quaternion();
      rotYaw.setFromAxisAngle(new Vector3(0, 0, 1), -screenMove.x * YAW_SPEED);
      const newPos = this.cameraStartPosition.clone().applyQuaternion(rotYaw);

      // pitch
      const PITCH_SPEED = 40;
      newPos.z += (-screenMove.y * PITCH_SPEED) / Math.sqrt(this.zoom);

      // apply
      this.camera.position.copy(newPos);

      if (this.viewCenter) {
        this.camera.lookAt(this.viewCenter);
      } else this.camera.lookAt(new Vector3());
    } else if (button == 2) {
      // right click = pan
      const move = newWorldPos
        .clone()
        .sub(this.unproject(this.mouseDownScreen))
        .multiplyScalar(2);
      const newCamera = this.cameraStartPosition
        .clone()
        .sub(move)
        .normalize()
        .multiplyScalar(ORBIT_RADIUS);
      this.camera.position.set(newCamera.x, newCamera.y, newCamera.z);
    }

    this.updateNearFar();
    this.camera.updateProjectionMatrix();
  }

  private updateNearFar(): void {
    const sceneBox = new Box3().setFromObject(this.graphic.scene);
    const low = sceneBox.min;
    const high = sceneBox.max;

    const corners: Vector3[] = [
      new Vector3(low.x, low.y, low.z),
      new Vector3(high.x, low.y, low.z),
      new Vector3(low.x, high.y, low.z),
      new Vector3(low.x, low.y, high.z),
      new Vector3(high.x, high.y, low.z),
      new Vector3(high.x, low.y, high.z),
      new Vector3(low.x, high.y, high.z),
      new Vector3(high.x, high.y, high.z),
    ];

    const forward = this.camera.getWorldDirection(new Vector3(0, 0, -1));
    const distances = corners.map((corner) =>
      corner.sub(this.camera.position).dot(forward)
    );
    const minDistance = Math.min(...distances);
    const maxDistance = Math.max(...distances);
    this.camera.near = minDistance;
    this.camera.far = maxDistance;

    const material = this.graphic.customOutline.fsQuad
      .material as ShaderMaterial;
    material.uniforms.cameraNear.value = minDistance;
    material.uniforms.cameraFar.value = maxDistance;
    // console.log(`Near: ${this.camera.near}, Far: ${this.camera.far}`);
  }

  private onMouseUp(event: MouseEvent): void {
    this.mouseDownScreen = null;
  }

  private onWheel(event: WheelEvent): void {
    let y = event.deltaY;
    let zoom = this.zoom;
    if (y > 0) {
      zoom *= 1.1; // Zoom in
    } else {
      zoom /= 1.1; // Zoom out
    }
    this.updateZoom(zoom, this.getMouseScreenPosition(event));
  }

  private unproject(screenPos: Vector2): Vector3 {
    return new Vector3(screenPos.x, screenPos.y, 1).unproject(this.camera);
  }

  private getMouseScreenPosition(event: MouseEvent | WheelEvent): Vector2 {
    let mousePosition = new Vector2();

    mousePosition.x =
      (event.clientX - this.domElement.offsetLeft) /
        this.domElement.offsetWidth -
      1;
    mousePosition.y =
      -(
        (event.clientY - this.domElement.offsetTop) /
        this.domElement.offsetHeight
      ) + 1;
    return mousePosition;
  }

  private findGroundIntersection(screenPosition: Vector2): Vector3 {
    this.rayCaster.setFromCamera(screenPosition.clone(), this.camera);

    let point = new Vector3();
    if (
      !this.rayCaster.ray.intersectPlane(
        new Plane(new Vector3(0, 0, 1), 0),
        point
      )
    ) {
      console.warn("Raycaster did not intersect with the plane.");
      return null;
    }

    return point;
  }

  updateZoom(zoom: number, center?: Vector2): void {
    let aspect = window.innerWidth / window.innerHeight;
    this.camera.left = -1 / zoom / 2;
    this.camera.right = 1 / zoom / 2;
    this.camera.top = 1 / zoom / 2 / aspect;
    this.camera.bottom = -1 / zoom / 2 / aspect;

    // if (center) {
    //   const oldPos = this.getMouseWorldPosition(center);
    //   if (!oldPos) return;
    //   const newCenter = center.multiplyScalar(zoom / this.zoom);
    //   const newPos = this.getMouseWorldPosition(newCenter);
    //   if (!newPos) return;
    //   const move = newPos.sub(oldPos);
    //   const newCameraPos = this.camera.position
    //     .clone()
    //     .sub(move)
    //     .normalize()
    //     .multiplyScalar(ORBIT_RADIUS);
    //   this.camera.position.set(newCameraPos.x, newCameraPos.y, newCameraPos.z);
    // }
    this.zoom = zoom;
    this.updateNearFar();
    this.camera.updateProjectionMatrix();
  }

  private onWindowResize(): void {
    this.updateZoom(this.zoom);
  }
}
