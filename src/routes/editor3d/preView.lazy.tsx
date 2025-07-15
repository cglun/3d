import ListGroup from "react-bootstrap/esm/ListGroup";
import ListGroupItem from "react-bootstrap/esm/ListGroupItem";
import ButtonGroup from "react-bootstrap/esm/ButtonGroup";
import Button from "react-bootstrap/esm/Button";
import Container from "react-bootstrap/esm/Container";
import Modal from "react-bootstrap/esm/Modal";
import { createLazyFileRoute } from "@tanstack/react-router";

import { useEffect, useRef, useState } from "react";
import _axios from "@/app/http";
import { useUpdateScene } from "@/app/hooks";

import { APP_COLOR, MessageError, RecordItem } from "@/app/type";

import { getButtonColor, getThemeByScene } from "@/three/utils/util4UI";
import Icon from "@/component/common/Icon";
import { Three3dViewer } from "@/three/threeObj/Three3dViewer";
import { errorMessage } from "@/app/utils";
import Viewer3dPlus from "@/viewer3d/Viewer3dPlus";

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

  const [show, setShow] = useState(false);

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

  //@ts-ignore 忽略类型检查,后面有可能用到，不要问为什么
  function callBack(viewer: Three3dViewer) {
    console.log("o");
  }

  function handleClose() {
    setShow(false);
  }
  const modalBody = useRef<HTMLDivElement>(null);
  useEffect(() => {}, []);

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
          {/* <Modal fullscreen show={show} onHide={handleClose}> */}
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
            <Viewer3dPlus item={_item} callBack={callBack} />
          </Modal.Body>
        </Modal>
      </ListGroupItem>
    </ListGroup>
  );
}
