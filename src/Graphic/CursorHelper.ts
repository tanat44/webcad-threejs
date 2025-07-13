import { Plane, Raycaster, Vector2, Vector3 } from "three";
import { Graphic } from "./Graphic";

export class CursorHelper {
  private graphic: Graphic;
  rayCaster: Raycaster;

  constructor(graphic: Graphic) {
    this.graphic = graphic;
    this.rayCaster = new Raycaster();
  }

  unproject(screenPos: Vector2): Vector3 {
    return new Vector3(screenPos.x, screenPos.y, 1).unproject(
      this.graphic.orthoCamera.camera
    );
  }

  getScreenPosition(event: MouseEvent | WheelEvent): Vector2 {
    let mousePosition = new Vector2();
    const { domElement } = this.graphic.renderer;

    mousePosition.x =
      ((event.clientX - domElement.offsetLeft) * 2) / domElement.offsetWidth -
      1;
    mousePosition.y =
      -(
        ((event.clientY - domElement.offsetTop) * 2) /
        domElement.offsetHeight
      ) + 1;
    return mousePosition;
  }

  findGroundIntersection(screenPosition: Vector2): Vector3 {
    return this.findPlaneIntersection(
      screenPosition,
      new Plane(new Vector3(0, 0, 1), 0)
    );
  }

  findPlaneIntersection(screenPosition: Vector2, plane: Plane): Vector3 {
    this.rayCaster.setFromCamera(
      screenPosition.clone(),
      this.graphic.orthoCamera.camera
    );

    let point = new Vector3();
    if (!this.rayCaster.ray.intersectPlane(plane, point)) {
      console.warn("Raycaster did not intersect with the plane.");
      return null;
    }
    return point;
  }
}
