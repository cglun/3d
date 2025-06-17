import { editorInstance } from "@/three/EditorInstance";

import { DirectionalLight } from "three";
import { lightGUI } from "./lightGUI";

export default function directionalLightGUI(light: DirectionalLight) {
  const editor = editorInstance.getEditor();

  const folder = editor.createGUI("平行光");
  lightGUI(light, folder);
  const shadowFolder = folder.addFolder("阴影");
  const { mapSize, camera } = light.shadow;
  shadowFolder.add(mapSize, "x", 0, 14096, 1).name("宽");
  shadowFolder.add(mapSize, "y", 0, 14096, 1).name("高");
  shadowFolder.add(camera, "near", 0, 14096, 1).name("近端");
  shadowFolder.add(camera, "far", 0, 14096, 1).name("远端");
  const min = -2048;
  const max = 2048;
  shadowFolder.add(camera, "left", min, max, 1).name("左端");
  shadowFolder.add(camera, "right", min, max, 1).name("右端");
  shadowFolder.add(camera, "top", min, max, 1).name("顶端");
  shadowFolder.add(camera, "bottom", min, max, 1).name("底端");
  shadowFolder.add(light.shadow, "bias", -0.0001, 6, 0.001).name("锯齿");
}
