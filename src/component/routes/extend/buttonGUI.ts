import { editorInstance } from "@/three/instance/EditorInstance";
import { SceneUserData } from "@/three/config/Three3dConfig";
import { Scene } from "three";
import { ActionItemMap } from "@/app/type";

export default function buttonGUI(
  updateScene: (scene: Scene) => void,
  groupIndex: number,
  index: number
) {
  const { customButtonList } = editorInstance.getEditor().scene
    .userData as SceneUserData;
  const { group } = customButtonList.userButton;
  const editor = editorInstance.getEditor();
  const folder = editor.createGUI("按钮");
  const button = group[groupIndex].listGroup[index] as ActionItemMap;
  group[groupIndex].listGroup.forEach((item) => {
    item.isClick = false;
  });

  const funcDel = {
    deleteButton: () => {
      group[groupIndex].listGroup.splice(index, 1);
      editor.destroyGUI();
      updateScene(editor.scene);
    },
  };
  folder.add(funcDel, "deleteButton").name("删除按钮");
  if (typeof button.showName === "string") {
    const anyButton = button as Record<string, any>;
    folder
      .add(anyButton, "showName" as string)
      .name("名称")
      .onChange(() => {
        updateScene(editor.scene);
      });
  }
  folder.add(button, "NAME_ID").name("按钮Id").disable(true);
}
