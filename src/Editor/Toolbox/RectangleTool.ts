import { BoxGeometry, Mesh, Plane, Vector3 } from "three";
import { Graphic } from "../../Graphic/Graphic";
import { Editor } from "../Editor";
import { ProcessElement } from "../ProcessElement";
import { ToolBase } from "./ToolBase";

enum ToolState {
  Idle,
  FirstClick,
  SecondClick,
}

export class RectangleTool extends ToolBase {
  tempObject: Mesh;
  state: ToolState = ToolState.Idle;

  constructor(graphic: Graphic, editor: Editor) {
    super(graphic, editor, editor.ui.controlPanel.rectangleButton);
  }

  override activate(): void {
    super.activate();
    this.state = ToolState.Idle;
    if (this.tempObject) throw new Error("Temporary object already exists");
  }

  protected override overrideMouseMove(e: MouseEvent): void {
    if (!this.tempObject) {
      const box = new BoxGeometry(1, 1, 1);
      box.translate(0, 0, 0.5);
      this.tempObject = new Mesh(box, ToolBase.tempMaterial);
      this.graphic.scene.add(this.tempObject);
    }

    const mousePosition = this.graphic.cursorHelper.getScreenPosition(e);
    if (this.state === ToolState.Idle) {
      // adjust origin position
      const pos =
        this.graphic.cursorHelper.findGroundIntersection(mousePosition);
      pos.x = Math.round(pos.x);
      pos.y = Math.round(pos.y);
      pos.z = Math.round(pos.z);
      this.tempObject.position.copy(pos);
    } else if (this.state === ToolState.FirstClick) {
      // adjust z scale
      const pos = this.graphic.cursorHelper.findPlaneIntersection(
        mousePosition,
        new Plane(new Vector3(0, -1, 0), this.tempObject.position.y)
      );
      this.tempObject.scale.z = Math.round(pos.z);
    } else if (this.state === ToolState.SecondClick) {
      // adjust x and y scale
      const zPlane = new Plane(new Vector3(0, 0, 1));
      zPlane.translate(new Vector3(0, 0, this.tempObject.scale.z));
      const pos = this.graphic.cursorHelper.findPlaneIntersection(
        mousePosition,
        zPlane
      );
      const scaleX = Math.abs(pos.x - this.tempObject.position.x) * 2;
      const scaleY = Math.abs(pos.y - this.tempObject.position.y) * 2;
      this.tempObject.scale.x = Math.round(scaleX);
      this.tempObject.scale.y = Math.round(scaleY);
    }
  }

  protected override overrideMouseUp(e: MouseEvent): void {
    if (!this.tempObject) throw new Error("Temporary object not created");
    if (this.state === ToolState.Idle) {
      this.state = ToolState.FirstClick;
    } else if (this.state === ToolState.FirstClick) {
      this.state = ToolState.SecondClick;
    } else if (this.state === ToolState.SecondClick) {
      // create process object
      this.tempObject.material = this.editor.process.getDefaultMaterial();
      const element = new ProcessElement(this.tempObject);
      this.editor.process.addElement(element);

      // deference temporary object
      this.tempObject = null;
      this.state = ToolState.Idle;
    }
  }
}
