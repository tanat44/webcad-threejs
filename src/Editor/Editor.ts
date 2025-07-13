import { Graphic } from "../Graphic/Graphic";
import { Ui } from "../Ui/Ui";
import { Process } from "./Process";
import { Toolbox } from "./Toolbox/Toolbox";

export class Editor {
  private graphic: Graphic;

  process: Process;
  ui: Ui;
  toolbox: Toolbox;

  public constructor(graphic: Graphic, ui: Ui) {
    this.graphic = graphic;
    this.process = new Process(graphic, this);
    this.ui = ui;
    this.toolbox = new Toolbox(graphic, this);
  }
}
