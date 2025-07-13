import { Material, MeshLambertMaterial } from "three";
import { Graphic } from "../Graphic/Graphic";
import { Editor } from "./Editor";
import { BoxElement } from "./Element/BoxElement";
import { ElementBase } from "./Element/ElementBase";
import { ElementType } from "./type";

const STORAGE_KEY = "savedElements";
export class Process {
  graphic: Graphic;
  editor: Editor;
  elements: ElementBase[] = [];

  private defaultMaterial: Material;

  constructor(graphic: Graphic, editor: Editor) {
    this.graphic = graphic;
    this.editor = editor;
    this.elements = [];
    this.defaultMaterial = new MeshLambertMaterial({ color: 0x2f00ff });
  }

  addElement(element: ElementBase) {
    this.elements.push(element);
    this.graphic.scene.add(element.mesh);
  }

  getDefaultMaterial() {
    return this.defaultMaterial;
  }

  save() {
    const output = this.elements.map((element) => element.serialize());
    const text = JSON.stringify(output);
    localStorage.setItem(STORAGE_KEY, text);
    console.log(`Saved ${this.elements.length} elements to localStorage`);
  }

  load() {
    console.log("Loading elements from localStorage...");
    // delete existing elements
    this.elements.forEach((element) => {
      this.graphic.scene.remove(element.mesh);
      element.mesh.geometry.dispose();
    });
    this.elements = [];
    // load from localStorage
    const text = localStorage.getItem(STORAGE_KEY);
    const objects = JSON.parse(text);
    for (const object of objects) {
      const element = this.deserializeElement(object);
      this.elements.push(element);
      this.graphic.scene.add(element.mesh);
    }
  }

  private deserializeElement(object: any) {
    if (object.elementType === ElementType.Box) {
      return BoxElement.deserialize(object, this.editor);
    }
    throw new Error(`Can't deserialize element type: ${object.elementType}`);
  }
}
