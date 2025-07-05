import { ButtonGroupStyle } from "@/three/config/Three3dConfig";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { showButtonGroupDiv, stopRoam } from "../../effects/utils";
import { Scene } from "three";
import { editorInstance } from "@/three/instance/EditorInstance";

export default function buttonGroupBaseGUI(
  folder: GUI,
  groupStyle: ButtonGroupStyle,
  updateScene: (scene: Scene) => void
) {
  const direction = {
    横向: "row",
    纵向: "column",
  };
  showButtonGroupDiv(groupStyle);
  stopRoam();
  const styleFolder = folder.addFolder("样式").onChange(() => {
    showButtonGroupDiv(groupStyle);
    updateScene(editorInstance.getEditor().scene);
  });

  styleFolder.add(groupStyle, "direction", direction).name("排列方向");
  styleFolder.add(groupStyle, "gap", 0, 100, 0.01).name("间距");
  styleFolder.add(groupStyle, "left", 0, 100, 0.01).name("位置X");
  styleFolder.add(groupStyle, "top", 0, 100, 0.01).name("位置Y");
  styleFolder.add(groupStyle, "width", 30, 1000, 0.1).name("宽度");
  styleFolder.add(groupStyle, "height", 20, 100, 0.1).name("高度");
  styleFolder.add(groupStyle, "borderWidth", 0, 10, 0.1).name("边框宽度");
  styleFolder.addColor(groupStyle, "borderColor").name("边框颜色");
  styleFolder.addColor(groupStyle, "borderColorIsClick").name("点击边框颜色");
  styleFolder.add(groupStyle, "opacity", 0, 1, 0.01).name("透明度");

  styleFolder.add(groupStyle, "borderRadius", 0, 100, 0.1).name("圆角");
  styleFolder.add(groupStyle, "fontSize", 0, 100, 0.1).name("字体大小");
  styleFolder.addColor(groupStyle, "color").name("字体颜色");
  styleFolder.addColor(groupStyle, "colorIsClick").name("点击字体颜色");
  styleFolder
    .add(groupStyle, "useBackgroundUrl")
    .name("使用背景图片")
    .onChange((value) => {
      bgUrl.hide();
      bgUrlIsClick.hide();
      bgColorIsClick.hide();
      bgColor.hide();
      if (value) {
        bgUrl.show();
        bgUrlIsClick.show();
      }
      if (!value) {
        bgColorIsClick.show();
        bgColor.show();
      }
    });

  const bgColor = styleFolder
    .addColor(groupStyle, "backgroundColor")
    .name("背景颜色")
    .show(!groupStyle.useBackgroundUrl);
  const bgColorIsClick = styleFolder
    .addColor(groupStyle, "backgroundColorIsClick")
    .name("点击背景颜色")
    .show(!groupStyle.useBackgroundUrl);

  const bgUrl = styleFolder
    .add(groupStyle, "backgroundUrl")
    .name("背景图片")
    .show(groupStyle.useBackgroundUrl);
  const bgUrlIsClick = styleFolder
    .add(groupStyle, "backgroundUrlIsClick")
    .name("点击背景图片")
    .show(groupStyle.useBackgroundUrl);
}
