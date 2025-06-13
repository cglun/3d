import { createLazyFileRoute } from "@tanstack/react-router";
import { useUpdateScene } from "../../app/hooks";

import AlertBase from "../../component/common/AlertBase";
import {
  Button,
  ButtonGroup,
  ListGroup,
  ListGroupItem,
  Modal,
  Tab,
  Tabs,
} from "react-bootstrap";
import { useEffect, useState } from "react";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

import { getButtonColor, getThemeByScene } from "../../threeUtils/util4UI";

import CardTop from "../../component/common/routes/effects/CardTop";
import CardMark from "../../component/common/routes/effects/CardMark";
import sceneUserData, {
  RoamButtonUserSetting,
  SceneUserData,
} from "../../three/Three3dConfig";
import { editorInstance } from "../../three/EditorInstance";
import {
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  TubeGeometry,
} from "three";
import { cameraEnterAnimation } from "../../threeUtils/util4Camera";

// 定义一个变量来保存 GUI 实例

export const Route = createLazyFileRoute("/editor3d/effects")({
  component: RouteComponent,
});

function RouteComponent() {
  const { scene } = useUpdateScene();
  const { themeColor } = getThemeByScene(scene);
  const buttonColor = getButtonColor(themeColor);
  const [show, setShow] = useState(false);
  const [hasGui, setHasGui] = useState(false);

  const userData = scene.userData as SceneUserData;

  const { topCard, markLabel } =
    userData.userCssStyle || sceneUserData.userCssStyle;

  // 先检查条件，避免在组件渲染逻辑中提前返回
  let earlyReturnElement = null;
  if (userData.projectId === -1) {
    earlyReturnElement = <AlertBase text={"到左上脚3d中加载场景！"} />;
  } else if (!userData.config3d?.useComposer) {
    earlyReturnElement = <AlertBase text={"请到设置中开启合成"} />;
  }
  const editor = editorInstance.getEditor();
  useEffect(() => {
    return () => {
      // 在组件卸载时销毁 GUI 实例
      editor?.destroyGUI();
    };
  }, []);

  // 如果有需要提前返回的元素，直接返回
  if (earlyReturnElement) {
    return earlyReturnElement;
  }

  function handleClose() {
    if (hasGui && editor.guiInstance) {
      // 销毁 GUI 实例
      editor.destroyGUI();
      setHasGui(false);
    }

    setShow(false);
  }

  function setRoamPath() {
    if (hasGui) {
      return;
    }

    const { customButtonList } = editorInstance.getEditor().scene
      .userData as SceneUserData;
    const { userSetting } = customButtonList.roamButtonGroup;

    // 创建 GUI 实例并保存到变量中
    editor.guiInstance = new GUI({ width: 285 });
    setHasGui(true);

    const folderGeometry = editor.guiInstance.addFolder("Geometry");

    const { roamLine } = editorInstance.getEditor().extraParams;
    if (roamLine) {
      folderGeometry
        .add(roamLine, "roamIsRunning")
        .name("启动/停止")
        .onChange(function () {
          const editor = editorInstance.getEditor();
          const { tubeMesh } = editor;
          if (!roamLine.roamIsRunning) {
            cameraEnterAnimation(editor);
            editor.destroyGUI();
          }
          if (tubeMesh === null) {
            addTube(userSetting);
          }
        });
    }
    folderGeometry
      .add(userSetting, "scale", 2, 10)
      .name("缩放比例")
      .step(2)
      .onChange(function () {
        setScale(editorInstance.getEditor().tubeMesh!, userSetting);
      });
    folderGeometry
      .add(userSetting, "extrusionSegments", 50, 200)
      .name("曲线分段")
      .step(50)
      .onChange(function () {
        addTube(userSetting);
      });
    folderGeometry
      .add(userSetting, "radiusSegments", 2, 12)
      .name("半径分段")
      .step(1)
      .onChange(function () {
        addTube(userSetting);
      });
    folderGeometry
      .add(userSetting, "offset", -20, 20)
      .name("偏移量")
      .step(0.1)
      .onChange(function () {
        addTube(userSetting);
      });
    folderGeometry
      .add(userSetting, "radius", 0.1, 20)
      .name("半径")
      .step(0.1)
      .onChange(function () {
        addTube(userSetting);
      });
    folderGeometry
      .add(userSetting, "closed")
      .name("是否闭合")
      .onChange(function () {
        addTube(userSetting);
      });

    folderGeometry.open();

    folderGeometry
      .add(userSetting, "lookAhead")
      .name("向前看")
      .onChange(function () {
        console.log("lookAhead");

        // animateCamera();
      });
  }
  function addTube(params: RoamButtonUserSetting) {
    const { tubeMesh } = editorInstance.getEditor();
    if (tubeMesh !== null) {
      tubeMesh.parent?.remove(tubeMesh);
      tubeMesh.geometry.dispose();
    }
    const { extraParams, scene } = editorInstance.getEditor();

    const curvePath = editorInstance
      .getEditor()
      .getCurveByEmptyMesh("漫游动画1");

    const { roamLine } = extraParams;
    curvePath.closed = true;

    if (roamLine) {
      roamLine.roamIsRunning = true;
      roamLine.tubeGeometry = new TubeGeometry(
        curvePath, //曲线
        params.extrusionSegments, //曲线的分段数量
        params.radius, //意味着生成的管道半径为 1 个单位。
        params.radiusSegments, //指定管道圆周方向的分段数量
        params.closed //是否闭合
      );
    }
    const material = new MeshLambertMaterial({ color: 0xff00ff });
    const wireframeMaterial = new MeshBasicMaterial({
      color: 0x000000,
      opacity: 0.3,
      wireframe: true,
      transparent: true,
    });

    const mesh = new Mesh(roamLine?.tubeGeometry, material);
    const wireframe = new Mesh(roamLine?.tubeGeometry, wireframeMaterial);
    mesh.add(wireframe);
    mesh.scale.set(params.scale, params.scale, params.scale);
    scene.add(mesh);
    setScale(mesh, params);

    editorInstance.getEditor().tubeMesh = mesh;
  }
  function setScale(mesh: Mesh, params: any) {
    mesh.scale.set(params.scale, params.scale, params.scale);
  }
  return (
    <ListGroup>
      <ListGroupItem>
        <ButtonGroup size="sm">
          {!show && (
            <>
              {" "}
              <Button
                variant={buttonColor}
                onClick={() => {
                  setShow(true);
                }}
              >
                标签设置
              </Button>
              <Button
                variant={buttonColor}
                onClick={() => {
                  setRoamPath();
                }}
              >
                漫游路径
              </Button>
            </>
          )}
        </ButtonGroup>
        <Modal size="xl" show={show} onHide={handleClose} backdrop="static">
          <Modal.Header closeButton>
            <Modal.Title>效果设置</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ padding: 0, minHeight: "30px" }}>
            <Tabs defaultActiveKey="home" id="uncontrolled-tab-example">
              <Tab eventKey="home" title="顶牌设置">
                <CardTop userDataStyles={topCard} />
              </Tab>
              <Tab eventKey="profile" title="标签设置">
                <CardMark userDataStyles={markLabel} />
              </Tab>
            </Tabs>
          </Modal.Body>
          <Modal.Footer>
            <Button variant={buttonColor} onClick={handleClose}>
              关闭
            </Button>
          </Modal.Footer>
        </Modal>
      </ListGroupItem>
    </ListGroup>
  );
}
