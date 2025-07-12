import {
  AmbientLight,
  BoxGeometry,
  BufferGeometry,
  Color,
  DepthTexture,
  DirectionalLight,
  DoubleSide,
  GridHelper,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  PlaneGeometry,
  Scene,
  Vector2,
  Vector3,
  WebGLRenderer,
  WebGLRenderTarget,
} from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader";
import { CustomOutlinePass } from "./CustomOutlinePass.js";
import { OrthoCamera } from "./OrthoCamera";

const GRID_SIZE = 20;

export class Graphic {
  scene: Scene;
  orthoCamera: OrthoCamera;

  // rendering
  renderer: WebGLRenderer;
  composer: EffectComposer;
  effectFXAA: ShaderPass;
  customOutline: CustomOutlinePass;

  constructor() {
    this.setupScene();
    this.setupLighting();
    this.addTestObject();
    this.onWindowResize();
    this.animate();
  }

  drawCube(pos: Vector3, color: string) {
    const geometry2 = new BoxGeometry(1, 1, 1);
    const material2 = new MeshLambertMaterial({ color: color });
    const cube2 = new Mesh(geometry2, material2);
    cube2.position.copy(pos);
    this.scene.add(cube2);
  }

  drawLine(to: Vector3, color: string) {
    const material = new LineBasicMaterial({
      color,
    });
    const points = [];
    points.push(new Vector3());
    points.push(to);
    const geometry = new BufferGeometry().setFromPoints(points);
    const line = new Line(geometry, material);
    this.scene.add(line);
  }

  drawPlane() {
    const geometry = new PlaneGeometry(5, 5);
    const material = new MeshBasicMaterial({ color: "pink", side: DoubleSide });
    const plane = new Mesh(geometry, material);
    this.scene.add(plane);
  }

  addTestObject() {
    this.drawCube(new Vector3(0, 0, 0), "gray");
    this.drawCube(new Vector3(10, 0, 0), "red");
    this.drawLine(new Vector3(10, 0, 0), "red");
    this.drawCube(new Vector3(0, 10, 0), "green");
    this.drawLine(new Vector3(0, 10, 0), "green");
    this.drawCube(new Vector3(0, 0, 10), "blue");
    this.drawLine(new Vector3(0, 0, 10), "blue");
  }

  setupLighting() {
    this.scene.add(new AmbientLight(0xffffff));

    const light1 = new DirectionalLight(0xffffff, 5);
    light1.position.set(-100, 50, 100);
    this.scene.add(light1);

    const light2 = new DirectionalLight(0xffffff, 2);
    light2.position.set(-100, -50, 10);
    this.scene.add(light2);
  }

  setupScene() {
    this.scene = new Scene();
    this.scene.background = new Color(0xf0f0f0);
    const gridHelper = new GridHelper(GRID_SIZE, GRID_SIZE);
    gridHelper.rotateX(Math.PI / 2);
    gridHelper.material.depthTest = false;
    this.scene.add(gridHelper);

    this.renderer = new WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.orthoCamera = new OrthoCamera(this);

    // post processing
    const depthTexture = new DepthTexture(
      window.innerWidth,
      window.innerHeight
    );
    const renderTarget = new WebGLRenderTarget(
      window.innerWidth,
      window.innerHeight,
      {
        depthTexture: depthTexture,
        depthBuffer: true,
      }
    );

    // Initial render pass.
    this.composer = new EffectComposer(this.renderer, renderTarget);
    const pass = new RenderPass(this.scene, this.orthoCamera.camera);
    this.composer.addPass(pass);

    // Outline pass.
    this.customOutline = new CustomOutlinePass(
      new Vector2(window.innerWidth, window.innerHeight),
      this.scene,
      this.orthoCamera.camera
    );
    this.composer.addPass(this.customOutline);

    // Antialias pass.
    this.effectFXAA = new ShaderPass(FXAAShader);
    this.effectFXAA.uniforms["resolution"].value.set(
      1 / window.innerWidth,
      1 / window.innerHeight
    );
    this.composer.addPass(this.effectFXAA);

    document.body.appendChild(this.renderer.domElement);
    window.addEventListener("resize", this.onWindowResize.bind(this));
    this.renderer.domElement.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    });
  }

  onWindowResize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.composer.setSize(window.innerWidth, window.innerHeight);
    this.effectFXAA.setSize(window.innerWidth, window.innerHeight);
    this.customOutline.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.composer.render();
  }
}
