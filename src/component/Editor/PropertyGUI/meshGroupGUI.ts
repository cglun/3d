import { editorInstance } from "@/three/instance/EditorInstance";
import { Group, Mesh } from "three";
import positionGUI from "@/component/Editor/PropertyGUI/commonGUI/positionGUI";
import scaleGUI from "@/component/Editor/PropertyGUI/commonGUI/scaleGUI";
import rotationGUI from "@/component/Editor/PropertyGUI/commonGUI/rotationGUI";
import { transformCMD } from "@/three/command/cmd";

export default function meshGroupGUI(group: Group | Mesh) {
  const editor = editorInstance.getEditor();
  const folder = editor.createGUI("模型组").onFinishChange(() => {
    transformCMD(group, () => meshGroupGUI(group));
  }); // 添加旋转控件，将度转换为弧度
  folder.add(group, "name").name("模型名称");

  positionGUI(folder, group, -50, 50, 0.01);
  rotationGUI(folder, group);
  scaleGUI(folder, group, -50, 50, 0.001);

  // const scaleFolder = folder.addFolder("缩放");
  // const lockYZ = {
  //   isLock: true,
  // };

  // scaleFolder
  //   .add(lockYZ, "isLock")
  //   .onChange((value) => {
  //     scaleY.disable(value);
  //     scaleZ.disable(value);
  //   })
  //   .name("锁定YZ轴");
  // scaleFolder
  //   .add(group.scale, "x", -50, 50, 0.001)
  //   .name(`X${lastToken}`)
  //   .onChange(() => {
  //     if (lockYZ.isLock) {
  //       scaleY.setValue(group.scale.x);
  //       scaleZ.setValue(group.scale.x);
  //     }
  //   });
  // const scaleY = scaleFolder
  //   .add(group.scale, "y", -50, 50, 0.001)
  //   .name(`Y${lastToken}`)
  //   .disable(lockYZ.isLock);
  // const scaleZ = scaleFolder
  //   .add(group.scale, "z", -50, 50, 0.001)
  //   .name(`Z${lastToken}`)
  //   .disable(lockYZ.isLock);
}
