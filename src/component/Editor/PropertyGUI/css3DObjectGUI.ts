import { CSS3DObject } from "three/addons/renderers/CSS3DRenderer.js";
import positionGUI from "@/component/Editor/PropertyGUI/commonGUI/positionGUI";
import { transformCMD } from "@/three/command/cmd";
import rotationGUI from "./commonGUI/rotationGUI";
import scaleGUI from "./commonGUI/scaleGUI";
import ModalConfirm3d from "@/component/common/ModalConfirm3d";
import { Scene } from "three";
import { getEditorInstance } from "@/three/utils/utils";
import deleteButtonGUI from "./deleteButtonGUI/deleteButtonGUI";

export default function css3DObjectGUI(
  object: CSS3DObject,
  updateScene: (scene: Scene) => void
) {
  const { editor, scene } = getEditorInstance();
  const folder = editor.createGUI("标签组").onFinishChange(() => {
    transformCMD(object, () => css3DObjectGUI(object, updateScene));
  });

  const fun = {
    delButton: () => {
      ModalConfirm3d(
        {
          title: "删除步骤",
          body: `确认删除${object.name}吗？`,
          confirmButton: {
            show: true,
            hasButton: true,
            closeButton: true,
          },
        },
        () => {
          editor.transformControl.detach(); // 取消选中,不然会报错
          object.removeFromParent();
          folder.destroy();
          updateScene(scene);
        }
      );
    },
  };

  deleteButtonGUI(fun, folder, "图片");

  folder.add(object, "name").name("标签名");
  positionGUI(folder, object, -50, 50, 0.01);
  rotationGUI(folder, object);
  scaleGUI(folder, object, 0, 1, 0.001);

  return folder;
}
