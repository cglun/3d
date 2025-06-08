import { Object3D, Object3DEventMap, Vector3 } from "three";
import { APP_COLOR, CustomButtonType } from "../app/type";
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
    toggleButtonGroup: {
      name: string;
      type: CustomButtonType;
      listGroup: unknown[];
      userSetting: {
        modelOffset: {
          x: number;
          y: number;
          z: number;
        };
      };
    };
    roamButtonGroup: {
      name: string;
      type: CustomButtonType;
      userSetting: Record<string, unknown>;
      listGroup: unknown[];
    };
    panelControllerButtonGroup: {
      name: string;
      type: CustomButtonType;
      listGroup: unknown[];
    };
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

const userData: SceneUserData = {
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
    name: "",
    asBackground: false,
  },
  javascript: "",
  customButtonList: {
    toggleButtonGroup: {
      name: "切换",
      type: "TOGGLE" as CustomButtonType,
      listGroup: [],
      userSetting: {
        modelOffset: {
          x: 0, // 模型的 x 偏移量
          y: 0, // 模型的 y 偏移量
          z: 0, // 模型的 z 偏移量
        },
      },
    },
    roamButtonGroup: {
      name: "漫游",
      type: "ROAM" as CustomButtonType,
      userSetting: {},
      listGroup: [],
    },
    panelControllerButtonGroup: {
      name: "面板",
      type: "PANEL_CONTROLLER" as CustomButtonType,
      listGroup: [],
    },
  }, // 若 CustomButtonListType 有具体结构，需按需填充
  APP_THEME: {
    themeColor: APP_COLOR.Dark, // 若 APP_COLOR 有具体结构，需按需填充
    iconFill: "",
    sceneCanSave: false,
  },
  userCssStyleTopCard: { ...userCssStyle }, // 若 UserStyles 有具体结构，需按需填充
  userCssStyleMarkLabel: { ...userCssStyle }, // 若 UserStyles 有具体结构，需按需填充
  selected3d: null, // 若 Selected3d 有具体结构，需按需填充
};
export default userData;
/**
 * 场景用户数据接口，定义了场景相关的用户数据结构
 */
