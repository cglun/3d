import {
  CatmullRomCurve3,
  Object3D,
  Object3DEventMap,
  Scene,
  Vector3,
} from "three";

import { getObjectWorldPosition } from "@/viewer3d/viewer3dUtils";
import { createGroupIfNotExist } from "@/threeUtils/util4Scene";
export function hasValueString(
  item: Object3D<Object3DEventMap>,
  value: string
) {
  return item.name.includes(value);
}

export function getCurveByMesh(scene: Scene, curveName: string) {
  const vector: Vector3[] = [];
  const _curve = createGroupIfNotExist(scene, curveName, false);
  if (!_curve) {
    return;
  }

  _curve.children.forEach((child) => {
    const position = getObjectWorldPosition(child);
    vector.push(position);
  });

  const curve = new CatmullRomCurve3(vector, true);
  return curve;
}
