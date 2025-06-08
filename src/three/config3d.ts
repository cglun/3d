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
