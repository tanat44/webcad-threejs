import { Graphic } from "../Graphic/Graphic";
import { Ui } from "../Ui/Ui";
import { Toolbox } from "./Toolbox/Toolbox";

export class Editor {
  private graphic: Graphic;

  ui: Ui;
  toolbox: Toolbox;

  public constructor(graphic: Graphic, ui: Ui) {
    this.graphic = graphic;
    this.ui = ui;
    this.toolbox = new Toolbox(graphic, this);
  }
}
