import { Dispatch } from "react";
import { TourWindow } from "@/app/MyContext";
import { editorInstance } from "@/three/instance/EditorInstance";
import { SceneUserData } from "@/three/config/Three3dConfig";
import {
  createTestLabel,
  setFontSize,
  setLabelFontColor,
} from "@/component/routes/effects/utils";
import markCommonGUI from "@/component/routes/effects/gui/markCommonGUI";

export default function topCardGUI(dispatchTourWindow: Dispatch<TourWindow>) {
  const editor = editorInstance.getEditor();

  const folderGeometry = editor.createGUI("顶牌");

  const userData = editor.scene.userData as SceneUserData;
  const { topCard } = userData.userCssStyle;

  const { labelInfo } = createTestLabel(editor, dispatchTourWindow, {
    markVisible: false,
    labelVisible: true,
    cubeVisible: false,
  });

  //没有就创建，显示
  const labelInfoDiv = labelInfo.div;

  markCommonGUI(folderGeometry, topCard, labelInfo);
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

  // folderGeometry.addColor( topCard, "bodyColor").onChange( function ( val ) {

  // 			spotLight.color.setHex( val );

  // 		} );
}
