import { UserCssStyle } from "@/three/config/Three3dConfig";
import { LabelInfo } from "@/viewer3d/label/LabelInfo";

import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import {
  hexToRgb,
  setFontSize,
  setLabelFontColor,
  useBackgroundColor,
  useBackgroundImage,
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

  // const lockXY = {
  //   isLock: true,
  //   size: {
  //     width: object.cardWidth,
  //     height: object.cardHeight,
  //   },
  // };

  // parentFolder
  //   .add(lockXY, "isLock")
  //   .name("使用背景图宽高比")
  //   .onChange((value) => {
  //     imgHeight.disable(value);
  //     imgWidth.disable(value);
  //     if (lockXY.isLock) {
  //       imgHeight.setValue(lockXY.size.height);
  //       imgWidth.setValue(lockXY.size.width);
  //     }
  //   });
  parentFolder
    .add(object, "enableCardBackgroundUrl")
    .name("使用背景图")
    .onChange((value) => {
      bgUrl.disable(!value);
      imgHeight.disable(value);
      imgWidth.disable(value);
      bgOpacity.disable(value);
      bgColor.disable(value);
      if (value) {
        useBackgroundImage(object, style, imgHeight, imgWidth);
      }
      if (!value) {
        useBackgroundColor(object, style);
      }
    });

  const imgWidth = parentFolder
    .add(object, "cardWidth", 30, 500, 0.01)
    .name("宽度")
    .disable(object.enableCardBackgroundUrl)
    .onChange(() => {
      style.width = `${object.cardWidth}px`;
    });

  const imgHeight = parentFolder
    .add(object, "cardHeight", 30, 500, 0.01)
    .name("高度")
    .disable(object.enableCardBackgroundUrl)
    .onChange(() => {
      style.height = `${object.cardHeight}px`;
    });

  parentFolder
    .add(object, "cardSize", 0, 2)
    .name("缩放")
    .step(0.001)
    .onChange(() => {
      labelInfo.css3DSprite.scale.set(
        object.cardSize,
        object.cardSize,
        object.cardSize
      );
    });

  parentFolder
    .add(object, "cardRadius", 0, 100)
    .name("圆角")
    .step(0.01)
    .onChange(() => {
      style.borderRadius = `${object.cardRadius}px`;
    });

  const bgColor = parentFolder
    .addColor(object, "cardBackgroundColor")
    .name("背景颜色")
    .disable(object.enableCardBackgroundUrl)
    .onChange(() => {
      // 将颜色值和透明度结合为 rgba 格式
      const rgbaColor = `rgba(${hexToRgb(object.cardBackgroundColor)}, ${object.opacity})`;
      style.backgroundColor = rgbaColor;
    });

  const bgOpacity = parentFolder
    .add(object, "opacity", 0, 1)
    .step(0.01)
    .name("背景色透明度")
    .disable(object.enableCardBackgroundUrl)
    .onChange(() => {
      // const rgbaColor = `rgba(${hexToRgb(object.cardBackgroundColor)}, ${object.opacity})`;
      // style.backgroundColor = rgbaColor;
      useBackgroundColor(object, style);
    });

  const bgUrl = parentFolder
    .add(object, "cardBackgroundUrl")
    .name("背景URL")
    .disable(!object.enableCardBackgroundUrl)
    .onChange(() => {
      useBackgroundImage(object, style, imgHeight, imgWidth);
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
    .add(object, "headerMarginTop", 0, 500)
    .step(0.1)
    .name("上边距")
    .onChange(() => {
      style.paddingTop = `${object.headerMarginTop}px`;
    });
  parentFolder
    .add(object, "headerMarginLeft", 0, 500)
    .step(0.1)
    .name("左边距")
    .onChange(() => {
      style.paddingLeft = `${object.headerMarginLeft}px`;
      // style.padding = `${object.headerMarginTop}px ${object.headerMarginLeft}px`;
    });
}
