import { editorInstance } from "@/three/instance/EditorInstance";
import {
  CSS3DObject,
  CSS3DSprite,
} from "three/addons/renderers/CSS3DRenderer.js";
import positionGUI from "@/component/Editor/PropertyGUI/commonGUI/positionGUI";
import { transformCMD } from "@/three/command/cmd";

export default function css3DSpriteGUI(object: CSS3DSprite | CSS3DObject) {
  const editor = editorInstance.getEditor();
  const folder = editor.createGUI("标签组").onFinishChange(() => {
    transformCMD(object, () => css3DSpriteGUI(object));
  });
  folder.add(object, "name").name("标签名");

  positionGUI(folder, object, -50, 50, 0.01);

  return folder;
}
