import React from "react";
import { Scene } from "three";
import { TourWindow } from "@/app/MyContext";
import { LabelInfo } from "@/viewer3d/label/LabelInfo";
import { viewerInstance } from "@/three/ViewerInstance";
import { SceneUserData } from "@/three/Three3dConfig";

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
    // this.createLabelInfoPanelByModelGroupName(modelName);
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
        const { userCssStyle } = viewerInstance.getViewer().scene
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
        headerTitle.style.display = showAreYou[1] ? "block" : "none";
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
    const { scene } = viewerInstance.getViewer();

    const group = scene.getObjectByName(modelGroupName);

    if (group) {
      const { children } = group;
      if (children) {
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          const label = new LabelInfo(
            child,
            this.scene,
            this.dispatchTourWindow
          );
          label.css3DSprite.visible = false;

          viewerInstance.getViewer().MARK_LABEL_GROUP.add(label.css3DSprite);
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
        const css3DSprite = _item.css3DSprite.name.replace("SPRITE-", "");
        const isOk = this.boxName + "-" + css3DSprite === item;
        if (isOk) {
          this.canBeShowLabelInfo.push(_item);
        }
      });
    });
  }

  //高亮标签信息面板
  highlightLabelInfoPanel() {
    const { scene } = viewerInstance.getViewer();

    const viewer = viewerInstance.getViewer();
    this.canBeShowLabelInfo.forEach((item) => {
      const modelName = item.css3DSprite.name.replace("SPRITE-", "");
      const model = scene.getObjectByName(modelName);
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
