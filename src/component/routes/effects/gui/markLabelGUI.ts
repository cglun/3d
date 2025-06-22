import { TourWindow } from "@/app/MyContext";

import { editorInstance } from "@/three/instance/EditorInstance";
import { SceneUserData } from "@/three/config/Three3dConfig";
import { Dispatch } from "react";

import { createTestLabel } from "@/component/routes/effects/utils";
import markCommonGUI from "./markCommonGUI";

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

  markCommonGUI(folderGeometry, markLabel, marker);
}
