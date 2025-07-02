import ListGroup from "react-bootstrap/esm/ListGroup";
import ListGroupItem from "react-bootstrap/esm/ListGroupItem";
import ButtonGroup from "react-bootstrap/esm/ButtonGroup";
import Button from "react-bootstrap/esm/Button";
import Container from "react-bootstrap/esm/Container";
import Modal from "react-bootstrap/esm/Modal";
import { createLazyFileRoute } from "@tanstack/react-router";
import Viewer3d from "@/viewer3d/Viewer3d";
import { useEffect, useRef, useState } from "react";
import _axios from "@/app/http";
import { useUpdateScene } from "@/app/hooks";

import { ActionItemMap, APP_COLOR, MessageError, RecordItem } from "@/app/type";
import { resetListGroupIsClick } from "@/viewer3d/buttonList/buttonGroup";
import { LabelInfoPanelController } from "@/viewer3d/label/LabelInfoPanelController";

import { getButtonColor, getThemeByScene } from "@/three/utils/util4UI";
import Icon from "@/component/common/Icon";
import { Three3dViewer } from "@/three/threeObj/Three3dViewer";
import { errorMessage } from "@/app/utils";
import { viewerInstance } from "@/three/instance/ViewerInstance";

// 定义响应数据的类型
interface PageListResponse {
  code: number;
  message: string;
  data: {
    records: RecordItem[];
  };
}

export const Route = createLazyFileRoute("/editor3d/preView")({
  component: RouteComponent,
});

function RouteComponent() {
  const [listScene, setListScene] = useState<RecordItem[]>([]);
  const [toggleButtonList, setToggleButtonList] = useState<ActionItemMap[]>();
  const [roamButtonList, setRoamButtonList] = useState<ActionItemMap[]>([]);
  const [panelControllerButtonList, setPanelControllerButtonList] = useState<
    ActionItemMap[]
  >([]);
  const [show, setShow] = useState(false);
  const [controller, setController] = useState<LabelInfoPanelController>();
  const [showControllerButton, setShowControllerButton] = useState(false);
  const { scene } = useUpdateScene();
  const { themeColor } = getThemeByScene(scene);
  const buttonColor = getButtonColor(themeColor);
  const [_item, _setItem] = useState<RecordItem>({
    id: -1,
    name: "",
    des: "",
    cover: "",
  });

  useEffect(() => {
    // 指定响应数据的类型
    _axios
      .post<PageListResponse>("/project/pageList/", { size: 1000 })
      .then((res) => {
        if (res.data.code === 200) {
          const message = res.data.message;
          if (message) {
            return;
          }
          const records: RecordItem[] = res.data.data.records;
          const sceneList = records.filter((item) => {
            if (item.des === "Scene") {
              item.id = parseInt(item.id.toString());
              return item;
            }
          });

          setListScene(sceneList);
          //获取url的参数 值
          const urlParams = new URLSearchParams(window.location.search);
          const sceneId = urlParams.get("sceneId");
          if (sceneId) {
            _setItem({
              id: parseInt(sceneId),
              name: "场景预览",
              des: "Scene",
              cover: "",
            });
            return;
          }
          _setItem(sceneList[0]);
        }
      })
      .catch((error: MessageError) => {
        errorMessage(error);
      });
  }, []);

  // 忽略类型检查，暂时不清楚 Context116 完整类型定义
  function callBack(viewer: Three3dViewer) {
    //const viewer = viewerInstance.getViewer();

    // 检查 getToggleButtonGroup 方法是否存在
    setToggleButtonList(viewer.getToggleButtonGroup);
    setRoamButtonList(viewer.getRoamListByRoamButtonMap || []);
    setPanelControllerButtonList(viewer.getPanelControllerButtonGroup || []);
    if (viewer.labelInfoPanelController) {
      setController(viewer.labelInfoPanelController);
    }
  }

  function handleClose() {
    setShow(false);
  }
  const modalBody = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const viewer = viewerInstance.getViewer();
    setShow(true);
    window.addEventListener("resize", viewer?.onWindowResize);
    return () => {
      window.removeEventListener("resize", viewer?.onWindowResize);
    };
  }, []);

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
              <Icon iconName="eye" gap={1} title="预览场景" />
              场景
            </Button>
          )}
        </ButtonGroup>
        <Modal fullscreen show={show} onHide={handleClose}>
          {/* <Modal.Header closeButton>
            <Modal.Title>场景预览</Modal.Title>
          </Modal.Header>*/}

          <Modal.Body
            ref={modalBody}
            style={{ padding: 0 }}
            className="position-relative"
          >
            <Container
              className="position-absolute top-0 right-0"
              style={{ zIndex: 1 }}
            >
              <ButtonGroup size="sm">
                {listScene.map((item: RecordItem) => {
                  return (
                    <Button
                      variant={buttonColor}
                      key={item.id}
                      // Bug 修复：添加 _item 判空检查
                      disabled={_item && item.id === _item.id}
                      onClick={() => {
                        _setItem(item);
                      }}
                    >
                      id_{item.id}_{item.name}
                    </Button>
                  );
                })}
                <Button variant={APP_COLOR.Danger} onClick={handleClose}>
                  关闭
                </Button>
              </ButtonGroup>
            </Container>
            {_item.id !== -1 && (
              <Viewer3d
                item={_item}
                canvasStyle={{
                  width: window.innerWidth + "px",
                  height: window.innerHeight + "px",
                }}
                callBack={callBack}
                showProgress={true}
              />
            )}
          </Modal.Body>
        </Modal>
      </ListGroupItem>
    </ListGroup>
  );
}
