import React, { memo, useContext, useEffect, useRef, useState } from "react";
import { useLocation } from "@tanstack/react-router";
import ProgressBar from "react-bootstrap/esm/ProgressBar";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import { useUpdateCamera, useUpdateScene } from "@/app/hooks";
import ModalTour from "@/component/common/ModalTour";
import { editorInstance } from "@/three/instance/EditorInstance";
import ModalConfirm3d from "@/component/common/ModalConfirm3d";
import AlertBase from "@/component/common/AlertBase";
import { APP_COLOR, MessageError, RecordItem } from "@/app/type";
import { getProjectData } from "@/three/utils/util4Scene";
import { MyContext } from "@/app/MyContext";

import { Three3dEditor } from "@/three/threeObj/Three3dEditor";
import { errorMessage } from "@/app/utils";
import TransformControl from "./TransformControl/TransformControl";
import { SceneReload } from "@/app/customEvents/sceneEvent";

import { getEditorInstance } from "@/three/utils/utils";

function EditorViewer3d() {
  const editorCanvas: React.RefObject<HTMLDivElement> =
    useRef<HTMLDivElement>(null);
  // 使用 useRef 替代 useState
  const isInitialized = useRef(false);
  // const isLoaded = useRef(false);

  const { updateScene } = useUpdateScene();
  const { updateCamera } = useUpdateCamera();
  const [godTime, setGodTime] = useState(116); //用于刷新
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

      isInitialized.current = true; // 标记为已初始化

      updateScene(editor.scene);
      updateCamera(editor.camera);
      editorInstance.setEditor(editor);

      // editor.controls.enabled = true;

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
        const { editor } = getEditorInstance();

        editorInstance.resetUndo();
        editor.resetScene();
        getProjectData(item.id)
          .then((data: string) => {
            // 假设 deserialize 是异步方法
            editor.deserialize(data, item);

            editor.loadedModelsEnd = () => {
              // 在模型加载完成后更新场景
              // //  editor.addGridHelper();=[]
              editor.runJavascript();
              editor.destroyGUI();
              editor.scene.add(editor.HELPER_GROUP);

              setTimeout(() => {
                ModalConfirm3d({
                  title: "提示",
                  body: (
                    <AlertBase text={"加载完成"} type={APP_COLOR.Success} />
                  ),
                  confirmButton: {
                    show: true,
                  },
                });
              }, 1116);

              setTimeout(() => {
                ModalConfirm3d({
                  title: "提示",
                  body: (
                    <AlertBase text={"关闭窗口"} type={APP_COLOR.Success} />
                  ),
                  confirmButton: {
                    show: false,
                  },
                });
              }, 1998);
              const { userData } = getEditorInstance();
              userData.GOD_NUMBER.clearHistory = new Date().getTime(); //清除历史记录
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
                  body: (
                    <AlertBase text={"加载完成"} type={APP_COLOR.Success} />
                  ),
                  confirmButton: {
                    show: false,
                  },
                });
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
          })
          .catch((error: MessageError) => {
            errorMessage(error);
          });
      }
    }
    initScene(); // 添加事件监听器
    document.addEventListener("sceneReload", sceneReload as EventListener);

    return () => {
      const editor = editorInstance.getEditor();
      if (editor) {
        window.removeEventListener("resize", editor.onWindowResize);
      }
      document.removeEventListener("sceneReload", sceneReload as EventListener);
    };
  }, [sceneId, godTime]);
  function sceneReload(e: CustomEvent<SceneReload>) {
    setGodTime(e.detail.sceneId);
  }

  return (
    <Container fluid>
      <Row>
        <TransformControl />
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
