import { Mesh, MeshLambertMaterial } from "three";
import { Graphic } from "../Graphic/Graphic";
import { Ui } from "../Ui/Ui";
import { KeyShortcut } from "./KeyShortcut";
import { Process } from "./Process";
import { Toolbox } from "./Toolbox/Toolbox";

enum EditorMode {
  Edit,
  Solid,
}

export class Editor {
  mode: EditorMode = EditorMode.Edit;

  private graphic: Graphic;
  readonly process: Process;
  readonly ui: Ui;
  readonly keyShortcut: KeyShortcut;
  readonly toolbox: Toolbox;

  // solid
  readonly solidMaterial: MeshLambertMaterial = new MeshLambertMaterial({
    color: 0xb7ff00,
  });
  private solidMesh: Mesh | undefined;

  constructor(graphic: Graphic, ui: Ui) {
    this.graphic = graphic;
    this.process = new Process(graphic, this);
    this.ui = ui;
    this.keyShortcut = new KeyShortcut(this);
    this.toolbox = new Toolbox(graphic, this);
  }

  toggleMode() {
    if (this.mode === EditorMode.Edit) {
      // enter solid mode
      this.process.hideElement();
      const geometry = this.process.mergeElement();
      this.solidMesh = new Mesh(geometry, this.solidMaterial);
      this.graphic.scene.add(this.solidMesh);
      this.mode = EditorMode.Solid;
    } else {
      // enter edit mode
      if (this.solidMesh) {
        this.graphic.scene.remove(this.solidMesh);
        this.solidMesh.geometry.dispose();
        this.solidMesh = undefined;
      }

      this.process.showElement();
      this.mode = EditorMode.Edit;
    }
  }
}
