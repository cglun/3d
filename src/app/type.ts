import {
  Euler,
  OrthographicCamera,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Extra3d, Parameters3d } from "../three/config3d";
import { LabelInfoPanelController } from "../viewer3d/label/LabelInfoPanelController";
import { TourWindow } from "./MyContext";

export interface CanvasNode {
  width: number;
  height: number;
}
export interface SceneItem {
  id: number;
  description: string;
  name: string;
  projectId: number;
  type: string;
}
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

export interface ToastBody {
  title: string;
  content: string;
  type: APP_COLOR;
  delay: DELAY;
  show: boolean;
}

export enum HTTP_TYPE {
  GET = "GET",
  POST = "POST",
  DELETE = "DELETE",
  UPDATE = "UPDATE",
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
  handler?: (nameId?: string) => void;
  data: {
    isSelected: boolean;
    isRunning: boolean;
    cameraPosition: Vector3;
  };
}
// 使用 = 定义类型，并且明确成员类型为字符串字面量类型
export type CustomButtonType =
  | "TOGGLE"
  | "DRAWER"
  | "STRETCH"
  | "ROAM"
  | "PANEL_CONTROLLER";

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

// 定义 context 的类型
export interface Context116_XX {
  getScene: () => Scene; // 返回 Scene 类型
  getControls: () => OrbitControls; // 返回 OrbitControls 类型
  getCamera: () => PerspectiveCamera | OrthographicCamera; // 返回 PerspectiveCamera 类型

  getAll: () => {
    scene: Scene;
    camera: PerspectiveCamera | OrthographicCamera;
    controls: OrbitControls;
    renderer: WebGLRenderer;
    divElement: HTMLDivElement;
    extra3d: Extra3d;
    parameters3d: Parameters3d;
  }; // 返回 object 类型
  getUserData?: () => object; // 返回 {}
  getToggleButtonGroup?: () => ActionItemMap[]; // 返回 ActionItemMap[] 类型
  getRoamListByRoamButtonMap?: () => ActionItemMap[]; // 返回 ActionItemMap[] 类型
  getPanelControllerButtonGroup?: () => ActionItemMap[]; // 返回 ActionItemMap[] 类型
  labelInfoPanelController?: LabelInfoPanelController;
  dispatchTourWindow?: React.Dispatch<TourWindow>;
  setPanelController?: (
    labelInfoPanelController: LabelInfoPanelController
  ) => void;
}
declare global {
  interface Document {
    getCurrentActionItemMap: (item: ActionItemMap) => void;
  }
}

export interface UserStyles {
  cardWidth: number;
  cardHeight: number;
  cardSize: number;
  cardRadius: number;
  cardBackgroundColor: string;
  cardBackgroundUrl: string;

  headerFontSize: number;
  headerColor: string;
  headerMarginTop: number;
  headerMarginLeft: number;
  bodyFontSize: number;
  bodyColor: string;
  modelHighlightColor: string;
  offsetX: number;
  offsetY: number;
  opacity: number;
}
