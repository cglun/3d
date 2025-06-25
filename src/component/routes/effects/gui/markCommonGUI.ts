import { UserCssStyle } from "@/three/config/Three3dConfig";
import { LabelInfo } from "@/viewer3d/label/LabelInfo";

import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import {
  hexToRgb,
  setFontSize,
  setLabelFontColor,
} from "@/component/routes/effects/utils";
import { MarkLabel } from "@/viewer3d/label/MarkLabel";
import { editorInstance } from "@/three/instance/EditorInstance";
import Toast3d from "@/component/common/Toast3d";
import { APP_COLOR } from "@/app/type";
export default function markCommonGUI(
  parentFolder: GUI,
  object: UserCssStyle,
  labelInfo: LabelInfo | MarkLabel
) {
  const labelInfoDiv = labelInfo.div;
  const editor = editorInstance.getEditor();

  editor.outlinePass.selectedObjects = [];

  const { style } = labelInfoDiv;

  const lockXY = {
    isLock: true,
    size: {
      width: object.cardWidth,
      height: object.cardHeight,
    },
  };

  parentFolder
    .add(lockXY, "isLock")
    .name("使用背景图宽高比")
    .onChange((value) => {
      imgHeight.disable(value);
      imgWidth.disable(value);
      if (lockXY.isLock) {
        imgHeight.setValue(lockXY.size.height);
        imgWidth.setValue(lockXY.size.width);
      }
    });

  const imgWidth = parentFolder
    .add(object, "cardWidth", 30, 500, 0.01)
    .name("宽度")
    .disable(lockXY.isLock)
    .onChange(() => {
      style.width = `${object.cardWidth}px`;
    });

  const imgHeight = parentFolder
    .add(object, "cardHeight", 30, 500, 0.01)
    .name("高度")
    .disable(lockXY.isLock)
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
  parentFolder
    .addColor(object, "cardBackgroundColor")
    .name("背景颜色")
    .onChange(() => {
      // 将颜色值和透明度结合为 rgba 格式
      const rgbaColor = `rgba(${hexToRgb(object.cardBackgroundColor)}, ${object.opacity})`;
      style.backgroundColor = rgbaColor;
      style.backgroundImage = "";
    });

  parentFolder
    .add(object, "opacity", 0.01, 1)
    .step(0.01)
    .name("背景色透明度")
    .onChange(() => {
      const rgbaColor = `rgba(${hexToRgb(object.cardBackgroundColor)}, ${object.opacity})`;
      style.backgroundColor = rgbaColor;
    });
  parentFolder
    .add(object, "cardBackgroundUrl")
    .name("背景URL")
    .onChange(() => {
      style.backgroundImage = `url("${object.cardBackgroundUrl}")`;
      // 创建 Image 对象
      const img = new Image();
      img.src = object.cardBackgroundUrl;

      img.onload = () => {
        // 图片加载完成后获取宽高
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        imgHeight.setValue((imgWidth.getValue() * height) / width);
        lockXY.size.width = width;
        lockXY.size.height = height;
      };

      img.onerror = () => {
        Toast3d("图片加载失败", "提示", APP_COLOR.Danger);
        console.error("图片加载失败");
      };
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
