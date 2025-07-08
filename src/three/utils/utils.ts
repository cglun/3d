import { GenerateButtonItemMap } from "@/app/type";
import { getButtonGroupStyle } from "@/component/routes/effects/utils";
import {
  getPanelControllerButtonGroup,
  getRoamListByRoamButtonMap,
  getToggleButtonGroup,
} from "@/viewer3d/buttonList/buttonGroup";
import {
  CatmullRomCurve3,
  Object3D,
  Object3DEventMap,
  Scene,
  Vector3,
} from "three";
import { CustomButtonItem, GenerateButtonGroup } from "../config/Three3dConfig";

export function hasValueString(
  item: Object3D<Object3DEventMap>,
  value: string
) {
  return item.name.includes(value);
}

export function getCurveByMesh_xx(scene: Scene, curveName: string) {
  const vector: Vector3[] = [];
  const _curve = scene.getObjectByName(curveName);

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

// 得到物体的世界坐标
export function getObjectWorldPosition(model: Object3D) {
  const worldPosition = new Vector3();
  model.getWorldPosition(worldPosition);
  return worldPosition;
}

export function getListGroupByIndex(groupIndex: number) {
  let listGroup = [] as GenerateButtonItemMap[];
  if (groupIndex === 0) {
    listGroup = getToggleButtonGroup();
  }
  if (groupIndex === 1) {
    listGroup = getRoamListByRoamButtonMap();
  }
  if (groupIndex === 2) {
    listGroup = getPanelControllerButtonGroup();
  }
  return listGroup;
}
