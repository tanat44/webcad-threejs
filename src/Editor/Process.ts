import { BufferGeometry, Material, MeshLambertMaterial } from "three";
import { ADDITION, Evaluator, SUBTRACTION } from "three-bvh-csg";
import { Graphic } from "../Graphic/Graphic";
import { Editor } from "./Editor";
import { BoxElement } from "./Element/BoxElement";
import { ElementBase } from "./Element/ElementBase";
import { ElementType, ProcessType } from "./type";

const STORAGE_KEY = "savedElements";
const OPACITY = 0.5;
export class Process {
  readonly graphic: Graphic;
  readonly editor: Editor;
  readonly addMaterial: Material;
  readonly subtractMaterial: Material;
  readonly disableMaterial: Material;
  elements: ElementBase[] = [];

  constructor(graphic: Graphic, editor: Editor) {
    this.graphic = graphic;
    this.editor = editor;
    this.addMaterial = new MeshLambertMaterial({
      color: 0x2f00ff,
      opacity: OPACITY,
      transparent: true,
    });
    this.subtractMaterial = new MeshLambertMaterial({
      color: 0xff6459,
      opacity: OPACITY,
      transparent: true,
    });
    this.disableMaterial = new MeshLambertMaterial({
      color: 0xa6a6a6,
      opacity: OPACITY,
      transparent: true,
    });
    this.elements = [];
  }

  addElement(element: ElementBase) {
    this.elements.push(element);
    this.graphic.scene.add(element.mesh);

    // update ui
    this.editor.ui.processPanel.addElement(element);
  }

  getDefaultMaterial() {
    return this.disableMaterial;
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
      this.editor.ui.processPanel.removeElement(element);
    });
    this.elements = [];

    // load from localStorage
    const text = localStorage.getItem(STORAGE_KEY);
    const objects = JSON.parse(text);
    for (const object of objects) {
      const element = this.deserializeElement(object);
      this.addElement(element);
    }
  }

  private deserializeElement(object: any) {
    if (object.elementType === ElementType.Box) {
      return BoxElement.deserialize(object, this.editor);
    }
    throw new Error(`Can't deserialize element type: ${object.elementType}`);
  }

  getElement(id: number) {
    const element = this.elements.find((el) => el.mesh.id === id);
    return element;
  }

  mergeElement(): BufferGeometry {
    const evaluator = new Evaluator();
    if (this.elements.length === 0) return undefined;
    if (this.elements.length === 1) return this.elements[0].mesh.geometry;

    let brush = this.elements[0].getBrush();
    for (let i = 1; i < this.elements.length; i++) {
      const element = this.elements[i];
      if (element.processType === ProcessType.Disable) continue;
      const thisBrush = element.getBrush();
      brush = evaluator.evaluate(
        brush,
        thisBrush,
        element.processType === ProcessType.Add ? ADDITION : SUBTRACTION
      );
    }
    return brush.geometry;
  }

  hideElement() {
    this.elements.forEach((element) => {
      element.mesh.visible = false;
    });
  }

  showElement() {
    this.elements.forEach((element) => {
      element.mesh.visible = true;
    });
  }
}
