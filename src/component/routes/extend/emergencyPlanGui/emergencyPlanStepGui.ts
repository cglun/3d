import { Group, Mesh, Scene } from "three";

import { transformCMD } from "@/three/command/cmd";
import { getEditorInstance } from "@/three/utils/utils";
import { EmergencyImage } from "@/viewer3d/label/EmergencyImage";
import { userCssStyle } from "@/three/config/Three3dConfig";
import ModalConfirm3d from "@/component/common/ModalConfirm3d";
import deleteButtonGUI from "@/component/Editor/PropertyGUI/deleteButtonGUI/deleteButtonGUI";
import {
  removeRecursively,
  setEmergencyPlanAddButton,
} from "@/three/utils/util4Scene";

export default function emergencyPlanStepGui(
  group: Group | Mesh,
  updateScene: (scene: Scene) => void
) {
  const { editor, scene } = getEditorInstance();
  const folder = editor.createGUI("组").onFinishChange(() => {
    transformCMD(group, () => emergencyPlanStepGui(group, updateScene));
  });
  folder.add(group, "name").name("步骤名称"); // 步骤名称不可编辑
  const fun = {
    addButton: () => {
      const label = new EmergencyImage(
        { markName: "name" },
        { ...userCssStyle }
      );
      group.add(label.css3DSprite);
      updateScene(scene);
    },
    delButton: () => {
      ModalConfirm3d(
        {
          title: "删除步骤",
          body: `确认删除${group.name}吗？`,
          confirmButton: {
            show: true,
            hasButton: true,
            closeButton: true,
          },
        },
        () => {
          editor.transformControl.detach(); // 取消选中,不然会报错
          editor.scene.userData.tempDate.showEmergencyPlanAddButton = false; // 隐藏添加按钮
          setEmergencyPlanAddButton(false);
          removeRecursively(group);
          folder.destroy();
          updateScene(scene);
        }
      );
    },
  };

  deleteButtonGUI(fun, folder, "步骤");
  // folder.add(fun, "addButton").name("添加图片");
}
