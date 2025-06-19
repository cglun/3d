import { editorInstance } from "@/three/EditorInstance";

import { DirectionalLight, DirectionalLightHelper } from "three";
import { lightGUI } from "./lightGUI";

export default function directionalLightGUI(light: DirectionalLight) {
  const editor = editorInstance.getEditor();

  const folder = editor.createGUI("平行光");
  lightGUI(light, folder);
  const shadowFolder = folder.addFolder("阴影");
  const { mapSize, camera } = light.shadow;

  shadowFolder.add(mapSize, "x", 0, 4096, 1).name("宽");
  shadowFolder.add(mapSize, "y", 0, 4096, 1).name("高");
  shadowFolder.add(camera, "near", 0, 4096, 1).name("近端");
  shadowFolder.add(camera, "far", 0, 4096, 1).name("远端");
  const min = -1;
  const max = 1;
  const step = 0.001;
  shadowFolder.add(camera, "left", min, max, step).name("左端");
  shadowFolder.add(camera, "right", min, max, step).name("右端");
  shadowFolder.add(camera, "top", min, max, step).name("顶端");
  shadowFolder.add(camera, "bottom", min, max, step).name("底端");

  shadowFolder.add(light.shadow, "bias", 0, 0.01, 0.001 / 1000).name("锯齿");
  //@ts-expect-error 别搞人
  const helper = {
    addHelper: () => {
      // 创建平行光助手
      const lightHelper = new DirectionalLightHelper(light, 5); // 5 是助手尺寸
      editor.HELPER_GROUP.add(lightHelper);
      // editor.scene.add(lightHelper); // 将助手添加到场景
    },
  };
  //shadowFolder.add(helper, "addHelper").name("添加助手");
}
