import { TourWindow } from "@/app/MyContext";

import { editorInstance } from "@/three/instance/EditorInstance";
import { SceneUserData } from "@/three/config/Three3dConfig";
import { Dispatch } from "react";

import { createTestLabel } from "@/component/routes/effects/utils";
import markCommonGUI from "@/component/routes/effects/gui/markCommonGUI";

export default function markLabelGUI(dispatchTourWindow: Dispatch<TourWindow>) {
  const editor = editorInstance.getEditor();

  const userData = editor.scene.userData as SceneUserData;
  const { markLabel } = userData.userCssStyle;
  const folderGeometry = editor.createGUI("标签");

  const { marker } = createTestLabel(editor, dispatchTourWindow, {
    markVisible: true,
    labelVisible: false,
    cubeVisible: true,
  });

  markCommonGUI(folderGeometry, markLabel, marker);
}
