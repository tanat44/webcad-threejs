import { Material, MeshLambertMaterial } from "three";
import { Graphic } from "../../Graphic/Graphic";
import { Button } from "../../Ui/Button";
import { Editor } from "../Editor";

export class ToolBase {
  protected graphic: Graphic;
  protected editor: Editor;
  button?: Button;

  protected toolActive: boolean = false;
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
    this.toolActive = true;
  }

  deactivate() {
    this.button?.setActive(false);
    this.toolActive = false;
  }

  onMouseDown(e: MouseEvent) {
    if (!this.toolActive) return;
    this.overrideMouseDown(e);
  }

  protected overrideMouseDown(e: MouseEvent) {
    console.log("undefined mousedown", e);
  }

  onMouseMove(e: MouseEvent) {
    if (!this.toolActive) return;
    this.overrideMouseMove(e);
  }

  protected overrideMouseMove(e: MouseEvent) {
    console.log("undefined mousemove", e);
  }

  onMouseUp(e: MouseEvent) {
    if (!this.toolActive) return;
    this.overrideMouseUp(e);
  }

  protected overrideMouseUp(e: MouseEvent) {
    console.log("undefined mouseup", e);
  }
}
