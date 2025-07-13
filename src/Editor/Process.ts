import { Material, MeshLambertMaterial } from "three";
import { Graphic } from "../Graphic/Graphic";
import { Editor } from "./Editor";
import { ProcessElement } from "./ProcessElement";

export class Process {
  graphic: Graphic;
  elements: ProcessElement[] = [];

  private defaultMaterial: Material;

  constructor(graphic: Graphic, editor: Editor) {
    this.graphic = graphic;
    this.elements = [];
    this.defaultMaterial = new MeshLambertMaterial({ color: 0x2f00ff });
  }

  addElement(element: ProcessElement) {
    this.elements.push(element);
    this.graphic.scene.add(element.mesh);
  }

  getDefaultMaterial() {
    return this.defaultMaterial;
  }
}
