import { createLazyFileRoute } from "@tanstack/react-router";
import Button from "react-bootstrap/esm/Button";
import {
  AmbientLight,
  BoxGeometry,
  Group,
  Mesh,
  MeshLambertMaterial,
  PlaneGeometry,
} from "three";

import { ButtonGroup, Card, Container } from "react-bootstrap";

import { useUpdateScene } from "@/app/hooks";

import Icon from "@/component/common/Icon";
import { editorInstance } from "@/three/EditorInstance";
import { getThemeByScene, setClassName } from "@/threeUtils/util4UI";
import { addMonkey } from "@/threeUtils/util4Scene";
import { createDirectionalLight } from "@/threeUtils/factory3d";

export const Route = createLazyFileRoute("/editor3d/mesh")({
  component: RouteComponent,
});

function RouteComponent() {
  const { scene, updateScene } = useUpdateScene();
  const { themeColor } = getThemeByScene(scene);
  function getEditor() {
    return editorInstance.getEditor();
  }
  function addBox() {
    // 创建立方体
    const cubeGeometry = new BoxGeometry(1, 1, 1);
    const cubeMaterial = new MeshLambertMaterial();
    const cube = new Mesh(cubeGeometry, cubeMaterial);
    cube.name = "立方体";
    // cube.castShadow = true; // 立方体投射阴影
    cube.position.set(0, 0.5, 0);

    //
    const { useShadow } = getEditor().scene.userData.config3d;
    cube.castShadow = useShadow;
    cube.receiveShadow = useShadow;
    getEditor().GEOMETRY.add(cube);
    updateScene(getEditor().scene);
  }

  function addAmbientLight() {
    const editor = editorInstance.getEditor();
    const light = new AmbientLight(0xffffff, 0.5);
    light.name = "环境光【不能投射阴影】";
    editor.LIGHT_GROUP.add(light);
    editor.scene.add(editor.LIGHT_GROUP);
    updateScene(getEditor().scene);
  }
  function addPlane() {
    // 创建地面

    const planeGeometry = new PlaneGeometry(10, 10);
    const planeMaterial = new MeshLambertMaterial({ color: 0xdddddd });
    const plane = new Mesh(planeGeometry, planeMaterial);
    plane.name = "平面";
    plane.receiveShadow = true; // 地面接收阴影
    plane.castShadow = true;
    plane.rotation.x = -Math.PI / 2;

    const { useShadow } = getEditor().scene.userData.config3d;
    plane.receiveShadow = useShadow;
    plane.castShadow = useShadow;

    getEditor().GEOMETRY.add(plane);
    updateScene(getEditor().scene);
  }
  //@ts-expect-error 组
  function addGroup() {
    const group = new Group();

    getEditor().scene.add(group);
    updateScene(getEditor().scene);
  }
  function addDirectionalLight() {
    const editor = editorInstance.getEditor();
    const { useShadow } = editor.scene.userData.config3d;
    const light = createDirectionalLight();

    light.castShadow = useShadow;
    editor.LIGHT_GROUP.add(light);
    editor.scene.add(editor.LIGHT_GROUP);

    updateScene(getEditor().scene);
  }

  return (
    <Container fluid className="d-flex flex-wrap pt-2">
      <Card>
        <Card.Header>
          <i className={setClassName("box")}></i> 几何体
        </Card.Header>
        <Card.Body className="pt-1">
          <ButtonGroup>
            <Button
              variant={themeColor}
              onClick={() => {
                addBox();
              }}
            >
              立方体
            </Button>
            <Button
              variant={themeColor}
              onClick={() => {
                addPlane();
              }}
            >
              平面
            </Button>
            {/* <Button
              variant={themeColor}
              onClick={() => {
                addGroup();
              }}
            >
              组
            </Button> */}
            <Button
              variant={themeColor}
              onClick={() => {
                addMonkey();
              }}
            >
              猴头
            </Button>
          </ButtonGroup>
        </Card.Body>
      </Card>
      <Card className="ms-2">
        <Card.Header>
          <Icon iconName={"lightbulb"}></Icon>灯光
        </Card.Header>
        <Card.Body className="pt-1">
          <ButtonGroup>
            <Button
              variant={themeColor}
              title="可以投射阴影"
              onClick={() => {
                addDirectionalLight();
              }}
            >
              平行光
            </Button>
            <Button
              variant={themeColor}
              title="不能投射阴影"
              onClick={() => {
                addAmbientLight();
              }}
            >
              环境光
            </Button>
          </ButtonGroup>
        </Card.Body>
      </Card>
    </Container>
  );
}
