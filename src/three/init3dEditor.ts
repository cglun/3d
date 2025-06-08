import {
  BoxHelper,
  Camera,
  Color,
  DataTexture,
  MOUSE,
  Object3D,
  OrthographicCamera,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { TransformControls } from "three/addons/controls/TransformControls.js";
import { DragControls } from "three/addons/controls/DragControls.js";
import { GlbModel, UserDataType } from "../app/type";
import { cameraTween } from "./animate";
import { setBoxHelper, commonAnimate, AnimateProps } from "./common3d";
import { extra3d as extra, parameters } from "./config3d";
import {
  createConfigRenderer,
  createPerspectiveCamera,
  createRenderer,
  createScene,
} from "./factory3d";
import { createGroupIfNotExist } from "./utils";
import { GLOBAL_CONSTANT } from "./GLOBAL_CONSTANT";
import { editorInstance } from "./EditorInstance";

let scene: Scene,
  camera: PerspectiveCamera | OrthographicCamera,
  perspectiveCamera: PerspectiveCamera,
  orthographicCamera: OrthographicCamera,
  controls: OrbitControls,
  controls1: OrbitControls,
  controls2: OrbitControls,
  renderer: WebGLRenderer,
  divElement: HTMLDivElement,
  transfControls: TransformControls,
  transfControls1: TransformControls,
  transfControls2: TransformControls,
  extra3d = extra;
const parameters3d = { ...parameters, flag: "editor" };

export function getAll() {
  return {
    scene,
    camera,
    controls,
    renderer,
    divElement,
    extra3d,
    parameters3d,
  };
}

function animate() {
  const animateProps: AnimateProps = {
    scene,
    camera,
    controls,
    renderer,
    extra3d,
    parameters3d,
  };

  commonAnimate(animateProps);
  requestAnimationFrame(animate);
}

export default function initScene(node: HTMLDivElement): void {
  divElement = node;
  //透视相机
  perspectiveCamera = createPerspectiveCamera(node);
  camera = perspectiveCamera;
  const tween = cameraTween(camera, new Vector3(-5, 15, 18));
  tween.start();

  //正交相机
  const xxx = 40;
  orthographicCamera = new OrthographicCamera(
    node.offsetWidth / -xxx,
    node.offsetWidth / xxx,
    node.offsetHeight / xxx,
    node.offsetHeight / -xxx,
    1,
    1000
  );
  orthographicCamera.name = "正交相机";
  scene = createScene();
  renderer = createRenderer(node);
  node.appendChild(renderer.domElement);
  // 初始化轨道控制器
  controls1 = new OrbitControls(perspectiveCamera, renderer.domElement);
  controls2 = new OrbitControls(orthographicCamera, renderer.domElement);
  //controls3 = new FirstPersonControls(perspectiveCamera, renderer.domElement);

  controls = controls1;

  // 初始化变换控制器
  transfControls1 = new TransformControls(
    perspectiveCamera,
    renderer.domElement
  );
  transfControls2 = new TransformControls(
    orthographicCamera,
    renderer.domElement
  );
  transfControls = transfControls1;
  const { labelRenderer2d, labelRenderer3d } = createConfigRenderer(
    scene,
    node
  );

  extra3d = {
    ...extra3d,
    labelRenderer2d,
    labelRenderer3d,
  };
  animate();
}

// 场景序列化
export function sceneSerialization_x(): string {
  const { scene } = editorInstance.getEditor();
  scene.userData.selected3d = undefined;
  const sceneCopy = scene.clone();
  const modelList: GlbModel[] = [];

  const MODEL_GROUP = createGroupIfNotExist(
    sceneCopy,
    GLOBAL_CONSTANT.MODEL_GROUP
  );
  const HELPER_GROUP = createGroupIfNotExist(
    sceneCopy,
    GLOBAL_CONSTANT.HELPER_GROUP
  );
  if (HELPER_GROUP) {
    HELPER_GROUP.children = [];
  }
  const existModelGroup = MODEL_GROUP && MODEL_GROUP.children;

  if (existModelGroup) {
    MODEL_GROUP.children.forEach((child) => {
      const { id, name, position, rotation, scale } = child;
      const model: GlbModel = {
        id,
        name,
        position,
        rotation,
        scale,
        // 修改部分，确保 userData 包含所需属性
        userData: {
          ...child.userData,
          modelUrl: child.userData.modelUrl || "",
          modelTotal: child.userData.modelTotal || 0,
          modelLoaded: 0,
        },
      };
      modelList.push(model);
    });
    MODEL_GROUP.children = [];
  }

  // 处理背景
  const background = sceneCopy.background as Color | DataTexture;
  const isColor = background !== null && background instanceof Color;
  sceneCopy.background = null;
  sceneCopy.environment = null;
  if (isColor) {
    sceneCopy.background = background;
    sceneCopy.userData.backgroundHDR = undefined;
  }
  debugger;
  const result = {
    sceneJsonString: JSON.stringify(sceneCopy.toJSON()),
    modelsJsonString: JSON.stringify(modelList),
    type: "scene",
  };

  return JSON.stringify(result);
}

export function setDragControls(currentObject: Object3D) {
  const dragControls = new DragControls(
    [currentObject],
    camera,
    renderer.domElement
  );
  dragControls.mouseButtons = {
    LEFT: null,
    MIDDLE: MOUSE.DOLLY,
    RIGHT: null,
  };
  dragControls.addEventListener("dragstart", function () {
    controls.enabled = false;
    // dragControls.enabled = true;
  });

  dragControls.addEventListener("dragend", function () {
    controls.enabled = true;
    dragControls.enabled = false;
    setTimeout(() => {
      dragControls.dispose();
    }, 100);
  });
}

//为选中的物体加上变换控件
export function setTransformControls(selectedMesh: Object3D) {
  transfControls.addEventListener("dragging-changed", (event) => {
    controls.enabled = !event.value;
  });
  transfControls.addEventListener("change", () => {
    const boxHelper = scene.getObjectByName(
      GLOBAL_CONSTANT.BOX_HELPER
    ) as BoxHelper;
    if (boxHelper) {
      boxHelper.update();
    }
  });
  //transfControls.addEventListener("mouseDown", () => {});
  // transfControls.addEventListener("mouseUp", () => {});
  transfControls.attach(selectedMesh);
  setBoxHelper(selectedMesh, scene);
  const HELPER_GROUP = createGroupIfNotExist(
    scene,
    GLOBAL_CONSTANT.HELPER_GROUP
  );

  const getHelper = transfControls.getHelper();
  const userData = {
    type: UserDataType.TransformHelper,
    isHelper: true,
    isSelected: false,
  };
  getHelper.userData = userData;
  HELPER_GROUP?.add(getHelper);
  if (HELPER_GROUP) {
    scene.add(HELPER_GROUP);
  }
  getHelper.traverse((child) => {
    child.userData = userData;
  });
}
export function getUserData() {
  return scene.userData;
}
export function getControls() {
  return controls;
}

export function getTransfControls() {
  return transfControls;
}
export function getPerspectiveCamera(): PerspectiveCamera {
  return perspectiveCamera;
}
export function getCamera(): PerspectiveCamera | OrthographicCamera {
  return camera;
}
export function setCamera(_camera: Camera) {
  perspectiveCamera.position.x = _camera.position.x;
  perspectiveCamera.position.y = _camera.position.y;
  perspectiveCamera.position.z = _camera.position.z;
}
export function getScene(): Scene {
  return scene;
}
export function setScene(newScene: Scene) {
  scene = newScene;
}

export function getRenderer(): WebGLRenderer {
  return renderer;
}
export function getDivElement() {
  return divElement;
}
export function getLabelRenderer() {
  return extra.labelRenderer2d;
}
export function setSelectedObject<T>(obj: T) {
  scene.userData.selected3d = obj;
}

export function setCameraType(cameraType: string, cameraUp: Vector3) {
  if (cameraType === "PerspectiveCamera") {
    const { x, y, z } = scene.userData.fixedCameraPosition;
    // perspectiveCamera.position.set(x, y, z);
    const tween = cameraTween(
      camera as PerspectiveCamera,
      new Vector3(x, y, z)
    );
    tween.start();

    camera = perspectiveCamera;
    camera.lookAt(0, 0, 0);
    transfControls = transfControls1;
    transfControls2.getHelper().visible = false;
    controls = controls1;
  }

  if (cameraType === "OrthographicCamera") {
    if (camera.type === "PerspectiveCamera") {
      scene.userData.fixedCameraPosition = camera.position.clone();
    }

    camera = orthographicCamera;
    const { x, y, z } = cameraUp;

    const bl = 40;
    camera.position.x = x * bl;
    camera.position.y = y * bl;
    camera.position.z = z * bl;
    camera.lookAt(0, 0, 0);
    transfControls = transfControls2;
    transfControls1.getHelper().visible = false;

    controls2.mouseButtons = {
      LEFT: MOUSE.LEFT,
      MIDDLE: MOUSE.DOLLY,
      RIGHT: MOUSE.LEFT,
    };
    controls = controls2;
  }
}
