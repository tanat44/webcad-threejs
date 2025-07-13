import { Mesh } from "three";

export class ProcessElement {
  mesh: Mesh;

  constructor(mesh: Mesh) {
    this.mesh = mesh;
  }
}
