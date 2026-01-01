import { editorInstance } from "@/three/instance/EditorInstance";

import positionGUI from "@/component/Editor/PropertyGUI/commonGUI/positionGUI";
import { transformCMD } from "@/three/command/cmd";
import { getEditorInstance } from "@/three/utils/utils";
import { MarkLabel } from "@/viewer3d/label/MarkLabel";
import Toast3d from "@/component/common/Toast3d/Toast3d";
import { MITT_EVENT } from "@/app/mittIns";
import { Group } from "three/src/objects/Group.js";
import rotationGUI from "@/component/Editor/PropertyGUI/commonGUI/rotationGUI";
import scaleGUI from "@/component/Editor/PropertyGUI/commonGUI/scaleGUI";

export default function markGroupGUI(object: Group) {
  const editor = editorInstance.getEditor();
  const folder = editor.createGUI("标签组").onFinishChange(() => {
    transformCMD(object, () => markGroupGUI(object));
  });
  folder.add(object, "name").name("标签组名");
  const fun = {
    addButton: () => {
      const { editor, scene } = getEditorInstance();

      const label = new MarkLabel(scene, {
        markName: `标签-${object.children.length}`,
        logo: "geo-alt",
        showEye: false,
        tourObject: {
          id: "id",
          title: "title",
        },
      });

      editor.currentSelected3d.add(label.css3DSprite);
      editor.mitt.emit(MITT_EVENT.UPDATE_SCENE);
      Toast3d("添加成功");
    },
  };

  folder.add(fun, "addButton").name("增加标签");

  positionGUI(folder, object, -50, 50, 0.01);
  rotationGUI(folder, object);
  scaleGUI(folder, object, -50, 50, 0.001);

  return folder;
}
