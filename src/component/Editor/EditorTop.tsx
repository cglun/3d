import { useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Dropdown,
  Offcanvas,
  Navbar,
  Nav,
  Badge,
} from "react-bootstrap";
import { Color } from "three";
import ListCard from "@/component/Editor/ListCard";
import Toast3d from "@/component/common/Toast3d";
import ModalConfirm3d from "@/component/common/ModalConfirm3d";
import { APP_COLOR, RecordItem } from "@/app/type";
import axios from "@/app/http";
import InputBase from "@/component/common/InputBase";
import { useUpdateScene } from "@/app/hooks";
import { Search3d } from "@/component/Editor/Search3d";

import { useLocation, useNavigate } from "@tanstack/react-router";
import Icon from "@/component/common/Icon";
import { editorInstance } from "@/three/instance/EditorInstance";
import { getThemeByScene } from "@/three/utils/util4UI";
import { stopRoam } from "@/component/common/routes/effects/utils";
import { SceneUserData } from "@/three/config/Three3dConfig";

// 若 getThemeByScene 确实在该文件且正确导出，使用此导入语句

export default function EditorTop() {
  //打开场景列表
  const [showScene, setShowScene] = useState(false);
  const { scene, updateScene } = useUpdateScene();
  const [list, setList] = useState<RecordItem[]>([]);
  const [error, setError] = useState("");
  const [filterList, setFilterList] = useState<RecordItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleClose = () => setShowScene(false);
  const handleShow = () => setShowScene(true);

  const { themeColor, iconFill, sceneCanSave } = getThemeByScene(scene);
  document.body.setAttribute("data-bs-theme", themeColor);
  //const logoUrl = new URL("/static/images/logo.png", import.meta.url).href;
  const navigate = useNavigate();
  const location = useLocation();

  function saveScene() {
    const editor = editorInstance.getEditor();
    const { scene } = editor;
    if (scene.userData.projectId === -1) {
      Toast3d("请先另存场景", "提示", APP_COLOR.Warning);
      return;
    }
    const dataJson = editor.sceneSerialization();
    axios
      .post("/project/update/", {
        id: scene.userData.projectId,
        dataJson: dataJson,
      })
      .then((res) => {
        if (res.data.code === 200) {
          Toast3d("保存成功");
        } else {
          Toast3d(res.data.message, "提示", APP_COLOR.Warning);
        }
      })
      .catch((error) => {
        console.error(error);
        Toast3d("错误:" + error, "提示", APP_COLOR.Warning);
      });
  }
  function setThemeByBtn(color: APP_COLOR) {
    document.body.setAttribute("data-bs-theme", color);
    const { scene } = editorInstance.getEditor();
    const { APP_THEME } = scene.userData;
    APP_THEME.themeColor = color;
    updateScene(scene);
  }
  function setThemeIcons(color: string) {
    const { scene } = editorInstance.getEditor();
    const { APP_THEME } = scene.userData;
    APP_THEME.iconFill = color;
    updateScene(scene);
  }

  // 另存场景
  function saveAsNewScene() {
    const { scene } = editorInstance.getEditor();
    // scene.userData.APP_THEME.sceneCanSave = true;
    function getValue(sceneName: string, des: string) {
      scene.userData.sceneName = sceneName;
      scene.userData.des = des;
    }

    ModalConfirm3d(
      {
        title: "另存场景",
        body: (
          <InputBase
            getValue={getValue}
            name={scene.userData.sceneName}
            des={"Scene"}
          ></InputBase>
        ),
      },
      function () {
        const editor = editorInstance.getEditor();
        const dataJson = editor.sceneSerialization();
        axios
          .post("/project/create/", {
            name: scene.userData.sceneName,
            des: "Scene",
            dataJson: dataJson,
          })
          .then((res) => {
            if (res.data.code === 200) {
              const id = res.data.data;
              navigate({
                to: location.pathname + `?sceneId=${id}`,
              });
              // setSceneIsSave(false);
              Toast3d("保存成功");
            } else {
              Toast3d(res.data.message, "提示", APP_COLOR.Warning);
            }
          })
          .catch((error) => {
            Toast3d(error, "提示", APP_COLOR.Warning);
          });
      }
    );
  }

  useEffect(() => {
    setIsLoading(true);

    axios
      .post("/project/pageList/", { size: 1000 })
      .then((res) => {
        if (res.data.code === 200) {
          const message = res.data.message;
          if (message) {
            setError(message);
            return;
          }
          const list = res.data.data.records;
          const sceneList = list.filter((item: RecordItem) => {
            if (item.des === "Scene") {
              return item;
            }
          });
          setList(sceneList);
          setIsLoading(false);
          setFilterList(sceneList);
        }
      })
      .catch((error) => {
        console.error(error);
        Toast3d("error", error, APP_COLOR.Danger);
      });
  }, [showScene]);

  return (
    <Navbar expand="sm" className="bg-body-tertiary" style={{ padding: 0 }}>
      <Navbar.Brand className="d-flex" style={{ marginRight: 0 }}>
        {/* <Image style={{ width: "1.6rem" }} src={logoUrl} title="logo" /> */}
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <ButtonGroup size="sm">
            <Button variant={themeColor} onClick={handleShow}>
              <Icon iconName="badge-3d" title="切换场景" placement="right" />
            </Button>
          </ButtonGroup>
        </Nav>
        <Nav className="me-2">
          <ButtonGroup aria-label="Basic example" size="sm">
            <Button
              variant={themeColor}
              onClick={() => {
                const { scene } = editorInstance.getEditor();
                const userData = scene.userData as SceneUserData;
                const refreshTime = userData.APP_THEME?.refreshTime || 0;
                userData.APP_THEME.refreshTime = refreshTime + 1;

                updateScene(scene);
              }}
            >
              <Icon
                iconName="bi bi-arrow-clockwise"
                title="刷新"
                placement="left"
              />
            </Button>
            <Button
              variant={themeColor}
              onClick={() => {
                navigate({
                  to: location.pathname,
                });
                document.title = "3d新场景";
                // const newScene = createNewScene();
                const editor = editorInstance.getEditor();
                editor.resetScene();
                stopRoam();
                updateScene(editor.scene);
                Toast3d("场景已新建");
              }}
            >
              <Icon iconName="plus-square" title=" 新建场景" placement="left" />
            </Button>
            <Button
              variant={themeColor}
              disabled={!sceneCanSave}
              onClick={() => {
                saveScene();
              }}
            >
              <Icon iconName="floppy" title="保存场景" placement="left" />
            </Button>
            <Button
              variant={themeColor}
              onClick={() => {
                saveAsNewScene();
              }}
            >
              <Icon iconName="floppy2" title="场景另存" placement="left" />
            </Button>
            <Button
              as="div"
              variant={themeColor}
              style={{ paddingLeft: "0", paddingRight: "0" }}
            >
              <Dropdown>
                <Dropdown.Toggle
                  id="dropdown-autoclose-true"
                  variant={themeColor}
                  size="sm"
                >
                  {themeColor === "light" ? (
                    <Icon iconName="sun" title="白天" placement="left" />
                  ) : (
                    <Icon iconName="moon-stars" title="黑夜" placement="left" />
                  )}
                </Dropdown.Toggle>

                <Dropdown.Menu style={{ minWidth: "1rem" }}>
                  {themeColor === APP_COLOR.Dark ? (
                    <Dropdown.Item
                      onClick={() => {
                        setThemeByBtn(APP_COLOR.Light);
                        const { scene } = editorInstance.getEditor();
                        const enableColor = scene.background instanceof Color;
                        if (enableColor) {
                          scene.background = new Color("#eee");
                        }
                      }}
                    >
                      <Icon iconName="sun" title="白天" placement="left" />
                    </Dropdown.Item>
                  ) : (
                    <Dropdown.Item
                      onClick={() => {
                        setThemeByBtn(APP_COLOR.Dark);
                        const { scene } = editorInstance.getEditor();
                        // const { asBackground } = scene.userData.backgroundHDR;
                        const enableColor = scene.background instanceof Color;
                        if (enableColor) {
                          scene.background = new Color("#000116");
                        }
                      }}
                    >
                      <Icon
                        iconName="moon-stars"
                        title="黑夜"
                        placement="left"
                      />
                    </Dropdown.Item>
                  )}
                  {iconFill === "-fill" ? (
                    <Dropdown.Item
                      onClick={() => {
                        setThemeIcons("");
                      }}
                    >
                      <Icon
                        iconName="bi bi-emoji-expressionless"
                        title="空心图标"
                        placement="left"
                      />
                    </Dropdown.Item>
                  ) : (
                    <Dropdown.Item
                      onClick={() => {
                        setThemeIcons("-fill");
                      }}
                    >
                      <Icon
                        iconName="bi bi-emoji-expressionless-fill"
                        title="填充图标"
                        placement="left"
                      />
                    </Dropdown.Item>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </Button>
            <Button
              variant={themeColor}
              onClick={() => {
                Toast3d("待续", "提示", APP_COLOR.Warning);
                window.open(
                  "https://pan.xunlei.com/s/VOM1WYs9m_wKSBf8MM7ZhKMjA1?pwd=76k8#",
                  "_blank"
                );
              }}
            >
              <Icon iconName="camera-video" title="教程" placement="left" />
            </Button>
          </ButtonGroup>
        </Nav>
      </Navbar.Collapse>
      {showScene && (
        <Offcanvas show={showScene} onHide={handleClose}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>
              <Icon iconName="badge-3d" gap={1} />
              所有场景
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className="pt-0">
            <Badge bg={APP_COLOR.Secondary} className="mb-2">
              当前：【id:
              {scene.userData.projectId}】{scene.userData.sceneName}
            </Badge>
            <Search3d list={list} setFilterList={setFilterList} type="场景" />
            <ListCard
              list={filterList}
              setList={setFilterList}
              isLoading={isLoading}
              error={error}
            />
          </Offcanvas.Body>
        </Offcanvas>
      )}
    </Navbar>
  );
}
