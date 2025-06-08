import {
  AnimationAction,
  AnimationMixer,
  Clock,
  TubeGeometry,
  Vector3,
} from "three";
import { CSS2DRenderer } from "three/addons/renderers/CSS2DRenderer.js";
import { CSS3DRenderer } from "three/addons/renderers/CSS3DRenderer.js";
import { APP_COLOR, CustomButtonListType, UserStyles } from "../app/type";

export const enableScreenshot = {
  enable: false,
  renderTime: 0,
};

export function setEnableScreenshot(enable: boolean) {
  enableScreenshot.enable = enable;
}
export interface Config3d {
  css2d: boolean; //是否开启2d标签
  css3d: boolean; //是否开启3d标签
  useTween: boolean; //是否开启动画
  useShadow: boolean; //是否开启阴影
  useKeyframe: boolean; //是否开启关键帧动画
  useComposer: boolean; //是否开启后处理
  FPS: number; //帧率
}

export const config3d: Config3d = {
  css2d: true, //是否开启2d标签
  css3d: true, //是否开启3d标签
  useTween: true, //是否开启动画
  useShadow: true, //是否开启阴影
  useKeyframe: true, //是否开启关键帧动画
  FPS: 30, //帧率
  useComposer: true,
};
export const userCssStyleTopCard: UserStyles = {
  cardWidth: 116,
  cardHeight: 116,
  cardRadius: 5,
  cardBackgroundColor: "#d85555",
  cardBackgroundUrl: "/editor3d/public/static/images/defaultImage3d.png",
  headerFontSize: 18,
  headerColor: "#fe2ffe",
  bodyFontSize: 14,
  bodyColor: "#fee1e1",
  modelHighlightColor: "#aaffaa",
  offsetX: 0,
  offsetY: 0,
  cardSize: 0.04,
  opacity: 1,
  headerMarginTop: 0,
  headerMarginLeft: 0,
};
export const sceneUserData = {
  isSelected: false,
  fixedCameraPosition: new Vector3(-5, 5, 8),
  config3d,
  projectId: -1,
  backgroundHDR: {
    name: "venice_sunset_1k.hdr",
    asBackground: true,
  },
  javascript: `//const scene = getScene(); 
  console.log("116");`,
  customButtonList: {} as CustomButtonListType,
  APP_THEME: {
    themeColor: APP_COLOR.Dark,
    iconFill: "",
    sceneCanSave: false,
  },
  userCssStyleTopCard,
  userCssStyleTopCardMark: { ...userCssStyleTopCard },
};
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
export interface Parameters3d {
  clock: Clock;
  timeS: number;
  actionMixerList: AnimationAction[];
  mixer: AnimationMixer[];
  roamLine?: RoamLine;
}

export const parameters: Parameters3d = {
  clock: new Clock(),
  timeS: 0,
  actionMixerList: [],
  mixer: [],
};
export interface Extra3d {
  labelRenderer2d: CSS2DRenderer | undefined;
  labelRenderer3d: CSS3DRenderer | undefined;
}

export const extra3d: Extra3d = {
  labelRenderer2d: undefined,
  labelRenderer3d: undefined,
};
