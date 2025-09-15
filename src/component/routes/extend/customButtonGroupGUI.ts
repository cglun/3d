import { editorInstance } from "@/three/instance/EditorInstance";
import {
  CustomButtonItemBase,
  SceneUserData,
} from "@/three/config/Three3dConfig";
import { Scene } from "three";
import ModalConfirm3d from "@/component/common/ModalConfirm3d";
import buttonGroupBaseGUI from "@/component/routes/extend/extendButtonGui/buttonGroupBaseGUI";
import deleteButtonGUI from "@/component/Editor/PropertyGUI/deleteButtonGUI/deleteButtonGUI";

export default function customButtonGroupGUI(
  customButtonItem: CustomButtonItemBase,
  updateScene: (scene: Scene) => void,
  index: number
) {
  const editor = editorInstance.getEditor();
  const { customButtonGroupList } = editor.scene.userData as SceneUserData;
  const { group } = customButtonGroupList.customButtonGroup;

  const folder = editor.createGUI("按钮组");
  const funcDel = {
    delButton: () => {
      ModalConfirm3d(
        {
          title: "删除按钮组",
          body: `删除【${group[index].name}】吗？`,
        },
        () => {
          group.splice(index, 1);
          editor.destroyGUI();
          updateScene(editor.scene);
        }
      );
    },
  };

  deleteButtonGUI(funcDel, folder, "按钮组");
  buttonGroupBaseGUI(folder, customButtonItem, updateScene);
}
