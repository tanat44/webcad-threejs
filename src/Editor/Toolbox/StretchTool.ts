import { Mesh, Plane, Vector3 } from "three";
import { Graphic } from "../../Graphic/Graphic";
import { absoluteVector, hasZeroComponent } from "../../Graphic/Math";
import { Editor } from "../Editor";
import { PlaneIndicatorTool } from "./PlaneIndicatorTool";
import { ToolBase } from "./ToolBase";

enum ToolState {
  Idle, // cursor shining on object plane
  FirstClick, // pick object
}
export class StretchTool extends ToolBase {
  state: ToolState = ToolState.FirstClick;
  targetObject: Mesh;
  targetOriginalPosition: Vector3;
  targetOriginalScale: Vector3;
  mouseDownPosition: Vector3;
  stretchPlane: Plane;
  stretchNormal: Vector3;
  planeIndicator: PlaneIndicatorTool;

  constructor(graphic: Graphic, editor: Editor) {
    super(graphic, editor, editor.ui.controlPanel.stretchButton);
  }

  override activate(): void {
    super.activate();
    this.state = ToolState.Idle;
    this.targetObject = null;
    this.targetOriginalPosition = null;
    this.targetOriginalScale = null;
    this.graphic.orthoCamera.orbit.setEnableControl(false);
  }

  override deactivate(): void {
    super.deactivate();
    if (this.targetObject) {
      if (this.targetOriginalPosition)
        this.targetObject.position.copy(this.targetOriginalPosition);
      if (this.targetOriginalScale)
        this.targetObject.scale.copy(this.targetOriginalScale);
      this.targetObject = null;
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

      this.targetObject = element.mesh;
      this.targetOriginalPosition = this.targetObject.position.clone();
      this.targetOriginalScale = this.targetObject.scale.clone();
      this.mouseDownPosition = intersect.point.clone();
      this.stretchNormal = intersect.face.normal.clone();
      const anyVector = new Vector3(1, 2, 3);
      const perpendicularVector = anyVector
        .clone()
        .cross(this.stretchNormal)
        .normalize();
      this.stretchPlane = new Plane(
        perpendicularVector,
        -intersect.point.dot(perpendicularVector)
      ); // somehow plane is flipped

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
        this.stretchPlane
      );

      if (!intersect) {
        console.warn("could not find intersection");
        return;
      }
      const mouseMove = intersect.clone().sub(this.mouseDownPosition);

      // find if stretch in/out of surface
      let deltaScale = Math.round(this.stretchNormal.dot(mouseMove));
      const newScale = this.targetOriginalScale
        .clone()
        .add(
          absoluteVector(this.stretchNormal.clone()).multiplyScalar(deltaScale)
        );
      if (hasZeroComponent(newScale)) {
        console.warn("new scale has zero component");
        return;
      }
      this.targetObject.scale.copy(newScale);

      // update position
      this.targetObject.position.copy(
        this.targetOriginalPosition
          .clone()
          .add(this.stretchNormal.clone().multiplyScalar(deltaScale * 0.5))
      );
    }
  }

  protected override overrideMouseUp(e: MouseEvent): void {
    if (this.state === ToolState.FirstClick) {
      this.state = ToolState.Idle;
      this.targetObject = null;
      this.targetOriginalPosition = null;
    }
  }
}
