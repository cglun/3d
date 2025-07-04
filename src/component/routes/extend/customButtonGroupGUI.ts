import { editorInstance } from "@/three/instance/EditorInstance";
import { SceneUserData } from "@/three/config/Three3dConfig";
import { Scene } from "three";
import ModalConfirm3d from "@/component/common/ModalConfirm3d";
import buttonGroupBaseGUI from "@/component/routes/extend/extendButtonGui/buttonGroupBaseGUI";

export default function customButtonGroupGUI(
  updateScene: (scene: Scene) => void,
  index: number
) {
  const { customButtonList } = editorInstance.getEditor().scene
    .userData as SceneUserData;
  const { group } = customButtonList.userButton;
  const editor = editorInstance.getEditor();

  const folder = editor.createGUI("按钮组");
  const funcDel = {
    deleteButtonGroup: () => {
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
  const delFolder = folder.add(funcDel, "deleteButtonGroup").name("删除按钮组")
    .domElement.children[0].children[0].children[0] as HTMLElement;
  delFolder.style.color = "rgb(220, 53, 69)";
  const groupStyle = group[index].buttonGroupStyle;
  folder.add(group[index], "showGroup").name("是否显示");
  folder
    .add(group[index], "name")
    .name("名称")
    .onChange(() => {
      updateScene(editor.scene);
    });
  //公用的样式代码
  buttonGroupBaseGUI(folder, groupStyle);
}
