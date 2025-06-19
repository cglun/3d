import { editorInstance } from "@/three/EditorInstance";
import { CSS3DSprite } from "three/addons/renderers/CSS3DRenderer.js";
import positionGUI from "@/component/Editor/PropertyGUI/commonGUI/positionGUI";

export default function css3CSS3DSpriteGUI(object: CSS3DSprite) {
  const editor = editorInstance.getEditor();
  const folder = editor.createGUI("标签组"); // 添加旋转控件，将度转换为弧度
  folder.add(object, "name").name("标签名");
  positionGUI(folder, object, -50, 50, 0.01);
}
