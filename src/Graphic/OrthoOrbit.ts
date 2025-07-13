import {
  Box3,
  OrthographicCamera,
  Quaternion,
  ShaderMaterial,
  Vector2,
  Vector3,
} from "three";
import { CursorHelper } from "./CursorHelper";
import { Graphic } from "./Graphic";

const ORBIT_RADIUS = 100;

export class OrthoOrbit {
  private graphic: Graphic;
  private cursorHelper: CursorHelper;
  private camera: OrthographicCamera;
  private domElement: HTMLElement;

  private cameraStartPosition: Vector3 | null = null;
  private mouseDownScreen: Vector2 | null = null;
  private viewCenter: Vector3 | null = null;
  private zoom: number = 1;

  constructor(camera: OrthographicCamera, graphic: Graphic) {
    this.graphic = graphic;
    this.camera = camera;

    // listen to dom
    this.domElement = graphic.renderer.domElement;
    this.domElement.addEventListener("mousedown", this.onMouseDown.bind(this));
    this.domElement.addEventListener("mousemove", this.onMouseMove.bind(this));
    this.domElement.addEventListener("mouseup", this.onMouseUp.bind(this));
    this.domElement.addEventListener("wheel", this.onWheel.bind(this), {
      passive: true,
    });
  }

  render() {}

  private onMouseDown(event: MouseEvent): void {
    this.mouseDownScreen =
      this.graphic.cursorHelper.getMouseScreenPosition(event);
    this.viewCenter = this.graphic.cursorHelper.findGroundIntersection(
      new Vector2()
    );
    this.cameraStartPosition = this.camera.position.clone();
  }

  private onMouseMove(event: MouseEvent): void {
    if (!this.mouseDownScreen) return;

    const newScreenPos =
      this.graphic.cursorHelper.getMouseScreenPosition(event);
    const newWorldPos = this.graphic.cursorHelper.unproject(newScreenPos);
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
        .sub(this.graphic.cursorHelper.unproject(this.mouseDownScreen))
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
    this.updateZoom(
      zoom,
      this.graphic.cursorHelper.getMouseScreenPosition(event)
    );
  }

  updateZoom(zoom?: number, center?: Vector2): void {
    if (!zoom) zoom = this.zoom;

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
}
