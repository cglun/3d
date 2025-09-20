import { useUpdateScene } from "@/app/hooks";
import { getThemeByScene } from "@/three/utils/util4UI";

import Button from "react-bootstrap/esm/Button";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import ButtonGroup from "react-bootstrap/esm/ButtonGroup";
import Icon from "@/component/common/Icon";
import { ButtonGroupStyle } from "@/three/config/Three3dConfig";
import groupBaseGUI from "@/component/routes/common/buttonGUI/groupBaseGUI";
import { getEditorInstance } from "@/three/utils/utils";
import { updateEmergencyPlan } from "@/app/utils";
import { GROUP } from "@/three/config/CONSTANT";
import { Group, Scene } from "three";
import { emergencyButton } from "@/component/routes/extend/extendButton/EmergencyButtonType";

export default function DragBarButton({
  buttonGroupStyle,
  scene,
}: {
  buttonGroupStyle: ButtonGroupStyle;
  scene: Scene;
}) {
  const { themeColor } = getThemeByScene(scene);
  return (
    <ButtonGroup>
      <Button
        variant={themeColor}
        size="sm"
        onClick={() => {
          const { editor } = getEditorInstance();
          const folder = editor.createGUI("按钮组").onChange(() => {
            updateEmergencyPlan();
            console.log(editor.scene.children);
          });
          groupBaseGUI(folder, buttonGroupStyle);
        }}
        draggable={true}
        onDragStart={() => {}}
        onDragEnd={(e) => {}}
      >
        <Icon iconName="bi bi-arrows-move" gap={1} title={""} />
      </Button>
      <Button
        variant={themeColor}
        size="sm"
        onMouseEnter={() => {}}
        onClick={() => {
          const { editor, scene } = getEditorInstance();
          //   navigate({
          //     to: navigateToUrl("extend"),
          //   });
          const emergencyPlan = editor.EMERGENCY_PLAN_GROUP;
          const group = scene.getObjectByName(GROUP.EMERGENCY_PLAN);
          if (!group) {
            scene.add(emergencyPlan);
          }

          const group1 = new Group();
          group1.name = "预案" + (emergencyPlan.children.length + 1);
          group1.userData = {
            ...emergencyButton,
          };
          emergencyPlan.add(group1);
          scene.add(emergencyPlan);
          updateEmergencyPlan();
          // updateScene(scene);
        }}
      >
        <Icon iconName="plus-square" title="添加预案" />
      </Button>
    </ButtonGroup>
  );
}
