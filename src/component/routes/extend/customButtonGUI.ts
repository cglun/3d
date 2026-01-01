import { Scene } from "three";
import { editorInstance } from "@/three/instance/EditorInstance";
import { SceneUserData } from "@/three/config/Three3dConfig";

import buttonBaseGui from "@/component/routes/extend/extendButtonGui/buttonBaseGui";
export default function buttonGUI(
  updateScene: (scene: Scene) => void,
  groupIndex: number,
  index: number,
  setShowCodeWindow: (show: boolean) => void
) {
  const { customButtonGroupList } = editorInstance.getEditor().scene
    .userData as SceneUserData;
  const { listGroup } =
    customButtonGroupList.customButtonGroup.group[groupIndex];
  const editor = editorInstance.getEditor();
  const folder = editor.createGUI("按钮");

  const funcDel = {
    openCodeWindow: () => {
      setShowCodeWindow(true);
    },
  };

  folder.add(funcDel, "openCodeWindow").name("实现方法");

  buttonBaseGui(folder, updateScene, listGroup, index);
}
