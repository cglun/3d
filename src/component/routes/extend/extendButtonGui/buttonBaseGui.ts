import { Scene } from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { editorInstance } from "@/three/instance/EditorInstance";
import { ButtonItemBase } from "@/app/type";

import ModalConfirm3d from "@/component/common/ModalConfirm3d";
export default function buttonBaseGui(
  folder: GUI,
  updateScene: (scene: Scene) => void,
  listGroup: ButtonItemBase[],
  index: number
) {
  const editor = editorInstance.getEditor();
  const button = listGroup[index];

  const funcDel = {
    deleteButton: () => {
      ModalConfirm3d(
        {
          title: "删除按钮",
          body: `删除【${button.showName}】吗？`,
        },
        () => {
          listGroup.splice(index, 1);
          editor.destroyGUI();
          updateScene(editor.scene);
        }
      );
    },
  };

  const delFolder = folder.add(funcDel, "deleteButton").name("删除按钮")
    .domElement.children[0].children[0].children[0] as HTMLElement;
  delFolder.style.color = "rgb(220, 53, 69)";

  folder
    .add(button, "showName")
    .name("名称")
    .onChange(() => {
      updateScene(editor.scene);
    });
  folder
    .add(button, "showButton")
    .name("是否显示按钮")
    .onFinishChange(() => {
      updateScene(editor.scene);
    });

  const styleFolder = folder.addFolder("样式");
  styleFolder
    .add(button.style, "offsetHeight", -100, 100, 1)
    .name("增加高度")
    .onChange(() => {
      updateScene(editor.scene);
    });
  styleFolder
    .add(button.style, "offsetWidth", -100, 100, 1)
    .name("增加宽度")
    .onChange(() => {
      updateScene(editor.scene);
    });
  folder.add(button, "NAME_ID").name("按钮Id").disable(true);
}
