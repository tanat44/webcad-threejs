import { OrthographicCamera } from "three";
import { Graphic } from "./Graphic";
import { OrthoOrbit } from "./OrthoOrbit";

export class OrthoCamera {
  camera: OrthographicCamera;
  orbit: OrthoOrbit;

  constructor(graphic: Graphic) {
    // camera
    this.camera = new OrthographicCamera();
    this.camera.position.set(-10, -20, 15);
    this.camera.up.set(0, 0, 1);
    this.camera.lookAt(0, 0, 4);

    // orbit
    this.orbit = new OrthoOrbit(this.camera, graphic);

    window.addEventListener("resize", this.onWindowResize.bind(this));
  }

  onLoad() {
    this.orbit.updateZoom(0.05);
  }

  onWindowResize() {
    this.orbit.updateZoom();
  }
}
