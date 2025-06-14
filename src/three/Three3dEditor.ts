import {
  Color,
  DataTexture,
  OrthographicCamera,
  PerspectiveCamera,
  Raycaster,
  Vector2,
  Vector3,
} from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

import { GlbModel, UserDataType } from "../app/type";
import { GLOBAL_CONSTANT } from "./GLOBAL_CONSTANT";
import { Three3d } from "./Three3d";

import { TransformControls } from "three/addons/controls/TransformControls.js";
import { BackgroundHDR, SceneUserData } from "./Three3dConfig";
import { createGroupIfNotExist } from "../threeUtils/util4Scene";
import { Dispatch } from "react";
import { TourWindow } from "../app/MyContext";
import { createGridHelper } from "../threeUtils/factory3d";

export class Three3dEditor extends Three3d {
  static divElement: HTMLDivElement;

  transformControl = this.initTransformControl();
  //  divElement: HTMLDivElement;
  point = new Vector3();
  raycaster = new Raycaster();
  pointer = new Vector2(0, 0);
  onUpPosition = new Vector2(0, 0);
  onDownPosition = new Vector2(0, 0);
  private _guiInstance: GUI | null = null; // 用于存储 GUI 实例

  get guiInstance() {
    return this._guiInstance;
  }
  set guiInstance(value: GUI | null) {
    this._guiInstance = value;
  }

  constructor(
    divElement: HTMLDivElement,
    dispatchTourWindow: Dispatch<TourWindow>
  ) {
    super(divElement, dispatchTourWindow);
  }
  initTransformControl() {
    const transformControl = new TransformControls(
      this.camera,
      this.renderer.domElement
    );
    const HELPER_GROUP = createGroupIfNotExist(
      this.scene,
      GLOBAL_CONSTANT.HELPER_GROUP
    );
    const _that = this.controls;
    transformControl.addEventListener("change", () => this.animate());
    transformControl.addEventListener("dragging-changed", function (event) {
      _that.enabled = !event.value;
    });
    transformControl.setMode("translate");
    const helper = transformControl.getHelper();
    helper.userData = {
      type: UserDataType.TransformHelper,
      isHelper: true,
      isSelected: false,
    };

    helper.visible = true;
    HELPER_GROUP?.add(helper);
    if (HELPER_GROUP) {
      this.scene.add(HELPER_GROUP);
    }

    transformControl.addEventListener("objectChange", function () {
      console.log(" updateSplineOutline()");
      //updateSplineOutline();
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
    const sceneCopy = this.scene.clone();
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
      MODEL_GROUP.children = [];
    }

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
      this.guiInstance = null;
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
  addGridHelper() {
    const HELPER_GROUP = createGroupIfNotExist(
      this.scene,
      GLOBAL_CONSTANT.HELPER_GROUP
    );
    if (HELPER_GROUP) {
      HELPER_GROUP.add(createGridHelper());
      this.scene.add(HELPER_GROUP);
    }
  }
}
