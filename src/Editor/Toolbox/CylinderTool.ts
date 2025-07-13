import { Graphic } from "../../Graphic/Graphic";
import { Editor } from "../Editor";
import { ToolBase } from "./ToolBase";

export class CylinderTool extends ToolBase {
  constructor(graphic: Graphic, editor: Editor) {
    super(graphic, editor, editor.ui.controlPanel.cylinderButton);
  }
}
