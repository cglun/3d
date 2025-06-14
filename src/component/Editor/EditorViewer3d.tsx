import React, { memo, useContext, useEffect, useRef } from "react";
import { useLocation } from "@tanstack/react-router";

import {
  Button,
  ButtonGroup,
  Col,
  Container,
  ProgressBar,
  Row,
} from "react-bootstrap";
import { Object3D, Vector3 } from "three";
import { TransformControlsMode } from "three/addons/controls/TransformControls.js";
import { useUpdateCamera, useUpdateScene } from "../../app/hooks";
import ModalTour from "../common/ModalTour";
import Icon from "../common/Icon";
import { Three3dEditor } from "../../three/Three3dEditor";
import { editorInstance, EditorInstance } from "../../three/EditorInstance";
import ModalConfirm3d from "../common/ModalConfirm3d";
import AlertBase from "../common/AlertBase";
import { APP_COLOR, RecordItem } from "../../app/type";
import { getThemeByScene } from "../../threeUtils/util4UI";
import { getProjectData } from "../../threeUtils/util4Scene";
import { MyContext } from "../../app/MyContext";

function EditorViewer3d() {
  const editorCanvas: React.RefObject<HTMLDivElement> =
    useRef<HTMLDivElement>(null);
  // 使用 useRef 替代 useState
  const isInitialized = useRef(false);
  // const isLoaded = useRef(false);

  const { scene, updateScene } = useUpdateScene();
  const { updateCamera } = useUpdateCamera();
  const { themeColor } = getThemeByScene(scene);
  const { dispatchTourWindow } = useContext(MyContext);
  const location = useLocation().search; // 获取 sceneId 参数
  const searchParams = new URLSearchParams(location);
  const sceneId = searchParams.get("sceneId") ?? "-1";

  useEffect(() => {
    // let editor: Three3dEditor;
    if (editorCanvas.current && !isInitialized.current) {
      const editor = new Three3dEditor(
        editorCanvas.current,
        dispatchTourWindow
      );
      editor.addGridHelper();
      isInitialized.current = true; // 标记为已初始化
      editorInstance.setEditor(editor);

      editor.controls.enabled = true;

      window.addEventListener("resize", () => editor.onWindowResize());
    }

    function initScene() {
      const item: RecordItem = {
        id: parseInt(sceneId),
        name: "名字",
        des: "描述",
        cover: "封面",
      };

      if (item.id !== -1) {
        const editor = editorInstance.getEditor();
        getProjectData(item.id).then((data: string) => {
          // 假设 deserialize 是异步方法
          editor.deserialize(data, item);

          editor.loadedModelsEnd = () => {
            //这里为什么不有执行  debugger; // 在模型加载完成后更新场景
            editor.transformControl = editor.initTransformControl();

            editor.runJavascript();

            editor.destroyGUI();

            // editor.initPostProcessing();

            setTimeout(() => {
              ModalConfirm3d({
                title: "提示",
                body: <AlertBase text={"加载完成"} type={APP_COLOR.Success} />,
                confirmButton: {
                  show: true,
                },
              });
            }, 1116);

            setTimeout(() => {
              ModalConfirm3d({
                title: "提示",
                body: <AlertBase text={"关闭窗口"} type={APP_COLOR.Success} />,
                confirmButton: {
                  show: false,
                },
              });
            }, 1998);
            updateScene(editor.scene);
            updateCamera(editor.camera);
            document.title = `【id:${item.id}】`;
          };
          editor.onLoadProgress = (progress: number) => {
            ModalConfirm3d({
              title: "加载……",
              body: <ProgressBar now={progress} label={`${progress}%`} />,
              confirmButton: {
                show: true,
              },
            });
            if (progress === 100) {
              ModalConfirm3d({
                title: "提示",
                body: <AlertBase text={"加载完成"} type={APP_COLOR.Success} />,
                confirmButton: {
                  show: false,
                },
              });
              updateScene(editor.scene);
              updateCamera(editor.camera);
            }
          };

          editor.onLoadError = (error: string) => {
            console.error(error);
            ModalConfirm3d({
              title: "提示",
              body: (
                <AlertBase text={"有错，看控制台"} type={APP_COLOR.Danger} />
              ),
              confirmButton: {
                show: true,
                hasButton: true,
              },
            });
          };
        });
      }
    }
    initScene();

    return () => {
      const editor = editorInstance.getEditor();
      if (editor) {
        window.removeEventListener("resize", editor.onWindowResize);
      }
    };
  }, [sceneId]);

  function setMode(modeName: TransformControlsMode) {
    const editor = EditorInstance.getInstance().getEditor();
    const transfControls = editor.transformControl;
    transfControls.setMode(modeName);
  }

  return (
    <Container fluid>
      <Row>
        <Col xs="auto">
          <ButtonGroup size="sm" vertical>
            <Button
              variant={themeColor}
              onClick={() => {
                setMode("translate");
              }}
            >
              <Icon
                iconName="bi bi-arrows-move"
                style={{ width: "100%" }}
                title="移动"
              />
            </Button>
            <Button
              variant={themeColor}
              onClick={() => {
                setMode("rotate");
              }}
            >
              <Icon iconName="bi bi-arrow-repeat" title="旋转" />
            </Button>
            <Button
              variant={themeColor}
              onClick={() => {
                setMode("scale");
              }}
            >
              <Icon iconName="bi bi-arrows-angle-expand" title="绽放" />
            </Button>
            <Button
              variant={themeColor}
              onClick={() => {
                const editor = editorInstance.getEditor();
                editor.setCameraType(editor.camera, new Vector3(0, 1, 0));
              }}
            >
              <Icon iconName="bi bi-align-top" title="顶视" />
            </Button>
            <Button
              variant={themeColor}
              onClick={() => {
                const editor = editorInstance.getEditor();
                editor.setCameraType(editor.camera, new Vector3(0, 0, 1));
              }}
            >
              <Icon iconName="bi bi-align-middle" title="前视" />
            </Button>
            <Button
              variant={themeColor}
              onClick={() => {
                const editor = editorInstance.getEditor();
                editor.setCameraType(editor.camera, new Vector3(1, 0, 0));
              }}
            >
              <Icon iconName="bi bi-align-start" title="左视" />
            </Button>
            <Button
              variant={themeColor}
              onClick={() => {
                const editor = editorInstance.getEditor();
                editor.setCameraType(editor.camera, Object3D.DEFAULT_UP);
              }}
            >
              <Icon iconName="box" title="透视" />
            </Button>
          </ButtonGroup>
        </Col>
        <Col
          style={{
            height: "70vh",
            width: "100%",
          }}
          id="editor-canvas"
          className="position-relative"
          ref={editorCanvas}
        ></Col>
      </Row>

      <ModalTour />
    </Container>
  );
}

export default memo(EditorViewer3d);
