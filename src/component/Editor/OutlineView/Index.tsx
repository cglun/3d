import { Object3D } from "three";

import { Accordion, Card, ListGroup } from "react-bootstrap";

import Property3d from "@/component/Editor/Property3d/Index";
import TreeList from "@/component/Editor/TreeList";
import { useUpdateScene } from "@/app/hooks";
import { OutlineViewCamera } from "@/component/Editor/OutlineView/OutlineViewCamera";
import { OutlineViewScene } from "@/component/Editor/OutlineView/OutlineViewScene";

import Icon from "@/component/common/Icon";
import { styleHeader } from "@/component/Editor/OutlineView/fontColor";

export default function Index() {
  const gap = 1;
  const { scene } = useUpdateScene();
  const lightList: Object3D[] = [];
  const meshList: Object3D[] = [];
  const array = scene.children;
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    if ("isLight" in element && element.isLight) {
      lightList.push(element);
    } else {
      meshList.push(element);
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
                {lightList.length > 0 && <TreeList data={lightList} />}
              </ListGroup>
            </Card.Body>
          </Card>
          <Card>
            <Card.Header className="text-center" style={styleHeader}>
              <Icon iconName="box" gap={gap} title="模型" />
            </Card.Header>
            <Card.Body>
              <ListGroup className="da-gang">
                {meshList.length > 0 && <TreeList data={meshList} />}
              </ListGroup>
            </Card.Body>
          </Card>
        </Accordion.Body>
      </Accordion.Item>
      <Property3d />
    </Accordion>
  );
}
