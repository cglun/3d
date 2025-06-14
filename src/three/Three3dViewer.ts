import {
  Color,
  DataTexture,
  Object3D,
  Object3DEventMap,
  Raycaster,
  Vector2,
  Vector3,
} from "three";
import { GlbModel } from "@/app/type";
import { GLOBAL_CONSTANT } from "@/three/GLOBAL_CONSTANT";
import { Three3d } from "@/three/Three3d";
import { SceneUserData } from "@/three/Three3dConfig";
import { createGroupIfNotExist } from "@/threeUtils/util4Scene";
import { TourWindow } from "@/app/MyContext";
import {
  getPanelControllerButtonGroup,
  getRoamListByRoamButtonMap,
  getToggleButtonGroup,
} from "@/viewer3d/buttonList/buttonGroup";

import { viewerInstance } from "@/three/ViewerInstance";

/**
 * Three3dViewer 类，继承自 Three3d 类，用于创建一个 3D 视图器。
 * 该类提供了设置场景用户数据的功能。
 */
export class Three3dViewer extends Three3d {
  /**
   * 构造函数，初始化 Three3dViewer 实例。
   * @param divElement - 用于渲染 3D 场景的 HTML div 元素。
   */
  point = new Vector3();
  raycaster = new Raycaster();
  pointer = new Vector2(0, 0);
  canBeRaycast = [] as Object3D<Object3DEventMap>[];
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
  onPointerClick(event: MouseEvent) {
    const { offsetX, offsetY } = event;
    console.log("onPointerClick", offsetX, offsetY);

    const { offsetWidth, offsetHeight } = this.divElement;
    this.pointer.x = (offsetX / offsetWidth) * 2 - 1;
    this.pointer.y = -(offsetY / offsetHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.camera);

    const intersects = this.raycaster.intersectObjects(
      this.canBeRaycast,
      false
    );

    if (intersects.length > 0) {
      const object = intersects[0].object;
      this.outlinePass.selectedObjects = [object];
      console.log(object.name);
    }
  }
  setCanBeRaycast() {
    const obj = createGroupIfNotExist(
      this.scene,
      GLOBAL_CONSTANT.MODEL_GROUP,
      false
    );

    if (!obj) {
      return;
    }
    const { customButtonList } = this.scene.userData as SceneUserData;

    const canBeRaycast = [] as Object3D<Object3DEventMap>[];
    customButtonList.toggleButtonGroup.customButtonItem.listGroup.map(
      (item) => {
        if (item.groupCanBeRaycast) {
          const group = createGroupIfNotExist(this.scene, item.NAME_ID, false);
          if (group) {
            const array = group.children;
            for (let index = 0; index < array.length; index++) {
              const element = array[index];
              canBeRaycast.push(element);
            }
          }
        }
      }
    );

    this.canBeRaycast = canBeRaycast;
  }
}
