import { Light } from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
//灯光的通用属性
export const lightGUI = (light: Light, folder: GUI) => {
  const minP = 40;
  const folderBase = folder.addFolder("基础属性");
  folderBase.add(light, "name").name("名称");
  folderBase.add(light, "intensity", 0, 30, 0.01).name("强度");
  folderBase.addColor(light, "color").name("颜色");

  const positionFolder = folder.addFolder("位置");
  const lastToken = "轴";
  positionFolder
    .add(light.position, "x", -minP, minP, 0.01)
    .name(`X${lastToken}`)
    .onChange(() => {
      light.lookAt(0, 0, 0);
    });
  positionFolder
    .add(light.position, "y", -minP, minP, 0.01)
    .name(`Y${lastToken}`)
    .onChange(() => {
      light.lookAt(0, 0, 0);
    });
  positionFolder
    .add(light.position, "z", -minP, minP, 0.01)
    .name(`Z${lastToken}`)
    .onChange(() => {
      light.lookAt(0, 0, 0);
    });
};
