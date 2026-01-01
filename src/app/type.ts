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

export interface ModelType {
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
  ModelType = "ModelType",
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
export interface ButtonItemBase {
  showName: string;
  NAME_ID: string;
  showButton: boolean; //是否显示按钮
  isClick: boolean; //是否点击, 改变选中状态
  style: {
    offsetWidth: number;
    offsetHeight: number;
  };
}

export interface GenerateButtonItemMap extends ButtonItemBase {
  groupCanBeRaycast: boolean; //射线检测是否选中组的children
  data: {
    isSelected: boolean;
    isRunning: boolean;
    cameraViewerPosition: Vector3; // 拉伸时的相机偏移
  };
  handler: (nameId: string) => void;
}

export interface CustomButtonItemMap extends ButtonItemBase {
  codeString: string;
}

export const generateButtonItemMap: GenerateButtonItemMap = {
  showName: "名称",
  NAME_ID: "NAME_ID",
  showButton: true,
  isClick: false,
  groupCanBeRaycast: false,
  data: {
    isSelected: false,
    isRunning: false,
    cameraViewerPosition: new Vector3(),
  },
  style: {
    offsetWidth: 0,
    offsetHeight: 0,
  },
  handler: function (nameId: string): void {
    throw new Error("Function not implemented." + nameId);
  },
};

// 使用 = 定义类型，并且明确成员类型为字符串字面量类型
export type CustomButtonType =
  | "TOGGLE"
  | "DRAWER"
  | "STRETCH"
  | "ROAM"
  | "PANEL_CONTROLLER"
  | "USER_BUTTON";

export enum ContainerName {
  toggleButtonGroup = "toggleButtonGroup",
  roamButtonGroup = "roamButtonGroup",
  markButtonGroup = "markButtonGroup",
  userButtonGroup = "userButtonGroup",
  panelControllerButtonGroup = "panelControllerButtonGroup",
}

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
    getCurrentGenerateButtonItemMap: (item: GenerateButtonItemMap) => void;
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
// 定义响应数据的类型
export interface ResponseData {
  code: number;
  message: string;
  data: {
    records: {
      id: number;
      name: string;
      des: string;
      cover: string;
    }[];
  };
}
