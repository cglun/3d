import { Dispatch } from "react";
import { editorInstance } from "@/three/instance/EditorInstance";
import { SceneUserData } from "@/three/config/Three3dConfig";
import { createTestLabel } from "@/component/routes/effects/utils";
import { TourWindow } from "@/app/MyContext";
export default function modelHighlightGUI(
  dispatchTourWindow: Dispatch<TourWindow>
) {
  const editor = editorInstance.getEditor();

  const folderGeometry = editor.createGUI("模型高亮");

  const userData = editor.scene.userData as SceneUserData;

  const { modelEdgeHighlight } = userData.userCssStyle;

  const outlinePass = editor.outlinePass;
  outlinePass.selectedObjects = [editor.addCube()];
  editor.setOutLinePassColor();
  createTestLabel(editor, dispatchTourWindow, {
    mark: false,
    label: false,
    blender: true,
  });

  folderGeometry
    .add(modelEdgeHighlight, "edgeStrength", 0.01, 10)
    .name("边缘强度")
    .step(0.01)
    .onChange(() => {
      outlinePass.edgeStrength = modelEdgeHighlight.edgeStrength;
    });
  folderGeometry
    .add(modelEdgeHighlight, "edgeGlow", 0.01, 10)
    .name("边缘发光")
    .step(0.01)
    .onChange(() => {
      outlinePass.edgeGlow = modelEdgeHighlight.edgeGlow;
    });
  folderGeometry
    .add(modelEdgeHighlight, "edgeThickness", -0.1, 25)
    .name("边缘厚度")
    .step(0.1)
    .onChange(() => {
      outlinePass.edgeThickness = modelEdgeHighlight.edgeThickness;
      //editor.renderer.render(editor.scene, editor.camera);
    });
  folderGeometry
    .add(modelEdgeHighlight, "pulsePeriod", 0.01, 3)
    .name("闪烁周期")
    .step(0.01)
    .onChange(() => {
      outlinePass.pulsePeriod = modelEdgeHighlight.pulsePeriod;
    });
  folderGeometry
    .addColor(modelEdgeHighlight, "canSeeColor")
    .name("可见颜色")
    .onChange(() => {
      outlinePass.visibleEdgeColor.set(modelEdgeHighlight.canSeeColor);
    });
  folderGeometry
    .addColor(modelEdgeHighlight, "noSeeColor")
    .name("不可见颜色")
    .onChange(() => {
      outlinePass.hiddenEdgeColor.set(modelEdgeHighlight.noSeeColor);
    });
}
