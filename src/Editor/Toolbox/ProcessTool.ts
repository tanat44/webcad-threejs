import { Graphic } from "../../Graphic/Graphic";
import { Editor } from "../Editor";
import { ProcessType } from "../type";
import { ToolBase } from "./ToolBase";

export class ProcessTool extends ToolBase {
  constructor(graphic: Graphic, editor: Editor) {
    super(graphic, editor, editor.ui.controlPanel.processButton);
  }

  protected override overrideMouseDown(e: MouseEvent): void {
    // do nothing
  }

  protected override overrideMouseMove(e: MouseEvent): void {
    // do nothing
  }

  protected override overrideMouseUp(e: MouseEvent): void {
    const mousePosition = this.graphic.cursorHelper.getScreenPosition(e);

    const intersect = this.graphic.cursorHelper.findIntersection(mousePosition);
    if (!intersect) return;
    const element = this.editor.process.getElement(intersect.object.id);
    if (!element) return;

    const previousProcessType = element.processType;
    if (e.shiftKey) {
      if (element.processType === ProcessType.Subtract) {
        element.changeProcessType(ProcessType.Disable);
      } else if (element.processType === ProcessType.Disable) {
        element.changeProcessType(ProcessType.Add);
      }
    } else if (e.altKey) {
      if (element.processType === ProcessType.Add) {
        element.changeProcessType(ProcessType.Disable);
      } else if (element.processType === ProcessType.Disable) {
        element.changeProcessType(ProcessType.Subtract);
      }
    }

    if (previousProcessType !== element.processType) {
      this.editor.publishElementUpdate("ElementUpdate", element);
    }
  }
}
