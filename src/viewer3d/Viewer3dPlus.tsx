import { useReducer, useEffect, useRef, useState, Suspense, memo } from "react";
import { APP_COLOR, DELAY, MessageError, RecordItem } from "@/app/type";

import {
  initEditorCamera,
  initEditorScene,
  initTourWindow,
  MyContext,
} from "@/app/MyContext";
import ModalTour from "@/component/common/ModalTour";
import { reducerCamera, reducerScene, reducerTour } from "@/app/reducer";
import { viewerInstance } from "@/three/instance/ViewerInstance";
import { Three3dViewer } from "@/three/threeObj/Three3dViewer";
import { getProjectData } from "@/three/utils/util4Scene";
import Container from "react-bootstrap/esm/Container";
import ProgressBar from "react-bootstrap/esm/ProgressBar";
import { errorMessage } from "@/app/utils";
import {
  CustomButtonGroup,
  customButtonGroupListInit,
  GenerateButtonGroup,
  SceneUserData,
} from "@/three/config/Three3dConfig";
import {
  getButtonGroupItemStyle,
  getButtonGroupStyle,
} from "@/component/routes/effects/utils";
import { getListGroupByIndex, getViewerInstance } from "@/three/utils/utils";
import Toast3dPlus, {
  Toast3dPlusProps,
} from "@/component/common/Toast3d/Toast3dPlus";
import EmergencyPlanButtonGroup from "@/component/routes/extend/extendButton/EmerGencyPlanButtonGroup";

/**
 * 其他应用可以调用此组件，
 * @returns
 */

export default function Viewer3dPlus({
  item,
  callBack,
  showButtonGroup = true,
  showProgress = true,
  canvasStyle = { height: "100vh", width: "100vw" },
}: {
  item: RecordItem;
  callBack: (viewer: Three3dViewer) => void;
  showProgress?: boolean;
  canvasStyle?: { height: string; width: string } & React.CSSProperties;
  showButtonGroup?: boolean;
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
  const configGroup = { ...customButtonGroupListInit };
  const [generateButtonGroup, setGenerateButtonGroup] =
    useState<GenerateButtonGroup>(configGroup.generateButtonGroup);
  const [customButtonGroup, setCustomButtonGroup] = useState<CustomButtonGroup>(
    configGroup.customButtonGroup
  );
  if (import.meta.env.PROD) {
    document.body.setAttribute("data-bs-theme", "dark");
  }

  useEffect(() => {
    if (canvas3d.current && !isInitialized.current) {
      isInitialized.current = true; // 标记为已初始化

      const viewer = new Three3dViewer(canvas3d.current, dispatchTourWindow);
      viewerInstance.setViewer(viewer);
      viewer.controls.enabled = true;
      viewer.divElement.addEventListener("click", (event) =>
        viewer.onPointerClick(event)
      );
      window.addEventListener("resize", () => viewer.onWindowResize());
    }

    if (item.des.includes("EDITOR_3D")) {
      if (item.des.includes("Scene")) {
        loadScene();
      }
    }

    return () => {
      const viewer = viewerInstance.getViewer();
      if (viewer) {
        window.removeEventListener("resize", viewer.onWindowResize);
        viewer.divElement.removeEventListener("click", viewer.onPointerClick);
      }
      canvas3d.current = null;
    };
  }, [item]);

  function loadScene() {
    getProjectData(item.id).then((data: string) => {
      // console.log("loadScene,要清空原来的哦");
      const viewer = viewerInstance.getViewer();
      viewer.resetScene();
      viewer.deserialize(data, item);

      setLoadProgress(viewer);
    });
  }

  function setLoadProgress(viewer: Three3dViewer) {
    // 在模型加载完成后更新场景
    viewer.loadedModelsEnd = () => {
      const desJSON = JSON.parse(item.des);

      if (desJSON.type === "Scene") {
        viewer.runJavascript();
        viewer.setCanBeRaycast();
        viewer.setOutLinePassColor();
        const { customButtonGroupList } = viewer.scene
          .userData as SceneUserData;
        if (showButtonGroup) {
          const { generateButtonGroup, customButtonGroup } =
            customButtonGroupList;
          setGenerateButtonGroup(generateButtonGroup);
          setCustomButtonGroup(customButtonGroup);
        }

        callBack(viewer);
      }

      //关了进度条
      if (showProgress) {
        setProgress(100);
      }
    };
    viewer.onLoadError = (error: MessageError) => {
      errorMessage(error);
    };

    if (showProgress) {
      viewer.onLoadProgress = (progress: number) => {
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
        <EmergencyPlanButtonGroup instance={viewerInstance.getViewer()} />
        <ModalTour />
        {showButtonGroup && (
          <Suspense fallback={<div>Loading...</div>}>
            <GenerateButtonGroupShow
              groupIndex={0}
              generateButtonGroup={generateButtonGroup}
              setGenerateButtonGroup={setGenerateButtonGroup}
            />
            <GenerateButtonGroupShow
              groupIndex={1}
              generateButtonGroup={generateButtonGroup}
              setGenerateButtonGroup={setGenerateButtonGroup}
            />
            <GenerateButtonGroupShow
              groupIndex={2}
              generateButtonGroup={generateButtonGroup}
              setGenerateButtonGroup={setGenerateButtonGroup}
            />

            <CustomButtonGroupShow
              customButtonGroup={customButtonGroup}
              setCustomButtonGroup={setCustomButtonGroup}
            />
          </Suspense>
        )}
      </Container>
    </MyContext.Provider>
  );
}

function GenerateButtonGroupShow({
  groupIndex,
  generateButtonGroup,
  setGenerateButtonGroup,
}: {
  groupIndex: number;
  generateButtonGroup: GenerateButtonGroup;
  setGenerateButtonGroup: (generateButtonGroup: GenerateButtonGroup) => void;
}) {
  const { customButtonItem } = generateButtonGroup.group[groupIndex];
  const { showGroup, buttonGroupStyle } = customButtonItem;
  const viewer = viewerInstance.getViewer();

  if (!viewer) {
    return;
  }

  const positionStyle = getButtonGroupStyle(
    customButtonItem,
    showGroup,
    viewer.divElement
  );

  const listGroup = getListGroupByIndex(groupIndex);
  if (!showGroup) {
    return;
  }
  return (
    <div style={positionStyle}>
      {listGroup.map((item, index) => {
        const buttonStyle = getButtonGroupItemStyle(item, buttonGroupStyle);
        if (!item.showButton) {
          return;
        }

        return (
          <button
            key={index}
            style={{
              ...buttonStyle,
            }}
            onClick={() => {
              const newGroup = resetGenerateButtonGroupClick(
                generateButtonGroup,
                groupIndex,
                index
              );
              // 正确更新 generateButtonGroup 状态
              setGenerateButtonGroup({ ...generateButtonGroup, ...newGroup });
              item.handler(item.NAME_ID);
            }}
          >
            {item.showName}
          </button>
        );
      })}
    </div>
  );
}
memo(GenerateButtonGroupShow);

function CustomButtonGroupShow({
  customButtonGroup,
  setCustomButtonGroup,
}: {
  customButtonGroup: CustomButtonGroup;
  setCustomButtonGroup: (customButtonGroup: CustomButtonGroup) => void;
}) {
  const { group } = customButtonGroup;
  const [toast3dPlusProps, setToast3dPlusProps] = useState<Toast3dPlusProps>({
    show: false,
    content: "content",
    title: "提示",
    type: APP_COLOR.Success,
    delay: DELAY.MIDDLE,
  });
  return group.map((item, index) => {
    const { listGroup, showGroup, buttonGroupStyle } = item;
    const { group } = customButtonGroup;
    const { viewer } = getViewerInstance();

    const positionStyle = getButtonGroupStyle(
      group[index],
      showGroup,
      viewer.divElement
    );
    if (!showGroup) {
      return;
    }
    function Toast3d(content: string, type?: APP_COLOR, title?: string) {
      setToast3dPlusProps({
        ...toast3dPlusProps,
        show: true,
        content,
        title: title ?? "提示",
        type: type ?? APP_COLOR.Success,
      });
    }
    return (
      <>
        <div
          key={index}
          style={{
            ...positionStyle,
          }}
        >
          {listGroup.map((_item, _index) => {
            const buttonStyle = getButtonGroupItemStyle(
              _item,
              buttonGroupStyle
            );
            if (!_item.showButton) {
              return;
            }

            return (
              <button
                key={_index}
                style={{ ...buttonStyle }}
                onClick={() => {
                  const viewerIns = viewerInstance.getViewer();
                  const newGroup = resetCustomButtonGroupClick(
                    customButtonGroup,
                    index,
                    _index
                  );
                  if (viewerIns) {
                    new Function("viewerIns", "iToast", _item.codeString)(
                      viewerIns,
                      {
                        APP_COLOR,
                        Toast3d,
                      }
                    );
                  }

                  setCustomButtonGroup({
                    ...customButtonGroup,
                    ...newGroup,
                  });
                }}
              >
                {_item.showName}
              </button>
            );
          })}
        </div>
        <Toast3dPlus
          toast3dPlusProps={toast3dPlusProps}
          setToast3dPlusProps={setToast3dPlusProps}
        />
      </>
    );
  });
}

function resetGenerateButtonGroupClick(
  generateButtonGroup: GenerateButtonGroup,
  parentIndex: number,
  childrenIndex: number
) {
  const newGroup = generateButtonGroup.group[
    parentIndex
  ].customButtonItem.listGroup.map((item, index) => {
    // 深拷贝每个 customButtonItem 及其 listGroup
    item.isClick = false;
    if (childrenIndex === index) {
      item.isClick = true;
    }
  });

  return newGroup;
}
function resetCustomButtonGroupClick(
  customButtonGroup: CustomButtonGroup,
  parentIndex: number,
  childrenIndex: number
) {
  const newGroup = customButtonGroup.group[parentIndex].listGroup.map(
    (item, index) => {
      item.isClick = false;
      if (childrenIndex === index) {
        item.isClick = true;
      }
      return item;
    }
  );

  return newGroup;
}
