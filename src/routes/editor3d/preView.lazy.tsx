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
  const beiShu = window.innerHeight / window.innerWidth; // 将 beiShu 计算移到这里
  const [size3d, setSize3d] = useState({
    w: 1138,
    h: 1138 * beiShu,
  });

  useEffect(() => {
    setShow(true);
    function handleResize3d() {
      if (modalBody.current) {
        const _body = modalBody.current;
        const _w = _body.offsetWidth || 1138;
        const _h = _body.offsetHeight || _body.offsetWidth * beiShu;

        setSize3d({ w: _w, h: _h });
      }
    }
    window.addEventListener("resize", handleResize3d);
    handleResize3d();

    return () => {
      window.removeEventListener("resize", handleResize3d);
    };
  }, []);

  // 点击按钮后，将其他按钮的 isClick 置为 false
  function handleClickResize(
    index: number,
    buttonList: ActionItemMap[],
    setToggleButtonList: (value: ActionItemMap[]) => void
  ) {
    const newListGroup = resetListGroupIsClick(buttonList);
    newListGroup[index].isClick = !newListGroup[index].isClick;
    setToggleButtonList(newListGroup);
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
              <Icon iconName="eye" gap={1} title="预览场景" />
              场景
            </Button>
          )}
        </ButtonGroup>
        <Modal size="xl" show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>场景预览</Modal.Title>
          </Modal.Header>
          <Container>
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
            </ButtonGroup>
          </Container>
          <Modal.Body ref={modalBody} style={{ padding: 0 }}>
            {_item.id !== -1 && (
              <Viewer3d
                item={_item}
                canvasStyle={{
                  width: size3d.w + "px",
                  height: size3d.h + "px",
                }}
                callBack={callBack}
                showProgress={true}
              />
            )}
          </Modal.Body>
          <Modal.Footer>
            <ButtonGroup size="sm">
              {toggleButtonList?.map((item: ActionItemMap, index: number) => {
                return (
                  <Button
                    variant={buttonColor}
                    key={index}
                    onClick={() => {
                      if (item.handler) {
                        item.handler();
                        handleClickResize(
                          index,
                          toggleButtonList,
                          setToggleButtonList
                        );
                        setShowControllerButton(false);
                      }
                    }}
                  >
                    {item.showName} {/* 显示按钮的名称 */}
                  </Button>
                );
              })}

              {roamButtonList.map((item: ActionItemMap, index: number) => {
                const isStart = item.NAME_ID.includes("START");
                return (
                  <Button
                    variant={buttonColor}
                    key={index}
                    onClick={() => {
                      if (item.handler) {
                        // handleClickResize(
                        //   index,
                        //   roamButtonList,
                        //   setRoamButtonList
                        // );
                        const name = item.NAME_ID.split("_AN_")[0];
                        item.handler(item.NAME_ID);
                        const nameId = isStart
                          ? `${name}_AN_STOP`
                          : `${name}_AN_START`;
                        setRoamButtonList((prevList) => {
                          return prevList.map((prevItem) => {
                            if (prevItem.NAME_ID === item.NAME_ID) {
                              return {
                                ...prevItem,
                                NAME_ID: nameId,
                              };
                            }
                            return prevItem;
                          });
                        });
                        setShowControllerButton(false);
                      }
                    }}
                  >
                    {isStart ? item.showName[0] : item.showName[1]}
                  </Button>
                );
              })}
            </ButtonGroup>
            <ButtonGroup size="sm" className="mt-2">
              {/* <Button
                variant={buttonColor}
                onClick={() => {
                  const { x, y, z } = getCamera().position;
                  const cameraX = x.toFixed(2);
                  const cameraY = y.toFixed(2);
                  const cameraZ = z.toFixed(2);
                  const position = `"cameraPosition":{"x":${cameraX},"y":${cameraY},"z":${cameraZ}} `;

                  navigator.clipboard
                    .writeText(position)
                    .then(() => {
                      Toast3d("复制成功", "提示", APP_COLOR.Success, 2000);
                    })
                    .catch((err) => {
                      alert("复制失败,查看控制台");
                      console.error("复制失败:", err);
                    });
                }}
              >
                复制相机位置
              </Button> */}
              <Button variant={APP_COLOR.Danger} onClick={handleClose}>
                关闭
              </Button>

              <Button
                variant={buttonColor}
                onClick={() => {
                  //  const controller = getPanelController();
                  if (controller) {
                    const modelNameList = [
                      "2-004-015",
                      "2-010-017",
                      "2-008-015",
                    ];
                    controller.findLabelInfoByModelBoxName(modelNameList);
                    const isShow = controller.canBeShowLabelInfo.length > 0;
                    setShowControllerButton(isShow);
                    controller.showSmallCircle();
                    controller.highlightLabelInfoPanel();
                  }
                }}
              >
                查找标签测试
              </Button>

              {showControllerButton &&
                panelControllerButtonList.map(
                  (item: ActionItemMap, index: number) => {
                    return (
                      <Button
                        variant={buttonColor}
                        disabled={!showControllerButton}
                        key={index}
                        onClick={() => {
                          if (item.handler) {
                            item.handler();
                            // 点击按钮后，将其他按钮的 isClick 置为 false
                            setPanelControllerButtonList((prevList) => {
                              return prevList.map((prevItem) => {
                                if (prevItem.NAME_ID === item.NAME_ID) {
                                  return {
                                    ...prevItem,
                                    isClick: true,
                                  };
                                }
                                return {
                                  ...prevItem,
                                  isClick: false,
                                };
                              });
                            });
                          }
                        }}
                      >
                        {/* {item.showName} */}
                        {item.isClick ? "√" : "x"}
                      </Button>
                    );
                  }
                )}
            </ButtonGroup>
          </Modal.Footer>
        </Modal>
      </ListGroupItem>
    </ListGroup>
  );
}
