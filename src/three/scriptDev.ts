/** ============脚本开发调试=============== */
/** ============调试完成后，把【开始】到【结束】之间的代码复制到脚本中保存，刷新！*/

import { ActionItemMap } from "../app/type";

//@ts-ignore 忽略类型错误,  脚本开发调试   【开始】到【结束】之间的代码复制到脚本中保存，刷新！
export function runScript(three3d: Three3d) {
  // ===============开始==================//

  const { labelInfoPanelController } = three3d;
  labelInfoPanelController.isShow = true; // 设置面板显示状态
  labelInfoPanelController.createLabelInfoPanelByModelGroupName("huojia");
  document.getCurrentActionItemMap = function (item: ActionItemMap) {
    if (labelInfoPanelController) {
      if (item.NAME_ID === "全景") {
        labelInfoPanelController.resetHighLightModel();
        labelInfoPanelController.hideLabel();
      }
      const boxName = Array.isArray(item.showName)
        ? item.showName[0].slice(2)
        : item.showName.slice(2);
      labelInfoPanelController.resetHighLightModel();
      labelInfoPanelController.setBoxName(boxName);
      labelInfoPanelController.hideLabel();
      labelInfoPanelController.updateLabelInfoPanel();
    }
  };
  //===============结束==================//
}
