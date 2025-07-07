import { AnimationMixer, Mesh, TubeGeometry, Vector3 } from "three";
import {
  ButtonItemBase,
  GenerateButtonItemMap,
  APP_COLOR,
  CustomButtonItemMap,
  CustomButtonType,
  GlbModel,
} from "@/app/type";

//import venice_sunset_1k from "@static/file3d/hdr/venice_sunset_1k.hdr?url";
//import spruit_sunrise_1k from "@static/file3d/hdr/spruit_sunrise_1k.hdr?url";
const venice_sunset_1k = new URL(
  "@static/file3d/hdr/venice_sunset_1k.hdr",
  import.meta.url
).href;
const spruit_sunrise_1k = new URL(
  "@static/file3d/hdr/spruit_sunrise_1k.hdr",
  import.meta.url
).href;

export const userCssStyle = {
  cardWidth: 296,
  cardHeight: 378,
  cardRadius: 0,
  cardBackgroundColor: "#502626",
  cardBackgroundUrl: "/editor3d/static/images/topCard.png",
  enableCardBackgroundUrl: true,
  headerFontSize: 16,
  headerColor: "#67ebeb",
  bodyFontSize: 12,
  bodyColor: "#48db4a",
  offsetX: 0,
  offsetY: 0,
  cardSize: 0.0116,
  headerMarginTop: 0,
  headerMarginLeft: 0,
  opacity: 1,
};
export const modelEdgeHighlight = {
  //设置颜色
  edgeStrength: 5, // 边缘强度
  edgeGlow: 1.16, // 边缘发光
  edgeThickness: 1, // 边缘厚度
  pulsePeriod: 0.5, // 脉冲周期
  canSeeColor: "#00ff00",
  noSeeColor: "#00ff00",
};
export type ModelEdgeHighlight = typeof modelEdgeHighlight;
export type UserCssStyle = typeof userCssStyle;
export interface RoamButtonUserSetting {
  scale: number;
  extrusionSegments: number;
  radiusSegments: number;
  closed: boolean;
  lookAhead: boolean;
  speed: number;
  offset: number;
  radius: number;
  tension: number;
}

export const buttonGroupStyleInit = {
  top: 0,
  left: 0,
  width: 80,
  height: 30,
  borderColor: "#ff0000",
  borderColorIsClick: "#ff00ff",
  borderWidth: 0,
  direction: "row",
  opacity: 1,
  borderRadius: 0,
  fontSize: 20,
  gap: 2,
  color: "#7a2a2a",
  colorIsClick: "#ff00ff",
  marginTop: 0,
  marginLeft: 0,
  backgroundColor: "#67ebeb",
  backgroundColorIsClick: "#5b2806",
  useBackgroundUrl: true,
  backgroundUrl: "/editor3d/static/images/topMark.png",
  backgroundUrlIsClick: "/editor3d/static/images/topMark.png",
};
export type ButtonGroupStyle = typeof buttonGroupStyleInit;

export interface CustomButtonItemBase {
  name: string;
  type: CustomButtonType;
  listGroup: ButtonItemBase[];
  showGroup: boolean;
  buttonGroupStyle: ButtonGroupStyle;
}

export interface CustomButtonItem extends CustomButtonItemBase {
  listGroup: GenerateButtonItemMap[];
}

export interface CustomButtonItem2 extends CustomButtonItemBase {
  listGroup: CustomButtonItemMap[];
}

export interface ToggleButtonGroup {
  customButtonItem: CustomButtonItem;
  userSetting: {
    modelOffset: Vector3;
    cameraOffset: Vector3;
    animationTime: number;
  };
}
export interface RoamButtonGroup {
  customButtonItem: CustomButtonItem;
  userSetting: RoamButtonUserSetting;
}
export interface PanelControllerButtonGroup {
  customButtonItem: CustomButtonItem;
}
export interface UserButtonGroup {
  customButtonItem: CustomButtonItem;
}
export interface UserButton {
  name: string;
  group: CustomButtonItem2[];
}

export type Config3dKey = keyof Config3d;
export type Config3d = typeof config3dInit;
export const config3dInit = {
  css2d: true, //是否开启2d标签
  css3d: true, //是否开启3d标签
  useTween: true, //是否开启动画
  useShadow: true, //是否开启阴影
  useKeyframe: true, //是否开启关键帧动画
  FPS: 30, //帧率
  useComposer: true,
};

export interface SceneUserData {
  projectId: number;
  GOD_NUMBER: {
    clearHistory: number;
  }; // 刷新场景时间和清空历史
  cameraPosition: {
    start: Vector3;
    end: Vector3;
  };
  config3d: Config3d;
  backgroundHDR: BackgroundHDR;
  javascript: string;
  customButtonGroupList: typeof customButtonGroupListInit;
  APP_THEME: {
    themeColor: APP_COLOR;
    iconFill: string;
    sceneCanSave: boolean;
  };
  userCssStyle: {
    topCard: UserCssStyle;
    markLabel: UserCssStyle;
    modelEdgeHighlight: ModelEdgeHighlight;
  };
}

export interface GenerateButtonGroup {
  des: "生成按钮组";
  group: [ToggleButtonGroup, RoamButtonGroup, PanelControllerButtonGroup];
}
export interface CustomButtonGroup {
  des: "用户自定义";
  group: CustomButtonItem2[];
}
export type CustomButtonGroupList = {
  generateButtonGroup: GenerateButtonGroup;
  customButtonGroup: CustomButtonGroup;
};
export const customButtonGroupListInit: CustomButtonGroupList = {
  generateButtonGroup: {
    des: "生成按钮组",
    group: [
      {
        customButtonItem: {
          name: "切换",
          type: "TOGGLE" as CustomButtonType,
          listGroup: [] as GenerateButtonItemMap[],
          showGroup: true, // 补充缺失属性
          buttonGroupStyle: { ...buttonGroupStyleInit }, // 补充缺失属性
        },
        userSetting: {
          modelOffset: new Vector3(0, 0, 0),
          cameraOffset: new Vector3(0, 0, 0),
          animationTime: 1160,
        },
      },
      {
        customButtonItem: {
          name: "漫游",
          type: "ROAM" as CustomButtonType,
          listGroup: [] as GenerateButtonItemMap[],
          showGroup: true, // 补充缺失属性
          buttonGroupStyle: { ...buttonGroupStyleInit }, // 补充缺失属性
        },
        userSetting: {
          scale: 1,
          extrusionSegments: 100,
          radiusSegments: 3,
          closed: true,
          lookAhead: true,
          speed: 2,
          offset: 1,
          radius: 1,
          tension: 0.25,
        },
      },
      {
        customButtonItem: {
          name: "标签控制",
          type: "PANEL_CONTROLLER" as CustomButtonType,
          listGroup: [] as GenerateButtonItemMap[],
          showGroup: true,
          buttonGroupStyle: { ...buttonGroupStyleInit },
        },
      },
    ],
  },
  customButtonGroup: {
    des: "用户自定义",
    group: [] as CustomButtonItem2[],
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
  roamTime: number;
  roamIsRunning: boolean;
  direction: Vector3;
  biNormal: Vector3;
  normal: Vector3;
  position: Vector3;
  lookAt: Vector3;
  tubeGeometry: TubeGeometry;
  startTime: number;
}

export type HdrKey = keyof typeof hdr;
export const hdr = {
  "venice_sunset_1k.hdr": venice_sunset_1k,
  "spruit_sunrise_1k.hdr": spruit_sunrise_1k,
};
export const backgroundHDR = {
  color: "#14171f",
  asBackground: true,
  isColor: false,
  HDRName: "venice_sunset_1k.hdr",
};
export type BackgroundHDR = typeof backgroundHDR;
// 定义 hdr 对象键的联合类型

const sceneUserData: SceneUserData = {
  projectId: -1,
  GOD_NUMBER: {
    clearHistory: 116,
  },
  cameraPosition: {
    start: new Vector3(15, 16, 17),
    end: new Vector3(5, 6, 7),
  },
  config3d: { ...config3dInit },
  backgroundHDR: { ...backgroundHDR },
  javascript: "console.log(116)",
  customButtonGroupList: { ...customButtonGroupListInit },
  APP_THEME: {
    themeColor: APP_COLOR.Dark, // 若 APP_COLOR 有具体结构，需按需填充
    iconFill: "",
    sceneCanSave: false,
  },
  userCssStyle: {
    topCard: {
      ...userCssStyle,
      headerFontSize: 24,
      bodyFontSize: 20,
      headerMarginTop: 20,
      headerMarginLeft: 20,
    } as UserCssStyle,
    markLabel: {
      ...userCssStyle,
      cardWidth: 123,
      cardHeight: 25,
      headerMarginLeft: 40,
      headerColor: "#a30000",
      cardBackgroundUrl: "/editor3d/static/images/topMark.png",
    } as UserCssStyle,
    modelEdgeHighlight: {
      ...modelEdgeHighlight,
    },
  },
};
export default sceneUserData;
