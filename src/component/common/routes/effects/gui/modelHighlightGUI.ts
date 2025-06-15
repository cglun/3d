import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { editorInstance } from "@/three/EditorInstance";
import { SceneUserData } from "@/three/Three3dConfig";
import { addMonkey } from "@/threeUtils/util4Scene";

export default function modelHighlightGUI() {
  const editor = editorInstance.getEditor();
  editor.destroyGUI();
  // 创建 GUI 实例并保存到变量中
  editor.guiInstance = new GUI({ width: 285 });
  const userData = editor.scene.userData as SceneUserData;
  editor.setOutLinePassColor();
  const { modelEdgeHighlight } = userData.userCssStyle;
  const folderGeometry = editor.guiInstance.addFolder("模型高亮");
  const cube = editor.addCube();
  const outlinePass = editor.outlinePass;
  addMonkey();
  outlinePass.selectedObjects = [cube];

  editor.scene.add(cube);
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
