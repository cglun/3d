import { Object3D } from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
export default function positionGUI(
  parentFolder: GUI,
  object: Object3D,
  min: number,
  max: number,
  step: number
) {
  const lastToken = "轴";

  const positionFolder = parentFolder.addFolder("位置");
  positionFolder
    .add(object.position, "x", min, max, step)
    .name(`X${lastToken}`);

  positionFolder
    .add(object.position, "y", min, max, step)
    .name(`Y${lastToken}`);
  positionFolder
    .add(object.position, "z", min, max, step)
    .name(`Z${lastToken}`);
  return positionFolder;
}
