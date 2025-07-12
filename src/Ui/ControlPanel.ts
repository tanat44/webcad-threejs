import { Editor } from "../Editor/Editor";
import { Graphic } from "../Graphic/Graphic";
import { Button } from "./Button";

export class ControlPanel {
  graphic: Graphic;
  editor: Editor;

  constructor(graphic: Graphic, editor: Editor) {
    this.graphic = graphic;
    const dom = document.getElementById("controlPanel");
    new Button("rectangle", dom, () => {
      console.log("rectangle");
    });
    new Button("cylinder", dom, () => {
      console.log("cylinder");
    });
    new Button("measure", dom, () => {
      console.log("measure");
    });
  }
}
