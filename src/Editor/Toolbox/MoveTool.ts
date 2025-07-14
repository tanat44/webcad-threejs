import { Mesh, Plane, Vector3 } from "three";
import { Graphic } from "../../Graphic/Graphic";
import { Editor } from "../Editor";
import { ToolBase } from "./ToolBase";

enum ToolState {
  FirstClick, // pick object
  SecondClick, // commit new position
}
export class MoveTool extends ToolBase {
  state: ToolState = ToolState.FirstClick;
  moveObject: Mesh;
  objectOriginalPosition: Vector3;
  mouseDownPosition: Vector3;
  movePlane: Plane;

  constructor(graphic: Graphic, editor: Editor) {
    super(graphic, editor, editor.ui.controlPanel.moveButton);
  }

  override activate(): void {
    super.activate();
    this.state = ToolState.FirstClick;
    this.moveObject = null;
    this.objectOriginalPosition = null;
  }

  override deactivate(): void {
    super.deactivate();
    if (this.moveObject) {
      if (this.objectOriginalPosition)
        this.moveObject.position.copy(this.objectOriginalPosition);
      this.moveObject = null;
    }
  }

  protected override overrideMouseDown(e: MouseEvent): void {
    if (this.state === ToolState.FirstClick) {
      const mousePosition = this.graphic.cursorHelper.getScreenPosition(e);
      const intersect =
        this.graphic.cursorHelper.findIntersection(mousePosition);
      if (!intersect) return;
      const element = this.editor.process.getElement(intersect.object.id);
      if (!element) return;

      this.moveObject = element.mesh;
      this.objectOriginalPosition = this.moveObject.position.clone();
      this.mouseDownPosition = intersect.point.clone();
      this.movePlane = new Plane(
        intersect.normal,
        intersect.point.dot(intersect.normal)
      );
    }
  }

  protected override overrideMouseMove(e: MouseEvent): void {
    if (!this.moveObject) return;

    const mousePosition = this.graphic.cursorHelper.getScreenPosition(e);
    const intersect = this.graphic.cursorHelper.findPlaneIntersection(
      mousePosition,
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

  protected override overrideMouseUp(e: MouseEvent): void {
    if (this.state === ToolState.FirstClick) {
      this.state = ToolState.SecondClick;
    } else if (this.state === ToolState.SecondClick) {
      this.state = ToolState.FirstClick;
      this.moveObject = null;
      this.objectOriginalPosition = null;
    }
  }
}
