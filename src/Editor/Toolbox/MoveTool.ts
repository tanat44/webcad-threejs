import { CircleGeometry, Mesh, Plane, Quaternion, Vector3 } from "three";
import { Graphic } from "../../Graphic/Graphic";
import { Editor } from "../Editor";
import { ToolBase } from "./ToolBase";

const INDICATOR_RADIUS = 1;

enum ToolState {
  Idle, // cursor shining on object plane
  FirstClick, // pick object
}
export class MoveTool extends ToolBase {
  state: ToolState = ToolState.FirstClick;
  moveObject: Mesh;
  objectOriginalPosition: Vector3;
  mouseDownPosition: Vector3;
  movePlane: Plane;
  planeIndicator: Mesh;

  constructor(graphic: Graphic, editor: Editor) {
    super(graphic, editor, editor.ui.controlPanel.moveButton);
  }

  override activate(): void {
    super.activate();
    this.state = ToolState.Idle;
    this.moveObject = null;
    this.objectOriginalPosition = null;
    this.graphic.orthoCamera.orbit.setEnableControl(false);

    // crate plane indicator
    const geometry = new CircleGeometry(INDICATOR_RADIUS);
    this.planeIndicator = new Mesh(
      geometry,
      this.editor.process.indicatorMaterial
    );
    this.graphic.scene.add(this.planeIndicator);
  }

  override deactivate(): void {
    super.deactivate();
    if (this.moveObject) {
      if (this.objectOriginalPosition)
        this.moveObject.position.copy(this.objectOriginalPosition);
      this.moveObject = null;
    }
    this.graphic.orthoCamera.orbit.setEnableControl(true);

    // remove plane indicator
    this.graphic.scene.remove(this.planeIndicator);
    this.planeIndicator = null;
  }

  protected override overrideMouseDown(e: MouseEvent): void {
    if (this.state === ToolState.Idle) {
      const mousePosition = this.graphic.cursorHelper.getScreenPosition(e);
      const intersect = this.graphic.cursorHelper.findIntersection(
        mousePosition,
        this.editor.process.elements.meshes
      );
      if (!intersect) return;
      const element = this.editor.process.getElement(intersect.object.id);
      if (!element) return;

      this.moveObject = element.mesh;
      this.objectOriginalPosition = this.moveObject.position.clone();
      this.mouseDownPosition = intersect.point.clone();
      const normal = intersect.face.normal.clone();
      this.movePlane = new Plane(normal, -intersect.point.dot(normal)); // somehow the plane must be flipped to get the correct intersection

      // becomes FirstClick state
      this.state = ToolState.FirstClick;
      this.planeIndicator.visible = false;
    }
  }

  protected override overrideMouseMove(e: MouseEvent): void {
    const mousePosition = this.graphic.cursorHelper.getScreenPosition(e);

    if (this.state === ToolState.Idle) {
      const intersect = this.graphic.cursorHelper.findIntersection(
        mousePosition,
        this.editor.process.elements.meshes
      );
      if (!intersect) return;
      const element = this.editor.process.getElement(intersect.object.id);
      if (!element) return;
      this.planeIndicator.position.copy(
        intersect.point.add(intersect.face.normal.clone().multiplyScalar(0.1))
      );
      this.planeIndicator.quaternion.copy(
        new Quaternion().setFromUnitVectors(
          new Vector3(0, 0, 1),
          intersect.face.normal
        )
      );
    } else if (this.state === ToolState.FirstClick) {
      const intersect = this.graphic.cursorHelper.findPlaneIntersection(
        mousePosition.clone(),
        this.movePlane
      );
      const move = intersect.clone().sub(this.mouseDownPosition);
      move.x = Math.round(move.x);
      move.y = Math.round(move.y);
      move.z = Math.round(move.z);
      this.moveObject.position.copy(
        this.objectOriginalPosition.clone().add(move)
      );
    }
  }

  protected override overrideMouseUp(e: MouseEvent): void {
    if (this.state === ToolState.FirstClick) {
      this.state = ToolState.Idle;
      this.moveObject = null;
      this.objectOriginalPosition = null;
      this.planeIndicator.visible = true;
    }
  }
}
