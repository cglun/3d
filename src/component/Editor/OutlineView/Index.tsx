import { Object3D } from "three";

import { Accordion, Card, ListGroup, ListGroupItem } from "react-bootstrap";

import Property3d from "@/component/Editor/PropertyGUI/Index";
import TreeList from "@/component/common/TreeList";
import { useUpdateScene } from "@/app/hooks";
import { OutlineViewCamera } from "@/component/Editor/OutlineView/OutlineViewCamera";
import { OutlineViewScene } from "@/component/Editor/OutlineView/OutlineViewScene";

import Icon from "@/component/common/Icon";
import { styleHeader } from "@/component/Editor/OutlineView/fontColor";

import { GROUP } from "@/three/config/CONSTANT";
import { APP_COLOR } from "@/app/type";
// import { editor } from "monaco-editor";
// import { editorInstance } from "@/three/EditorInstance";

export default function Index() {
  const gap = 1;
  const { scene } = useUpdateScene();

  if (!scene.children) {
    return null;
  }

  let LIGHT_GROUP: Object3D[] = [];
  let MODEL_GROUP: Object3D[] = [];
  let MARK_LABEL_GROUP: Object3D[] = [];
  let GEOMETRY: Object3D[] = [];

  // if (scene.getObjectByName instanceof Function) {
  //   LIGHT_GROUP = scene.getObjectByName("LIGHT_GROUP")?.children || [];
  //   MODEL_GROUP = scene.getObjectByName("MODEL_GROUP")?.children || [];
  // }

  const array = scene.children;

  // for (let index = 0; index < array.length; index++) {
  //   const { name, children } = array[index];
  //   if (name === GROUP.LIGHT_GROUP) {
  //     LIGHT_GROUP = getGroupByName(children);
  //   }
  //   if (name === GROUP.MODEL) {
  //     children.forEach((item) => {
  //       MODEL_GROUP.push(item);
  //     });
  //   }
  //   if (name === GROUP.MARK_LABEL_GROUP) {
  //     children.forEach((item) => {
  //       MARK_LABEL_GROUP.push(item);
  //     });
  //   }
  //   if (name === GROUP.GEOMETRY) {
  //     children.forEach((item) => {
  //       GEOMETRY.push(item);
  //     });
  //   }
  // }
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
          <Card>
            <Card.Header className="text-center" style={styleHeader}>
              <Icon iconName="camera-reels" gap={gap} title="相机" />

              <Icon iconName="box2" gap={gap} title="场景" />
            </Card.Header>
            <Card.Body>
              <ListGroup>
                <OutlineViewCamera />
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
                {TreeListShow(LIGHT_GROUP)}
              </ListGroup>
            </Card.Body>
          </Card>
          <Card>
            <Card.Header className="text-center" style={styleHeader}>
              <Icon iconName="box" gap={gap} title="几何体" />
            </Card.Header>
            <Card.Body>
              <ListGroup className="da-gang">
                {TreeListShow(GEOMETRY)}
              </ListGroup>
            </Card.Body>
          </Card>
          <Card>
            <Card.Header className="text-center" style={styleHeader}>
              <Icon iconName="bi bi-boxes" gap={gap} title="模型" />
            </Card.Header>
            <Card.Body>
              <ListGroup className="da-gang">
                {TreeListShow(MODEL_GROUP)}
              </ListGroup>
            </Card.Body>
          </Card>
          <Card>
            <Card.Header className="text-center" style={styleHeader}>
              <Icon iconName="pin-map" gap={gap} title="标签" />
            </Card.Header>
            <Card.Body>
              <ListGroup className="da-gang">
                {TreeListShow(MARK_LABEL_GROUP)}
              </ListGroup>
            </Card.Body>
          </Card>
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
