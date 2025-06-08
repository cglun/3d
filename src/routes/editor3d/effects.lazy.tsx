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
import { getButtonColor, getThemeByScene } from "../../app/utils";

import CardTop from "../../component/common/routes/effects/CardTop";
import CardMark from "../../component/common/routes/effects/CardMark";
import { SceneUserData } from "../../three/Three3dConfig";

export const Route = createLazyFileRoute("/editor3d/effects")({
  component: RouteComponent,
});

function RouteComponent() {
  const { scene } = useUpdateScene();
  const { themeColor } = getThemeByScene(scene);
  const buttonColor = getButtonColor(themeColor);
  const [show, setShow] = useState(false);

  const userData = scene.userData as SceneUserData;
  const userDataStylesTopCard = userData.userCssStyleTopCard;
  const userDataStylesMark = userData.userCssStyleMarkLabel;
  useEffect(() => {
    setShow(true);
  }, []);

  if (userData.projectId === -1) {
    return <AlertBase text={"到左上脚3d中加载场景！"} />;
  }

  if (!userData.config3d?.useComposer) {
    return <AlertBase text={"请到设置中开启合成"} />;
  }
  if (userDataStylesTopCard === undefined || userDataStylesMark === undefined) {
    return;
  }

  function handleClose() {
    // const _userData = getScene().userData as SceneUserData;
    // _userData.userCssStyleTopCard = userDataStylesTopCard;
    setShow(false);
  }

  return (
    <ListGroup>
      <ListGroupItem>
        <ButtonGroup size="sm">
          {!show && (
            <Button
              variant={buttonColor}
              onClick={() => {
                setShow(true);
              }}
            >
              效果设置
            </Button>
          )}
        </ButtonGroup>
        <Modal size="xl" show={show} onHide={handleClose} backdrop="static">
          <Modal.Header closeButton>
            <Modal.Title>效果设置</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ padding: 0, minHeight: "30px" }}>
            <Tabs defaultActiveKey="home" id="uncontrolled-tab-example">
              <Tab eventKey="home" title="顶牌设置">
                <CardTop userDataStyles={userDataStylesTopCard} />
              </Tab>
              <Tab eventKey="profile" title="标签设置">
                <CardMark userDataStyles={userDataStylesMark} />
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
