import {
  AnimationMixer,
  Mesh,
  Object3D,
  Object3DEventMap,
  TubeGeometry,
  Vector3,
} from "three";
import {
  ActionItemMap,
  APP_COLOR,
  CustomButtonType,
  GlbModel,
} from "../app/type";
import venice_sunset_1k from "/static/file3d/hdr/venice_sunset_1k.hdr?url";
import spruit_sunrise_1k from "/static/file3d/hdr/spruit_sunrise_1k.hdr?url";
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
export interface CustomButtonList {
  toggleButtonGroup: CustomButtonItem;
  roamButtonGroup: CustomButtonItem;
  panelControllerButtonGroup: CustomButtonItem;
}
export interface CustomButtonItem {
  name: string;
  type: CustomButtonType;
  userSetting: UserSetting;
  listGroup: ActionItemMap[];
}
export interface Config3d {
  css2d: boolean;
  css3d: boolean;
  useTween: boolean;
  useShadow: boolean;
  useKeyframe: boolean;
  FPS: number;
  useComposer: boolean;
}

export interface SceneUserData {
  projectId: number;
  selected3d: Object3D<Object3DEventMap> | null;
  cameraPosition: {
    start: Vector3;
    end: Vector3;
  };
  isSelected: boolean;
  config3d: Config3d;
  backgroundHDR: BackgroundHDR;
  javascript: string;
  customButtonList: {
    toggleButtonGroup: CustomButtonItem;
    roamButtonGroup: CustomButtonItem;
    panelControllerButtonGroup: CustomButtonItem;
  };
  APP_THEME: {
    themeColor: APP_COLOR;
    iconFill: string;
    sceneCanSave: boolean;
  };

  userCssStyle: {
    topCard: UserCssStyle;
    markLabel: UserCssStyle;
  };
}
type UserSetting = typeof userSettingInit;
export const userSettingInit = {
  modelOffset: new Vector3(0, 0, 0),
  cameraOffset: new Vector3(0, 0, 0),
  animationTime: 1160,
  speed: 1.16,
};
export const customButtonListInit = {
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
};
export interface ExtraParams {
  mixer: AnimationMixer[];
  selectedMesh: Mesh[];
  modelList: GlbModel[];
  modelSize: number;
  loadedModel: number;
  roamLine?: RoamLine;
}
export interface RoamLine {
  roamIsRunning: boolean;
  direction: Vector3;
  biNormal: Vector3;
  normal: Vector3;
  position: Vector3;
  lookAt: Vector3;
  tubeGeometry: TubeGeometry;
  speed: number;
}

export interface BackgroundHDR {
  color: string | HdrKey;
  asBackground: boolean;
  isColor: boolean;
}

// 定义 hdr 对象键的联合类型
export type HdrKey = keyof typeof hdr;
export const hdr = {
  "venice_sunset_1k.hdr": venice_sunset_1k,
  "spruit_sunrise_1k.hdr": spruit_sunrise_1k,
};
const sceneUserData: SceneUserData = {
  projectId: -1,
  selected3d: null,
  isSelected: false,
  cameraPosition: {
    start: new Vector3(15, 16, 17),
    end: new Vector3(5, 6, 7),
  },
  config3d: {
    css2d: true, //是否开启2d标签
    css3d: true, //是否开启3d标签
    useTween: true, //是否开启动画
    useShadow: true, //是否开启阴影
    useKeyframe: true, //是否开启关键帧动画
    FPS: 30, //帧率
    useComposer: true,
  },

  backgroundHDR: {
    color: "venice_sunset_1k.hdr",
    asBackground: true,
    isColor: false,
  } as BackgroundHDR,
  javascript: "",
  customButtonList: { ...customButtonListInit },
  APP_THEME: {
    themeColor: APP_COLOR.Dark, // 若 APP_COLOR 有具体结构，需按需填充
    iconFill: "",
    sceneCanSave: false,
  },
  userCssStyle: {
    topCard: {
      ...userCssStyle,
    },
    markLabel: {
      ...userCssStyle,
      cardHeight: 18,
      cardWidth: 140,
      bodyFontSize: 16,
    },
  },
};
export default sceneUserData;
