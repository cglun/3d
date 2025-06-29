import { Object3D } from "three";
import { editorInstance } from "@/three/instance/EditorInstance";
import { CMD, Command } from "@/three/command/Command";
import { GROUP } from "@/three/config/CONSTANT";
//物体变换命令，针对物体的位置、旋转、缩放进行变换
export function transformCMD(
  value: Object3D,
  guiUpdate: (obj: Object3D) => void
) {
  const lastTransform = {
    position: value.position.clone(),
    rotation: value.rotation.clone(),
    scale: value.scale.clone(),
  };

  editorInstance.executeCommand(
    new Command(
      () => {
        // 使用 copy 方法更新属性值
        value.position.copy(lastTransform.position);
        value.rotation.copy(lastTransform.rotation);
        value.scale.copy(lastTransform.scale);
        guiUpdate(value);
      },
      CMD.transform,
      value.name,
      value.parent?.name ?? GROUP.NONE
    )
  );
}
