import { Object3D } from "three";

import { Accordion, Card, ListGroup } from "react-bootstrap";

import Property3d from "@/component/Editor/Property3d/Index";
import TreeList from "@/component/Editor/TreeList";
import { useUpdateScene } from "@/app/hooks";
import { OutlineViewCamera } from "@/component/Editor/OutlineView/OutlineViewCamera";
import { OutlineViewScene } from "@/component/Editor/OutlineView/OutlineViewScene";

import Icon from "@/component/common/Icon";
import { styleHeader } from "@/component/Editor/OutlineView/fontColor";

import { GLOBAL_CONSTANT } from "@/three/GLOBAL_CONSTANT";

export default function Index() {
  const gap = 1;
  const { scene } = useUpdateScene();

  if (!scene.children) {
    return null;
  }

  let LIGHT_GROUP: Object3D[] = [];
  let MODEL_GROUP: Object3D[] = [];

  // if (scene.getObjectByName instanceof Function) {
  //   LIGHT_GROUP = scene.getObjectByName("LIGHT_GROUP")?.children || [];
  //   MODEL_GROUP = scene.getObjectByName("MODEL_GROUP")?.children || [];
  // }

  const array = scene.children;

  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    if (element.name === GLOBAL_CONSTANT.LIGHT_GROUP) {
      element.children.forEach((item) => {
        LIGHT_GROUP.push(item);
      });
    }
    if (element.name === GLOBAL_CONSTANT.MODEL_GROUP) {
      element.children.forEach((item) => {
        MODEL_GROUP.push(item);
      });
    }
  }

  return (
    <Accordion defaultActiveKey={["0", "1"]} alwaysOpen style={{}}>
      <Accordion.Item eventKey="0">
        <Accordion.Header>
          <Icon iconName="archive" gap={gap} />
          大纲
        </Accordion.Header>
        <Accordion.Body className="outline-view">
          <Card>
            <Card.Header className="text-center" style={styleHeader}>
              <Icon iconName="camera-reels" gap={gap} title="相机" />
            </Card.Header>
            <Card.Body>
              <ListGroup>
                <OutlineViewCamera />
              </ListGroup>
            </Card.Body>
          </Card>
          <Card>
            <Card.Header className="text-center" style={styleHeader}>
              <Icon iconName="box2" gap={gap} title=" 场景" />
            </Card.Header>
            <Card.Body>
              <ListGroup>
                <OutlineViewScene />
              </ListGroup>
            </Card.Body>
          </Card>
          <Card>
            <Card.Header className="text-center" style={styleHeader}>
              <Icon iconName="lightbulb" gap={gap} title="灯光" />
            </Card.Header>
            <Card.Body>
              <ListGroup className="da-gang">
                {LIGHT_GROUP.length > 0 && <TreeList data={LIGHT_GROUP} />}
              </ListGroup>
            </Card.Body>
          </Card>
          <Card>
            <Card.Header className="text-center" style={styleHeader}>
              <Icon iconName="box" gap={gap} title="模型" />
            </Card.Header>
            <Card.Body>
              <ListGroup className="da-gang">
                {MODEL_GROUP.length > 0 && <TreeList data={MODEL_GROUP} />}
              </ListGroup>
            </Card.Body>
          </Card>
        </Accordion.Body>
      </Accordion.Item>
      <Property3d />
    </Accordion>
  );
}
