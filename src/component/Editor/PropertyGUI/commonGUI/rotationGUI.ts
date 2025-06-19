import { Object3D } from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
export default function rotationGUI(parentFolder: GUI, object: Object3D) {
  const min = 0;
  const max = 2;
  const step = 0.001;
  const lastToken = "轴";
  const pi = Math.PI;
  const rotationFolder = parentFolder.addFolder("旋转");
  rotationFolder
    .add(object.rotation, "x", min * pi, max * pi, step * pi)
    .name(`X${lastToken}`);
  rotationFolder
    .add(object.rotation, "y", min * pi, max * pi, step * pi)
    .name(`Y${lastToken}`);
  rotationFolder
    .add(object.rotation, "z", min * pi, max * pi, step * pi)
    .name(`Z${lastToken}`);
}
