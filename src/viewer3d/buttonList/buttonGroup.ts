import { Scene, Vector3 } from "three";
import { ActionItemMap, CustomButtonType } from "@/app/type";

import { GLOBAL_CONSTANT } from "@/three/GLOBAL_CONSTANT";

import {
  animateDRAWER,
  animateROAM,
  animateSTRETCH,
  animateTOGGLE,
  cameraBackHome,
  drawerBackHome,
  showModelBackHome,
  stretchModelBackHome,
} from "@/viewer3d/buttonList/animateByButton";

import { hasValueString } from "@/viewer3d/buttonList/utils";
import { LabelInfoPanelController } from "@/viewer3d/label/LabelInfoPanelController";
import { CustomButtonList, SceneUserData } from "@/three/Three3dConfig";
import { viewerInstance } from "@/three/ViewerInstance";
import { editorInstance } from "@/three/EditorInstance";

function getActionItemByMap(
  item: ActionItemMap,
  customButtonType: CustomButtonType
): ActionItemMap {
  if (customButtonType === "DRAWER") {
    item.data = {
      isSelected: false,
      isRunning: false,
      cameraOffsetStretch: new Vector3(0, 0, 0),
    };
  }
  return item;
}

// 生成切换按钮组
export function generateToggleButtonGroup(
  // originalCodeArr: ActionItemMap[],
  sceneContext: Scene,
  customButtonType: CustomButtonType
): ActionItemMap[] {
  const actionList: ActionItemMap[] = [];
  const MODEL_GROUP = sceneContext.getObjectByName(GLOBAL_CONSTANT.MODEL_GROUP);

  if (MODEL_GROUP) {
    const { children } = MODEL_GROUP;
    actionList.push(
      getActionItemByMap(
        {
          showName: "全景",
          NAME_ID: MODEL_GROUP.name,
          showButton: true,
          isClick: false,
          groupCanBeRaycast: false,
          data: {
            isSelected: false,
            isRunning: false,
            cameraOffsetStretch: new Vector3(0, 0, 0),
          },
        },
        customButtonType
      )
    );
    //二层
    children.forEach((item) => {
      const level2 = item.children;
      level2.forEach((item) => {
        if (!hasValueString(item, GLOBAL_CONSTANT._ENV_)) {
          const { name } = item;
          actionList.push(
            getActionItemByMap(
              {
                showName: name,
                NAME_ID: name,
                showButton: true,
                isClick: false,
                groupCanBeRaycast: false,
                data: {
                  isSelected: false,
                  isRunning: false,
                  cameraOffsetStretch: new Vector3(0, 0, 0),
                },
              },
              customButtonType
            )
          );
        }
      });
    });

    if (customButtonType === "STRETCH") {
      //移除第一项
      //actionList.shift();
      return actionList;
    }

    //三层
    children.forEach((item) => {
      const level2 = item.children;
      level2.forEach((item) => {
        const level3 = item.children;

        if (!hasValueString(item, GLOBAL_CONSTANT._ENV_)) {
          level3.forEach((item) => {
            const { name } = item;
            actionList.push(
              getActionItemByMap(
                {
                  showName: name,
                  NAME_ID: name,
                  showButton: true,
                  isClick: false,
                  groupCanBeRaycast: false,
                  data: {
                    isSelected: false,
                    isRunning: false,
                    cameraOffsetStretch: new Vector3(0, 0, 0),
                  },
                },
                customButtonType
              )
            );
          });
        }
      });
    });
  }

  // const _code = [...actionList, ...originalCodeArr];
  // //  _code去除重复项
  const uniqueActionList = Array.from(
    new Map(actionList.map((item) => [item.NAME_ID, item])).values()
  );
  return uniqueActionList;
}

//重置按钮组的isClick为false
export function resetListGroupIsClick(listGroup: ActionItemMap[]) {
  return listGroup.map((item: ActionItemMap) => {
    return {
      ...item,
      isClick: false,
    };
  });
}

// 获取切换按钮组
export function getToggleButtonGroup(scene: Scene): ActionItemMap[] {
  const customButtonList = scene.userData.customButtonList as CustomButtonList;
  const { listGroup, type } =
    customButtonList.toggleButtonGroup.customButtonItem;
  return listGroup
    .map((item: ActionItemMap) => {
      const { toggleButtonGroup } = customButtonList;
      if (type === "TOGGLE") {
        return animateTOGGLE(item, toggleButtonGroup);
      }

      if (type === "STRETCH") {
        return animateSTRETCH(item, toggleButtonGroup);
      }
      if (type === "DRAWER") {
        return animateDRAWER(item, toggleButtonGroup);
      }
    })
    .filter((item) => item !== undefined) as ActionItemMap[];
}

//生成漫游动画按钮组
export function generateRoamButtonGroup() {
  const roamButtonGroup: ActionItemMap[] = [];
  const { scene } = editorInstance.getEditor();

  const roam = scene.getObjectByName("_ROAM_");
  if (roam) {
    roam.children.forEach((item) => {
      const { name } = item;
      roamButtonGroup.push({
        showName: [name + "_开始", name + "_停止"],
        NAME_ID: name + "_AN_START",
        showButton: true,
        isClick: false,
        groupCanBeRaycast: false,
        data: {
          isSelected: false,
          isRunning: false,
          cameraOffsetStretch: new Vector3(0, 0, 0),
        },
      });
    });
  }

  return roamButtonGroup;
}
//获取漫游动画按钮组
export function getRoamListByRoamButtonMap(scene: Scene): ActionItemMap[] {
  const { customButtonList } = scene.userData as SceneUserData;
  const { toggleButtonGroup, roamButtonGroup } = customButtonList;
  const { listGroup } = roamButtonGroup.customButtonItem;

  return listGroup.map((item: ActionItemMap) => {
    const { NAME_ID, showName } = item;

    return {
      showName: showName,
      NAME_ID: NAME_ID,
      handler: (state: string) => {
        if (state.includes("_START")) {
          roamAnimation(true);
        }
        if (state.includes("_STOP")) {
          roamAnimation(false);
          const { camera, controls } = viewerInstance.getViewer();
          cameraBackHome(camera, controls, 1000);
        }

        showModelBackHome(toggleButtonGroup);
        stretchModelBackHome(toggleButtonGroup);
        drawerBackHome(toggleButtonGroup);
      },
    } as ActionItemMap;
  });
}

export function roamAnimation(isRunning: boolean) {
  const { scene, controls } = viewerInstance.getViewer();
  const listGroup = getRoamListByRoamButtonMap(scene);
  // 获取用户数据并进行类型断言

  const { customButtonList } = scene.userData as {
    customButtonList?: CustomButtonList;
  };

  // 进行空值检查
  if (customButtonList && customButtonList.roamButtonGroup) {
    listGroup.map((item) => {
      const { NAME_ID } = item;
      const NAME = NAME_ID.split("_AN_")[0];
      // animateROAM(scene, camera, controls, NAME, roamButtonGroup, isRunning);
      animateROAM(scene, NAME, isRunning);
    });
  }
  controls.enabled = !isRunning;
}

export function generatePanelControllerButtonGroup() {
  const panelControllerButtonGroup: ActionItemMap[] = [];

  panelControllerButtonGroup.push({
    showName: "展开",
    NAME_ID: "expandLabelInfo",
    showButton: true,
    isClick: false,
    groupCanBeRaycast: false,
    data: {
      isSelected: false,
      isRunning: false,
      cameraOffsetStretch: new Vector3(0, 0, 0),
    },
  });
  panelControllerButtonGroup.push({
    showName: "收起",
    NAME_ID: "foldLabelInfo",
    showButton: true,
    isClick: false,
    groupCanBeRaycast: false,
    data: {
      isSelected: false,
      isRunning: false,
      cameraOffsetStretch: new Vector3(0, 0, 0),
    },
  });
  return panelControllerButtonGroup;
}

export function getPanelControllerButtonGroup(
  scene: Scene,
  panelController: LabelInfoPanelController
): ActionItemMap[] {
  const { customButtonList } = scene.userData as SceneUserData;
  const { listGroup } =
    customButtonList.panelControllerButtonGroup.customButtonItem;
  return listGroup.map((item: ActionItemMap) => {
    const { NAME_ID } = item;

    return {
      ...item, // 保留原有的属性
      handler: () => {
        if (NAME_ID === "expandLabelInfo") {
          panelController?.expandLabelInfo(); // 调用 expandLabelInfo 方法
        }
        if (NAME_ID === "foldLabelInfo") {
          panelController?.foldLabelInfo(); // 调用 foldLabelInfo 方法
        }
      },
    } as ActionItemMap; // 显式类型断言
  });
}
