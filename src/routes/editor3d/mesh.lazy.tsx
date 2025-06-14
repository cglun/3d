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

import { enableShadow } from "@/three/common3d";

import Icon from "@/component/common/Icon";
import { editorInstance } from "@/three/EditorInstance";
import { getThemeByScene, setClassName } from "@/threeUtils/util4UI";
import { glbLoader } from "@/threeUtils/util4Scene";
import {
  createDirectionalLight,
  createGridHelper,
} from "@/threeUtils/factory3d";

export const Route = createLazyFileRoute("/editor3d/mesh")({
  component: RouteComponent,
});

function RouteComponent() {
  const { scene, updateScene } = useUpdateScene();
  const { themeColor } = getThemeByScene(scene);
  function getScene() {
    return editorInstance.getEditor().scene;
  }
  function addBox() {
    // 创建立方体
    const cubeGeometry = new BoxGeometry(1, 1, 1);
    const cubeMaterial = new MeshLambertMaterial();
    const cube = new Mesh(cubeGeometry, cubeMaterial);
    cube.name = "cube1";
    // cube.castShadow = true; // 立方体投射阴影
    cube.position.set(0, 0.5, 0);
    cube.userData.isSelected = true;
    //
    const { useShadow } = getScene().userData.config3d;
    cube.castShadow = useShadow;
    cube.receiveShadow = useShadow;
    getScene().add(cube);
    updateScene(getScene());
  }
  function addLocalModel() {
    const blender = new URL(
      `/public/static/file3d/models/blender.glb`,
      import.meta.url
    ).href;

    const loader = glbLoader();
    loader.load(blender, function (gltf) {
      const group = new Group();
      group.name = "猴子";
      group.add(...gltf.scene.children);
      getScene().add(group);

      // const helper = createDirectionalLightHelper(light);
      // getScene().add(helper);
      getScene().add(createGridHelper());
      enableShadow(getScene(), getScene());
      updateScene(getScene());
    });
  }

  function addAmbientLight() {
    const light = new AmbientLight(0xffffff, 0.5);
    getScene().add(light);
    light.userData.isSelected = true;
    updateScene(getScene());
  }
  function addPlane() {
    // 创建地面

    const planeGeometry = new PlaneGeometry(10, 10);
    const planeMaterial = new MeshLambertMaterial({ color: 0xdddddd });
    const plane = new Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true; // 地面接收阴影
    plane.castShadow = true;
    plane.rotation.x = -Math.PI / 2;
    plane.userData.isSelected = true;
    const { useShadow } = getScene().userData.config3d;
    plane.receiveShadow = useShadow;
    plane.castShadow = useShadow;

    getScene().add(plane);
    updateScene(getScene());
  }
  function addGroup() {
    const group = new Group();
    group.userData.isSelected = true;

    getScene().add(group);
    updateScene(getScene());
  }
  function addDirectionalLight() {
    const { useShadow } = getScene().userData.config3d;
    const light = createDirectionalLight();

    light.castShadow = useShadow;

    getScene().add(light);

    updateScene(getScene());
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
            <Button
              variant={themeColor}
              onClick={() => {
                addGroup();
              }}
            >
              组
            </Button>
            <Button
              variant={themeColor}
              onClick={() => {
                addLocalModel();
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
              面光
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
