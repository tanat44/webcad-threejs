import {
  BoxGeometry,
  BufferGeometry,
  DoubleSide,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  PlaneGeometry,
  Scene,
  Vector3,
} from "three";

export function drawCube(scene: Scene, pos: Vector3, color: string) {
  const geometry2 = new BoxGeometry(1, 1, 1);
  const material2 = new MeshLambertMaterial({ color: color });
  const cube2 = new Mesh(geometry2, material2);
  cube2.position.copy(pos);
  scene.add(cube2);
}

export function drawLine(scene: Scene, to: Vector3, color: string) {
  const material = new LineBasicMaterial({
    color,
  });
  const points = [];
  points.push(new Vector3());
  points.push(to);
  const geometry = new BufferGeometry().setFromPoints(points);
  const line = new Line(geometry, material);
  scene.add(line);
}

export function drawPlane(scene: Scene) {
  const geometry = new PlaneGeometry(5, 5);
  const material = new MeshBasicMaterial({ color: "pink", side: DoubleSide });
  const plane = new Mesh(geometry, material);
  scene.add(plane);
}

export function drawTestObject(scene: Scene) {
  drawCube(scene, new Vector3(0, 0, 0), "gray");
  drawCube(scene, new Vector3(10, 0, 0), "red");
  drawLine(scene, new Vector3(10, 0, 0), "red");
  drawCube(scene, new Vector3(0, 10, 0), "green");
  drawLine(scene, new Vector3(0, 10, 0), "green");
  drawCube(scene, new Vector3(0, 0, 10), "blue");
  drawLine(scene, new Vector3(0, 0, 10), "blue");
}
