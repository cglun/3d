import { useEffect, useState } from "react";
import { TransformControlsMode } from "three/examples/jsm/controls/TransformControls.js";
import { useUpdateScene } from "@/app/hooks";
import Icon from "@/component/common/Icon";
import Toast3d from "@/component/common/Toast3d";
import { editorInstance } from "@/three/instance/EditorInstance";
import { getThemeByScene } from "@/three/utils/util4UI";
import Button from "react-bootstrap/esm/Button";
import ButtonGroup from "react-bootstrap/esm/ButtonGroup";
import Col from "react-bootstrap/esm/Col";
import ModalConfirm3d from "@/component/common/ModalConfirm3d";
import { SceneUserData } from "@/three/config/Three3dConfig";

export default function TransformControl() {
  const { scene } = useUpdateScene();
  const { themeColor } = getThemeByScene(scene);
  const [preStep, setPreStep] = useState("上一步");
  const [nextStep, setNextStep] = useState("下一步");
  const [undoStackLen, setUndoStackLen] = useState(0);
  const { GOD_NUMBER } = scene.userData as SceneUserData;
  const clearHistoryTime = GOD_NUMBER?.clearHistory || 116;

  const [flag, setFlag] = useState(0);
  function setMode(modeName: TransformControlsMode) {
    const editor = editorInstance.getEditor();
    const transfControls = editor.transformControl;
    transfControls.setMode(modeName);
  }

  useEffect(() => {
    const lengthChange = ((e: CustomEvent) => {
      setFlag(e.detail.flag);
      setUndoStackLen(e.detail.flag + 1);
    }) as EventListener;
    document.addEventListener("commandLengthChange", lengthChange);
    return () => {
      document.removeEventListener("commandLengthChange", lengthChange);
    };
  }, []);
  useEffect(() => {
    clearHistory();
  }, [clearHistoryTime]);
  // 实现上一步
  const handleLeft = () => {
    if (flag > 0) {
      setPreStep(`第${flag}步`);
      editorInstance.do(flag);
      setFlag(flag - 1);
    }
    if (flag === 0) {
      setPreStep("已到底");
      Toast3d("已到底");
    }
  };
  // 实现下一步
  const handleRight = () => {
    const len = editorInstance.undoStack.length;
    if (flag < len - 1) {
      setNextStep(`第${flag + 2}步`);
      editorInstance.do(flag);
      setFlag(flag + 1);
    }
    if (flag === len - 1 || len === 0) {
      setNextStep("已到底");
      Toast3d("已到底");
    }
  };

  // 实现历史功能
  const handleHistory = () => {
    const { undoStack } = editorInstance;
    const editor = editorInstance.getEditor();
    const history = editor.createGUI("历史记录");

    undoStack.forEach((item, index) => {
      // 添加 execute 按钮并获取其 DOM 元素
      const historyItem = history
        .add(item, "execute")
        .name(`【${index + 1}】${item.buttonName()}`);
      const buttonDom =
        historyItem.domElement.children[0].children[0].children[0];
      // 为按钮添加点击事件监听器
      if (flag === index) {
        historyItem.disable(true);
        buttonDom.classList.add("text-warning");
      }
      buttonDom.addEventListener("click", () => {
        // 修改按钮背景颜色，可按需调整颜色值
        // flag = index;
        setFlag(index);
      });
    });
  };
  const handleClear = () => {
    ModalConfirm3d(
      {
        title: "清空历史？",
        body: "清空后，您将无法恢复之前的操作!",
      },
      () => {
        clearHistory();
      }
    );
  };
  function clearHistory() {
    editorInstance.undoStack = [];
    setUndoStackLen(0);
    setFlag(0);
    const editor = editorInstance.getEditor();
    editor?.destroyGUI();
  }

  return (
    <Col xs="auto" className="d-flex flex-column left-btn-group">
      <div style={{ flexGrow: 10 }}></div>
      <ButtonGroup style={{ flexGrow: 1 }} size="sm" vertical>
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
            placement="right"
          />
        </Button>
        <Button
          variant={themeColor}
          onClick={() => {
            setMode("rotate");
          }}
        >
          <Icon iconName="bi bi-arrow-repeat" title="旋转" placement="right" />
        </Button>
        <Button
          variant={themeColor}
          onClick={() => {
            setMode("scale");
          }}
        >
          <Icon
            iconName="bi bi-arrows-angle-expand"
            title="缩放"
            placement="right"
          />
        </Button>

        {/* <Button
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
                     </Button> */}
      </ButtonGroup>

      <ButtonGroup style={{ flexGrow: 1 }} size="sm" vertical>
        <Button
          variant={themeColor}
          onClick={handleLeft}
          onMouseEnter={() => {
            setPreStep(`第${flag + 1}步`);
          }}
        >
          <Icon
            iconName="bi bi-arrow-90deg-left"
            title={preStep}
            placement="right"
          />
        </Button>

        <Button
          variant={themeColor}
          onClick={handleRight}
          onMouseEnter={() => {
            setNextStep(`第${flag + 1}步`);
          }}
        >
          <Icon
            iconName="bi bi-arrow-90deg-right"
            title={nextStep}
            placement="right"
          />
        </Button>
        {undoStackLen > 0 && (
          <>
            <Button variant={themeColor} onClick={handleHistory}>
              <Icon
                iconName="bi bi-clock-history"
                title="历史"
                placement="right"
              />
            </Button>
            <Button variant={themeColor} onClick={handleClear}>
              <Icon iconName="trash2" title="清空历史" placement="right" />
            </Button>
          </>
        )}
      </ButtonGroup>
    </Col>
  );
}
