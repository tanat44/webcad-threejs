import { Graphic } from "../../Graphic/Graphic";
import { Editor } from "../Editor";
import { CylinderTool } from "./CylinderTool";
import { MeasureTool } from "./MeasureTool";
import { RectangleTool } from "./RectangleTool";
import { ToolBase } from "./ToolBase";

export class Toolbox {
  currentTool: ToolBase | undefined = undefined;
  tools: ToolBase[] = [];

  constructor(graphic: Graphic, editor: Editor) {
    this.tools = [];
    this.tools.push(new RectangleTool(graphic, editor));
    this.tools.push(new CylinderTool(graphic, editor));
    this.tools.push(new MeasureTool(graphic, editor));

    document.addEventListener("keydown", this.onKeyDown.bind(this));
    document.addEventListener("mousedown", this.onMouseDown.bind(this));
    document.addEventListener("mousemove", this.onMouseMove.bind(this));
    document.addEventListener("mouseup", this.onMouseUp.bind(this));
  }

  private onKeyDown(event: KeyboardEvent) {
    if (this.currentTool) {
      if (event.key === "Escape") {
        this.currentTool.deactivate();
      } else {
        this.currentTool.deactivate();
        this.activate(event.key);
      }
    } else {
      this.activate(event.key);
    }
  }

  private activate(key: string) {
    for (const tool of this.tools) {
      if (tool.button.shortcut === key) {
        tool.activate();
        this.currentTool = tool;
        return;
      }
    }
  }

  private onMouseDown(event: MouseEvent) {
    if (this.currentTool) {
      this.currentTool.onMouseDown(event);
    }
  }

  private onMouseMove(event: MouseEvent) {
    if (this.currentTool) {
      this.currentTool.onMouseMove(event);
    }
  }

  private onMouseUp(event: MouseEvent) {
    if (this.currentTool) {
      this.currentTool.onMouseUp(event);
    }
  }
}
