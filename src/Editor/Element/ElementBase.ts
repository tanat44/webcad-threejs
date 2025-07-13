import { Mesh } from "three";
import { ElementType } from "../type";

export abstract class ElementBase {
  mesh: Mesh;
  elementType: ElementType;

  constructor(mesh: Mesh, elementType: ElementType) {
    this.mesh = mesh;
    this.elementType = elementType;
  }

  abstract serialize(): object;
}
