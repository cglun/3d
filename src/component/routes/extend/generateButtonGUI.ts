import { editorInstance } from "@/three/instance/EditorInstance";
import buttonBaseGui from "./extendButtonGui/buttonBaseGui";
import { Scene } from "three";
import { ActionItemBase, ActionItemMap } from "@/app/type";
import { CustomButtonList, SceneUserData } from "@/three/config/Three3dConfig";

export default function generateButtonGUI(
  updateScene: (scene: Scene) => void,
  listGroup: ActionItemBase[],
  index: number,
  groupName: keyof CustomButtonList
) {
  const editor = editorInstance.getEditor();
  const { customButtonList } = editor.scene.userData as SceneUserData;
  if (groupName === "userButton") {
    return;
  }
  const { name } = customButtonList[groupName].customButtonItem;
  const folder = editor.createGUI(name);
  buttonBaseGui(folder, updateScene, listGroup, index);

  const button = listGroup[index] as ActionItemMap;
  folder.add(button, "showButton").name("是否显示按钮");
  folder.add(button, "groupCanBeRaycast").name("是否被射线选中");

  if (customButtonList[groupName].customButtonItem.type === "STRETCH") {
    const settingFolder = folder.addFolder("相机位置");
    const { cameraViewerPosition } = button.data;
    settingFolder.add(cameraViewerPosition, "x").step(0.1).name("相机偏移X");
    settingFolder.add(cameraViewerPosition, "y").step(0.1).name("相机偏移Y");
    settingFolder.add(cameraViewerPosition, "z").step(0.1).name("相机偏移Z");
  }
}
