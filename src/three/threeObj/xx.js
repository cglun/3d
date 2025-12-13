if (viewerIns) {
  const { labelInfoPanelController, scene } = viewerIns;
  if (labelInfoPanelController) {
    labelInfoPanelController.isShow = true; // 设置面板显示状态
    labelInfoPanelController.createLabelInfoPanelByModelGroupName("huojia");
    document.getCurrentGenerateButtonItemMap = function (item) {
      if (labelInfoPanelController) {
        const { customButtonGroupList } = scene.userData;
        customButtonGroupList.generateButtonGroup.group[2].customButtonItem.showGroup = false; //隐藏展开按钮

        if (item.NAME_ID === "全景") {
          labelInfoPanelController.resetHighLightModel();
          labelInfoPanelController.hideLabel();
        }

        const boxName = Array.isArray(item.showName)
          ? item.showName[0].slice(2)
          : item.showName.slice(2);
        labelInfoPanelController.resetHighLightModel();
        labelInfoPanelController.setBoxName(boxName + "-");
        labelInfoPanelController.hideLabel();
        labelInfoPanelController.updateLabelInfoPanel();
      }
    };
  }
  const group = viewerIns.scene.getObjectByName("cangku_bg");
  const group2 = viewerIns.scene.getObjectByName("cangku_car");

  if (group) {
    const array = group.children;
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      viewerIns.canBeRaycast.push(element);
    }
  }
  if (group2) {
    group2.traverse((child) => {
      child.layer = 2;
    });
    group2.layer = 2;
  }
}
