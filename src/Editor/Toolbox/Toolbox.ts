import { Graphic } from "../../Graphic/Graphic";
import { Editor } from "../Editor";
import { BoxTool } from "./BoxTool";
import { CylinderTool } from "./CylinderTool";
import { MeasureTool } from "./MeasureTool";
import { MoveTool } from "./MoveTool";
import { ProcessTool } from "./ProcessTool";
import { ToolBase } from "./ToolBase";

export class Toolbox {
  currentTool: ToolBase | undefined = undefined;
  tools: ToolBase[] = [];

  constructor(graphic: Graphic, editor: Editor) {
    this.tools = [];

    // create tools
    this.tools.push(new BoxTool(graphic, editor));
    this.tools.push(new CylinderTool(graphic, editor));

    // edit tools
    this.tools.push(new ProcessTool(graphic, editor));
    this.tools.push(new MoveTool(graphic, editor));
    this.tools.push(new MeasureTool(graphic, editor));

    document.addEventListener("mousedown", this.onMouseDown.bind(this));
    document.addEventListener("mousemove", this.onMouseMove.bind(this));
    document.addEventListener("mouseup", this.onMouseUp.bind(this));
  }

  public handleKeyDown(event: KeyboardEvent) {
    if (this.currentTool) {
      if (event.key === "Escape") {
        this.currentTool.deactivate();
      } else {
        this.tryActivate(event.key);
      }
    } else {
      this.tryActivate(event.key);
    }
  }

  private tryActivate(key: string) {
    for (const tool of this.tools) {
      if (tool.button.shortcut === key) {
        // deactivate if try to activate the same tool
        if (this.currentTool === tool && tool.isActive) {
          tool.deactivate();
          return;
        }

        this.currentTool?.deactivate();
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
