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

import { getButtonColor, getThemeByScene } from "../../threeUtils/util4UI";

import CardTop from "../../component/common/routes/effects/CardTop";
import CardMark from "../../component/common/routes/effects/CardMark";
import sceneUserData, { SceneUserData } from "../../three/Three3dConfig";
import { editorInstance } from "../../three/EditorInstance";
import { setRoamPath } from "../../threeUtils/gui/roamGui";

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

  return (
    <ListGroup>
      <ListGroupItem>
        <ButtonGroup size="sm">
          {!show && (
            <>
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
              <Button
                variant={buttonColor}
                onClick={() => {
                  setRoamPath();
                }}
              >
                模型高亮
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
