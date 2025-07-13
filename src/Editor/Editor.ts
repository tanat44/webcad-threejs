import { Graphic } from "../Graphic/Graphic";
import { Ui } from "../Ui/Ui";
import { KeyShortcut } from "./KeyShortcut";
import { Process } from "./Process";
import { Toolbox } from "./Toolbox/Toolbox";

export class Editor {
  private graphic: Graphic;

  process: Process;
  ui: Ui;
  keyShortcut: KeyShortcut;
  toolbox: Toolbox;

  constructor(graphic: Graphic, ui: Ui) {
    this.graphic = graphic;
    this.process = new Process(graphic, this);
    this.ui = ui;
    this.keyShortcut = new KeyShortcut(this);
    this.toolbox = new Toolbox(graphic, this);
  }
}
