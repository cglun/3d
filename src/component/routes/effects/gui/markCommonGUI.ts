import { UserCssStyle } from "@/three/config/Three3dConfig";
import { LabelInfo } from "@/viewer3d/label/LabelInfo";

import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import {
  setFontSize,
  setLabelFontColor,
} from "@/component/routes/effects/utils";
import { MarkLabel } from "@/viewer3d/label/MarkLabel";
import { editorInstance } from "@/three/instance/EditorInstance";
export default function markCommonGUI(
  parentFolder: GUI,
  object: UserCssStyle,
  labelInfo: LabelInfo | MarkLabel
) {
  const labelInfoDiv = labelInfo.div;
  const editor = editorInstance.getEditor();

  editor.outlinePass.selectedObjects = [];

  const { style } = labelInfoDiv;

  parentFolder
    .add(object, "cardWidth", 30, 500)
    .name("宽度")
    .step(0.1)
    .onChange(() => {
      style.width = `${object.cardWidth}px`;
    });

  parentFolder
    .add(object, "cardHeight", 20, 600)
    .name("高度")
    .step(0.1)
    .onChange(() => {
      style.height = `${object.cardHeight}px`;
    });

  parentFolder
    .add(object, "cardSize", 0.01, 1)
    .name("缩放")
    .step(0.01)
    .onChange(() => {
      labelInfo.css3DSprite.scale.set(
        object.cardSize,
        object.cardSize,
        object.cardSize
      );
    });

  parentFolder
    .add(object, "cardRadius", 0.01, 100)
    .name("圆角")
    .step(0.01)
    .onChange(() => {
      style.borderRadius = `${object.cardRadius}px`;
    });
  parentFolder
    .addColor(object, "cardBackgroundColor")
    .name("背景颜色")
    .onChange(() => {
      style.backgroundColor = `${object.cardBackgroundColor}`;
      style.backgroundImage = "";
    });
  parentFolder
    .add(object, "cardBackgroundUrl")
    .name("背景URL")
    .onChange(() => {
      style.backgroundImage = `url("${object.cardBackgroundUrl}")`;
    });
  parentFolder
    .add(object, "opacity", 0.01, 1)
    .step(0.01)
    .name("透明度")
    .onChange(() => {
      style.opacity = object.opacity.toString();
    });

  parentFolder
    .add(object, "headerFontSize", 0.1, 100)
    .step(0.1)
    .name("标题字体大小")
    .onChange(() => {
      const div = labelInfoDiv.children[0] as HTMLDivElement;
      setFontSize(div, object.headerFontSize);
    });
  parentFolder
    .addColor(object, "headerColor")
    .name("标题字体颜色")
    .onChange(() => {
      const header = labelInfoDiv.children[0] as HTMLDivElement;
      setLabelFontColor(header, object.headerColor);
    });
  parentFolder
    .add(object, "headerMarginTop", 0.1, 100)
    .step(0.1)
    .name("上边距")
    .onChange(() => {
      style.paddingTop = `${object.headerMarginTop}px`;
    });
  parentFolder
    .add(object, "headerMarginLeft", 0.1, 100)
    .step(0.1)
    .name("左边距")
    .onChange(() => {
      style.paddingLeft = `${object.headerMarginLeft}px`;
      // style.padding = `${object.headerMarginTop}px ${object.headerMarginLeft}px`;
    });
}
