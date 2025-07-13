import { GUI } from "dat.gui";
import { Graphic } from "../Graphic/Graphic";
import { ControlPanel } from "./ControlPanel";
import { RenderUi } from "./DatGui/RenderUi";

export class Ui {
  private graphic: Graphic;
  private gui: GUI;

  controlPanel: ControlPanel;

  constructor(graphic: Graphic) {
    this.graphic = graphic;

    // dat gui
    this.gui = new GUI({ width: 300, closed: false });
    new RenderUi(graphic, this.gui);

    // other gui
    this.controlPanel = new ControlPanel(graphic);
  }
}
