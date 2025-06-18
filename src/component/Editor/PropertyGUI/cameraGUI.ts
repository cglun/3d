import { editorInstance } from "@/three/EditorInstance";
import { PerspectiveCamera } from "three";

export default function cameraGUI(camera: PerspectiveCamera) {
  const editor = editorInstance.getEditor();
  const folder = editor.createGUI("透视相机");
  const cameraFolder = folder.addFolder("位置");
  const min = -100;
  const max = 100;
  const step = 0.01;
  const lastToken = "轴";
  cameraFolder
    .add(camera.position, "x")
    .step(step)
    .min(min)
    .max(max)
    .name(`X${lastToken}`);

  cameraFolder
    .add(camera.position, "y")
    .step(step)
    .min(min)
    .max(max)
    .name(`Y${lastToken}`);
  cameraFolder
    .add(camera.position, "z")
    .step(step)
    .min(min)
    .max(max)
    .name(`Z${lastToken}`);
  const otherFolder = folder.addFolder("其他");
  otherFolder.add(camera, "fov").step(step).min(1).max(100).name("FOV");
  otherFolder.add(camera, "zoom").step(0.01).min(0.1).max(1).name("缩放");
}
