import { Color, DataTexture, Object3D } from "three";
import { GlbModel } from "../app/type";
import { GLOBAL_CONSTANT } from "./GLOBAL_CONSTANT";
import { Three3d } from "./Three3d";
import { SceneUserData } from "./Three3dConfig";
import { createGroupIfNotExist } from "../threeUtils/util4Scene";
import { TourWindow } from "../app/MyContext";
import {
  getPanelControllerButtonGroup,
  getRoamListByRoamButtonMap,
  getToggleButtonGroup,
} from "../viewer3d/buttonList/buttonGroup";

import { viewerInstance } from "./ViewerInstance";

/**
 * Three3dViewer 类，继承自 Three3d 类，用于创建一个 3D 视图器。
 * 该类提供了设置场景用户数据的功能。
 */
export class Three3dViewer extends Three3d {
  /**
   * 构造函数，初始化 Three3dViewer 实例。
   * @param divElement - 用于渲染 3D 场景的 HTML div 元素。
   */

  constructor(
    divElement: HTMLDivElement,
    dispatchTourWindow: React.Dispatch<TourWindow>
  ) {
    super(divElement, dispatchTourWindow);
  }

  /**
   * 设置场景的用户数据。
   * @param sceneUserData - 要设置的场景用户数据，类型为 SceneUserData。
   */
  setUserDate(sceneUserData: SceneUserData) {
    this.scene.userData = sceneUserData;
  }
  sceneSerialization_xx(): string {
    //const { scene } = editorInstance.getEditor();
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

    const result = {
      sceneJsonString: JSON.stringify(sceneCopy.toJSON()),
      modelsJsonString: JSON.stringify(modelList),
      type: "scene",
    };

    return JSON.stringify(result);
  }
  onPointerClick(e: Event) {
    console.log(e);
  }
  // 截图,返回图片的base64
  /**
   * 截取当前场景的屏幕截图。
   * @param width - 截图的宽度。
   * @param height - 截图的高度。*/
  takeScreenshot(width: number, height: number): string {
    this.renderer.setSize(width, height);
    this.camera.aspect = 1;
    this.renderer.render(this.scene, this.camera);
    const screenshot = this.renderer.domElement.toDataURL("image/png");
    return screenshot;
  }
  getSelectedObjects(): Object3D[] {
    return this.outlinePass.selectedObjects;
  }

  getToggleButtonGroup() {
    const { scene } = viewerInstance.getViewer();

    return getToggleButtonGroup(scene);
  }
  getRoamListByRoamButtonMap() {
    const { scene } = viewerInstance.getViewer();

    return getRoamListByRoamButtonMap(scene);
  }
  getPanelControllerButtonGroup() {
    const { scene } = viewerInstance.getViewer();
    return getPanelControllerButtonGroup(
      scene,
      viewerInstance.getViewer().labelInfoPanelController!!
    );
  }
}
