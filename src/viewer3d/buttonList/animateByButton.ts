import {
  BufferGeometry,
  CatmullRomCurve3,
  Line,
  LineBasicMaterial,
  Object3D,
  Object3DEventMap,
  PerspectiveCamera,
  Scene,
  TubeGeometry,
  Vector3,
} from "three";
import { ActionItemMap } from "@/app/type";

import { GROUP } from "@/three/GLOBAL_CONSTANT";

import { cameraTween, meshTween } from "@/three/animate";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { getObjectWorldPosition } from "@/viewer3d/viewer3dUtils";
import { roamAnimation } from "@/viewer3d/buttonList/buttonGroup";

import { SceneUserData, ToggleButtonGroup } from "@/three/Three3dConfig";
import { viewerInstance } from "@/three/ViewerInstance";

function _getViewer() {
  return viewerInstance.getViewer();
}

function getCamera() {
  return viewerInstance.getViewer().camera;
}
function getControls() {
  return viewerInstance.getViewer().controls;
}
// 显示模型-显示和隐藏
export function showModelByNameId(NAME_ID: string) {
  const MODEL_GROUP = _getViewer().MODEL_GROUP;

  MODEL_GROUP.traverse((item) => {
    item.layers.set(1);
  });

  const groups = _getViewer().scene.getObjectByName(NAME_ID);
  if (groups) {
    groups.traverse((item) => {
      item.layers.set(0);
    });
    showParentGroup(groups);
  }
  // 递归显示父级，新版本需要递归显示父级，才能显示模型
  function showParentGroup(group: Object3D<Object3DEventMap>) {
    group.layers.set(0);
    if (group.parent) {
      showParentGroup(group.parent);
    }
  }
}
export function showModelBackHome(toggleButtonGroup: ToggleButtonGroup) {
  const { type } = toggleButtonGroup.customButtonItem;
  if (type == "TOGGLE") {
    showModelByNameId(GROUP.MODEL);
    const { animationTime } = toggleButtonGroup.userSetting;
    cameraBackHome(getCamera(), getControls(), animationTime);
  }
}

// 显示模型-抽屉
export function drawerOutByNameId(
  item: ActionItemMap,
  toggleButtonGroup: ToggleButtonGroup
) {
  // 使用可选链操作符和默认值确保解构安全

  const MODEL_GROUP = _getViewer().scene.getObjectByName(item.NAME_ID);
  item.data = {
    isSelected: true,
    isRunning: true,
    cameraOffsetStretch: new Vector3(0, 0, 0),
  };
  if (MODEL_GROUP) {
    const { x, y, z } = MODEL_GROUP.position;
    const { modelOffset, animationTime } = toggleButtonGroup.userSetting;

    meshTween(
      MODEL_GROUP,
      new Vector3(x + modelOffset.x, y + modelOffset.y, z + modelOffset.z),
      animationTime
    )
      .start()
      .onComplete(() => {
        item.data = {
          isSelected: true,
          isRunning: false,
          cameraOffsetStretch: new Vector3(0, 0, 0),
        };
      });
  }
}
// 抽屉，回到初始位置
export function drawerBackHome(toggleButtonGroup: ToggleButtonGroup) {
  const { type, listGroup } = toggleButtonGroup.customButtonItem;

  if (type === "DRAWER") {
    const { userSetting } = toggleButtonGroup;
    listGroup.forEach((_item: ActionItemMap) => {
      const _d = _item.data;
      if (_item.data?.isSelected && !_d?.isRunning) {
        const model = _getViewer().scene.getObjectByName(_item.NAME_ID);

        _item.data = {
          isRunning: true,
          isSelected: true,
          cameraOffsetStretch: new Vector3(0, 0, 0),
        };

        if (model) {
          const mp = model.position;
          const { x, y, z } = userSetting.modelOffset;
          meshTween(
            model,
            new Vector3(mp.x - x, mp.y - y, mp.z - z),
            userSetting?.animationTime ?? 1000
          )
            .start()
            .onComplete(() => {
              _item.data = {
                isRunning: false,
                isSelected: false,
                cameraOffsetStretch: new Vector3(0, 0, 0),
              };
            });
        }
      }
    });
  }
}
// 显示模型-拉伸
export function stretchModelByNameId(
  NAME_ID: string,
  toggleButtonGroup: ToggleButtonGroup
) {
  const MODEL_GROUP = _getViewer().scene.getObjectByName(NAME_ID);

  if (MODEL_GROUP) {
    const isStretch = MODEL_GROUP.userData.childrenIsStretch;
    const isStretchRunning = MODEL_GROUP.userData.childrenIsRunning;
    if (isStretchRunning) {
      return;
    }
    MODEL_GROUP.userData.childrenIsRunning = true;
    if (isStretch) {
      stretchListGroup(MODEL_GROUP, toggleButtonGroup, false);
      return;
    }
    stretchListGroup(MODEL_GROUP, toggleButtonGroup, true);
  }
}

//展开的模型回到初始位置
export function stretchModelBackHome(toggleButtonGroup: ToggleButtonGroup) {
  const { type } = toggleButtonGroup.customButtonItem;

  if (type === "STRETCH") {
    const MODEL_GROUP = _getViewer().MODEL_GROUP;
    MODEL_GROUP.children.forEach((_item) => {
      const { children } = _item;
      for (let index = 0; index < children.length; index++) {
        const element = children[index];
        for (let index = 0; index < element.children.length; index++) {
          const _element = element.children[index];

          if (
            !element.userData.childrenIsRunning &&
            element.userData.childrenIsStretch
          ) {
            closeStretchModel(_element, toggleButtonGroup, index);
          }
        }

        // const { x, y, z } = element.position;

        //  stretchListGroup(element, customButtonList, false);
      }
      const { animationTime } = toggleButtonGroup.userSetting;
      cameraBackHome(getCamera(), getControls(), animationTime);
    });
  }
}

function closeStretchModel(
  group: Object3D<Object3DEventMap>,
  toggleButtonGroup: ToggleButtonGroup,
  index: number
) {
  const { x, y, z } = group.position;
  const { modelOffset, animationTime } = toggleButtonGroup.userSetting;

  meshTween(
    group,
    new Vector3(
      x - modelOffset.x * index,
      y - modelOffset.y * index,
      z - modelOffset.z * index
    ),
    animationTime
  )
    .start()
    .onComplete(() => {
      if (group.parent) {
        group.parent.userData.childrenIsStretch = false;
        group.parent.userData.childrenIsRunning = false;
      }
    });
}

function stretchListGroup(
  MODEL_GROUP: Object3D<Object3DEventMap>,
  toggleButtonGroup: ToggleButtonGroup,
  childrenIsStretch: boolean
) {
  const { animationTime, modelOffset } = toggleButtonGroup.userSetting;
  const array = MODEL_GROUP.children;
  const directionMultiplier = MODEL_GROUP.userData.childrenIsStretch ? -1 : 1;

  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    const { x, y, z } = element.position;
    meshTween(
      element,
      new Vector3(
        x + modelOffset.x * index * directionMultiplier,
        y + modelOffset.y * index * directionMultiplier,
        z + modelOffset.z * index * directionMultiplier
      ),
      animationTime
    )
      .start()
      .onComplete(() => {
        MODEL_GROUP.userData.childrenIsStretch = childrenIsStretch;
        MODEL_GROUP.userData.childrenIsRunning = false;
      });
  }
}

let isMoveCamera = false;
export function moveCameraSTRETCH(
  item: ActionItemMap,
  toggleButtonGroup: ToggleButtonGroup
) {
  const { NAME_ID } = item;

  const MODEL_GROUP = _getViewer().scene.getObjectByName(NAME_ID);

  if (MODEL_GROUP) {
    // 移动相机到指定位置
    const camera = getCamera();
    const controls = getControls();
    const { animationTime, cameraOffset } = toggleButtonGroup.userSetting;

    if (isMoveCamera) {
      cameraBackHome(camera, controls, animationTime);
    } else {
      // const offSet = item.data.cameraOffsetStretch;
      //相机位置
      const { x, y, z } = item.data.cameraOffsetStretch;
      // const { x, y, z } = getObjectWorldPosition(MODEL_GROUP);
      const cameraPositionSTRETCH = new Vector3(
        x + cameraOffset.x,
        y + cameraOffset.y,
        z + cameraOffset.z
      );
      const modelPosition = getObjectWorldPosition(MODEL_GROUP);
      controls.target.set(modelPosition.x, modelPosition.y, modelPosition.z);
      controls.update();
      cameraTween(camera, cameraPositionSTRETCH, animationTime).start();

      isMoveCamera = true;
    }
  }
}

export function moveCameraDRAWER(
  item: ActionItemMap,
  toggleButtonGroup: ToggleButtonGroup
) {
  const { NAME_ID } = item;
  const MODEL_GROUP = _getViewer().scene.getObjectByName(NAME_ID);
  if (MODEL_GROUP) {
    // 移动相机到指定位置
    const camera = getCamera();
    const controls = getControls();
    const { animationTime, cameraOffset, modelOffset } =
      toggleButtonGroup.userSetting;

    if (isMoveCamera && MODEL_GROUP.name === GROUP.MODEL) {
      cameraBackHome(camera, controls, animationTime);
    } else {
      if (MODEL_GROUP.name === GROUP.MODEL) {
        return;
      }
      const { x, y, z } = getObjectWorldPosition(MODEL_GROUP);

      const cameraPosition = new Vector3(
        x + cameraOffset.x + modelOffset.x,

        y + cameraOffset.y + modelOffset.y,
        z + cameraOffset.z + modelOffset.z
      );

      cameraTween(camera, cameraPosition, animationTime)
        .start()
        .onComplete(() => {
          controls.target.set(
            x + modelOffset.x,
            y + modelOffset.y,
            z + modelOffset.z
          );
          controls.update();
          camera.lookAt(controls.target);
        });

      isMoveCamera = true;
    }
  }
}

export function cameraBackHome(
  camera: PerspectiveCamera,
  controls: OrbitControls,
  animationTime: number
) {
  const { cameraPosition } = viewerInstance.getViewer().scene
    .userData as SceneUserData;

  cameraTween(camera, cameraPosition.end, animationTime)
    .start()
    .onComplete(() => {
      controls.target.set(0, 0, 0);

      isMoveCamera = false;
    });
}

//export let currentlyActionItemMap: (item: ActionItemMap) => void;
//currentlyActionItemMap = (item: ActionItemMap) => {};
function commonHandler(item: ActionItemMap) {
  if (_roamIsRunning) {
    roamAnimation(false);
  }
  if (document.getCurrentActionItemMap) {
    document.getCurrentActionItemMap(item);
  }
}

//显隐动画
export function animateTOGGLE(
  item: ActionItemMap,
  toggleButtonGroup: ToggleButtonGroup
) {
  const { NAME_ID } = item;

  return {
    ...item,
    handler: () => {
      // if (_roamIsRunning) {
      //   roamAnimation(false);
      // }
      // document.getCurrentActionItemMap(item);
      commonHandler(item);
      item.isClick = !item.isClick;
      const { cameraOffset, animationTime } = toggleButtonGroup.userSetting;
      if (NAME_ID === GROUP.MODEL) {
        showModelByNameId(GROUP.MODEL);
        cameraBackHome(getCamera(), getControls(), animationTime);
        return;
      }
      showModelByNameId(NAME_ID);
      const model = _getViewer().scene.getObjectByName(NAME_ID);
      if (model) {
        const { x, y, z } = getObjectWorldPosition(model);
        const camera = getCamera();
        cameraTween(
          camera,
          new Vector3(
            x + cameraOffset.x,
            y + cameraOffset.y,
            z + cameraOffset.z
          ),
          animationTime
        )
          .start()
          .onComplete(() => {
            const controls = getControls();
            controls.target.set(x, y, z);
            controls.update();
          });
      }
    },
  };
}
//抽屉按钮动画
export function animateDRAWER(
  item: ActionItemMap,
  toggleButtonGroup: ToggleButtonGroup
) {
  return {
    ...item,
    handler: () => {
      commonHandler(item);

      drawerBackHome(toggleButtonGroup);
      if (!item.data?.isSelected && !item.data?.isRunning) {
        drawerOutByNameId(item, toggleButtonGroup);
        moveCameraDRAWER(item, toggleButtonGroup);
      }
    },
  };
}
//拉伸按钮动画
export function animateSTRETCH(
  item: ActionItemMap,
  toggleButtonGroup: ToggleButtonGroup
) {
  const { NAME_ID } = item;
  return {
    ...item,
    handler: () => {
      commonHandler(item);
      //如果是全景按钮，
      if (NAME_ID === GROUP.MODEL) {
        //const customButtonList = _getViewer().userData
        stretchModelBackHome(toggleButtonGroup);
        return;
      }
      stretchModelByNameId(NAME_ID, toggleButtonGroup);
      moveCameraSTRETCH(item, toggleButtonGroup);
      drawerBackHome(toggleButtonGroup);
    },
  };
}

export const _roamIsRunning = false;
//ROAM动画
export function animateROAM(
  scene: Scene,
  curveName: string,
  isRunning: boolean
) {
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
  const { roamLine } = viewerInstance.getViewer().extraParams;
  if (roamLine) {
    roamLine.roamIsRunning = isRunning;
    roamLine.tubeGeometry = new TubeGeometry(curve, 100, 2, 3, true);
  }
}
