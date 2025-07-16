import { Material, MeshLambertMaterial } from "three";
import { Graphic } from "../../Graphic/Graphic";
import { Button } from "../../Ui/Button";
import { Editor } from "../Editor";

export class ToolBase {
  protected graphic: Graphic;
  protected editor: Editor;
  button?: Button;
  isActive: boolean = false;

  protected static tempMaterial: Material = new MeshLambertMaterial({
    color: 0x0f97ff,
    transparent: true,
    opacity: 0.5,
  });

  constructor(graphic: Graphic, editor: Editor, button?: Button) {
    this.graphic = graphic;
    this.editor = editor;
    this.button = button;
  }

  activate() {
    this.button?.setActive(true);
    this.isActive = true;
  }

  deactivate() {
    this.button?.setActive(false);
    this.isActive = false;
  }

  onMouseDown(e: MouseEvent) {
    if (!this.isActive) return;
    this.overrideMouseDown(e);
  }

  protected overrideMouseDown(e: MouseEvent) {
    console.log("undefined mousedown", e);
  }

  onMouseMove(e: MouseEvent) {
    if (!this.isActive) return;
    this.overrideMouseMove(e);
  }

  protected overrideMouseMove(e: MouseEvent) {
    console.log("undefined mousemove", e);
  }

  onMouseUp(e: MouseEvent) {
    if (!this.isActive) return;
    this.overrideMouseUp(e);
  }

  protected overrideMouseUp(e: MouseEvent) {
    console.log("undefined mouseup", e);
  }
}
