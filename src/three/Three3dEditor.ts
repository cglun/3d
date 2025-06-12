import {
  Color,
  DataTexture,
  OrthographicCamera,
  PerspectiveCamera,
  Raycaster,
  Vector2,
  Vector3,
} from "three";
import { GlbModel, UserDataType } from "../app/type";
import { GLOBAL_CONSTANT } from "./GLOBAL_CONSTANT";
import { Three3d } from "./Three3d";

import { TransformControls } from "three/addons/controls/TransformControls.js";
import { BackgroundHDR, SceneUserData } from "./Three3dConfig";
import { createGroupIfNotExist } from "../threeUtils/util4Scene";
import { Dispatch } from "react";
import { TourWindow } from "../app/MyContext";

export class Three3dEditor extends Three3d {
  static divElement: HTMLDivElement;

  transformControl = this.initTransformControl();
  //  divElement: HTMLDivElement;
  point = new Vector3();
  raycaster = new Raycaster();
  pointer = new Vector2(0, 0);
  onUpPosition = new Vector2(0, 0);
  onDownPosition = new Vector2(0, 0);

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

  onPointerMove(event: MouseEvent) {
    const { clientX, clientY } = event;

    const { offsetWidth, offsetHeight } = this.divElement;
    this.pointer.x = (clientX / offsetWidth) * 2 - 1;
    this.pointer.y = -(clientY / offsetHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.camera);
    const obj = createGroupIfNotExist(
      this.scene,
      GLOBAL_CONSTANT.MODEL_GROUP,
      false
    );
    if (!obj) {
      return;
    }

    const intersects = this.raycaster.intersectObjects(obj.children, false);

    if (intersects.length > 0) {
      const object = intersects[0].object;

      if (object !== this.transformControl.object) {
        this.transformControl.attach(object);
      }
    }
  }

  onPointerDown(event: MouseEvent) {
    this.onDownPosition.x = event.clientX;
    this.onDownPosition.y = event.clientY;
    console.log("onPointerDown", this.scene.children);
    // this.transformControl.getHelper().visible = false;
  }
  onPointerUp(event: MouseEvent) {
    this.onUpPosition.x = event.clientX;
    this.onUpPosition.y = event.clientY;

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
}
