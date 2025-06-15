import { TourWindow } from "@/app/MyContext";

import { editorInstance } from "@/three/EditorInstance";
import { SceneUserData } from "@/three/Three3dConfig";
import { MarkLabel } from "@/viewer3d/label/MarkLabel";
import { Dispatch } from "react";

import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { setLabelHeaderColor } from "@/component/common/routes/effects/utils";
export default function markLabelGUI(dispatchTourWindow: Dispatch<TourWindow>) {
  const editor = editorInstance.getEditor();
  editor.destroyGUI();
  // 创建 GUI 实例并保存到变量中
  editor.guiInstance = new GUI({ width: 285 });
  const userData = editor.scene.userData as SceneUserData;
  const { markLabel } = userData.userCssStyle;
  const folderGeometry = editor.guiInstance.addFolder("标签");
  const label = new MarkLabel(editor.scene, dispatchTourWindow, {
    markName: "此标签不会被保存",
    logo: "geo-alt",
    showEye: false,
    tourObject: {
      id: "id",
      title: "title",
    },
  });
  label.css3DSprite.position.set(0, 3, 0);
  editor.scene.add(label.css3DSprite);
  const labelStyle = label.div.style;

  folderGeometry
    .add(markLabel, "cardWidth", 30, 500)
    .name("宽度")
    .step(1)
    .onChange(() => {
      labelStyle.width = `${markLabel.cardWidth}px`;
    });
  folderGeometry
    .add(markLabel, "cardHeight", 2, 100)
    .name("高度")
    .step(1)
    .onChange(() => {
      labelStyle.lineHeight = `${markLabel.cardHeight}px`;
    });

  folderGeometry
    .add(markLabel, "cardSize", 0.01, 1)
    .name("缩放")
    .step(0.01)
    .onChange(() => {
      label.css3DSprite.scale.set(
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
      labelStyle.borderRadius = `${markLabel.cardRadius}px`;
    });
  folderGeometry
    .addColor(markLabel, "cardBackgroundColor")
    .name("背景颜色")
    .onChange(() => {
      labelStyle.backgroundColor = `${markLabel.cardBackgroundColor}`;
      labelStyle.backgroundImage = "";
    });
  folderGeometry
    .add(markLabel, "cardBackgroundUrl")
    .name("背景URL")
    .onChange(() => {
      labelStyle.backgroundImage = `url("${markLabel.cardBackgroundUrl}")`;
    });
  folderGeometry
    .add(markLabel, "opacity", 0.01, 1)
    .step(0.01)
    .name("透明度")
    .onChange(() => {
      labelStyle.opacity = markLabel.opacity.toString();
    });
  folderGeometry
    .addColor(markLabel, "headerColor")
    .name("字体颜色")
    .onChange(() => {
      const header1 = label.div.children[0].children[0] as HTMLDivElement;
      const header2 = label.div.children[0].children[1] as HTMLDivElement;
      header1.style.color = `${markLabel.headerColor}`;
      header2.style.color = `${markLabel.headerColor}`;
    });
  folderGeometry
    .add(markLabel, "headerFontSize", 0.1, 100)
    .step(0.1)
    .name("字体大小")
    .onChange(() => {
      //labelStyle.padding = `${markLabel.headerMarginTop}px ${markLabel.headerMarginLeft}px`;
      setLabelHeaderColor(
        label.div,
        "fontSize",
        markLabel.headerFontSize.toString(),
        "px"
      );
    });

  folderGeometry
    .add(markLabel, "headerMarginTop", 0.1, 100)
    .step(0.1)
    .name("上下边距")
    .onChange(() => {
      labelStyle.padding = `${markLabel.headerMarginTop}px ${markLabel.headerMarginLeft}px`;
    });
  folderGeometry
    .add(markLabel, "headerMarginLeft", 0.1, 100)
    .step(0.1)
    .name("左右边距")
    .onChange(() => {
      labelStyle.padding = `${markLabel.headerMarginTop}px ${markLabel.headerMarginLeft}px`;
    });

  // folderGeometry.addColor( markLabel, "bodyColor").onChange( function ( val ) {

  // 			spotLight.color.setHex( val );

  // 		} );
}
