import { GUI } from "dat.gui";
import { Graphic } from "../../Graphic/Graphic";
import { FolderBase } from "./FolderBase";

export class RenderUi extends FolderBase {
  constructor(graphic: Graphic, gui: GUI) {
    super(graphic, gui, "Render Settings");
  }

  protected override create() {
    const params = {
      mode: { Mode: 0 },
      FXAA: true,
      outlineColor: 0xffffff,
      depthBias: 1,
      depthMult: 1,
      normalBias: 1,
      normalMult: 1.0,
    };

    const uniforms = (this.graphic.customOutline.fsQuad.material as any)
      .uniforms;
    this.folder
      .add(params.mode, "Mode", {
        Outlines: 0,
        "Original scene": 1,
        "Depth buffer": 2,
        "Normal buffer": 3,
      })
      .onChange(function (value: number) {
        uniforms.debugVisualize.value = value;
      });

    this.folder
      .addColor(params, "outlineColor")
      .onChange(function (value: number) {
        uniforms.outlineColor.value.set(value);
      });

    this.folder
      .add(params, "depthBias", 0.0, 5)
      .onChange(function (value: number) {
        uniforms.multiplierParameters.value.x = value;
      });
    this.folder
      .add(params, "depthMult", 0.0, 10)
      .onChange(function (value: number) {
        uniforms.multiplierParameters.value.y = value;
      });
    this.folder
      .add(params, "normalBias", 0.0, 5)
      .onChange(function (value: number) {
        uniforms.multiplierParameters.value.z = value;
      });
    this.folder
      .add(params, "normalMult", 0.0, 10)
      .onChange(function (value: number) {
        uniforms.multiplierParameters.value.w = value;
      });
  }
}
