/** ============脚本开发调试=============== */
/** ============调试完成后，把【开始】到【结束】之间的代码复制到脚本中保存，刷新！*/

import { Three3dEditor } from "@/three/threeObj/Three3dEditor";
import { Three3dViewer } from "@/three/threeObj/Three3dViewer";

export function runScriptDev(
  editorIns: Three3dEditor,
  viewerIns: Three3dViewer
) {
  if (viewerIns) {
    console.log("在预览中生效");
  }
  if (editorIns) {
    console.log("在编辑器中生效");
  }
  // ===============开始==================//
  // if (viewerIns) {
  //   const { labelInfoPanelController } = viewerIns;
  //   if (labelInfoPanelController) {
  //     labelInfoPanelController.isShow = true; // 设置面板显示状态
  //     labelInfoPanelController.createLabelInfoPanelByModelGroupName("huojia");
  //     document.getCurrentActionItemMap = function (item) {
  //       if (labelInfoPanelController) {
  //         if (item.NAME_ID === "全景") {
  //           labelInfoPanelController.resetHighLightModel();
  //           labelInfoPanelController.hideLabel();
  //         }
  //         const boxName = Array.isArray(item.showName)
  //           ? item.showName[0].slice(2)
  //           : item.showName.slice(2);
  //         labelInfoPanelController.resetHighLightModel();
  //         labelInfoPanelController.setBoxName(boxName);
  //         labelInfoPanelController.hideLabel();
  //         labelInfoPanelController.updateLabelInfoPanel();
  //       }
  //     };
  //   }
  // }
  //===============结束==================//
}
