/**
 *
 * 动画
 */
import { Object3D, PerspectiveCamera, Vector3 } from "three";
import TWEEN, { Tween } from "three/addons/libs/tween.module.js";

export function cameraTween(
  camera: PerspectiveCamera,
  target: Vector3,
  time: number = 1000
) {
  return new Tween(camera.position)
    .to(target, time)
    .easing(TWEEN.Easing.Cubic.InOut);
}

export function meshTween(
  mesh: Object3D,
  target: Vector3,
  time: number = 1000
) {
  return new Tween(mesh.position).to(target, time);
}
