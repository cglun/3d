import { editorInstance } from "@/three/EditorInstance";
import { AmbientLight } from "three";
import { lightGUI } from "./lightGUI";

export default function ambientLightGUI(ambientLight: AmbientLight) {
  const editor = editorInstance.getEditor();
  const folder = editor.createGUI("环境光");
  lightGUI(ambientLight, folder);
}
