import { BoxGeometry, Mesh } from "three";
import { eulerToVector3 } from "../../Graphic/Math";
import { Editor } from "../Editor";
import { ElementType } from "../type";
import { ElementBase } from "./ElementBase";

export class BoxElement extends ElementBase {
  constructor(mesh: Mesh) {
    super(mesh, ElementType.Box);
  }

  static deserialize(object: any, editor: Editor): BoxElement {
    const geometry = new BoxGeometry(1, 1, 1);
    geometry.translate(0, 0, 0.5);
    const mesh = new Mesh(geometry, editor.process.getDefaultMaterial());
    mesh.position.set(object.position.x, object.position.y, object.position.z);
    mesh.scale.set(object.scale.x, object.scale.y, object.scale.z);
    mesh.rotation.set(object.rotation.x, object.rotation.y, object.rotation.z);
    return new BoxElement(mesh);
  }

  serialize(): object {
    const output = {
      elementType: this.elementType,
      scale: this.mesh.scale,
      position: this.mesh.position,
      rotation: eulerToVector3(this.mesh.rotation),
    };
    return output;
  }
}
