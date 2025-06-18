import { editorInstance } from "@/three/EditorInstance";
import { Group } from "three";

export default function meshGroupGUI(group: Group) {
  const editor = editorInstance.getEditor();
  const folder = editor.createGUI("组"); // 添加旋转控件，将度转换为弧度
  const min = 0;
  const max = 360;
  const step = 0.1;
  const pi = Math.PI / 180;
  const lastToken = "轴";
  const positionFolder = folder.addFolder("位置");
  positionFolder
    .add(group.position, "x", -500, 500, 0.001)
    .name(`X${lastToken}`);

  positionFolder
    .add(group.position, "y", -500, 500, 0.001)
    .name(`Y${lastToken}`);

  positionFolder
    .add(group.position, "z", -500, 500, 0.001)
    .name(`Z${lastToken}`);
  const rotationFolder = folder.addFolder("旋转");

  rotationFolder
    .add(group.rotation, "x", min * pi, max * pi, step * pi)
    .name(`X${lastToken}`);
  rotationFolder
    .add(group.rotation, "y", min * pi, max * pi, step * pi)
    .name(`Y${lastToken}`);
  rotationFolder
    .add(group.rotation, "z", min * pi, max * pi, step * pi)
    .name(`Z${lastToken}`);

  const scaleFolder = folder.addFolder("缩放");
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
    .add(group.scale, "x", -50, 50, 0.001)
    .name(`X${lastToken}`)
    .onChange(() => {
      if (lockYZ.isLock) {
        scaleY.setValue(group.scale.x);
        scaleZ.setValue(group.scale.x);
      }
    });
  const scaleY = scaleFolder
    .add(group.scale, "y", -50, 50, 0.001)
    .name(`Y${lastToken}`)
    .disable(lockYZ.isLock);
  const scaleZ = scaleFolder
    .add(group.scale, "z", -50, 50, 0.001)
    .name(`Z${lastToken}`)
    .disable(lockYZ.isLock);
}
