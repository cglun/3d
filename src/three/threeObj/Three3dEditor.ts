import {
  BoxGeometry,
  Color,
  DataTexture,
  DirectionalLight,
  Group,
  Mesh,
  MeshLambertMaterial,
  Object3D,
  OrthographicCamera,
  PerspectiveCamera,
  Raycaster,
  Scene,
  Vector2,
  Vector3,
} from "three";
import { Dispatch } from "react";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import {
  CSS3DObject,
  CSS3DSprite,
} from "three/addons/renderers/CSS3DRenderer.js";

import { TransformControls } from "three/addons/controls/TransformControls.js";
import { BackgroundHDR, SceneUserData } from "@/three/config/Three3dConfig";
import { addMonkey } from "@/three/utils/util4Scene";

import { TourWindow } from "@/app/MyContext";
import { GlbModel } from "@/app/type";
import {
  createDirectionalLight,
  createGridHelper,
} from "@/three/utils/factory3d";
import directionalLightGUI from "@/component/Editor/PropertyGUI/lightGUI/directionalLightGUI";

import { GROUP } from "@/three/config/CONSTANT";
import cameraGUI from "@/component/Editor/PropertyGUI/cameraGUI";
import meshGroupGUI from "@/component/Editor/PropertyGUI/meshGroupGUI";
import css3CSS3DSpriteGUI from "@/component/Editor/PropertyGUI/css3DSpriteGUI";
import { Three3d } from "@/three/threeObj/Three3d";
import { transformCMD } from "@/three/command/cmd";
import emergencyPlanGui from "@/component/routes/extend/emergencyPlanGui/emergencyPlanGui";
import emergencyPlanStepGui from "@/component/routes/extend/emergencyPlanGui/emergencyPlanStepGui";
import css3DObjectGUI from "@/component/Editor/PropertyGUI/css3DObjectGUI";

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

    const { useShadow } = this.scene.userData.config3d;
    const light = createDirectionalLight();
    light.castShadow = useShadow;
    // const lightHelper = createDirectionalLightHelper(light);
    // this.HELPER_GROUP.add(lightHelper);
    this.HELPER_GROUP.name = GROUP.HELPER;
    this.HELPER_GROUP.add(createGridHelper());
    this.scene.add(this.HELPER_GROUP);
    this.LIGHT_GROUP.add(light);
    this.transformControl = this.initTransformControl();
    this.controls.addEventListener("end", () => {
      const curSelected = this.currentSelected3d;
      if (curSelected instanceof PerspectiveCamera) {
        // cameraGUI(this.currentSelected3d as PerspectiveCamera);
        transformCMD(curSelected, () => cameraGUI(curSelected));
      }
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

    transformControl.addEventListener("dragging-changed", (event) => {
      _controls.enabled = !event.value;
      if (_controls.enabled) {
        const curSelected = this.currentSelected3d;

        if (curSelected instanceof Mesh) {
          // meshGroupGUI(curSelected);
          transformCMD(curSelected, () => meshGroupGUI(curSelected));
          return;
        }
        const parentGroup = curSelected.parent;
        if (curSelected instanceof Group) {
          if (parentGroup?.name === GROUP.EMERGENCY_PLAN) {
            transformCMD(curSelected, () => emergencyPlanGui(curSelected));
            return;
          }
          // 应急预案步骤
          if (parentGroup?.parent?.name === GROUP.EMERGENCY_PLAN) {
            transformCMD(curSelected, () => emergencyPlanStepGui(curSelected));
            return;
          }
          transformCMD(curSelected, () => meshGroupGUI(curSelected));
          return;
        }

        if (curSelected instanceof CSS3DObject) {
          if (parentGroup?.parent?.parent?.name === GROUP.EMERGENCY_PLAN) {
            transformCMD(curSelected, () => css3DObjectGUI(curSelected));
            return;
          }
        }

        if (curSelected instanceof DirectionalLight) {
          transformCMD(curSelected, () => directionalLightGUI(curSelected));
          return;
        }

        if (curSelected instanceof CSS3DSprite) {
          transformCMD(curSelected, () => css3CSS3DSpriteGUI(curSelected));
        }
      }
    });
    transformControl.setMode("translate");
    const helper = transformControl.getHelper();
    helper.visible = true;
    this.HELPER_GROUP.add(helper);

    transformControl.addEventListener("objectChange", () => {
      const curSelected = this.currentSelected3d;
      if (curSelected instanceof DirectionalLight) {
        curSelected.lookAt(0, 0, 0);
      }
    });
    return transformControl;
  }
  setUserDate(sceneUserData: SceneUserData) {
    this.scene.userData = sceneUserData;
  }

  // 场景序列化
  sceneSerialization(): string {
    this.scene.userData.GOD_NUMBER = {
      clearHistory: 116,
    };
    const sceneCopy = this.scene.clone();
    this.disposeObject3D(sceneCopy, true);
    // this.destroyGUI();
    const helperGroup = sceneCopy.getObjectByName(GROUP.HELPER);
    if (helperGroup) {
      sceneCopy.remove(helperGroup);
    }
    const modelGroup = sceneCopy.getObjectByName(GROUP.MODEL);
    if (modelGroup) {
      sceneCopy.remove(modelGroup);
    }
    const tilesGroup = sceneCopy.getObjectByName(GROUP.TILES);
    if (tilesGroup) {
      sceneCopy.remove(tilesGroup);
    }

    //sceneCopy.children = [];
    const modelList: GlbModel[] = [];

    // sceneCopy.add(this.MARK_LABEL_GROUP);
    // sceneCopy.add(this.LIGHT_GROUP);
    // sceneCopy.add(this.GEOMETRY);

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
    // this.scene.add(this.HELPER_GROUP);
    // this.scene.add(this.MARK_LABEL_GROUP);
    // this.scene.add(this.LIGHT_GROUP);
    // this.scene.add(this.GEOMETRY);

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
    }
    if (this.tubeMesh !== null) {
      if (this.tubeMesh.parent) {
        this.tubeMesh.parent.remove(this.tubeMesh);
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
    const testCube = this.scene.getObjectByName(GROUP.TEST + "_cube");
    if (testCube) {
      return testCube;
    }

    const cube = new Mesh(
      new BoxGeometry(1, 1, 1),
      new MeshLambertMaterial({
        color: "#049ef4",
      })
    );
    cube.name = GROUP.TEST + "_cube";
    cube.position.set(0, 0, 0);
    this.TEST_GROUP.add(cube);
    return cube;
  }
}
