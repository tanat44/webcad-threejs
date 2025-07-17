import { CircleGeometry, Mesh, Quaternion, Vector3 } from "three";
import { Graphic } from "../../Graphic/Graphic";
import { Editor } from "../Editor";
import { ToolBase } from "./ToolBase";

const INDICATOR_RADIUS = 1;

export class PlaneIndicatorTool extends ToolBase {
  planeIndicator: Mesh;

  constructor(graphic: Graphic, editor: Editor) {
    super(graphic, editor);
  }

  override activate(): void {
    super.activate();
    const geometry = new CircleGeometry(INDICATOR_RADIUS);
    this.planeIndicator = new Mesh(
      geometry,
      this.editor.process.indicatorMaterial
    );
    this.graphic.scene.add(this.planeIndicator);
  }

  override deactivate(): void {
    this.graphic.scene.remove(this.planeIndicator);
    this.planeIndicator = null;
  }

  protected override overrideMouseMove(e: MouseEvent): void {
    const mousePosition = this.graphic.cursorHelper.getScreenPosition(e);

    const intersect = this.graphic.cursorHelper.findIntersection(
      mousePosition,
      this.editor.process.elements.meshes
    );
    if (!intersect) return;
    const element = this.editor.process.getElement(intersect.object.id);
    if (!element) return;
    this.planeIndicator.position.copy(
      intersect.point.add(intersect.face.normal.clone().multiplyScalar(0.1))
    );
    this.planeIndicator.quaternion.copy(
      new Quaternion().setFromUnitVectors(
        new Vector3(0, 0, 1),
        intersect.face.normal
      )
    );
  }
}
