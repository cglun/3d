import { Object3D, Vector3 } from "three";

// 得到物体的世界坐标
export function getObjectWorldPosition(model: Object3D) {
  const worldPosition = new Vector3();
  model.getWorldPosition(worldPosition);
  return worldPosition;
}
