import { Euler, Vector3 } from "three";

export enum APP_COLOR {
  Primary = "primary",
  Secondary = "secondary",
  Success = "success",
  Danger = "danger",
  Warning = "warning",
  Info = "info",
  Light = "light",
  Dark = "dark",
}

export enum DELAY {
  SHORT = 1000,
  MIDDLE = 2000,
  LONG = 3000,
}

export interface GlbModel {
  id: number;
  name: string;
  position: Vector3;
  rotation: Euler;
  scale: Vector3;
  userData: {
    modelUrl: string;
    modelTotal: number;
    modelLoaded: number;
  };
}

export enum UserDataType {
  GlbModel = "GlbModel",
  TransformHelper = "TransformHelper",
  GridHelper = "GridHelper",
  BoxHelper = "BoxHelper",
  CSS2DObject = "CSS2DObject",
  CSS3DObject = "CSS3DObject",
}

export interface RecordItem {
  id: number;
  name: string;
  des: string;
  cover: string;
}
export interface ProjectListResponse {
  code: number;
  message: string;
  data: {
    records: RecordItem[];
  };
}

export interface ActionItemMap {
  showName: string | string[];
  NAME_ID: string;
  showButton: boolean; //是否显示按钮
  isClick: boolean; //是否点击, 改变选中状态
  groupCanBeRaycast: boolean; //射线检测是否选中组的children
  data: {
    isSelected: boolean;
    isRunning: boolean;
    cameraViewerPosition: Vector3; // 拉伸时的相机偏移
  };

  handler?: (nameId?: string) => void;
  codeString?: string;
}
// 使用 = 定义类型，并且明确成员类型为字符串字面量类型
export type CustomButtonType =
  | "TOGGLE"
  | "DRAWER"
  | "STRETCH"
  | "ROAM"
  | "PANEL_CONTROLLER"
  | "USER_BUTTON";

// 定义 item 的类型
export type TourItem = {
  id: number; // 假设 id 是数字类型
  title: string;
  thumbUrl: string;
};
export interface ConfirmButton {
  show?: boolean;
  hasButton?: boolean;
  closeButton?: boolean;
}

declare global {
  interface Document {
    getCurrentActionItemMap: (item: ActionItemMap) => void;
  }
}

export interface MessageError {
  status: number;
  response: {
    data: {
      code: number;
      message: string;
    };
  };
}
