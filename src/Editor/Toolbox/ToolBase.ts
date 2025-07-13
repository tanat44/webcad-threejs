import { Graphic } from "../../Graphic/Graphic";
import { Button } from "../../Ui/Button";
import { Editor } from "../Editor";

export class ToolBase {
  protected graphic: Graphic;
  protected editor: Editor;
  button: Button;

  private active: boolean = false;

  constructor(graphic: Graphic, editor: Editor, button: Button) {
    this.graphic = graphic;
    this.editor = editor;
    this.button = button;
  }

  activate() {
    this.button.setActive(true);
    this.active = true;
  }

  deactivate() {
    this.button.setActive(false);
    this.active = false;
  }

  onMouseDown(e: MouseEvent) {
    if (!this.active) return;
    console.log("Mouse down in tool base", e);
  }

  onMouseMove(e: MouseEvent) {
    if (!this.active) return;
    console.log("Mouse move in tool base", e);
  }

  onMouseUp(e: MouseEvent) {
    if (!this.active) return;
    console.log("Mouse up in tool base", e);
  }
}
