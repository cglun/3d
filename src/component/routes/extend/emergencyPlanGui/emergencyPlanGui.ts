import { Group, Mesh, Scene } from "three";

import { transformCMD } from "@/three/command/cmd";
import { getEditorInstance } from "@/three/utils/utils";

export default function emergencyPlanGui(
  group: Group | Mesh,
  updateScene: (scene: Scene) => void
) {
  const { editor, scene } = getEditorInstance();
  const folder = editor.createGUI("组").onFinishChange(() => {
    transformCMD(group, () => emergencyPlanGui(group, updateScene));
  }); // 添加旋转控件，将度转换为弧度
  folder.add(group, "name").name("预案名称");
  const fun = {
    addButton: () => {
      const step = new Group();
      step.name = "步骤" + (group.children.length + 1);
      group.add(step);
      updateScene(scene);
    },
  };

  folder.add(fun, "addButton").name("增加步骤");
}
