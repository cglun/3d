import Toast3d from "@/component/common/Toast3d";
import { editorInstance } from "@/three/EditorInstance";
import { SceneUserData } from "@/three/Three3dConfig";
import { Color, FogExp2, Scene } from "three";

export default function sceneGUI(scene: Scene) {
  const editor = editorInstance.getEditor();
  const sceneUserData = editor.scene.userData as SceneUserData;
  const { backgroundHDR } = sceneUserData;
  const { isColor, color } = backgroundHDR;

  const folder = editor.createGUI("场景");
  // folder.add(scene, "name").name("名称").disable(true); // 定义按钮点击后的处理函数
  folder
    .add(backgroundHDR, "isColor")
    .name(isColor ? "使用背景图" : "使用背景色")
    .onChange(() => {
      if (backgroundHDR.isColor) {
        bgHDRFolder.hide();
        bgColor.show();
        scene.background = new Color(color);
      }
      if (!backgroundHDR.isColor) {
        bgHDRFolder.show();
        bgColor.hide();
        editor.setTextureBackground_test();
      }
    });
  let fog = new FogExp2(0xcccccc, 0.0025);
  if (scene.fog !== null) {
    fog = scene.fog as FogExp2;
  }

  const fogFolder = folder
    .addColor(fog, "color")
    .name("雾气颜色")
    .onChange(() => {
      scene.fog = fog;
    });
  const fogDensity = folder
    .add(fog, "density", 0, 0.5, 0.001)
    .name("雾气密度")
    .onChange(() => {
      scene.fog = fog;
    });

  // 定义一个包含重置雾气方法的对象
  const fogResetter = {
    resetFog: () => {
      // 重置雾气，这里假设重置为初始的 fog 对象
      const color = new Color(0xcccccc);
      const density = 0.0025;
      scene.fog = new FogExp2(color, density);
      fogFolder.setValue(color);
      fogDensity.setValue(density);
      Toast3d("重置成功");
    },
  };
  folder.add(fogResetter, "resetFog").name("默认雾气值");

  // 定义 HDR 选项
  const hdrOptions = {
    贴图一: "venice_sunset_1k.hdr",
    贴图二: "spruit_sunrise_1k.hdr",
  };
  const bgHDRFolder = folder.addFolder("背景图").hide(); // 定义按钮点击后的处理函数

  bgHDRFolder
    .add(backgroundHDR, "HDRName", hdrOptions)
    .name("背景HDR")

    .onChange((value) => {
      backgroundHDR.HDRName = value;
      editor.setTextureBackground_test();
    });
  bgHDRFolder
    .add(backgroundHDR, "asBackground")
    .name("使用HDR作为背景")
    .onChange((value) => {
      backgroundHDR.asBackground = value;
      editor.setTextureBackground_test();
    });
  bgHDRFolder.add(scene, "backgroundBlurriness", 0, 1, 0.01).name("模糊度");
  bgHDRFolder.add(scene, "backgroundIntensity", 0, 1, 0.01).name("透明度");
  bgHDRFolder.add(scene, "environmentIntensity", 0, 10, 0.01).name("光强度");

  const bgColor = folder
    .addColor(backgroundHDR, "color")
    .hide()
    .name("背景色")
    .onChange(() => {
      scene.background = new Color(backgroundHDR.color);
    });
  //const backgroundColor=folder.add()

  if (!isColor) {
    bgHDRFolder.show();
  }
  // if (bgHDRbgHDR.isColor) {
  //   bgHDRbgHDR.color = "#00ff00";
  //   folder
  //     .add(bgHDRbgHDR, "isColor")
  //     .name("背景色")
  //     .onChange(() => {
  //       setBackgroundColor(scene, bgHDRbgHDR.color);
  //     });
  //   folder.addColor(bgHDRbgHDR, "color");
  // }

  // if (!bgHDRbgHDR.isColor) {
  //   folder
  //     .add(bgHDRbgHDR, "isColor")
  //     .name("背景图")
  //     .onChange(() => {
  //       setBackgroundColor(scene, bgHDRbgHDR.color);
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

  // if (bgHDRbgHDR.isColor) {
  //   folder
  //     .add(sceneUserData.bgHDRbgHDR, "color")
  //     .name("背景色")
  //     .onChange(() => {
  //       setBackgroundColor(scene, bgHDRbgHDR.color);
  //     });
  // }
  // folder
  //   .addColor(scene, "bgHDR")
  //   .name("背景色")
  //   .onChange((value: DataTexture|Color|null) => {
  //     console.log(value);

  //     scene.bgHDR = new Color(value);
  //     scene.environment = null;
  //   });
  // folder
  //   .addColor(scene, "bgHDR")
  //   .name("背景色")
  //   .onChange((colorValue: Color | Texture | CubeTexture | null) => {
  //     // 使用之前封装的工具函数获取有效的 Color 实例
  //     const newColor = getValidColor(colorValue);
  //     // 更新编辑器场景的背景色
  //     editor.scene.bgHDR = newColor;
  //     editor.scene.environment = null;
  //   });
}
