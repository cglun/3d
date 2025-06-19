import { Object3D } from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
export default function scaleGUI(
  parentFolder: GUI,
  object: Object3D,
  min: number,
  max: number,
  step: number
) {
  const lastToken = "轴";

  const scaleFolder = parentFolder.addFolder("缩放");
  const lockYZ = {
    isLock: true,
  };

  scaleFolder
    .add(lockYZ, "isLock")
    .onChange((value) => {
      scaleY.disable(value);
      scaleZ.disable(value);
    })
    .name("锁定YZ轴");
  scaleFolder
    .add(object.scale, "x", min, max, step)
    .name(`X${lastToken}`)
    .onChange(() => {
      if (lockYZ.isLock) {
        scaleY.setValue(object.scale.x);
        scaleZ.setValue(object.scale.x);
      }
    });
  const scaleY = scaleFolder
    .add(object.scale, "y", min, max, step)
    .name(`Y${lastToken}`)
    .disable(lockYZ.isLock);
  const scaleZ = scaleFolder
    .add(object.scale, "z", min, max, step)
    .name(`Z${lastToken}`)
    .disable(lockYZ.isLock);
}
