import { Euler, Vector3 } from "three";

export function eulerToVector3(euler: Euler): Vector3 {
  return new Vector3(euler.x, euler.y, euler.z);
}
