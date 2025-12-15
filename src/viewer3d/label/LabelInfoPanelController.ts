import React from "react";
import { Scene, Vector3 } from "three";
import { TourWindow } from "@/app/MyContext";
import { LabelInfo } from "@/viewer3d/label/LabelInfo";
import { viewerInstance } from "@/three/instance/ViewerInstance";
import { SceneUserData } from "@/three/config/Three3dConfig";
import { getViewerInstance } from "@/three/utils/utils";
import { isMoveCamera } from "../buttonList/animateByButton";

// 标签信息面板控制器
export class LabelInfoPanelController {
  allLabelInfo: LabelInfo[] = []; //全部标签信息
  canBeShowLabelInfo: LabelInfo[] = []; //全部可以显示的标签信息
  isShow = false;
  panelStatus = 0;
  scene: Scene;
  boxName = "";
  modelName = "";
  showPanelTest1 = ["C_F1"];

  // 使用箭头函数确保 this 指向正确
  private showList = [
    () => this.hideLabel(),
    () => this.showSmallCircle(),
    () => this.showLabel(),
    () => this.showPanel(),
  ];
  dispatchTourWindow: React.Dispatch<TourWindow>;
  // 初始化标签信息面板控制器
  constructor(dispatchTourWindow: React.Dispatch<TourWindow>, scene: Scene) {
    this.dispatchTourWindow = dispatchTourWindow;
    this.scene = scene;
  }

  setModelName(modelName: string) {
    this.modelName = modelName;
  }

  setIsShow(isShow: boolean) {
    this.isShow = isShow;
  }
  setBoxName(boxName: string) {
    this.boxName = boxName;
  }
  getModelName() {
    return this.modelName;
  }

  //隐藏标签信息面板
  hideLabel() {
    this.panelStatus = 0;
    for (let i = 0; i < this.canBeShowLabelInfo.length; i++) {
      const labelInfo = this.canBeShowLabelInfo[i];
      labelInfo.css3DSprite.visible = false;
    }
  }
  //显示标签信息为小圆圈
  showSmallCircle() {
    this.panelStatus = 1;
    this.show([true, false, false]);
  }
  //显示标签信息标签
  showLabel() {
    this.panelStatus = 2;
    this.show([true, true, false]);
  }
  //显示标签信息面板
  showPanel() {
    this.panelStatus = 3;
    this.show([true, true, true]);
  }
  private show(showAreYou: boolean[]) {
    if (this.isShow) {
      for (let i = 0; i < this.canBeShowLabelInfo.length; i++) {
        const labelInfo = this.canBeShowLabelInfo[i];

        labelInfo.css3DSprite.visible = true;
        const labelDiv = labelInfo.div;

        const labelHeader = labelDiv.children[0] as HTMLElement;

        const headerEye = labelHeader.children[0] as HTMLElement;
        const headerTitle = labelHeader.children[1] as HTMLElement;

        const labelBody = labelDiv.children[1] as HTMLElement;
        const { userCssStyle } = getViewerInstance().viewer.scene
          .userData as SceneUserData;
        const { cardWidth, cardHeight, headerMarginTop, headerMarginLeft } =
          userCssStyle.topCard;
        if (this.panelStatus < 3) {
          labelDiv.style.width = "auto";
          labelDiv.style.height = "auto";
          labelDiv.style.padding = `5px ${headerMarginLeft}px`;
        } else {
          labelDiv.style.width = cardWidth + "px";
          labelDiv.style.height = cardHeight + "px";
          labelDiv.style.height = cardHeight + "px";
          labelDiv.style.padding = `${headerMarginTop}px ${headerMarginLeft}px`;
          //  labelHeader.style.marginLeft = headerMarginLeft + "px";
          // labelBody.style.padding = `0px ${headerMarginLeft}px`;
        }
        headerEye.style.display = showAreYou[0] ? "block" : "none";
        if (headerTitle) {
          headerTitle.style.display = showAreYou[1] ? "block" : "none";
        }

        labelBody.style.display = showAreYou[2] ? "block" : "none";
      }
    }
  }

  //展开标签信息面板
  expandLabelInfo() {
    this.panelStatus += 1;
    if (this.panelStatus > 3) {
      this.panelStatus = 0;
    }
    this.showList[this.panelStatus]();
  }
  //折叠标签信息面板
  foldLabelInfo() {
    this.panelStatus -= 1;
    if (this.panelStatus < 0) {
      this.panelStatus = 3;
    }
    this.showList[this.panelStatus]();
  }
  //创建标签信息面板
  /**
   * 创建标签信息面板
   * @param modelGroupName 模型组名称
   */
  createLabelInfoPanelByModelGroupName(modelGroupName: string) {
    const { scene, userData } = getViewerInstance();

    const [toggleButtonGroup] =
      userData.customButtonGroupList.generateButtonGroup.group;
    const { type } = toggleButtonGroup.customButtonItem;
    const labelOffset = new Vector3(0, 0, 0);
    if (isMoveCamera) {
      if (type === "DRAWER" || type === "STRETCH") {
        const { modelOffset } = toggleButtonGroup.userSetting;
        labelOffset.copy(modelOffset);
      }
    }

    const modelGroup = scene.getObjectByName(modelGroupName);

    if (modelGroup) {
      const { children } = modelGroup;
      if (children) {
        //console.log(options, "options");
        const { userCssStyle } = scene.userData as SceneUserData;
        for (let i = 0; i < children.length; i++) {
          const child = children[i];

          let label = new LabelInfo(
            child,
            userCssStyle.topCard,
            this.dispatchTourWindow
          );
          // 过滤出需要创建标签信息面板的模型
          // const options = window?.ObjectEditor3d?.options;

          // if (options && options.trigger && options.database) {
          //   const formItem = options.database.data.staticData[i];
          //   label = new LabelInfo(
          //     child,
          //     userCssStyle.topCard,
          //     this.dispatchTourWindow,
          //     formItem,
          //     options.trigger
          //   );
          // }
          label.css3DSprite.visible = false;
          const { x, y, z } = label.css3DSprite.position;
          label.css3DSprite.position.set(
            x + labelOffset.x,
            y + labelOffset.y,
            z + labelOffset.z
          );

          scene.add(label.css3DSprite);
          this.allLabelInfo.push(label);
        }
      }
    }
  }

  //更新标签信息面板
  updateLabelInfoPanel() {
    for (let i = 0; i < this.canBeShowLabelInfo.length; i++) {
      const labelInfo = this.canBeShowLabelInfo[i];
      const labelDiv = labelInfo.div;
      const labelHeader = labelDiv.children[0] as HTMLElement;
      const headerTitle = labelHeader.children[1] as HTMLElement;
      headerTitle.textContent = this.boxName;
    }
  }
  //根据模型名称查找标签信息面板
  findLabelInfoByModelBoxName(modelNameList: string[]) {
    const viewer = viewerInstance.getViewer();
    this.canBeShowLabelInfo = [];
    viewer.getSelectedObjects().length = 0;
    this.allLabelInfo.filter((_item) => {
      return modelNameList.some((item) => {
        const isOk = _item.css3DSprite.name === "SPRITE-" + item;

        if (isOk) {
          this.canBeShowLabelInfo.push(_item);
        }
      });
    });
  }

  //高亮标签信息面板
  highlightLabelInfoPanel() {
    const viewer = viewerInstance.getViewer();
    const { scene } = viewer;

    this.canBeShowLabelInfo.forEach((item) => {
      const newName = item.name.split("-");
      const model = scene.getObjectByName(`${newName[1]}-${newName[2]}`);
      if (model) {
        viewer.getSelectedObjects().push(model);
      }
    });
  }
  //重置高亮标签信息面板
  resetHighLightModel() {
    const viewer = viewerInstance.getViewer();
    viewer.getSelectedObjects().length = 0;
  }
}
