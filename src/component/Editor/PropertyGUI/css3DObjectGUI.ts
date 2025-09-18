import { CSS3DObject } from "three/addons/renderers/CSS3DRenderer.js";
import positionGUI from "@/component/Editor/PropertyGUI/commonGUI/positionGUI";
import { transformCMD } from "@/three/command/cmd";
import rotationGUI from "./commonGUI/rotationGUI";
import scaleGUI from "./commonGUI/scaleGUI";
import { Scene } from "three";
import { getEditorInstance } from "@/three/utils/utils";

export default function css3DObjectGUI(
  object: CSS3DObject,
  updateScene?: (scene: Scene) => void
) {
  const { editor } = getEditorInstance();
  const folder = editor.createGUI("组").onFinishChange(() => {
    transformCMD(object, () => css3DObjectGUI(object, updateScene));
  });

  folder.add(object, "name").name("图片名");
  positionGUI(folder, object, -50, 50, 0.01);
  rotationGUI(folder, object);
  scaleGUI(folder, object, 0, 1, 0.001);

  return folder;
}
