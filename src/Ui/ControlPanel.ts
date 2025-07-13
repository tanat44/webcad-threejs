import { Graphic } from "../Graphic/Graphic";
import { Button } from "./Button";

export class ControlPanel {
  graphic: Graphic;

  // buttons
  boxButton: Button;
  cylinderButton: Button;
  measureButton: Button;

  constructor(graphic: Graphic) {
    this.graphic = graphic;
    const dom = document.getElementById("controlPanel");
    this.boxButton = new Button("box", "b", dom);
    this.cylinderButton = new Button("cylinder", "c", dom);
    this.measureButton = new Button("measure", "m", dom);
  }
}
