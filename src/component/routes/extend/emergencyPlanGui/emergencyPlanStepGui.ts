import { Group, Mesh, Scene } from "three";

import { transformCMD } from "@/three/command/cmd";
import { getEditorInstance } from "@/three/utils/utils";
import { EmergencyImage } from "@/viewer3d/label/EmergencyImage";
import { userCssStyle } from "@/three/config/Three3dConfig";
import ModalConfirm3d from "@/component/common/ModalConfirm3d";
import deleteButtonGUI from "@/component/Editor/PropertyGUI/deleteButtonGUI/deleteButtonGUI";
import { removeRecursively } from "@/three/utils/util4Scene";
import getPageList from "@/app/httpRequest";
import { errorMessage } from "@/app/utils";
import { MessageError } from "@/app/type";
import { loadAssets } from "@/app/http";

export default function emergencyPlanStepGui(
  group: Group | Mesh,
  updateScene: (scene: Scene) => void
) {
  const { editor, scene } = getEditorInstance();
  const folder = editor.createGUI("组").onFinishChange(() => {
    transformCMD(group, () => emergencyPlanStepGui(group, updateScene));
  });
  folder.add(group, "name").name("步骤名称"); // 步骤名称不可编辑
  const fun = {
    addButton: () => {
      const label = new EmergencyImage(
        { markName: "name" },
        { ...userCssStyle }
      );
      group.add(label.css3DSprite);
      updateScene(scene);
    },
    delButton: () => {
      ModalConfirm3d(
        {
          title: "删除步骤",
          body: `确认删除${group.name}吗？`,
          confirmButton: {
            show: true,
            hasButton: true,
            closeButton: true,
          },
        },
        () => {
          editor.transformControl.detach(); // 取消选中,不然会报错

          removeRecursively(group);
          folder.destroy();
          updateScene(scene);
        }
      );
    },
  };

  deleteButtonGUI(fun, folder, "步骤"); // folder.add(fun, "addButton").name("添加图片");
  const div = document.createElement("div");

  folder.domElement.appendChild(div);
  //默认图片
  const defaultImage3dUrl = new URL(
    "@static/images/defaultImage3d.png",
    import.meta.url
  ).href;
  //const cardBody = item.cover?.trim().length > 0 ? cardBodyImg : defaultImage3d;

  getPageList({ name: "3D_PROJECT", type: "Image", description: "图片" })
    .then((res) => {
      if (Array.isArray(res)) {
        res.forEach((item) => {
          const img = document.createElement("img");
          img.src = loadAssets(item.cover?.trim() || defaultImage3dUrl);
          img.style.width = "33.33%";
          img.addEventListener("click", () => {
            const { currentSelected3d } = getEditorInstance().editor;
            const label = new EmergencyImage(
              { markName: item.name || "名称" },
              {
                ...userCssStyle,
                cardBackgroundUrl: loadAssets(item.cover),
              }
            );

            currentSelected3d.add(label.css3DSprite);
            updateScene(scene);
          });
          div.appendChild(img);
        });
      }
    })
    .catch((error: MessageError) => {
      errorMessage(error);
      if (typeof error === "string") {
        alert(error);
      }
    });
}
