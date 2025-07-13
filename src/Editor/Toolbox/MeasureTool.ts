import { Graphic } from "../../Graphic/Graphic";
import { Editor } from "../Editor";
import { ToolBase } from "./ToolBase";

export class MeasureTool extends ToolBase {
  constructor(graphic: Graphic, editor: Editor) {
    super(graphic, editor, editor.ui.controlPanel.measureButton);
  }
}
