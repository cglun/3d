import { CustomButtonItemMap, GenerateButtonItemMap } from "@/app/type";

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
import { editorInstance } from "../instance/EditorInstance";
import { SceneUserData } from "../config/Three3dConfig";
import { viewerInstance } from "../instance/ViewerInstance";

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
export function getShowButtonStyle_xx(
  _item: CustomButtonItemMap | GenerateButtonItemMap
) {
  return {
    opacity: _item.showButton ? "initial" : (0.6).toString(),
    fontStyle: _item.showButton ? "normal" : "italic",
    textDecoration: _item.showButton ? "none" : "line-through",
  };
}
/**
 * 获取编辑器实例及其相关数据
 * @returns 包含编辑器实例、编辑器场景用户数据以及自定义按钮组列表的对象
 */
export function getEditorInstance() {
  const editor = editorInstance.getEditor();
  const userData = editor.scene.userData as SceneUserData;
  const customButtonGroupList = userData.customButtonGroupList;
  const scene = editor.scene;
  return { editor, userData, customButtonGroupList, scene };
}
/**
 * 获取查看器场景的用户数据和自定义按钮组列表
 * 注意：此函数存在语法错误，需要修正
 */
export function getViewerInstance() {
  const viewer = viewerInstance.getViewer();
  const userData = viewer.scene.userData as SceneUserData;
  const customButtonGroupList = userData.customButtonGroupList;
  const scene = viewer.scene;
  return { viewer, userData, customButtonGroupList, scene };
}
