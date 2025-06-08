import { RefObject, useReducer } from "react";
import { useEffect, useRef, useState } from "react";
import { Container, ProgressBar } from "react-bootstrap";
import {
  ActionItemMap,
  APP_COLOR,
  Context116,
  CustomButtonListType,
  RecordItem,
} from "../app/type";
import { Object3D, Vector2 } from "three";
import Toast3d from "../component/common/Toast3d";
import {
  initEditorCamera,
  initEditorScene,
  initTourWindow,
  MyContext,
} from "../app/MyContext";
import ModalTour from "../component/common/ModalTour";
import { reducerCamera, reducerScene, reducerTour } from "../app/reducer";
import { getCamera, getScene, getDivElement } from "../three/init3dViewer";
import { getProjectData } from "../three/utils";

import InfoPanel from "./InfoPanel";
import {
  getPanelControllerButtonGroup,
  getRoamListByRoamButtonMap,
  getToggleButtonGroup,
  setPanelController,
} from "./buttonList/buttonGroup";
import { LabelInfoPanelController } from "./label/LabelInfoPanelController";
import { viewerInstance } from "../three/ViewerInstance";

import ModalConfirm3d from "../component/common/ModalConfirm3d";
import AlertBase from "../component/common/AlertBase";
import { Three3dViewer } from "../three/Three3dViewer";

/**
 * 其他应用可以调用此组件，
 * @returns
 */

export default function Viewer3d({
  item,
  canvasStyle = { height: "100vh", width: "100vw" },
  showProgress = true,
}: {
  item: RecordItem;
  showProgress: boolean;
  canvasStyle?: { height: string; width: string } & React.CSSProperties;
}) {
  // 修改为明确指定 HTMLDivElement 类型
  const canvas3d: RefObject<HTMLDivElement> = useRef(null);
  const isInitialized = useRef(false);

  const [scene, dispatchScene] = useReducer(reducerScene, initEditorScene);
  const [tourWindow, dispatchTourWindow] = useReducer(
    reducerTour,
    initTourWindow
  );
  const [camera, dispatchCamera] = useReducer(reducerCamera, initEditorCamera);

  useEffect(() => {
    if (canvas3d.current && !isInitialized.current) {
      const viewer = new Three3dViewer(canvas3d.current);
      viewerInstance.setEditor(viewer);
      console.log("初始化编辑器");

      viewer.controls.enabled = true;

      viewer.divElement.addEventListener("click", (event) =>
        viewer.onPointerClick(event)
      );
      window.addEventListener("resize", () => viewer.onWindowResize());
    }
    loadScene();
    return () => {
      const viewer = viewerInstance.getEditor();

      if (viewer) {
        window.removeEventListener("resize", viewer.onWindowResize);

        viewer.divElement.removeEventListener("click", viewer.onPointerClick);
      }
    };
  }, [item]);
  function loadScene() {
    if (item.id !== -1) {
      isInitialized.current = true; // 标记为已初始化
      const viewer = viewerInstance.getEditor();
      console.log("初始化编辑器完成", item.name);

      getProjectData(item.id).then((data) => {
        // 假设 deserialize 是异步方法
        viewer.deserialize(data, item);

        // 在模型加载完成后更新场景
        viewer.loadedModelsEnd = () => {
          viewer.runJavascript();
          //关了进度条
          if (showProgress) {
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
            }, 2116);
          }
        };
        if (showProgress) {
          viewer.onLoadProgress = (progress: number) => {
            ModalConfirm3d({
              title: "加载……",
              body: <ProgressBar now={progress} label={`${progress}%`} />,
              confirmButton: {
                show: true,
              },
            });
          };
        }
      });
    }
  }

  return (
    <MyContext.Provider
      value={{
        scene,
        dispatchScene,
        tourWindow,
        dispatchTourWindow,
        camera,
        dispatchCamera,
      }}
    >
      <Container fluid className="position-relative">
        <div style={canvasStyle} ref={canvas3d}></div>
        <ModalTour />
      </Container>
    </MyContext.Provider>
  );
}
