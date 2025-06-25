import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import ListGroup from "react-bootstrap/esm/ListGroup";
import Col from "react-bootstrap/esm/Col";
import ButtonGroup from "react-bootstrap/esm/ButtonGroup";
import Button from "react-bootstrap/esm/Button";
import InputGroup from "react-bootstrap/esm/InputGroup";
import Form from "react-bootstrap/esm/Form";
import Card from "react-bootstrap/esm/Card";
import { createLazyFileRoute } from "@tanstack/react-router";

import { useContext, useEffect, useState } from "react";
import { CSS3DSprite } from "three/addons/renderers/CSS3DRenderer.js";
import Toast3d from "@/component/common/Toast3d";
import markLabelGUI from "@/component/routes/effects/gui/markLabelGUI";
import topCardGUI from "@/component/routes/effects/gui/topCardGUI";
import { APP_COLOR, TourItem } from "@/app/type";
import { useUpdateScene } from "@/app/hooks";
import { ConfigCheck } from "@/component/common/ConfigCheck";
import _axios from "@/app/http";

import { MyContext } from "@/app/MyContext";

import { MarkLabel } from "@/viewer3d/label/MarkLabel";
import { SceneUserData } from "@/three/config/Three3dConfig";
import { editorInstance } from "@/three/instance/EditorInstance";
import {
  getButtonColor,
  getThemeByScene,
  setClassName,
} from "@/three/utils/util4UI";
import { clearOldLabel } from "@/three/utils/util4Scene";
import { stopRoam } from "@/component/routes/effects/utils";
import Icon from "@/component/common/Icon";
import { GROUP } from "@/three/config/CONSTANT";

export const Route = createLazyFileRoute("/editor3d/mark")({
  component: RouteComponent,
});

function RouteComponent() {
  const [markName, setMarkName] = useState("mark");
  const [logo, setLogo] = useState("geo-alt");
  const [listTour, setListTour] = useState([]);
  const { dispatchTourWindow } = useContext(MyContext);
  const { scene, updateScene } = useUpdateScene();
  const { themeColor } = getThemeByScene(scene);
  const buttonColor = getButtonColor(themeColor);

  const userData = scene.userData as SceneUserData;
  const { config3d } = userData as SceneUserData;
  useEffect(() => {
    const editor = editorInstance.getEditor();
    const testGroup = editor.scene.getObjectByName(GROUP.TEST);
    if (testGroup) testGroup.visible = true;

    _axios
      .get("/pano/page?size=1000")
      .then((res) => {
        if (res.data.code === 200) {
          const { records } = res.data.result;
          setListTour(records);
        } else {
          Toast3d(res.data.message, "提示", APP_COLOR.Danger);
          console.error(res.data);
        }
      })
      .catch((err) => {
        Toast3d("看控制台", "提示", APP_COLOR.Danger);
        console.error(err);
      });
    return () => {
      editor.outlinePass.selectedObjects = [];
      const markLabel = editor.scene.getObjectByName(GROUP.TEST + "_markLabel");
      if (markLabel) markLabel.visible = false;
      const labelInfo = editor.scene.getObjectByName(GROUP.TEST + "_cube");
      if (markLabel) markLabel.visible = false;
      if (labelInfo) labelInfo.visible = false;
      if (testGroup) testGroup.visible = false;
      editor.destroyGUI();
    };
  }, []);

  if (!config3d) return;

  function addMark(label: CSS3DSprite) {
    const editor = editorInstance.getEditor();
    editor.MARK_LABEL_GROUP.add(label);
    editor.scene.add(editor.MARK_LABEL_GROUP);
  }

  return (
    <Container fluid className="ms-2 mt-2">
      <Row>
        <Col xl={12}>
          <ListGroup horizontal>
            {/* <ListGroup.Item>
              <ConfigCheck
                label="2D标签"
                configKey="css2d"
                callBack={clearOldLabel}
              />
            </ListGroup.Item> */}
            <ListGroup.Item>
              <ConfigCheck
                iconName="geo-alt"
                label="3D标签"
                configKey="css3d"
                toolTip="显示和隐藏标签"
                callBack={clearOldLabel}
              />
            </ListGroup.Item>
            <ListGroup.Item>
              <ButtonGroup size="sm">
                <Button
                  variant={buttonColor}
                  disabled={!config3d.css3d}
                  onClick={() => {
                    stopRoam();
                    markLabelGUI(dispatchTourWindow);
                  }}
                >
                  <Icon iconName="geo-alt" gap={1} />
                  标签
                </Button>
                <Button
                  variant={buttonColor}
                  disabled={!config3d.css3d}
                  onClick={() => {
                    stopRoam();
                    topCardGUI(dispatchTourWindow);
                  }}
                >
                  <Icon iconName="credit-card-2-front" gap={1} />
                  顶牌
                </Button>
              </ButtonGroup>
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
      <Row className="mt-2">
        <Col xl={8}>
          <InputGroup>
            <div className="d-flex ">
              <i
                className={setClassName(logo)}
                style={{ fontSize: "1.4rem" }}
              ></i>
              <Form.Select
                size="sm"
                aria-label="logo"
                disabled={!config3d.css3d}
                onChange={(e) => {
                  setLogo(e.target.value);
                }}
              >
                <option value="geo-alt" defaultValue="geo-alt">
                  图标1
                </option>
                <option value="geo"> 图标2</option>
                <option value="pin-map"> 图标3</option>
              </Form.Select>
            </div>
            <Form.Control
              size="sm"
              placeholder="名称"
              disabled={!config3d.css3d}
              onChange={(e) => {
                setMarkName(e.target.value);
              }}
            />
            <ButtonGroup size="sm">
              {/* <Button
                variant={getButtonColor(themeColor)}
                disabled={!config3d.css2d}
                onClick={() => {
                  addMark(createCss2dLabel(markName, logo));
                  updateScene(getScene());
                }}
              >
                添加2d标记
              </Button>
              <Button
                variant={getButtonColor(themeColor)}
                disabled={!config3d.css2d}
                onClick={() => {
                  Toast3d("待续", "提示", APP_COLOR.Danger);
                }}
              >
                一键2d标记
              </Button> */}
              <Button
                variant={getButtonColor(themeColor)}
                disabled={!config3d.css3d}
                onClick={() => {
                  const { scene } = editorInstance.getEditor(); //addMark(createCss3dLabel(markName, logo));
                  const label = new MarkLabel(scene, dispatchTourWindow, {
                    markName,
                    logo,

                    showEye: false,
                    tourObject: {
                      id: "id",
                      title: "title",
                    },
                  });

                  addMark(label.css3DSprite);

                  updateScene(scene);
                }}
              >
                添加3d标记
              </Button>
              {/* <Button
                variant={getButtonColor(themeColor)}
                disabled={!config3d.css3d}
                onClick={() => {
                  Toast3d("待续", "提示", APP_COLOR.Danger);
                }}
              >
                一键3d标记
              </Button> */}
            </ButtonGroup>
          </InputGroup>
        </Col>
      </Row>
      <Row>
        <Col className="d-flex   flex-wrap">
          {listTour &&
            config3d.css3d &&
            // 修改为明确指定 TourItem 类型
            listTour.map((item: TourItem, index: number) => {
              return (
                <Card className="ms-2" style={{ width: "6rem" }} key={index}>
                  <Card.Header className="card-pd-header ">
                    {item.title}
                  </Card.Header>
                  <Card.Img
                    src={item.thumbUrl}
                    alt={item.title}
                    variant="top"
                    style={{ cursor: "crosshair" }}
                    onClick={() => {
                      const { scene } = editorInstance.getEditor();
                      const label = new MarkLabel(scene, dispatchTourWindow, {
                        markName: item.title,
                        logo,
                        showEye: true,
                        tourObject: {
                          id: item.id.toString(),
                          title: item.title,
                        },
                      });
                      addMark(label.css3DSprite);

                      updateScene(scene);
                    }}
                  ></Card.Img>
                </Card>
              );
            })}
        </Col>
      </Row>
    </Container>
  );
}
