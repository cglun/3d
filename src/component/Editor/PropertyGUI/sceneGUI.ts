import { editorInstance } from "@/three/EditorInstance";
import { SceneUserData } from "@/three/Three3dConfig";
import { Color, CubeTexture, Scene, Texture } from "three";

// 封装颜色转换工具函数
function getValidColor(
  colorValue: Color | Texture | CubeTexture | null
): Color {
  if (colorValue instanceof Color) {
    return colorValue;
  }
  if (typeof colorValue === "string" || typeof colorValue === "number") {
    return new Color(colorValue);
  }
  return new Color(0xffffff); // 默认白色
}

export default function sceneGUI(scene: Scene) {
  const editor = editorInstance.getEditor();
  const sceneUserData = editor.scene.userData as SceneUserData;
  const { backgroundHDR } = sceneUserData;

  const folder = editor.createGUI("场景");
  folder.add(scene, "name").name("名称").disable(true); // 定义按钮点击后的处理函数

  const isColorController = folder
    .add(backgroundHDR, "isColor")
    .name(backgroundHDR.isColor ? "使用背景图" : "使用背景色")
    .onChange(() => {
      console.log(backgroundHDR.isColor);
      isColorController.name(
        backgroundHDR.isColor ? "使用背景图" : "使用背景色"
      );

      if (backgroundHDR.isColor) {
        HDR.hide();
      }
    });
  const HDR = folder.add(backgroundHDR, "color").hide().name("HDR");
  //const backgroundColor=folder.add()

  if (!backgroundHDR.isColor) {
    HDR.show();
  }
  // if (HDRHDR.isColor) {
  //   HDRHDR.color = "#00ff00";
  //   folder
  //     .add(HDRHDR, "isColor")
  //     .name("背景色")
  //     .onChange(() => {
  //       setBackgroundColor(scene, HDRHDR.color);
  //     });
  //   folder.addColor(HDRHDR, "color");
  // }

  // if (!HDRHDR.isColor) {
  //   folder
  //     .add(HDRHDR, "isColor")
  //     .name("背景图")
  //     .onChange(() => {
  //       setBackgroundColor(scene, HDRHDR.color);
  //     });
  //   // 修改为下拉选择
  //   const options = {
  //     geometry: "Box", // 默认选项
  //   };
  //   const geometries = ["Box", "Sphere", "Cylinder"];
  //   folder
  //     .add(options, "geometry", geometries)
  //     .name("几何体类型")
  //     .onChange((value) => {
  //       console.log(`选择的几何体类型是: ${value}`);
  //     });
  // }

  // if (HDRHDR.isColor) {
  //   folder
  //     .add(sceneUserData.HDRHDR, "color")
  //     .name("背景色")
  //     .onChange(() => {
  //       setBackgroundColor(scene, HDRHDR.color);
  //     });
  // }
  // folder
  //   .addColor(scene, "HDR")
  //   .name("背景色")
  //   .onChange((value: DataTexture|Color|null) => {
  //     console.log(value);

  //     scene.HDR = new Color(value);
  //     scene.environment = null;
  //   });
  // folder
  //   .addColor(scene, "HDR")
  //   .name("背景色")
  //   .onChange((colorValue: Color | Texture | CubeTexture | null) => {
  //     // 使用之前封装的工具函数获取有效的 Color 实例
  //     const newColor = getValidColor(colorValue);
  //     // 更新编辑器场景的背景色
  //     editor.scene.HDR = newColor;
  //     editor.scene.environment = null;
  //   });
}
