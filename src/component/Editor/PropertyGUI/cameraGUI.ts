import { editorInstance } from "@/three/instance/EditorInstance";
import { PerspectiveCamera } from "three";
import positionGUI from "@/component/Editor/PropertyGUI/commonGUI/positionGUI";
import { transformCMD } from "@/three/command/cmd";

export default function cameraGUI(camera: PerspectiveCamera) {
  const editor = editorInstance.getEditor();
  const folder = editor.createGUI("透视相机");

  const min = -100;
  const max = 100;
  const step = 0.01;

  positionGUI(folder, camera, min, max, step).onFinishChange(() => {
    transformCMD(camera, cameraGUI);
  });
  const otherFolder = folder.addFolder("其他");
  otherFolder.add(camera, "fov").step(step).min(1).max(100).name("FOV");
  otherFolder.add(camera, "zoom").step(0.01).min(0.1).max(1).name("缩放");
}
