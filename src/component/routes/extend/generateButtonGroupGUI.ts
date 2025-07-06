import { Scene } from "three";
import { editorInstance } from "@/three/instance/EditorInstance";
import { CustomButtonList, SceneUserData } from "@/three/config/Three3dConfig";
import buttonGroupBaseGUI from "@/component/routes/extend/extendButtonGui/buttonGroupBaseGUI";
import roamGUI from "@/component/routes/effects/gui/roamGUI";

export default function generateButtonGroupGUI(
  key: keyof CustomButtonList,
  updateScene: (scene: Scene) => void
) {
  if (key === "userButton") {
    return;
  }

  const { customButtonList } = editorInstance.getEditor().scene
    .userData as SceneUserData;
  const { customButtonItem } = customButtonList[key];
  const editor = editorInstance.getEditor();
  const folder = editor.createGUI(customButtonItem.name);
  buttonGroupBaseGUI(folder, customButtonItem, updateScene);
  if (key === "toggleButtonGroup") {
    const { userSetting } = customButtonList[key];
    const dataFolder = folder.addFolder("数据");
    dataFolder.add(userSetting, "animationTime").name("动画时间");
    const min = 100,
      max = 100,
      step = 0.01;
    const cameraFolder = folder.addFolder("相机偏移");
    cameraFolder.add(userSetting.cameraOffset, "x", min, max, step).name("X");
    cameraFolder.add(userSetting.cameraOffset, "y", min, max, step).name("Y");
    cameraFolder.add(userSetting.cameraOffset, "z", min, max, step).name("Z");

    const modelFolder = folder.addFolder("模型偏移");
    modelFolder.add(userSetting.modelOffset, "x", min, max, step).name("X");
    modelFolder.add(userSetting.modelOffset, "y", min, max, step).name("Y");
    modelFolder.add(userSetting.modelOffset, "z", min, max, step).name("Z");
  }
  if (key === "roamButtonGroup") {
    roamGUI(folder);
  }
}
