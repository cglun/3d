import { DirectionalLight } from "three";
import { editorInstance } from "@/three/instance/EditorInstance";
import { lightGUI } from "@/component/Editor/PropertyGUI/lightGUI/lightGUI";
import { transformCMD } from "@/three/command/cmd";
import positionGUI from "@/component/Editor/PropertyGUI/commonGUI/positionGUI";

export default function directionalLightGUI(light: DirectionalLight) {
  const editor = editorInstance.getEditor();

  const folder = editor.createGUI("平行光");
  lightGUI(light, folder);
  positionGUI(folder, light, -40, 40, 0.01).onFinishChange(() => {
    transformCMD(light, () => directionalLightGUI(light));
  });

  const shadowFolder = folder.addFolder("阴影");
  const { mapSize, camera } = light.shadow;

  shadowFolder.add(mapSize, "x", 0, 4096, 1).name("宽");
  shadowFolder.add(mapSize, "y", 0, 4096, 1).name("高");
  shadowFolder.add(camera, "near", 0, 4096, 1).name("近端");
  shadowFolder.add(camera, "far", 0, 4096, 1).name("远端");
  const min = -15;
  const max = 15;
  const step = 0.001;
  const zero = 0;

  shadowFolder.add(camera, "left", min, zero, step).name("左端");
  shadowFolder.add(camera, "right", zero, max, step).name("右端");
  shadowFolder.add(camera, "top", zero, max, step).name("顶端");
  shadowFolder.add(camera, "bottom", min, zero, step).name("底端");

  shadowFolder.add(light.shadow, "bias", 0, 0.01, 0.001 / 1000).name("锯齿");

  // const helper = {
  //   addHelper: () => {
  //     // 创建平行光助手
  //     const lightHelper = new DirectionalLightHelper(light, 5); // 5 是助手尺寸
  //     editor.HELPER_GROUP.add(lightHelper);
  //     lightHelper.matrixWorldNeedsUpdate = true;
  //     // editor.scene.add(lightHelper); // 将助手添加到场景
  //   },
  // };
  // shadowFolder.add(helper, "addHelper").name("添加助手");
}
