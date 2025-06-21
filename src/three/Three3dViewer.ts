import { Object3D, Object3DEventMap, Raycaster, Vector2, Vector3 } from "three";
import { Three3d } from "@/three/Three3d";
import { SceneUserData } from "@/three/Three3dConfig";

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
    const controller = viewerInstance.getViewer().labelInfoPanelController;
    return getPanelControllerButtonGroup(scene, controller);
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
    const { customButtonList } = this.scene.userData as SceneUserData;
    const canBeRaycast = [] as Object3D<Object3DEventMap>[];
    customButtonList.toggleButtonGroup.customButtonItem.listGroup.map(
      (item) => {
        if (item.groupCanBeRaycast) {
          const group = this.scene.getObjectByName(item.NAME_ID);

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
