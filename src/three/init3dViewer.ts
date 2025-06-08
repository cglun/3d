import {
  // ACESFilmicToneMapping,
  Object3D,
  Object3DEventMap,
  //PCFSoftShadowMap,
  PerspectiveCamera,
  Scene,
  TubeGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
//import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { OutlinePass } from "three/addons/postprocessing/OutlinePass.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
//import { FXAAShader } from "three/addons/shaders/FXAAShader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { Curves } from "three/addons/Addons.js";
//import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";

import {
  createConfigRenderer,
  createDirectionalLight,
  createPerspectiveCamera,
  createRenderer,
  createScene,
  createUnrealBloomPass,
} from "./factory3d";

import { extra3d as extra, parameters } from "./config3d";
import { AnimateProps, commonAnimate } from "./common3d";

import { SceneUserData } from "../app/type";

let scene: Scene,
  camera: PerspectiveCamera,
  controls: OrbitControls,
  renderer: WebGLRenderer,
  divElement: HTMLDivElement,
  extra3d = extra,
  composer: EffectComposer,
  //effectFXAA: ShaderPass,
  outlinePass: OutlinePass;
const roamLine = {
  roamIsRunning: false,
  direction: new Vector3(),
  biNormal: new Vector3(),
  normal: new Vector3(),
  position: new Vector3(),
  lookAt: new Vector3(),
  speed: 1,
  // tubeGeometry: null,
  // tubeGeometry: null,
  tubeGeometry: new TubeGeometry(new Curves.GrannyKnot(), 100, 2, 3, true),
};

//export const _selectedObjects: Object3D<Object3DEventMap>[] = [];

const parameters3d = { ...parameters, roamLine, flag: "viewer" };
function animate() {
  const animateProps: AnimateProps = {
    scene,
    camera,
    controls,
    renderer,
    extra3d,
    parameters3d,
    composer,
  };

  commonAnimate(animateProps);
  requestAnimationFrame(animate);
}
export default function initScene(node: HTMLDivElement): void {
  divElement = node;
  camera = createPerspectiveCamera(node, "截图透视相机");
  camera.position.set(-3, 3, 5);
  scene = createScene();
  const { useShadow } = getScene().userData.config3d;
  const light = createDirectionalLight();
  light.castShadow = useShadow;
  scene.add(light);

  renderer = createRenderer(node);

  node.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);

  const { labelRenderer2d, labelRenderer3d } = createConfigRenderer(
    scene,
    node
  );
  extra3d = {
    ...extra3d,
    labelRenderer2d,
    labelRenderer3d,
  };
  renderer.setAnimationLoop(animate);
  animate();
}
export function initPostProcessing() {
  if (!divElement) {
    return;
  }
  const { offsetWidth, offsetHeight } = divElement;
  composer = new EffectComposer(renderer);

  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  outlinePass = new OutlinePass(
    new Vector2(offsetWidth, offsetHeight),
    scene,
    camera
  );

  composer.addPass(outlinePass);

  //设置颜色
  outlinePass.edgeStrength = 1; // 边缘强度
  outlinePass.edgeGlow = 0.4; // 边缘发光
  outlinePass.edgeThickness = 1; // 边缘厚度
  outlinePass.pulsePeriod = 1.16; // 脉冲周期

  const userData = scene.userData as SceneUserData;
  const color = userData.userCssStyleTopCard?.modelHighlightColor || "#0000ff";
  setOutLinePassColor(color);

  // renderer.shadowMap.enabled = true;
  // renderer.shadowMap.type = PCFSoftShadowMap;
  // renderer.shadowMap.autoUpdate = true;
  // renderer.shadowMap.needsUpdate = true; // 增大阴影贴图尺寸以提高阴影质量

  // renderer.toneMapping = ACESFilmicToneMapping; // 使用枚举值替代数字
  // renderer.toneMappingExposure = 1.16; // 调整曝光度;

  composer.addPass(createUnrealBloomPass(divElement));

  //调整 FXAAShader 的抗锯齿质量参数
  // effectFXAA = new ShaderPass(FXAAShader);

  // effectFXAA.uniforms["resolution"].value.set(
  //   1 / offsetWidth,
  //   1 / offsetHeight
  // );
  //composer.addPass(effectFXAA);

  const outputPass = new OutputPass();
  composer.addPass(outputPass);
}
export function getControls() {
  return controls;
}
export function getSelectedObjects() {
  return outlinePass.selectedObjects;
}
export function setOutLinePassColor(color: string) {
  outlinePass.visibleEdgeColor.set(color); // 可见边缘颜色
  outlinePass.hiddenEdgeColor.set(color); // 不可见边缘颜色
}

export function getLabelRenderer() {
  return extra.labelRenderer2d;
}
export function setScene(newScene: Scene) {
  scene = newScene;
}
export function setCamera(_camera: Object3D<Object3DEventMap>) {
  camera.position.x = _camera.position.x;
  camera.position.y = _camera.position.y;
  camera.position.z = _camera.position.z;
}
export function getAll() {
  return {
    scene,
    camera,
    controls,
    renderer,
    divElement,
    extra3d,
    parameters3d,
    getSelectedObjects,
  };
}
export function getUserData(): SceneUserData {
  return scene.userData as SceneUserData;
}
export function getCamera() {
  return camera;
}

export function getScene(): Scene {
  return scene;
}

export function getRenderer() {
  return renderer;
}
export function getDivElement() {
  return divElement;
}

// 截图,返回图片的base64
export function takeScreenshot(width: number, height: number): string {
  renderer.setSize(width, height);
  camera.aspect = 1;
  renderer.render(scene, camera);
  const screenshot = renderer.domElement.toDataURL("image/png");
  return screenshot;
}
