import { Mesh } from "three";
import { ElementBase } from "./ElementBase";

export class ElementCollection extends Array {
  readonly meshes: Mesh[] = [];

  constructor() {
    super();
    this.meshes = [];
    this.push = (...items: ElementBase[]) => {
      items.forEach((item) => {
        this.meshes.push(item.mesh);
      });
      return super.push(...items);
    };
  }
}
