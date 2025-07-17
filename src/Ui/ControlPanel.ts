import { Graphic } from "../Graphic/Graphic";
import { Button } from "./Button";

export class ControlPanel {
  graphic: Graphic;

  // buttons
  processButton: Button;
  boxButton: Button;
  cylinderButton: Button;
  moveButton: Button;
  stretchButton: Button;
  measureButton: Button;

  constructor(graphic: Graphic) {
    this.graphic = graphic;

    // create tool
    const createDom = document.getElementById("createTool");
    this.boxButton = new Button("box", "b", createDom);
    // this.cylinderButton = new Button("cylinder", "c", createDom);

    // edit tool
    const editDom = document.getElementById("editTool");
    this.processButton = new Button("process", "p", editDom);
    this.moveButton = new Button("move", "m", editDom);
    this.stretchButton = new Button("stretch", "t", editDom);
    // this.measureButton = new Button("measure", "s", editDom);
  }
}
