import {
  DirectionalLight,
  DirectionalLightHelper,
  GridHelper,
  PerspectiveCamera,
  Scene,
  Vector2,
  WebGLRenderer,
} from "three";

import {
  CSS2DObject,
  CSS2DRenderer,
} from "three/addons/renderers/CSS2DRenderer.js";
import {
  CSS3DSprite,
  CSS3DRenderer,
} from "three/addons/renderers/CSS3DRenderer.js";

import { UserDataType } from "../app/type";

import { TourWindow } from "../app/MyContext";

import { UnrealBloomPass } from "three/examples/jsm/Addons.js";
import sceneUserData from "../three/Three3dConfig";
import { getTourSrc } from "./util4Scene";

import { setClassName } from "./util4UI";

export function createPerspectiveCamera(
  node: HTMLElement,
  cameraName = "透视相机"
) {
  const { offsetWidth, offsetHeight } = node;
  const camera = new PerspectiveCamera(
    50,
    offsetWidth / offsetHeight,
    0.1,
    1000
  );
  camera.name = cameraName;
  const { x, y, z } = sceneUserData.cameraPosition.end;
  camera.position.set(x, y, z);
  camera.userData.isSelected = false;

  return camera;
}

export function createDirectionalLight(name = "平行光") {
  // 添加正交光源
  const light = new DirectionalLight(0xffffff, 2.16);
  light.name = name;
  // 设置阴影参数
  light.shadow.mapSize.width = 2048; // 阴影图的宽度
  light.shadow.mapSize.height = 2048; // 阴影图的高度
  light.shadow.camera.near = 0.5; // 阴影摄像机的近剪裁面
  light.shadow.camera.far = 5000; // 阴影摄像机的远剪裁面
  light.shadow.camera.left = -10;
  light.shadow.camera.right = 10;
  light.shadow.camera.top = 10;
  light.shadow.camera.bottom = -10;
  light.position.set(3, 3, 3);
  light.shadow.bias = -0.0001;

  light.lookAt(0, 0, 0);
  return light;
}
export function createDirectionalLightHelper(light: DirectionalLight) {
  return new DirectionalLightHelper(light, 1, "#fff");
}

export function createGridHelper(name = "网格辅助", wh = new Vector2(10, 10)) {
  const gridHelper = new GridHelper(wh.x, wh.y);
  gridHelper.userData = {
    type: UserDataType.GridHelper,
    isHelper: true,
    isSelected: false,
  };
  gridHelper.name = name;
  return gridHelper;
}

export function createRenderer(node: HTMLElement) {
  const renderer = new WebGLRenderer({ antialias: true, alpha: true });

  renderer.shadowMap.enabled = true;

  renderer.setSize(node.offsetWidth, node.offsetHeight);
  return renderer;
}

export function createScene() {
  const scene = new Scene();
  scene.userData = sceneUserData;
  //scene.background = new Color("#000116");

  return scene;
}

export function createCss2dLabel(name: string, logo: string) {
  const div = createDiv(logo, name);
  const css2DObject = new CSS2DObject(div);
  css2DObject.name = name;
  css2DObject.userData = {
    type: UserDataType.CSS2DObject,
    labelLogo: logo,
  };

  return css2DObject;
}

export function createLabelRenderer(
  node: HTMLElement,
  renderer: "2d" | "3d" = "2d"
) {
  const labelRenderer =
    renderer === "2d" ? new CSS2DRenderer() : new CSS3DRenderer();
  labelRenderer.setSize(node.offsetWidth, node.offsetHeight);

  const renderDom = labelRenderer.domElement;
  renderDom.style.position = "absolute";
  renderDom.style.pointerEvents = "none";
  renderDom.classList.add("label-renderer");
  node.appendChild(labelRenderer.domElement);
  return labelRenderer;
}

function createDiv(
  logo: string,
  name: string,
  tourObject?: {
    id: string;
    title: string;
  },
  dispatchTourWindow?: React.Dispatch<TourWindow>
) {
  const div = document.createElement("div");
  div.className = "mark-label";
  const img = document.createElement("i");
  img.className = setClassName(logo);
  div.appendChild(img);
  const span = document.createElement("span");
  span.textContent = name;
  div.appendChild(span);

  if (tourObject) {
    const i = document.createElement("i");
    i.className = setClassName("eye");
    i.classList.add("ms-2");
    i.style.cursor = "pointer";
    i.setAttribute("data-tour-id", tourObject.id);
    i.addEventListener("click", function () {
      // 修改部分：检查 dispatchTourWindow 是否存在
      if (dispatchTourWindow) {
        dispatchTourWindow({
          type: "tourWindow",
          payload: {
            show: true,
            title: tourObject.title,
            tourSrc: getTourSrc(tourObject.id),
          },
        });
      }
    });
    div.appendChild(i);
  }
  return div;
}

export function createCss3dLabel(
  name: string,
  logo: string,
  tourObject?: {
    id: string;
    title: string;
  },
  dispatchTourWindow?: React.Dispatch<TourWindow>
) {
  const div = createDiv(logo, name, tourObject, dispatchTourWindow);
  const css3DSprite = new CSS3DSprite(div);

  css3DSprite.name = name;
  css3DSprite.position.set(0, 0, 0);
  css3DSprite.scale.set(0.04, 0.04, 0.04);
  css3DSprite.userData = {
    type: UserDataType.CSS3DObject,
    labelLogo: logo,
    tourObject: tourObject,
  };
  return css3DSprite;
}

export function createUnrealBloomPass(node: HTMLElement) {
  const { offsetWidth, offsetHeight } = node;
  const bloomPass = new UnrealBloomPass(
    new Vector2(offsetWidth, offsetHeight),
    1.5,
    4.4,
    0.85
  );
  bloomPass.threshold = 1.4;
  bloomPass.strength = 0.4;
  bloomPass.radius = 0.4;
  return bloomPass;
}
