import { useReducer, useEffect, useRef, useState, Suspense, memo } from "react";
import { MessageError, RecordItem } from "@/app/type";

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
  generateButtonGroupItem,
  getButtonGroupStyle,
} from "@/component/routes/effects/utils";
import {
  getEditorInstance,
  getListGroupByIndex,
  getShowButtonStyle,
} from "@/three/utils/utils";

/**
 * 其他应用可以调用此组件，
 * @returns
 */

export default function Viewer3dPlus({
  item,
  canvasStyle = { height: "100vh", width: "100vw" },
  showProgress = true,
  callBack,
}: {
  item: RecordItem;
  showProgress?: boolean;
  dev?: "editor3d" | "viewer3d";
  canvasStyle?: { height: string; width: string } & React.CSSProperties;
  callBack: (viewer: Three3dViewer) => void;
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

  useEffect(() => {
    if (canvas3d.current && !isInitialized.current) {
      isInitialized.current = true; // 标记为已初始化
      console.log("Viewer3d", item.id);
      const viewer = new Three3dViewer(canvas3d.current, dispatchTourWindow);
      viewerInstance.setViewer(viewer);
      viewer.controls.enabled = true;
      viewer.divElement.addEventListener("click", (event) =>
        viewer.onPointerClick(event)
      );
      window.addEventListener("resize", () => viewer.onWindowResize());
    }

    if (item.des === "Scene") {
      loadScene();
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
    const viewer = viewerInstance.getViewer();
    getProjectData(item.id).then((data: string) => {
      // console.log("loadScene,要清空原来的哦");
      viewer.resetScene();
      viewer.deserialize(data, item);

      setLoadProgress(viewer);
    });
  }

  function setLoadProgress(viewer: Three3dViewer) {
    // 在模型加载完成后更新场景
    viewer.loadedModelsEnd = () => {
      if (item.des === "Scene") {
        viewer.runJavascript();
        viewer.setCanBeRaycast();
        viewer.setOutLinePassColor();
        const { customButtonGroupList } = viewer.scene
          .userData as SceneUserData;
        const { generateButtonGroup, customButtonGroup } =
          customButtonGroupList;
        setGenerateButtonGroup(generateButtonGroup);
        setCustomButtonGroup(customButtonGroup);

        callBack(viewer);
      }

      //关了进度条
      if (showProgress) {
        setProgress(100);
        // 添加场景加载完成事件
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
        <ModalTour />
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

          <CustomButtonGroupShow />
        </Suspense>
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

  const positionStyle = getButtonGroupStyle(customButtonItem);
  const { showGroup, buttonGroupStyle } = customButtonItem;
  const { editor } = getEditorInstance();

  if (editor === undefined) {
    return;
  }

  const listGroup = getListGroupByIndex(groupIndex);
  useEffect(() => {
    return () => {
      // viewerInstance.getViewer() = null;
    };
  }, []);

  return (
    <div
      style={{
        ...positionStyle,
        visibility: showGroup ? "visible" : "hidden",
        flexDirection: buttonGroupStyle.direction === "row" ? "row" : "column",
        position: "absolute",
      }}
    >
      {listGroup.map((item, index) => {
        const buttonStyle = generateButtonGroupItem(item, buttonGroupStyle);
        const showButtonStyle = getShowButtonStyle(item);

        return (
          <button
            key={index}
            style={{
              ...buttonStyle,
              ...showButtonStyle,
            }}
            onClick={() => {
              const newGroup = generateButtonGroup.group.map((x, xIndex) => {
                // 深拷贝每个 customButtonItem 及其 listGroup
                const customButtonItem = {
                  ...x.customButtonItem,
                  listGroup: x.customButtonItem.listGroup.map((y, yIndex) => {
                    const newItem = { ...y, isClick: true };
                    if (xIndex === groupIndex && yIndex === index) {
                      newItem.isClick = true;
                    }
                    return newItem;
                  }),
                };
                return { ...x, customButtonItem };
              });
              // 正确更新 generateButtonGroup 状态
              setGenerateButtonGroup({
                ...generateButtonGroup,
                ...newGroup,
              });
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

function CustomButtonGroupShow() {
  return <>CustomButtonGroupShow</>;
  const { scene, updateScene } = useUpdateScene();
  const { customButtonGroupList } = scene.userData as SceneUserData;
  const { group } = customButtonGroupList.customButtonGroup;
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [showCodeWindow, setShowCodeWindow] = useState(false);
  const codeString = group[x]?.listGroup[y]?.codeString || "";

  return group.map((item, index) => {
    const { listGroup, showGroup, buttonGroupStyle } = item;
    const { group } = customButtonGroupList.customButtonGroup;
    const positionStyle = getButtonGroupStyle(group[index]);
    return (
      <>
        <div
          key={index}
          style={{
            ...positionStyle,
            visibility: showGroup ? "visible" : "hidden",
            flexDirection:
              buttonGroupStyle.direction === "row" ? "row" : "column",
            position: "absolute",
          }}
        >
          {listGroup.map((_item, _index) => {
            const buttonStyle = generateButtonGroupItem(
              _item,
              buttonGroupStyle
            );
            const showButtonStyle = getShowButtonStyle(_item);

            return (
              <button
                key={_index}
                style={{ ...buttonStyle, ...showButtonStyle }}
                onClick={() => {
                  console.log(`名称：${_item.showName},ID：${_item.NAME_ID} `);
                  const viewerIns = viewerInstance?.getViewer();
                  if (viewerIns) {
                    new Function("viewerIns", _item.codeString)(viewerIns);
                    //如果是预览模式，不执行下面的了。
                  }
                }}
              >
                {_item.showName}
              </button>
            );
          })}
        </div>
      </>
    );
  });
}

function resetClick() {}
