import { Scene } from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { CustomButtonItemBase } from "@/three/config/Three3dConfig";
import { stopRoam } from "@/component/routes/effects/utils";
import { editorInstance } from "@/three/instance/EditorInstance";
import groupBaseGUI from "@/component/routes/common/buttonGUI/groupBaseGUI";

export default function buttonGroupBaseGUI(
  folder: GUI,
  customButtonItem: CustomButtonItemBase,
  updateScene: (scene: Scene) => void
) {
  const folderBase = folder.addFolder("基础");
  folderBase
    .add(customButtonItem, "name")
    .name("名称")
    .disable(customButtonItem.type !== "USER_BUTTON")
    .onChange(() => {
      updateScene(editorInstance.getEditor().scene);
    });

  const { buttonGroupStyle } = customButtonItem;
  stopRoam();

  groupBaseGUI(folderBase, buttonGroupStyle).onChange(() => {
    updateScene(editorInstance.getEditor().scene);
  });
}
