import { Scene, Vector3 } from "three";
import {
  CustomButtonType,
  generateButtonItemMap,
  GenerateButtonItemMap,
} from "@/app/type";

import { GROUP } from "@/three/config/CONSTANT";

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

import { SceneUserData } from "@/three/config/Three3dConfig";
import {
  getEditorInstance,
  getViewerInstance,
  hasValueString,
} from "@/three/utils/utils";

export const cameraViewerPosition = new Vector3(0, 0, 0);

//设置模型和相机的偏移
export function setUserSettingByType(
  userSetting: {
    modelOffset: Vector3;
    cameraOffset: Vector3;
    animationTime: number;
  },
  customButtonType: CustomButtonType
) {
  if (customButtonType === "TOGGLE") {
    userSetting.cameraOffset.x = 26;
  }
  if (customButtonType === "DRAWER") {
    userSetting.modelOffset.z = 5;
    userSetting.cameraOffset.y = 4;
    userSetting.cameraOffset.z = 1;
  }
  if (customButtonType === "STRETCH") {
    userSetting.modelOffset.y = 1;
  }
}

// 生成切换按钮组
export function generateToggleButtonGroup(
  // originalCodeArr: GenerateButtonItemMap[],
  sceneContext: Scene,
  customButtonType: CustomButtonType
): GenerateButtonItemMap[] {
  const actionList: GenerateButtonItemMap[] = [];
  const MODEL_GROUP = sceneContext.getObjectByName(GROUP.MODEL);
  const overallViewer: GenerateButtonItemMap = {
    ...generateButtonItemMap,
    showName: "全景",
    NAME_ID: GROUP.MODEL,
  };

  if (MODEL_GROUP) {
    const { children } = MODEL_GROUP;
    actionList.push({
      ...overallViewer,
      showName: "全景",
      NAME_ID: GROUP.MODEL,
    });
    //二层
    children.forEach((item) => {
      const level2 = item.children;
      level2.forEach((item) => {
        if (!hasValueString(item, GROUP.ENV)) {
          const { name } = item;
          actionList.push({ ...overallViewer, showName: name, NAME_ID: name });
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

        if (!hasValueString(item, GROUP.ENV)) {
          level3.forEach((item) => {
            const { name } = item;
            actionList.push({
              ...overallViewer,
              showName: name,
              NAME_ID: name,
            });
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
export function resetListGroupIsClick(listGroup: GenerateButtonItemMap[]) {
  return listGroup.map((item: GenerateButtonItemMap) => {
    return {
      ...item,
      isClick: false,
    };
  });
}

// 获取切换按钮组
export function getToggleButtonGroup(): GenerateButtonItemMap[] {
  // const { customButtonItem } = generateButtonGroup.group[index];

  const { customButtonGroupList } = getViewerInstance();
  if (!customButtonGroupList) {
    return [];
  }
  const { generateButtonGroup } = customButtonGroupList;
  const group = generateButtonGroup.group[0];
  const { listGroup, type } = group.customButtonItem;

  return listGroup
    .map((item: GenerateButtonItemMap) => {
      if (type === "TOGGLE") {
        return animateTOGGLE(item, group);
      }
      if (type === "STRETCH") {
        return animateSTRETCH(item, group);
      }
      if (type === "DRAWER") {
        return animateDRAWER(item, group);
      }
    })
    .filter((item) => item !== undefined) as GenerateButtonItemMap[];
}

//生成漫游动画按钮组
export function generateRoamButtonGroup() {
  const roamButtonGroup: GenerateButtonItemMap[] = [];
  const { scene } = getEditorInstance();
  const roam = scene.getObjectByName(GROUP.ROAM);
  if (roam) {
    roam.children.forEach((item) => {
      const { name } = item;
      roamButtonGroup.push({
        ...generateButtonItemMap,
        showName: name + "_开始",
        NAME_ID: name + "_AN_START",
      });
      roamButtonGroup.push({
        ...generateButtonItemMap,
        showName: name + "_停止",
        NAME_ID: name + "_AN_STOP",
      });
    });
  }

  return roamButtonGroup;
}
//获取漫游动画按钮组
export function getRoamListByRoamButtonMap(): GenerateButtonItemMap[] {
  const { customButtonGroupList } = getViewerInstance();
  if (!customButtonGroupList) {
    return [];
  }
  const [toggleButtonGroup, roamButtonGroup] =
    customButtonGroupList.generateButtonGroup.group;
  const { listGroup } = roamButtonGroup.customButtonItem;
  return listGroup.map((item) => {
    return {
      ...item,
      handler: (state: string) => {
        if (state.includes("_START")) {
          roamAnimation(true);
        }
        if (state.includes("_STOP")) {
          roamAnimation(false);
          const { camera, controls } = getViewerInstance().viewer;
          const { userSetting } = toggleButtonGroup;
          cameraBackHome(camera, controls, userSetting.animationTime);
        }

        showModelBackHome(toggleButtonGroup);
        stretchModelBackHome(toggleButtonGroup);
        drawerBackHome(toggleButtonGroup);
      },
    } as GenerateButtonItemMap;
  });
}

export function roamAnimation(isRunning: boolean) {
  const { scene, controls } = getViewerInstance().viewer;
  const { customButtonGroupList } = scene.userData as SceneUserData;

  const listGroup = getRoamListByRoamButtonMap();
  // 获取用户数据并进行类型断言

  const [roamButtonGroup] = customButtonGroupList.generateButtonGroup.group;
  // 进行空值检查
  if (customButtonGroupList && roamButtonGroup) {
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
  const panelControllerButtonGroup: GenerateButtonItemMap[] = [];

  panelControllerButtonGroup.push({
    ...generateButtonItemMap,
    showName: "展开",
    NAME_ID: "expandLabelInfo",
  });
  panelControllerButtonGroup.push({
    ...generateButtonItemMap,
    showName: "收起",
    NAME_ID: "foldLabelInfo",
  });
  return panelControllerButtonGroup;
}

export function getPanelControllerButtonGroup(): GenerateButtonItemMap[] {
  const { customButtonGroupList, viewer } = getViewerInstance();
  if (!customButtonGroupList) {
    return [];
  }

  const { labelInfoPanelController } = viewer;
  const { customButtonItem } =
    customButtonGroupList.generateButtonGroup.group[2];

  const { listGroup } = customButtonItem;
  return listGroup.map((item: GenerateButtonItemMap) => {
    const { NAME_ID } = item;
    return {
      ...item, // 保留原有的属性
      handler: () => {
        item.isClick = !item.isClick;

        if (NAME_ID === "expandLabelInfo") {
          labelInfoPanelController.expandLabelInfo(); // 调用 expandLabelInfo 方法
        }
        if (NAME_ID === "foldLabelInfo") {
          labelInfoPanelController.foldLabelInfo(); // 调用 foldLabelInfo 方法
        }
      },
    } as GenerateButtonItemMap; // 显式类型断言
  });
}
