import { Mesh } from "three";
import { Brush } from "three-bvh-csg";
import { eulerToVector3 } from "../../Graphic/Math";
import { Editor } from "../Editor";
import { ElementType, ProcessType } from "../type";

export abstract class ElementBase {
  editor: Editor;
  mesh: Mesh;
  elementType: ElementType;
  processType: ProcessType;

  constructor(editor: Editor, mesh: Mesh, elementType: ElementType) {
    this.editor = editor;
    this.mesh = mesh;
    this.elementType = elementType;
    this.changeProcessType(ProcessType.Disable);
  }

  serialize(): object {
    const output = {
      elementType: this.elementType,
      processType: this.processType,
      scale: this.mesh.scale,
      position: this.mesh.position,
      rotation: eulerToVector3(this.mesh.rotation),
    };
    return output;
  }

  changeProcessType(type: ProcessType): void {
    this.processType = type;
    if (type === ProcessType.Add) {
      this.mesh.material = this.editor.process.addMaterial;
    } else if (type === ProcessType.Disable) {
      this.mesh.material = this.editor.process.disableMaterial;
    } else if (type === ProcessType.Subtract) {
      this.mesh.material = this.editor.process.subtractMaterial;
    }
  }

  getBrush(): Brush {
    const brush = new Brush(this.mesh.geometry);
    brush.position.copy(this.mesh.position);
    brush.scale.copy(this.mesh.scale);
    brush.rotation.copy(this.mesh.rotation);
    brush.updateMatrixWorld();
    return brush;
  }
}
