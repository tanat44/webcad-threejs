import { Mesh, Plane, Vector3 } from "three";
import { Graphic } from "../../Graphic/Graphic";
import { Editor } from "../Editor";
import { PlaneIndicatorTool } from "./PlaneIndicatorTool";
import { ToolBase } from "./ToolBase";

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
  planeIndicator: PlaneIndicatorTool;

  constructor(graphic: Graphic, editor: Editor) {
    super(graphic, editor, editor.ui.controlPanel.moveButton);
  }

  override activate(): void {
    super.activate();
    this.state = ToolState.Idle;
    this.moveObject = null;
    this.objectOriginalPosition = null;
    this.graphic.orthoCamera.orbit.setEnableControl(false);
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
    if (this.planeIndicator) {
      this.planeIndicator.deactivate();
      this.planeIndicator = null;
    }
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
      this.planeIndicator.deactivate();
      this.planeIndicator = null;
    }
  }

  protected override overrideMouseMove(e: MouseEvent): void {
    const mousePosition = this.graphic.cursorHelper.getScreenPosition(e);

    if (this.state === ToolState.Idle) {
      if (!this.planeIndicator) {
        this.planeIndicator = new PlaneIndicatorTool(this.graphic, this.editor);
        this.planeIndicator.activate();
      }
      this.planeIndicator.onMouseMove(e);
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
    }
  }
}
