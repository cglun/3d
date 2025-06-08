import { RefObject, useReducer } from "react";
import { useEffect, useRef, useState } from "react";
import { Container, ProgressBar } from "react-bootstrap";
import {
  ActionItemMap,
  APP_COLOR,
  Context116,
  CustomButtonListType,
  GlbModel,
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

import { Three3dViewer } from "../three/Three3dViewer";
import { If } from "three/tsl";

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
  showProgress?: boolean;
  canvasStyle?: { height: string; width: string } & React.CSSProperties;
}) {
  // 修改为明确指定 HTMLDivElement 类型
  const canvas3d = useRef(null);
  const isInitialized = useRef(false);
  const [progress, setProgress] = useState(0);
  const [scene, dispatchScene] = useReducer(reducerScene, initEditorScene);
  const [tourWindow, dispatchTourWindow] = useReducer(
    reducerTour,
    initTourWindow
  );
  const [camera, dispatchCamera] = useReducer(reducerCamera, initEditorCamera);

  useEffect(() => {
    if (canvas3d.current && !isInitialized.current) {
      console.log("Viewer3d", item.id);
      const viewer = new Three3dViewer(canvas3d.current);
      viewerInstance.setViewer(viewer);
      console.log("初始化编辑器");

      viewer.controls.enabled = true;

      viewer.divElement.addEventListener("click", (event) =>
        viewer.onPointerClick(event)
      );
      window.addEventListener("resize", () => viewer.onWindowResize());
    }
    if (item.des === "Scene") {
      loadScene();
    }
    if (item.des === "Mesh") {
      loadMesh();
    }

    return () => {
      const viewer = viewerInstance.getViewer();

      if (viewer) {
        window.removeEventListener("resize", viewer.onWindowResize);

        viewer.divElement.removeEventListener("click", viewer.onPointerClick);
      }
    };
  }, [item]);

  function loadScene() {
    isInitialized.current = true; // 标记为已初始化
    const viewer = viewerInstance.getViewer();
    getProjectData(item.id).then((data) => {
      viewer.deserialize(data, item);
      setLoadProgress(viewer);
    });
  }
  // 加载模型
  function loadMesh() {
    isInitialized.current = true; // 标记为已初始化
    const viewer = viewerInstance.getViewer();
    viewer.addOneModel(item);
    setLoadProgress(viewer);
  }

  function setLoadProgress(viewer: Three3dViewer) {
    // 在模型加载完成后更新场景
    viewer.loadedModelsEnd = () => {
      if (item.des === "Scene") {
        viewer.runJavascript();
      }

      //关了进度条
      if (showProgress) {
        setProgress(100);
      }
    };
    viewer.onLoadError = (error: string) => {
      Toast3d("有错误,看控制台", "提示", APP_COLOR.Danger);
      console.error(error);
    };

    if (showProgress) {
      viewer.onLoadProgress = (progress: number) => {
        debugger;
        setProgress(progress);
      };
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
        {showProgress && progress < 100 && (
          <div className="mb-1 mx-auto" style={{ width: "300px" }}>
            <ProgressBar now={progress} label={`${progress}%`} />
          </div>
        )}
        <div style={canvasStyle} ref={canvas3d}></div>
        <ModalTour />
      </Container>
    </MyContext.Provider>
  );
}
