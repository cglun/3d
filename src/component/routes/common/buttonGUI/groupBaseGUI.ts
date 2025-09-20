import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { ButtonGroupStyle } from "@/three/config/Three3dConfig";

export default function groupBaseGUI(
  folder: GUI,
  buttonGroupStyle: ButtonGroupStyle
) {
  const folderBase = folder.addFolder("样式");
  const direction = {
    横向: "row",
    纵向: "column",
  };
  const { left, top } = buttonGroupStyle;
  buttonGroupStyle.left = parseFloat(left.toFixed(2));
  buttonGroupStyle.top = parseFloat(top.toFixed(2));
  folderBase.add(buttonGroupStyle, "left", 0, 100, 0.01).name("位置X");
  folderBase.add(buttonGroupStyle, "top", 0, 100, 0.01).name("位置Y");
  folderBase.add(buttonGroupStyle, "width", 30, 1000, 0.1).name("宽度");
  folderBase.add(buttonGroupStyle, "height", 20, 100, 0.1).name("高度");

  const directionDom = folderBase
    .add(buttonGroupStyle, "direction", direction)
    .name("排列方向").domElement.children[1].children[1] as HTMLElement;
  directionDom.style.width = "100%";
  directionDom.style.textAlign = "center";
  folderBase.add(buttonGroupStyle, "gap", 0, 100, 0.01).name("间距");
  folderBase.add(buttonGroupStyle, "borderWidth", 0, 10, 0.1).name("边框宽度");
  folderBase.addColor(buttonGroupStyle, "borderColor").name("边框颜色");
  folderBase
    .addColor(buttonGroupStyle, "borderColorIsClick")
    .name("点击边框颜色");
  folderBase.add(buttonGroupStyle, "opacity", 0, 1, 0.01).name("透明度");
  folderBase.add(buttonGroupStyle, "borderRadius", 0, 100, 0.1).name("圆角");
  folderBase.add(buttonGroupStyle, "fontSize", 0, 100, 0.1).name("字体大小");
  folderBase.addColor(buttonGroupStyle, "color").name("字体颜色");
  folderBase.addColor(buttonGroupStyle, "colorIsClick").name("点击字体颜色");
  folderBase
    .add(buttonGroupStyle, "useBackgroundUrl")
    .name("使用背景图/色")
    .onChange((value) => {
      bgColor.disable(value);
      bgColorIsClick.disable(value);
      bgUrl.disable(!value);
      bgUrlIsClick.disable(!value);
    });

  const bgColor = folderBase
    .addColor(buttonGroupStyle, "backgroundColor")
    .name("背景颜色")
    .disable(buttonGroupStyle.useBackgroundUrl);
  const bgColorIsClick = folderBase
    .addColor(buttonGroupStyle, "backgroundColorIsClick")
    .name("点击背景颜色")
    .disable(buttonGroupStyle.useBackgroundUrl);

  const bgUrl = folderBase
    .add(buttonGroupStyle, "backgroundUrl")
    .name("背景图片")
    .disable(!buttonGroupStyle.useBackgroundUrl);
  const bgUrlIsClick = folderBase
    .add(buttonGroupStyle, "backgroundUrlIsClick")
    .name("点击背景图片")
    .disable(!buttonGroupStyle.useBackgroundUrl);
  return folder;
}
