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
import { initEditorScene, initTourWindow, MyContext } from "../app/MyContext";
import ModalTour from "../component/common/ModalTour";
import { reducerScene, reducerTour } from "../app/reducer";
import initScene, {
  getCamera,
  getRenderer,
  getScene,
  setCamera,
  setScene,
  getLabelRenderer,
  getDivElement,
  getControls,
  getAll,
  getUserData,
} from "../three/init3dViewer";
import {
  getProjectData,
  onWindowResize,
  sceneDeserialize,
  setLabel,
  finishLoadExecute,
  loadModelByUrl,
  removeCanvasChild,
} from "../three/utils";
import { raycasterSelect } from "../three/common3d";

import InfoPanel from "./InfoPanel";
import {
  getPanelControllerButtonGroup,
  getRoamListByRoamButtonMap,
  getToggleButtonGroup,
  setPanelController,
} from "./buttonList/buttonGroup";
import { LabelInfoPanelController } from "./label/LabelInfoPanelController";
import { viewerInstance } from "../three/ViewerInstance";
import { Three3dEditor } from "../three/Three3dEditor";
import ModalConfirm3d from "../component/common/ModalConfirm3d";
import AlertBase from "../component/common/AlertBase";

/**
 * 其他应用可以调用此组件，
 * @returns
 */

export default function Viewer3d({
  item,
  canvasStyle = { height: "100vh", width: "100vw" },
  callBack,
  callBackError,
  getProgress,
}: {
  item: RecordItem;
  canvasStyle?: { height: string; width: string } & React.CSSProperties;
  callBack?: (item: Context116) => void;
  callBackError?: (error: unknown) => void;
  getProgress?: (progress: number) => void;
}) {
  // 修改为明确指定 HTMLDivElement 类型
  const canvas3d: RefObject<HTMLDivElement> = useRef(null);
  const isInitialized = useRef(false);

  const [progress, setProgress] = useState(0);
  const [position, setPosition] = useState(new Vector2(0, 0));
  const [show, setShow] = useState(false);
  const [info, setInfo] = useState<RecordItem>({
    id: 3,
    name: "",
    des: "",
    cover: "",
  });

  const [scene, dispatchScene] = useReducer(reducerScene, initEditorScene);
  const [tourWindow, dispatchTourWindow] = useReducer(
    reducerTour,
    initTourWindow
  );

  let modelNum = 0;
  function loadScene(item: RecordItem) {}

  function loadMesh(item: RecordItem) {}

  return "";

  useEffect(() => {
    // let editor: Three3dEditor;
    if (canvas3d.current && !isInitialized.current) {
      const editor = new Three3dEditor(canvas3d.current);
      viewerInstance.setEditor(editor);
      console.log("初始化编辑器");

      editor.controls.enabled = true;

      editor.divElement.addEventListener("pointerdown", (event) =>
        editor.onPointerDown(event)
      );
      editor.divElement.addEventListener("pointerup", (event) =>
        editor.onPointerUp(event)
      );
      editor.divElement.addEventListener("click", (event) =>
        editor.onPointerMove(event)
      );
      window.addEventListener("resize", () => editor.onWindowResize());
    }

    if (item.id !== -1 && !isInitialized.current) {
      isInitialized.current = true; // 标记为已初始化
      const editor = viewerInstance.getEditor();
      getProjectData(item.id).then((data) => {
        // 假设 deserialize 是异步方法
        editor.deserialize(data, item);

        // 在模型加载完成后更新场景
        editor.loadedModelsEnd = () => {
          editor.runJavascript();

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
        };
      });
    }

    return () => {
      const editor = viewerInstance.getEditor();

      if (editor) {
        window.removeEventListener("resize", editor.onWindowResize);

        editor.divElement.removeEventListener("click", editor.onPointerMove);
      }
    };
  }, [item]);

  function clickHandler(event: MouseEvent) {
    const divElement = getDivElement();
    const currentObject = raycasterSelect(
      event,
      getCamera(),
      getScene(),
      divElement
    );
    const selectedMesh: Object3D[] = [];
    for (let i = 0; i < currentObject.length; i++) {
      const { object } = currentObject[i];
      if (!object.userData.isHelper) {
        selectedMesh.push(object);
      }
    }

    if (selectedMesh.length > 0) {
      const customButtonList: CustomButtonListType =
        getScene().userData.customButtonList;
      const { listGroup } = customButtonList.toggleButtonGroup;
      const listGroupCanBeClick = listGroup.filter(
        (item: ActionItemMap) => item.isClick
      );

      const parentName = selectedMesh[0].parent?.name ?? "";

      // 修改为检查 groupNameList 中是否有对象的 NAME_ID 等于 parentName

      // const isParentNameInList = listGroup.some(
      //   (item: ActionItemMap) => item.isClick && item.NAME_ID === parentName
      // );

      // const isParentNameInList = listGroupCanBeClick.find(
      //   (_actionItem1: ActionItemMap) => {
      //     if (_actionItem1.NAME_ID === parentName) {
      //       return true;
      //     }
      //     return false;
      //   }
      // );

      // const isParentNameInList = listGroupCanBeClick.includes(parentName);
      const isParentNameInList = listGroupCanBeClick.some(
        (item: ActionItemMap) =>
          item.NAME_ID === parentName && item.groupCanBeRaycast
      );

      if (!isParentNameInList) {
        setShow(false);
        return;
      }

      Toast3d("选中的模型" + selectedMesh[0].name, "提示", APP_COLOR.Primary);

      setPosition(new Vector2(event.offsetX + 16, event.offsetY + 6));
      setShow(true);
      setInfo({
        name: selectedMesh[0].name,
        des: "",
        cover: "",
        id: 0,
      });
    }
    if (selectedMesh.length === 0) {
      setShow(false);
    }
  }

  return (
    <MyContext.Provider
      value={{ scene, dispatchScene, tourWindow, dispatchTourWindow }}
    >
      <Container fluid className="position-relative">
        {progress < 100 && !getProgress && (
          <div className="mb-1 mx-auto" style={{ width: "300px" }}>
            <ProgressBar now={progress} label={`${progress}%`} />
          </div>
        )}
        <div style={canvasStyle} ref={canvas3d}></div>
        <InfoPanel position={position} info={info} show={show} />
        <ModalTour />
      </Container>
    </MyContext.Provider>
  );
}
