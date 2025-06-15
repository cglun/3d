import { TourWindow } from "@/app/MyContext";

import { editorInstance } from "@/three/EditorInstance";
import { SceneUserData } from "@/three/Three3dConfig";

import { Dispatch } from "react";

import { GUI } from "three/addons/libs/lil-gui.module.min.js";

import { LabelInfo } from "@/viewer3d/label/LabelInfo";

export default function topCardGUI(dispatchTourWindow: Dispatch<TourWindow>) {
  const editor = editorInstance.getEditor();
  editor.destroyGUI();
  // 创建 GUI 实例并保存到变量中
  editor.guiInstance = new GUI({ width: 285 });
  const userData = editor.scene.userData as SceneUserData;
  const { topCard } = userData.userCssStyle;
  const folderGeometry = editor.guiInstance.addFolder("顶牌");
  const cube = editor.addCube();
  cube.name = "此顶牌不会被保存";
  const label = new LabelInfo(cube, editor.scene, dispatchTourWindow);
  label.css3DSprite.position.set(0, -5, 0);
  editor.scene.add(label.css3DSprite);
  const labelStyle = label.div.style;
  folderGeometry
    .add(topCard, "cardWidth", 30, 500)
    .name("宽度")
    .step(1)
    .onChange(() => {
      labelStyle.width = `${topCard.cardWidth}px`;
    });
  folderGeometry
    .add(topCard, "cardHeight", 20, 600)
    .name("高度")
    .step(1)
    .onChange(() => {
      labelStyle.height = `${topCard.cardHeight}px`;
    });

  folderGeometry
    .add(topCard, "cardSize", 0.01, 1)
    .name("缩放")
    .step(0.01)
    .onChange(() => {
      label.css3DSprite.scale.set(
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
      labelStyle.borderRadius = `${topCard.cardRadius}px`;
    });
  folderGeometry
    .addColor(topCard, "cardBackgroundColor")
    .name("背景颜色")
    .onChange(() => {
      labelStyle.backgroundColor = `${topCard.cardBackgroundColor}`;
      labelStyle.backgroundImage = "";
    });
  folderGeometry
    .add(topCard, "cardBackgroundUrl")
    .name("背景URL")
    .onChange(() => {
      labelStyle.backgroundImage = `url("${topCard.cardBackgroundUrl}")`;
    });
  folderGeometry
    .add(topCard, "opacity", 0.01, 1)
    .step(0.01)
    .name("透明度")
    .onChange(() => {
      labelStyle.opacity = topCard.opacity.toString();
    });

  folderGeometry
    .add(topCard, "headerFontSize", 0.1, 100)
    .step(0.1)
    .name("标题字体大小")
    .onChange(() => {
      // labelStyle.padding = `${topCard.headerMarginTop}px ${topCard.headerMarginLeft}px`;
      const p = label.div.children[0];
      for (let index = 0; index < p.children.length; index++) {
        const element = p.children[index] as HTMLDivElement;
        element.style.fontSize = `${topCard.headerFontSize}px`;
      }
    });
  folderGeometry
    .addColor(topCard, "headerColor")
    .name("标题字体颜色")
    .onChange(() => {
      // labelStyle.color = `${topCard.headerColor}`;
      const header1 = label.div.children[0].children[0] as HTMLDivElement;
      const header2 = label.div.children[0].children[1] as HTMLDivElement;
      header1.style.color = `${topCard.headerColor}`;
      header2.style.color = `${topCard.headerColor}`;
    });
  folderGeometry
    .add(topCard, "bodyFontSize", 0.1, 100)
    .step(0.1)
    .name("正文字体大小")
    .onChange(() => {
      // labelStyle.padding = `${topCard.headerMarginTop}px ${topCard.headerMarginLeft}px`;
      const p = label.div.children[1];
      for (let index = 0; index < p.children.length; index++) {
        const element = p.children[index] as HTMLDivElement;
        element.style.fontSize = `${topCard.bodyFontSize}px`;
      }
    });
  folderGeometry
    .addColor(topCard, "bodyColor")

    .name("正文字体颜色")
    .onChange(() => {
      // labelStyle.padding = `${topCard.headerMarginTop}px ${topCard.headerMarginLeft}px`;
      const p = label.div.children[1];
      for (let index = 0; index < p.children.length; index++) {
        const element = p.children[index] as HTMLDivElement;
        element.style.color = `${topCard.bodyColor}`;
      }
    });

  folderGeometry
    .add(topCard, "headerMarginTop", 0.1, 100)
    .step(0.1)
    .name("上下边距")
    .onChange(() => {
      labelStyle.padding = `${topCard.headerMarginTop}px ${topCard.headerMarginLeft}px`;
    });
  folderGeometry
    .add(topCard, "headerMarginLeft", 0.1, 100)
    .step(0.1)
    .name("左右边距")
    .onChange(() => {
      labelStyle.padding = `${topCard.headerMarginTop}px ${topCard.headerMarginLeft}px`;
    });

  // folderGeometry.addColor( topCard, "bodyColor").onChange( function ( val ) {

  // 			spotLight.color.setHex( val );

  // 		} );
}
