import { Scene } from "three";
import { editorInstance } from "@/three/instance/EditorInstance";
import { SceneUserData } from "@/three/config/Three3dConfig";
import buttonGroupBaseGUI from "@/component/routes/extend/extendButtonGui/buttonGroupBaseGUI";
import roamGUI from "@/component/routes/effects/gui/roamGUI";
import deleteButtonGUI from "@/component/Editor/PropertyGUI/deleteButtonGUI/deleteButtonGUI";
import ModalConfirm3d from "@/component/common/ModalConfirm3d";

export default function generateButtonGroupGUI(
  key: number,
  updateScene: (scene: Scene) => void
) {
  const { customButtonGroupList } = editorInstance.getEditor().scene
    .userData as SceneUserData;
  const { generateButtonGroup } = customButtonGroupList;
  const { customButtonItem } = generateButtonGroup.group[key];

  const editor = editorInstance.getEditor();
  const folder = editor.createGUI(customButtonItem.name);

  const funcDel = {
    delButton: () => {
      ModalConfirm3d(
        {
          title: "删除按钮组",
          body: `删除【${customButtonItem.name}】吗？`,
        },
        () => {
          customButtonItem.listGroup = [];
          editor.destroyGUI();
          updateScene(editor.scene);
        }
      );
    },
  };

  deleteButtonGUI(funcDel, folder, `${customButtonItem.name}组`);
  buttonGroupBaseGUI(folder, customButtonItem, updateScene);
  if (key === 0) {
    const { userSetting } = generateButtonGroup.group[key];
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
  if (key === 1) {
    roamGUI(folder);
  }
}
