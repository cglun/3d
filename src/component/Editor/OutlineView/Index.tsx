import { Group, Object3D } from "three";
import Accordion from "react-bootstrap/esm/Accordion";
import ListGroupItem from "react-bootstrap/esm/ListGroupItem";
import Card from "react-bootstrap/esm/Card";
import ListGroup from "react-bootstrap/esm/ListGroup";
import Property3d from "@/component/Editor/PropertyGUI/Index";
import TreeList from "@/component/common/TreeList";
import { useUpdateScene } from "@/app/hooks";
import { OutlineViewCamera } from "@/component/Editor/OutlineView/OutlineViewCamera";
import { OutlineViewScene } from "@/component/Editor/OutlineView/OutlineViewScene";

import Icon from "@/component/common/Icon";
import { styleHeader } from "@/component/Editor/OutlineView/fontColor";

import { GROUP } from "@/three/config/CONSTANT";
import { APP_COLOR } from "@/app/type";
import { Button, ButtonGroup } from "react-bootstrap";
import { getEditorInstance } from "@/three/utils/utils";
import { getThemeByScene } from "@/three/utils/util4UI";
import { useNavigate } from "@tanstack/react-router";
import { navigateToUrl, updateEmergencyPlan } from "@/app/utils";
import { useState } from "react";

// import { editor } from "monaco-editor";
// import { editorInstance } from "@/three/EditorInstance";

export default function Index() {
  const gap = 1;
  const { scene, updateScene } = useUpdateScene();
  const [isEmergencyPlanVisible, setIsEmergencyPlanVisible] = useState(false);
  const { themeColor } = getThemeByScene(scene);
  const navigate = useNavigate();
  let LIGHT_GROUP: Object3D[] = [];
  let MODEL_GROUP: Object3D[] = [];
  let MARK_LABEL_GROUP: Object3D[] = [];
  let GEOMETRY: Object3D[] = [];
  let EMERGENCY_PLAN_GROUP: Object3D[] = [];
  let enableEmergency = false;
  const array = scene.children;

  for (let index = 0; index < array.length; index++) {
    const { name, children } = array[index];
    switch (name) {
      case GROUP.LIGHT:
        LIGHT_GROUP = getGroupByName(children);
        break;
      case GROUP.MODEL:
        MODEL_GROUP = getGroupByName(children);
        break;
      case GROUP.MARK_LABEL:
        MARK_LABEL_GROUP = getGroupByName(children);
        break;
      case GROUP.GEOMETRY:
        GEOMETRY = getGroupByName(children);
        break;
      case GROUP.EMERGENCY_PLAN:
        EMERGENCY_PLAN_GROUP = getGroupByName(children);
        enableEmergency = array[index].userData.enableEMERGENCY_PLAN_GROUP;
        break;
      default:
        break;
    }
  }

  function getGroupByName(children: Object3D[]) {
    const arr: Object3D[] = [];
    children.forEach((item) => {
      arr.push(item);
    });
    return arr;
  }

  return (
    <Accordion defaultActiveKey={["0", "1"]} alwaysOpen style={{}}>
      <Accordion.Item eventKey="0">
        <Accordion.Header>
          <Icon iconName="archive" gap={gap} />
          大纲
        </Accordion.Header>
        <Accordion.Body className="outline-view">
          <CardItem
            icon={
              <>
                <Icon iconName="camera-reels" gap={gap} title="相机" />
                <Icon iconName="box2" gap={gap} title="场景" />
              </>
            }
            groupBody={
              <>
                <OutlineViewCamera />
                <OutlineViewScene />
              </>
            }
          />

          <CardItem
            icon={<Icon iconName="lightbulb" gap={gap} title="灯光" />}
            groupBody={TreeListShow(LIGHT_GROUP)}
          />
          <CardItem
            icon={<Icon iconName="bi bi-boxes" gap={gap} title="模型" />}
            groupBody={TreeListShow(MODEL_GROUP)}
          />
          <CardItem
            icon={<Icon iconName="pin-map" gap={gap} title="标签" />}
            groupBody={TreeListShow(MARK_LABEL_GROUP)}
          />
          <CardItem
            icon={<Icon iconName="menu-button" gap={gap} title="预案" />}
            groupBody={
              <>
                <ButtonGroup size="sm">
                  <Button
                    variant={themeColor}
                    onClick={() => {
                      const { editor, scene } = getEditorInstance();
                      navigate({
                        to: navigateToUrl("extend"),
                      });
                      const emergencyPlan = editor.EMERGENCY_PLAN_GROUP;
                      const group = scene.getObjectByName(GROUP.EMERGENCY_PLAN);
                      if (!group) {
                        scene.add(emergencyPlan);
                      }

                      const group1 = new Group();
                      group1.name =
                        "预案" + (emergencyPlan.children.length + 1);
                      group1.userData.showChildren = false;
                      emergencyPlan.add(group1);
                      scene.add(emergencyPlan);
                      updateEmergencyPlan();
                      updateScene(scene);
                    }}
                  >
                    <Icon
                      iconName="plus-circle"
                      gap={1}
                      fontSize={0.8}
                      title="添加预案"
                    />
                  </Button>
                  <Button
                    variant={themeColor}
                    onClick={() => {
                      navigate({
                        to: navigateToUrl("extend"),
                      });
                    }}
                  >
                    <Icon
                      iconName="bi bi-css"
                      gap={1}
                      fontSize={0.8}
                      title="按钮样式"
                    />
                  </Button>
                  <Button
                    variant={themeColor}
                    onClick={() => {
                      navigate({
                        to: navigateToUrl("extend"),
                      });
                      const { editor } = getEditorInstance();
                      const emergencyPlan = editor.EMERGENCY_PLAN_GROUP;
                      emergencyPlan?.traverse((child) => {
                        child.userData.showChildren = !isEmergencyPlanVisible;
                        child.visible = !isEmergencyPlanVisible;
                      });
                      setIsEmergencyPlanVisible(!isEmergencyPlanVisible);
                      updateEmergencyPlan();
                    }}
                  >
                    <Icon
                      iconName={isEmergencyPlanVisible ? "eye" : "eye-slash"}
                      gap={1}
                      fontSize={0.8}
                      title="全部显示"
                    />
                  </Button>

                  <Button
                    variant={themeColor}
                    onClick={() => {
                      const { editor } = getEditorInstance();
                      navigate({
                        to: navigateToUrl("extend"),
                      });
                      const emergencyPlan = editor.EMERGENCY_PLAN_GROUP;
                      emergencyPlan.userData.enableEMERGENCY_PLAN_GROUP =
                        !emergencyPlan.userData.enableEMERGENCY_PLAN_GROUP;
                      updateEmergencyPlan();
                      updateScene(editor.scene);
                    }}
                  >
                    <Icon
                      iconName={
                        enableEmergency ? "bi bi-toggle-on" : "bi bi-toggle-off"
                      }
                      gap={1}
                      fontSize={0.8}
                      title="启用/禁用"
                    />
                  </Button>
                </ButtonGroup>
                {TreeListShow(EMERGENCY_PLAN_GROUP)}
              </>
            }
          />
          <CardItem
            icon={<Icon iconName="box" gap={gap} title="几何体" />}
            groupBody={TreeListShow(GEOMETRY)}
          />
        </Accordion.Body>
      </Accordion.Item>
      <Property3d />
    </Accordion>
  );
}

function TreeListShow(group: Object3D[]) {
  if (group.length) {
    return <TreeList data={group} />;
  }
  return (
    <ListGroupItem style={{ cursor: "initial" }}>
      <span className={`text-${APP_COLOR.Secondary}`}> 空</span>
    </ListGroupItem>
  );
}

function CardItem({
  icon,
  groupBody,
}: {
  icon: JSX.Element;
  groupBody: JSX.Element;
}) {
  return (
    <Card>
      <Card.Header className="text-center" style={styleHeader}>
        {icon}
      </Card.Header>
      <Card.Body>
        <ListGroup>{groupBody}</ListGroup>
      </Card.Body>
    </Card>
  );
}
