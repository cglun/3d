import {
  BoxGeometry,
  Color,
  DataTexture,
  DirectionalLight,
  Group,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  OrthographicCamera,
  PerspectiveCamera,
  Raycaster,
  Scene,
  Vector2,
  Vector3,
} from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { GlbModel } from "@/app/type";

import { Three3d } from "@/three/Three3d";
import { TransformControls } from "three/addons/controls/TransformControls.js";
import { BackgroundHDR, SceneUserData } from "@/three/Three3dConfig";
import { addMonkey } from "@/threeUtils/util4Scene";
import { Dispatch } from "react";
import { TourWindow } from "@/app/MyContext";
import {
  createDirectionalLight,
  createGridHelper,
} from "@/threeUtils/factory3d";
import directionalLightGUI from "@/component/Editor/PropertyGUI/lightGUI/directionalLightGUI";

import { GLOBAL_CONSTANT } from "./GLOBAL_CONSTANT";

export class Three3dEditor extends Three3d {
  static divElement: HTMLDivElement;

  transformControl: TransformControls;
  //  divElement: HTMLDivElement;
  point = new Vector3();
  raycaster = new Raycaster();
  pointer = new Vector2(0, 0);
  onUpPosition = new Vector2(0, 0);
  onDownPosition = new Vector2(0, 0);
  currentSelected3d: Object3D = new Scene();
  private _guiInstance = new GUI().hide(); // 用于存储 GUI 实例
  HELPER_GROUP = new Group();

  get guiInstance() {
    return this._guiInstance;
  }
  set guiInstance(value: GUI) {
    this._guiInstance = value;
  }

  constructor(
    divElement: HTMLDivElement,
    dispatchTourWindow: Dispatch<TourWindow>
  ) {
    super(divElement, dispatchTourWindow);
    this.HELPER_GROUP.name = GLOBAL_CONSTANT.HELPER_GROUP;

    const { useShadow } = this.scene.userData.config3d;
    const light = createDirectionalLight();
    light.castShadow = useShadow;
    // const lightHelper = createDirectionalLightHelper(light);
    // this.HELPER_GROUP.add(lightHelper);
    this.HELPER_GROUP.name = GLOBAL_CONSTANT.HELPER_GROUP;
    this.HELPER_GROUP.add(createGridHelper());
    this.scene.add(this.HELPER_GROUP);
    this.LIGHT_GROUP.add(light);
    this.transformControl = this.initTransformControl();
    this.controls.addEventListener("change", () => {
      //、 if (this.currentSelected3d.type === "PerspectiveCamera") {
      // // 获取编辑器实例
      // const editor = editorInstance.getEditor();
      // const { guiInstance } = editor;
      // // 销毁旧的 GUI
      // editor.destroyGUI();
      // // 创建新的相机 GUI
      // const newGui = editor.createGUI("相机属性");
      // // 传入当前选中的相机实例
      // cameraGUI(this.currentSelected3d as PerspectiveCamera);
      // }
    });
  }

  initTransformControl() {
    const transformControl = new TransformControls(
      this.camera,
      this.renderer.domElement
    );

    const _controls = this.controls;

    transformControl.addEventListener("dragging-changed", function (event) {
      _controls.enabled = !event.value;
    });
    transformControl.setMode("translate");
    const helper = transformControl.getHelper();
    helper.visible = true;
    this.HELPER_GROUP.add(helper);

    transformControl.addEventListener("objectChange", () => {
      const curSelected = this.currentSelected3d;
      if (curSelected.type === "DirectionalLight") {
        curSelected.lookAt(0, 0, 0);
        directionalLightGUI(curSelected as DirectionalLight);
      }
    });
    return transformControl;
  }
  setUserDate(sceneUserData: SceneUserData) {
    this.scene.userData = sceneUserData;
  }

  // 场景序列化
  sceneSerialization(): string {
    this.scene.userData.selected3d = undefined;
    this.destroyGUI();
    const helperGroup = this.scene.getObjectByName(
      GLOBAL_CONSTANT.HELPER_GROUP
    );

    if (helperGroup) {
      this.scene.remove(helperGroup);
    }
    const sceneCopy = this.scene.clone();

    const modelList: GlbModel[] = [];
    sceneCopy.children = [];
    sceneCopy.add(this.MARK_LABEL_GROUP);
    sceneCopy.add(this.LIGHT_GROUP);

    this.MODEL_GROUP.children.forEach((child) => {
      const { id, name, position, rotation, scale } = child;
      const _userData = child.userData;

      const model: GlbModel = {
        id,
        name,
        position,
        rotation,
        scale,
        // 修改部分，确保 userData 包含所需属性
        userData: {
          ...child.userData,
          modelUrl: _userData.modelUrl || "",
          modelTotal: _userData.modelTotal || 0,
          modelLoaded: _userData.modelLoaded || 0,
        },
      };
      modelList.push(model);
    });

    // 处理背景
    const background = sceneCopy.background as Color | DataTexture;
    const isColor = background !== null && background instanceof Color;

    if (isColor) {
      //  sceneCopy.userData.backgroundHDR.color = "#" + background.getHexString();
      sceneCopy.userData.backgroundHDR = {
        ...sceneCopy.userData.backgroundHDR,
        isColor: true,
        color: "#" + background.getHexString(),
      } as BackgroundHDR;
    } else {
      sceneCopy.userData.backgroundHDR = {
        ...sceneCopy.userData.backgroundHDR,
        isColor: false,
      } as BackgroundHDR;
    }
    sceneCopy.background = null;
    sceneCopy.environment = null;
    const result = {
      sceneJsonString: JSON.stringify(sceneCopy.toJSON()),
      modelsJsonString: JSON.stringify(modelList),
      type: "scene",
    };

    return JSON.stringify(result);
  }

  onPointerDown(event: MouseEvent) {
    const { offsetX, offsetY } = event;
    this.onDownPosition.x = offsetX;
    this.onDownPosition.y = offsetY;

    // this.transformControl.getHelper().visible = false;
  }
  onPointerUp(event: MouseEvent) {
    const { offsetX, offsetY } = event;
    this.onUpPosition.x = offsetX;
    this.onUpPosition.y = offsetY;

    if (this.onDownPosition.distanceTo(this.onUpPosition) === 0) {
      this.transformControl.detach();
      this.animate();
    }
  }

  //设置相机的类型
  setCameraType(
    camera: PerspectiveCamera | OrthographicCamera,
    vector3: Vector3
  ) {
    console.log("设置相机的类型", camera, vector3);
  }

  destroyGUI() {
    if (this.guiInstance) {
      this.guiInstance.destroy();

      this.tubeMesh = null;
    }
    if (this?.tubeMesh !== null) {
      if (this.tubeMesh?.parent) {
        this.tubeMesh.parent?.remove(this.tubeMesh);
        this.tubeMesh.geometry.dispose();
        this.tubeMesh = null;
      }
    }
  }

  _addMonkey() {
    addMonkey();
  }
  createGUI(title: string) {
    this.destroyGUI();
    const container = document.querySelector("#gui-container-property");

    this.guiInstance = new GUI({ title });
    this.guiInstance.domElement.style.width = "100%";
    container?.appendChild(this.guiInstance.domElement);

    return this.guiInstance;
  }
  addCube() {
    const cube = new Mesh(
      new BoxGeometry(1, 1, 1),
      new MeshBasicMaterial({ color: 0xff0000 })
    );
    cube.position.set(0, 0, 0);
    this.HELPER_GROUP.add(cube);
    return cube;
  }
}
