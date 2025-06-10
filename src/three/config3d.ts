import { AnimationAction, AnimationMixer, Clock } from "three";
import { CSS2DRenderer } from "three/addons/renderers/CSS2DRenderer.js";
import { CSS3DRenderer } from "three/addons/renderers/CSS3DRenderer.js";

export const enableScreenshot = {
  enable: false,
  renderTime: 0,
};

export function setEnableScreenshot_xx(enable: boolean) {
  enableScreenshot.enable = enable;
}

export interface Parameters3d {
  clock: Clock;
  timeS: number;
  actionMixerList: AnimationAction[];
  mixer: AnimationMixer[];
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
