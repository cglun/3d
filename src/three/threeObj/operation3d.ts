import { getToggleButtonGroup } from "@/viewer3d/buttonList/buttonGroup";
import { getViewerInstance } from "../utils/utils";
import { Object3D } from "three";

export function clickModel(model: Object3D) {
  const { viewer } = getViewerInstance();

  const list = getToggleButtonGroup();
  list[1].handler("huojia");
  //viewer.outlinePass.selectedObjects = [model];

  if (model.parent?.name.includes("box_")) {
    viewer.labelInfoPanelController.setModelName(model.name);

    window.ObjectEditor3d = {
      ...window.ObjectEditor3d,
      HUOJIA_NAME: model.name,
    };
    // window.ObjectEditor3d.lightBox();
    //点亮货件
    viewer.outlinePass.selectedObjects = [];
    const list = new Set();
    const { rows } = window.ObjectEditor3d["GLOBAL_DATA_TO3D"];
    // const { HUOJIA_NAME, BOX_NAME } = window.ObjectEditor3d;
    // const boxname = HUOJIA_NAME + "-" + BOX_NAME;
    rows.forEach((item: any) => {
      list.add(item.yx_location_code);
    });

    list.forEach((item: any) => {
      const newName = item.split("-");
      if (newName[0] === model.name) {
        const obj = viewer.scene.getObjectByName(`${newName[2]}-${newName[1]}`);
        if (obj) {
          viewer.outlinePass.selectedObjects.push(obj);
        }
      }
    });
  }

  if (model.parent?.name.includes("huojia")) {
    viewer.outlinePass.selectedObjects = [model];

    window.ObjectEditor3d = {
      ...window.ObjectEditor3d,
      BOX_NAME: model.name,
    };
    // const newName = model.name.split("-");

    // const obj = viewer.scene.getObjectByName(`${newName[1]}-${newName[0]}`);
    // if (obj) {
    //   viewer.outlinePass.selectedObjects.push(obj);
    // }

    //window.ObjectEditor3d.setDetail();

    window.ObjectEditor3d.output1();
  }

  // 点击货件后，设置货件为选中状态'
  // const name = "ab-b";
  // const newName = name.split("-");
  // viewer.scene.getObjectByName(`${newName[1]}-${newName[2]}`);

  viewer.mitt.on("selectObject", (obj) => {
    console.log("监听到选中模型", obj);
  });
}
// ***/

function abc(store: any) {
  const testPosition = "02-004-004";
  const newName = testPosition.split("-");

  const box = newName[2] + "-" + newName[1];
  //打开货架
  const model = store.viewer.scene.getObjectByName(box);
  if (model) {
    store.viewer.getToggleButtonGroup[1].handler("huojia");
    store.viewer.outlinePass.selectedObjects.push(box);
    store.viewer.LabelInfoPanelController.showLabel();
  }
}
