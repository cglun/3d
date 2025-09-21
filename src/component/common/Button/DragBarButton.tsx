import { getThemeByScene } from "@/three/utils/util4UI";
import Button from "react-bootstrap/esm/Button";
import ButtonGroup from "react-bootstrap/esm/ButtonGroup";
import Icon from "@/component/common/Icon";
import { ButtonGroupStyle } from "@/three/config/Three3dConfig";
import groupBaseGUI from "@/component/routes/common/buttonGUI/groupBaseGUI";
import { getEditorInstance } from "@/three/utils/utils";
import { updateEmergencyPlan } from "@/app/utils";
import { GROUP } from "@/three/config/CONSTANT";
import { Group, Scene } from "three";
import { emergencyButton } from "@/component/routes/extend/extendButton/EmergencyButtonType";
import { getButtonPosition } from "@/component/routes/effects/utils";
import { useUpdateScene } from "@/app/hooks";

export default function DragBarButton({
  buttonGroupStyle,
  scene,
  emergencyGroup,
}: {
  buttonGroupStyle: ButtonGroupStyle;
  scene: Scene;
  emergencyGroup: Group;
}) {
  const { updateScene } = useUpdateScene();
  const { themeColor } = getThemeByScene(scene);
  function handleClick() {
    const { editor } = getEditorInstance();
    const folder = editor.createGUI("按钮组").onChange(() => {
      updateEmergencyPlan();
    });

    folder.add(emergencyGroup, "name").name("名称").disable(true);

    folder
      .add(emergencyGroup.userData.buttonGroupStyle, "enable")
      .name("显示")
      .onFinishChange(() => {
        updateEmergencyPlan();
      });

    groupBaseGUI(folder, buttonGroupStyle);
  }

  return (
    <ButtonGroup size="sm">
      <Button
        style={{
          cursor: "move",
        }}
        variant={themeColor}
        onClick={handleClick}
        draggable={true}
        onDragStart={handleClick}
        onDragEnd={(e) => {
          const { editor } = getEditorInstance();
          const { top, left } = getButtonPosition(e, editor.divElement);
          buttonGroupStyle.left = left * 100;
          buttonGroupStyle.top = top * 100;
          updateEmergencyPlan();
        }}
      >
        预案
      </Button>
      <Button
        variant={themeColor}
        onClick={() => {
          emergencyGroup.userData.buttonGroupStyle.enable =
            !emergencyGroup.userData.buttonGroupStyle.enable;
          updateEmergencyPlan();
        }}
      >
        <Icon
          iconName={
            emergencyGroup.userData.buttonGroupStyle.enable
              ? "eye"
              : "eye-slash"
          }
          title={"显示与隐藏"}
        />
      </Button>
      <Button
        variant={themeColor}
        onMouseEnter={() => {}}
        onClick={() => {
          const { editor } = getEditorInstance();
          //   navigate({
          //     to: navigateToUrl("extend"),
          //   });
          const emergencyPlan = editor.EMERGENCY_PLAN_GROUP;
          const group = editor.scene.getObjectByName(GROUP.EMERGENCY_PLAN);
          if (!group) {
            scene.add(emergencyPlan);
          }

          const group1 = new Group();
          group1.name = "预案" + (emergencyPlan.children.length + 1);
          group1.userData.buttonBase = { ...emergencyButton };
          emergencyPlan.add(group1);
          editor.scene.add(emergencyPlan);
          //updateEmergencyPlan();
          updateScene(editor.scene);
        }}
      >
        <Icon iconName="plus-square" title="添加预案" />
      </Button>
    </ButtonGroup>
  );
}
