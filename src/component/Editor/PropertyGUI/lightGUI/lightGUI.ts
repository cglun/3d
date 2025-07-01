import { Light } from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

//灯光的通用属性
export const lightGUI = (light: Light, folder: GUI) => {
  const folderBase = folder.addFolder("基础属性");
  folderBase.add(light, "name").name("名称");
  folderBase.add(light, "intensity", 0, 30, 0.01).name("强度");
  folderBase.addColor(light, "color").name("颜色");
};
