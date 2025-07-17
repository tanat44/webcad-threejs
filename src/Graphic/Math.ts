import { Euler, Vector3 } from "three";

export function eulerToVector3(euler: Euler): Vector3 {
  return new Vector3(euler.x, euler.y, euler.z);
}

export function isParallel(a: Vector3, b: Vector3): boolean {
  return Math.abs(a.dot(b)) > 0.05;
}

export function hasZeroComponent(v: Vector3): boolean {
  return Math.abs(v.x) < 0.05 || Math.abs(v.y) < 0.05 || Math.abs(v.z) < 0.05;
}

export function absoluteVector(v: Vector3): Vector3 {
  v.x = Math.abs(v.x);
  v.y = Math.abs(v.y);
  v.z = Math.abs(v.z);
  return v;
}
