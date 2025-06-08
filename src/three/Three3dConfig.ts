import { Object3D, Object3DEventMap, Vector3 } from "three";
import { ActionItemMap, APP_COLOR, CustomButtonType } from "../app/type";
export const userCssStyle = {
  cardWidth: 130,
  cardHeight: 130,
  cardRadius: 0.8,
  cardBackgroundColor: "#56c2c2",
  cardBackgroundUrl: "",
  headerFontSize: 16,
  headerColor: "#ffffff",
  bodyFontSize: 12,
  bodyColor: "#ffffff",
  modelHighlightColor: "#2eff7e",
  offsetX: 0,
  offsetY: 0,
  cardSize: 0.03,
  headerMarginTop: 15,
  headerMarginLeft: 18,
  opacity: 1,
};
export type UserCssStyle = typeof userCssStyle;
export interface CustomButtonListType {
  name: string;
  type: CustomButtonType;
  userSetting: UserSetting;
  listGroup: ActionItemMap[];
}
export interface SceneUserData {
  isSelected: boolean;
  fixedCameraPosition: Vector3;
  config3d: {
    css2d: boolean;
    css3d: boolean;
    useTween: boolean;
    useShadow: boolean;
    useKeyframe: boolean;
    FPS: number;
    useComposer: boolean;
  };
  projectId: number;
  backgroundHDR: {
    name: string;
    asBackground: boolean;
  };
  javascript: string;
  customButtonList: {
    toggleButtonGroup: CustomButtonListType;
    roamButtonGroup: CustomButtonListType;
    panelControllerButtonGroup: CustomButtonListType;
  };
  APP_THEME: {
    themeColor: APP_COLOR;
    iconFill: string;
    sceneCanSave: boolean;
  };
  userCssStyleTopCard: UserCssStyle;
  userCssStyleMarkLabel: UserCssStyle;
  selected3d: Object3D<Object3DEventMap> | null;
}
type UserSetting = typeof userSettingInit;
const userSettingInit = {
  modelOffset: new Vector3(0, 0, 0),
  cameraOffset: new Vector3(0, 0, 0),
  animationTime: new Vector3(0, 0, 0),
  speed: 1,
};
const sceneUserData: SceneUserData = {
  isSelected: false,
  fixedCameraPosition: new Vector3(5, 6, 7),
  config3d: {
    css2d: true, //是否开启2d标签
    css3d: true, //是否开启3d标签
    useTween: true, //是否开启动画
    useShadow: true, //是否开启阴影
    useKeyframe: true, //是否开启关键帧动画
    FPS: 30, //帧率
    useComposer: true,
  },
  projectId: -1,
  backgroundHDR: {
    name: "venice_sunset_1k.hdr",
    asBackground: true,
  },
  javascript: "",
  customButtonList: {
    toggleButtonGroup: {
      name: "切换",
      type: "TOGGLE" as CustomButtonType,
      listGroup: [],
      userSetting: { ...userSettingInit },
    },
    roamButtonGroup: {
      name: "漫游",
      type: "ROAM" as CustomButtonType,
      listGroup: [],
      userSetting: { ...userSettingInit },
    },
    panelControllerButtonGroup: {
      name: "面板",
      type: "PANEL_CONTROLLER" as CustomButtonType,
      listGroup: [],
      userSetting: { ...userSettingInit },
    },
  },
  APP_THEME: {
    themeColor: APP_COLOR.Dark, // 若 APP_COLOR 有具体结构，需按需填充
    iconFill: "",
    sceneCanSave: false,
  },
  userCssStyleTopCard: { ...userCssStyle }, // 若 UserStyles 有具体结构，需按需填充
  userCssStyleMarkLabel: { ...userCssStyle }, // 若 UserStyles 有具体结构，需按需填充
  selected3d: null, // 若 Selected3d 有具体结构，需按需填充
};
export default sceneUserData;
