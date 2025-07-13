import { Graphic } from "../../Graphic/Graphic";
import { Button } from "../../Ui/Button";
import { Editor } from "../Editor";

export class ToolBase {
  protected graphic: Graphic;
  protected editor: Editor;
  button: Button;

  constructor(graphic: Graphic, editor: Editor, button: Button) {
    this.graphic = graphic;
    this.editor = editor;
    this.button = button;
  }

  activate() {
    this.button.setActive(true);
  }

  deactivate() {
    this.button.setActive(false);
  }
}
