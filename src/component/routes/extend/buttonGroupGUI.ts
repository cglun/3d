import { editorInstance } from "@/three/instance/EditorInstance";
import { SceneUserData } from "@/three/config/Three3dConfig";
import { Scene } from "three";

export default function buttonGroupGUI(
  updateScene: (scene: Scene) => void,
  index: number
) {
  const { customButtonList } = editorInstance.getEditor().scene
    .userData as SceneUserData;
  const { group } = customButtonList.userButton;
  const editor = editorInstance.getEditor();

  const funcDel = {
    deleteButtonGroup: () => {
      group.splice(index, 1);
      editor.destroyGUI();

      updateScene(editor.scene);
    },
  };

  const folder = editor.createGUI("按钮组");
  folder.add(funcDel, "deleteButtonGroup").name("删除按钮组");
  const groupStyle = group[index].buttonGroupStyle;
  folder
    .add(group[index], "name")
    .name("名称")
    .onChange(() => {
      updateScene(editor.scene);
    });
  const direction = {
    横向: "row",
    纵向: "column",
  };
  folder.add(groupStyle, "direction", direction).name("排列方向");
  folder.add(group[index], "showGroup").name("是否显示");
  folder.add(groupStyle, "left", 0, 2000, 1).name("位置X");
  folder.add(groupStyle, "top", 0, 2000, 1).name("位置Y");
  folder.add(groupStyle, "width", 30, 1000, 0.1).name("宽度");
  folder.add(groupStyle, "height", 20, 100, 0.1).name("高度");
  folder.add(groupStyle, "borderWidth", 0, 10, 0.1).name("边框宽度");
  folder.addColor(groupStyle, "borderColor").name("边框颜色");
  folder.add(groupStyle, "opacity", 0, 1, 0.01).name("透明度");
  folder.add(groupStyle, "borderRadius", 0, 100, 0.1).name("圆角");
  folder.add(groupStyle, "fontSize", 0, 100, 0.1).name("字体大小");
  folder.addColor(groupStyle, "color").name("字体颜色");
  folder.addColor(groupStyle, "backgroundColor").name("背景颜色");
  folder.addColor(groupStyle, "backgroundColorIsClick").name("点击背景颜色");
  folder.add(groupStyle, "backgroundUrl").name("背景图片");
  folder.add(groupStyle, "backgroundUrlIsClick").name("点击背景图片");
}
