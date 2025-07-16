import { GUI } from "dat.gui";
import { Editor } from "../Editor/Editor";
import { Graphic } from "../Graphic/Graphic";
import { ControlPanel } from "./ControlPanel";
import { RenderUi } from "./DatGui/RenderUi";
import { ProcessPanel } from "./ProcessPanel";

export class Ui {
  private graphic: Graphic;
  private editor: Editor;
  private gui: GUI;

  controlPanel: ControlPanel;
  processPanel: ProcessPanel;

  constructor(graphic: Graphic) {
    this.graphic = graphic;

    // dat gui
    this.gui = new GUI({ width: 300, closed: false });
    new RenderUi(graphic, this.gui);

    // other gui
    this.controlPanel = new ControlPanel(graphic);
  }

  setEditor(editor: Editor) {
    this.editor = editor;
    this.processPanel = new ProcessPanel(editor);
  }
}
