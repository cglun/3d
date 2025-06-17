import { TourWindow } from "@/app/MyContext";

import { editorInstance } from "@/three/EditorInstance";
import { SceneUserData } from "@/three/Three3dConfig";
import { Dispatch } from "react";

import {
  setLabelFontColor,
  setFontSize,
  createTestLabel,
} from "@/component/common/routes/effects/utils";

export default function markLabelGUI(dispatchTourWindow: Dispatch<TourWindow>) {
  const editor = editorInstance.getEditor();

  const userData = editor.scene.userData as SceneUserData;
  const { markLabel } = userData.userCssStyle;
  const folderGeometry = editor.createGUI("标签");

  const { marker } = createTestLabel(editor, dispatchTourWindow, {
    mark: true,
    label: false,
    blender: false,
  });

  //没有就创建，显示
  const markDiv = marker.div;
  const { style } = markDiv;
  folderGeometry
    .add(markLabel, "cardWidth", 30, 500)
    .name("宽度")
    .step(1)
    .onChange(() => {
      style.width = `${markLabel.cardWidth}px`;
    });
  folderGeometry
    .add(markLabel, "cardHeight", 2, 100)
    .name("高度")
    .step(1)
    .onChange(() => {
      style.lineHeight = `${markLabel.cardHeight}px`;
    });

  folderGeometry
    .add(markLabel, "cardSize", 0.01, 1)
    .name("缩放")
    .step(0.01)
    .onChange(() => {
      marker.css3DSprite.scale.set(
        markLabel.cardSize,
        markLabel.cardSize,
        markLabel.cardSize
      );
    });

  folderGeometry
    .add(markLabel, "cardRadius", 0.01, 100)
    .name("圆角")
    .step(0.01)
    .onChange(() => {
      style.borderRadius = `${markLabel.cardRadius}px`;
    });
  folderGeometry
    .addColor(markLabel, "cardBackgroundColor")
    .name("背景颜色")
    .onChange(() => {
      style.backgroundColor = `${markLabel.cardBackgroundColor}`;
      style.backgroundImage = "";
    });
  folderGeometry
    .add(markLabel, "cardBackgroundUrl")
    .name("背景URL")
    .onChange(() => {
      style.backgroundImage = `url("${markLabel.cardBackgroundUrl}")`;
    });
  folderGeometry
    .add(markLabel, "opacity", 0.01, 1)
    .step(0.01)
    .name("透明度")
    .onChange(() => {
      style.opacity = markLabel.opacity.toString();
    });
  folderGeometry
    .addColor(markLabel, "headerColor")
    .name("字体颜色")
    .onChange(() => {
      const header = markDiv.children[0] as HTMLDivElement;
      setLabelFontColor(header, markLabel.headerColor);
    });
  folderGeometry
    .add(markLabel, "headerFontSize", 0.1, 100)
    .step(0.1)
    .name("字体大小")
    .onChange(() => {
      const div = markDiv.children[0] as HTMLDivElement;
      setFontSize(div, markLabel.headerFontSize);
    });

  folderGeometry
    .add(markLabel, "headerMarginTop", 0.1, 100)
    .step(0.1)
    .name("上下边距")
    .onChange(() => {
      style.padding = `${markLabel.headerMarginTop}px ${markLabel.headerMarginLeft}px`;
    });
  folderGeometry
    .add(markLabel, "headerMarginLeft", 0.1, 100)
    .step(0.1)
    .name("左右边距")
    .onChange(() => {
      style.padding = `${markLabel.headerMarginTop}px ${markLabel.headerMarginLeft}px`;
    });
}
