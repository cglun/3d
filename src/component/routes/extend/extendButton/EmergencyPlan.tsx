import Button from "react-bootstrap/esm/Button";
import ButtonGroup from "react-bootstrap/esm/ButtonGroup";
import ListGroup from "react-bootstrap/esm/ListGroup";
import ListGroupItem from "react-bootstrap/esm/ListGroupItem";
import {
  buttonGroupStyleInit,
  CustomButtonItem2,
} from "@/three/config/Three3dConfig";
import Icon from "@/component/common/Icon";

import { getEditorInstance } from "@/three/utils/utils";
import { useUpdateScene } from "@/app/hooks";
import { APP_COLOR } from "@/app/type";
import { Group } from "three";
import { GROUP } from "@/three/config/CONSTANT";
export default function EmergencyPlan() {
  const { updateScene } = useUpdateScene();
  return (
    <ListGroup>
      <ListGroupItem>
        <ButtonGroup size="sm" className="me-2">
          <Button
            variant={APP_COLOR.Success}
            onClick={() => {
              const { editor, scene } = getEditorInstance();
              const emergencyPlan = editor.EMERGENCY_PLAN_GROUP;
              const group = scene.getObjectByName(GROUP.EMERGENCY_PLAN);
              if (!group) {
                scene.add(emergencyPlan);
              }

              const group1 = new Group();
              group1.name = "预案" + emergencyPlan.children.length;

              emergencyPlan.add(group1);
              scene.add(emergencyPlan);
              updateScene(scene);
            }}
          >
            <Icon iconName="plus-circle" gap={1} fontSize={1} />
            预案
          </Button>
        </ButtonGroup>
      </ListGroupItem>
    </ListGroup>
  );
}
