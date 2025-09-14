import { editorInstance } from "@/three/instance/EditorInstance";
import {
  CustomButtonItemBase,
  SceneUserData,
} from "@/three/config/Three3dConfig";
import { Scene } from "three";
import ModalConfirm3d from "@/component/common/ModalConfirm3d";
import buttonGroupBaseGUI from "@/component/routes/extend/extendButtonGui/buttonGroupBaseGUI";

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
    deleteButtonGroup: () => {
      ModalConfirm3d(
        {
          title: "删除按钮组",
          body: `删除【${group[index].name}】吗？`,
        },
        () => {
          // const div = document.querySelector("#buttonGroupDiv") as HTMLElement;
          // if (div) {
          //   //  div.style.visibility = "hidden";
          // }
          group.splice(index, 1);
          editor.destroyGUI();
          updateScene(editor.scene);
        }
      );
    },
  };
  const delFolder = folder.add(funcDel, "deleteButtonGroup").name("删除按钮组")
    .domElement.children[0].children[0].children[0] as HTMLElement;
  delFolder.style.color = "rgb(220, 53, 69)";
  buttonGroupBaseGUI(folder, customButtonItem, updateScene);
}
