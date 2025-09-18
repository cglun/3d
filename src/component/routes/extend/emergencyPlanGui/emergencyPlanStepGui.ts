import { Group, Mesh, Scene } from "three";
import { transformCMD } from "@/three/command/cmd";
import { getEditorInstance } from "@/three/utils/utils";
import { EmergencyImage } from "@/viewer3d/label/EmergencyImage";
import { userCssStyle } from "@/three/config/Three3dConfig";
import getPageList from "@/app/httpRequest";
import { errorMessage } from "@/app/utils";
import { MessageError } from "@/app/type";
import { loadAssets } from "@/app/http";
import positionGUI from "@/component/Editor/PropertyGUI/commonGUI/positionGUI";
import rotationGUI from "@/component/Editor/PropertyGUI/commonGUI/rotationGUI";
import scaleGUI from "@/component/Editor/PropertyGUI/commonGUI/scaleGUI";
export default function emergencyPlanStepGui(
  group: Group | Mesh,
  updateScene?: (scene: Scene) => void
) {
  const { editor, scene } = getEditorInstance();
  const folder = editor.createGUI("组").onFinishChange(() => {
    transformCMD(group, () => emergencyPlanStepGui(group, updateScene));
  });
  folder.add(group, "name").name("步骤名称"); // 步骤名称不可编辑
  const folderStep = folder.addFolder("变换").close();
  positionGUI(folderStep, group, -50, 50, 0.01);
  rotationGUI(folderStep, group);
  scaleGUI(folderStep, group, -50, 50, 0.001);

  const div = document.createElement("div");

  folderStep.domElement.appendChild(div);
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
            updateScene?.(scene);
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
