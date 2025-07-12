import { GUI } from "dat.gui";
import { Editor } from "../Editor/Editor";
import { Graphic } from "../Graphic/Graphic";
import { ControlPanel } from "./ControlPanel";
import { RenderUi } from "./DatGui/RenderUi";

export class Ui {
  private graphic: Graphic;
  private gui: GUI;

  constructor(graphic: Graphic, editor: Editor) {
    this.graphic = graphic;

    // dat gui
    this.gui = new GUI({ width: 300, closed: false });
    new RenderUi(graphic, this.gui);

    // other gui
    new ControlPanel(graphic, editor);
  }
}
