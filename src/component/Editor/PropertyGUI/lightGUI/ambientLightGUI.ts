import { editorInstance } from "@/three/instance/EditorInstance";
import { AmbientLight } from "three";
import { lightGUI } from "@/component/Editor/PropertyGUI/lightGUI/lightGUI";

export default function ambientLightGUI(ambientLight: AmbientLight) {
  const editor = editorInstance.getEditor();
  const folder = editor.createGUI("环境光");
  lightGUI(ambientLight, folder);
}
