import { Dispatch } from "react";
import { TourWindow } from "@/app/MyContext";
import { editorInstance } from "@/three/instance/EditorInstance";
import { SceneUserData } from "@/three/config/Three3dConfig";
import {
  setLabelFontColor,
  setFontSize,
  createTestLabel,
} from "@/component/common/routes/effects/utils";
export default function topCardGUI(dispatchTourWindow: Dispatch<TourWindow>) {
  const editor = editorInstance.getEditor();

  const folderGeometry = editor.createGUI("顶牌");

  const userData = editor.scene.userData as SceneUserData;
  const { topCard } = userData.userCssStyle;

  const { labelInfo } = createTestLabel(editor, dispatchTourWindow, {
    mark: false,
    label: true,
    blender: false,
  });

  //没有就创建，显示
  const labelInfoDiv = labelInfo.div;
  const { style } = labelInfoDiv;
  folderGeometry
    .add(topCard, "cardWidth", 30, 500)
    .name("宽度")
    .step(0.1)
    .onChange(() => {
      style.width = `${topCard.cardWidth}px`;
    });
  folderGeometry
    .add(topCard, "cardHeight", 20, 600)
    .name("高度")
    .step(0.1)
    .onChange(() => {
      style.height = `${topCard.cardHeight}px`;
    });

  folderGeometry
    .add(topCard, "cardSize", 0.01, 1)
    .name("缩放")
    .step(0.01)
    .onChange(() => {
      labelInfo.css3DSprite.scale.set(
        topCard.cardSize,
        topCard.cardSize,
        topCard.cardSize
      );
    });

  folderGeometry
    .add(topCard, "cardRadius", 0.01, 100)
    .name("圆角")
    .step(0.01)
    .onChange(() => {
      style.borderRadius = `${topCard.cardRadius}px`;
    });
  folderGeometry
    .addColor(topCard, "cardBackgroundColor")
    .name("背景颜色")
    .onChange(() => {
      style.backgroundColor = `${topCard.cardBackgroundColor}`;
      style.backgroundImage = "";
    });
  folderGeometry
    .add(topCard, "cardBackgroundUrl")
    .name("背景URL")
    .onChange(() => {
      style.backgroundImage = `url("${topCard.cardBackgroundUrl}")`;
    });
  folderGeometry
    .add(topCard, "opacity", 0.01, 1)
    .step(0.01)
    .name("透明度")
    .onChange(() => {
      style.opacity = topCard.opacity.toString();
    });

  folderGeometry
    .add(topCard, "headerFontSize", 0.1, 100)
    .step(0.1)
    .name("标题字体大小")
    .onChange(() => {
      const div = labelInfoDiv.children[0] as HTMLDivElement;
      setFontSize(div, topCard.headerFontSize);
    });
  folderGeometry
    .addColor(topCard, "headerColor")
    .name("标题字体颜色")
    .onChange(() => {
      const header = labelInfoDiv.children[0] as HTMLDivElement;
      setLabelFontColor(header, topCard.headerColor);
    });
  folderGeometry
    .add(topCard, "bodyFontSize", 0.1, 100)
    .step(0.1)
    .name("正文字体大小")
    .onChange(() => {
      const div = labelInfoDiv.children[1] as HTMLDivElement;
      setFontSize(div, topCard.bodyFontSize);
    });
  folderGeometry
    .addColor(topCard, "bodyColor")
    .name("正文字体颜色")
    .onChange(() => {
      const div = labelInfoDiv.children[1] as HTMLDivElement;
      setLabelFontColor(div, topCard.bodyColor);
    });

  folderGeometry
    .add(topCard, "headerMarginTop", 0.1, 100)
    .step(0.1)
    .name("上边距")
    .onChange(() => {
      style.paddingTop = `${topCard.headerMarginTop}px`;
    });
  folderGeometry
    .add(topCard, "headerMarginLeft", 0.1, 100)
    .step(0.1)
    .name("左边距")
    .onChange(() => {
      style.paddingLeft = `${topCard.headerMarginLeft}px`;
      // style.padding = `${topCard.headerMarginTop}px ${topCard.headerMarginLeft}px`;
    });

  // folderGeometry.addColor( topCard, "bodyColor").onChange( function ( val ) {

  // 			spotLight.color.setHex( val );

  // 		} );
}
