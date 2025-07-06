import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { CustomButtonItemBase } from "@/three/config/Three3dConfig";
import {
  getButtonGroupByButtonGroupStyle,
  stopRoam,
} from "@/component/routes/effects/utils";
import { Scene } from "three";
import { editorInstance } from "@/three/instance/EditorInstance";

export default function buttonGroupBaseGUI(
  folder: GUI,
  customButtonItem: CustomButtonItemBase,
  updateScene: (scene: Scene) => void
) {
  const folderBase = folder.addFolder("基础");

  folderBase
    .add(customButtonItem, "name")
    .name("名称")
    .disable(true)
    .onChange(() => {
      updateScene(editorInstance.getEditor().scene);
    });
  folderBase
    .add(customButtonItem, "showGroup")
    .name("显示")
    .onFinishChange(() => {
      const { buttonGroupStyle } = customButtonItem;
      const div = document.querySelector("#buttonGroupDiv") as HTMLElement;
      getButtonGroupByButtonGroupStyle(customButtonItem, buttonGroupStyle, div);
    });
  const direction = {
    横向: "row",
    纵向: "column",
  };
  const { buttonGroupStyle } = customButtonItem;
  const div = document.querySelector("#buttonGroupDiv") as HTMLElement;
  getButtonGroupByButtonGroupStyle(customButtonItem, buttonGroupStyle, div);

  stopRoam();
  const styleFolder = folder.addFolder("样式").onChange(() => {
    getButtonGroupByButtonGroupStyle(customButtonItem, buttonGroupStyle, div);
    updateScene(editorInstance.getEditor().scene);
  });

  styleFolder.add(buttonGroupStyle, "left", 0, 100, 0.01).name("位置X");
  styleFolder.add(buttonGroupStyle, "top", 0, 100, 0.01).name("位置Y");
  styleFolder.add(buttonGroupStyle, "width", 30, 1000, 0.1).name("宽度");
  styleFolder.add(buttonGroupStyle, "height", 20, 100, 0.1).name("高度");

  const directionDom = styleFolder
    .add(buttonGroupStyle, "direction", direction)
    .name("排列方向").domElement.children[1].children[1] as HTMLElement;
  directionDom.style.width = "100%";
  directionDom.style.textAlign = "center";
  styleFolder.add(buttonGroupStyle, "gap", 0, 100, 0.01).name("间距");
  styleFolder.add(buttonGroupStyle, "borderWidth", 0, 10, 0.1).name("边框宽度");
  styleFolder.addColor(buttonGroupStyle, "borderColor").name("边框颜色");
  styleFolder
    .addColor(buttonGroupStyle, "borderColorIsClick")
    .name("点击边框颜色");
  styleFolder.add(buttonGroupStyle, "opacity", 0, 1, 0.01).name("透明度");
  styleFolder.add(buttonGroupStyle, "borderRadius", 0, 100, 0.1).name("圆角");
  styleFolder.add(buttonGroupStyle, "fontSize", 0, 100, 0.1).name("字体大小");
  styleFolder.addColor(buttonGroupStyle, "color").name("字体颜色");
  styleFolder.addColor(buttonGroupStyle, "colorIsClick").name("点击字体颜色");
  styleFolder
    .add(buttonGroupStyle, "useBackgroundUrl")
    .name("使用背景图/色")
    .onChange((value) => {
      bgColor.disable(value);
      bgColorIsClick.disable(value);
      bgUrl.disable(!value);
      bgUrlIsClick.disable(!value);
    });

  const bgColor = styleFolder
    .addColor(buttonGroupStyle, "backgroundColor")
    .name("背景颜色")
    .disable(buttonGroupStyle.useBackgroundUrl);
  const bgColorIsClick = styleFolder
    .addColor(buttonGroupStyle, "backgroundColorIsClick")
    .name("点击背景颜色")
    .disable(buttonGroupStyle.useBackgroundUrl);

  const bgUrl = styleFolder
    .add(buttonGroupStyle, "backgroundUrl")
    .name("背景图片")
    .disable(!buttonGroupStyle.useBackgroundUrl);
  const bgUrlIsClick = styleFolder
    .add(buttonGroupStyle, "backgroundUrlIsClick")
    .name("点击背景图片")
    .disable(!buttonGroupStyle.useBackgroundUrl);
}
