import { Scene } from "three";
import { editorInstance } from "@/three/instance/EditorInstance";
import { SceneUserData } from "@/three/config/Three3dConfig";

import { _confirmButton } from "@/component/common/ModalConfirmUtils";
import buttonBaseGui from "./extendButtonGui/buttonBaseGui";
export default function buttonGUI(
  updateScene: (scene: Scene) => void,
  groupIndex: number,
  index: number,
  setShowCodeWindow: (show: boolean) => void
) {
  const { customButtonList } = editorInstance.getEditor().scene
    .userData as SceneUserData;
  const { group } = customButtonList.userButton;
  const editor = editorInstance.getEditor();
  const folder = editor.createGUI("按钮");
  const array = group[groupIndex].listGroup;

  const funcDel = {
    openCodeWindow: () => {
      setShowCodeWindow(true);
    },
  };

  folder.add(funcDel, "openCodeWindow").name("实现方法");

  buttonBaseGui(folder, updateScene, array, index);
}
