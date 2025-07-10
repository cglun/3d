import { editorInstance } from "@/three/instance/EditorInstance";
import buttonBaseGui from "./extendButtonGui/buttonBaseGui";
import { Scene } from "three";
import { ButtonItemBase, GenerateButtonItemMap } from "@/app/type";
import { SceneUserData } from "@/three/config/Three3dConfig";

export default function generateButtonGUI(
  updateScene: (scene: Scene) => void,
  listGroup: ButtonItemBase[],
  groupIndex: number,
  index: number
) {
  const editor = editorInstance.getEditor();
  const { customButtonGroupList } = editor.scene.userData as SceneUserData;
  const { customButtonItem } =
    customButtonGroupList.generateButtonGroup.group[groupIndex];
  const { name, type } = customButtonItem;
  const folder = editor.createGUI(name);

  buttonBaseGui(folder, updateScene, listGroup, index);

  const button = listGroup[index] as GenerateButtonItemMap;

  if (type === "TOGGLE" || type === "STRETCH" || type === "DRAWER") {
    folder.add(button, "groupCanBeRaycast").name("是否被射线选中");
  }
  folder.add(button, "isClick").disable(true);

  if (type === "STRETCH") {
    const settingFolder = folder.addFolder("相机位置");
    const { cameraViewerPosition } = button.data;
    settingFolder.add(cameraViewerPosition, "x").step(0.1).name("相机偏移X");
    settingFolder.add(cameraViewerPosition, "y").step(0.1).name("相机偏移Y");
    settingFolder.add(cameraViewerPosition, "z").step(0.1).name("相机偏移Z");
  }
}
