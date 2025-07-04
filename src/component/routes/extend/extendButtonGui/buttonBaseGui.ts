import { Scene } from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { editorInstance } from "@/three/instance/EditorInstance";
import { ActionItemBase } from "@/app/type";
import { _confirmButton } from "@/component/common/ModalConfirmUtils";
import ModalConfirm3d from "@/component/common/ModalConfirm3d";
export default function buttonBaseGui(
  folder: GUI,
  updateScene: (scene: Scene) => void,
  listGroup: ActionItemBase[],
  index: number
) {
  const editor = editorInstance.getEditor();
  const button = listGroup[index];
  listGroup.forEach((item: ActionItemBase) => {
    item.isClick = false;
  });
  const funcDel = {
    deleteButton: () => {
      ModalConfirm3d(
        {
          title: "删除按钮",
          body: `删除【${button.showName}】吗？`,
        },
        () => {
          listGroup.splice(index, 1);
          editor.destroyGUI();
          updateScene(editor.scene);
        }
      );
    },
  };

  const delFolder = folder.add(funcDel, "deleteButton").name("删除按钮")
    .domElement.children[0].children[0].children[0] as HTMLElement;
  delFolder.style.color = "rgb(220, 53, 69)";

  folder
    .add(button, "showName")
    .name("名称")
    .onChange(() => {
      updateScene(editor.scene);
    });
  const styleFolder = folder.addFolder("样式");
  styleFolder.add(button.style, "offsetHeight").name("高度偏移");
  styleFolder.add(button.style, "offsetWidth").name("宽度偏移");
  folder.add(button, "NAME_ID").name("按钮Id").disable(true);
}

// const userSettingFolder = folder.addFolder("用户设置");
// userSettingFolder.add(item.userSetting, "animationTime").name("动画时间");
// userSettingFolder.add(item.userSetting, "modelOffset").name("模型偏移");
// userSettingFolder.add(item.userSetting, "cameraOffset").name("相机偏移");
// userSettingFolder.add(item.userSetting, "speed").name("速度");
// userSettingFolder.add(item.userSetting, "offset").name("偏移");
// userSettingFolder.add(item.userSetting, "radius").name("半径");
// userSettingFolder.add(item.userSetting, "tension").name("张力");
