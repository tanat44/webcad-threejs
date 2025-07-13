import { Graphic } from "../Graphic/Graphic";
import { Button } from "./Button";

export class ControlPanel {
  graphic: Graphic;

  // buttons
  rectangleButton: Button;
  cylinderButton: Button;
  measureButton: Button;

  constructor(graphic: Graphic) {
    this.graphic = graphic;
    const dom = document.getElementById("controlPanel");
    this.rectangleButton = new Button("rectangle", "r", dom);
    this.cylinderButton = new Button("cylinder", "c", dom);
    this.measureButton = new Button("measure", "m", dom);
  }
}
