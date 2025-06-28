import { useUpdateScene } from "@/app/hooks";
import Icon from "@/component/common/Icon";
import Toast3d from "@/component/common/Toast3d";
import { editorInstance } from "@/three/instance/EditorInstance";
import { getThemeByScene } from "@/three/utils/util4UI";
import { useState } from "react";

import Button from "react-bootstrap/esm/Button";
import ButtonGroup from "react-bootstrap/esm/ButtonGroup";
import Col from "react-bootstrap/esm/Col";
import { TransformControlsMode } from "three/examples/jsm/controls/TransformControls.js";

export default function TransformControl() {
  const { scene } = useUpdateScene();
  const { themeColor } = getThemeByScene(scene);
  const [preStep, setPreStep] = useState("上一步");
  const [nextStep, setNextStep] = useState("下一步");
  function setMode(modeName: TransformControlsMode) {
    const editor = editorInstance.getEditor();
    const transfControls = editor.transformControl;
    transfControls.setMode(modeName);
  } // 实现撤销功能
  const handleUndo = () => {
    setNextStep("下一步");
    setPreStep("上一步");
    if (!editorInstance.undo()) {
      setPreStep("已到底");
      Toast3d("已到底");
    }
  };

  // 实现重做功能
  const handleRedo = () => {
    setNextStep("下一步");
    setPreStep("上一步");
    if (!editorInstance.redo()) {
      setNextStep("已到底");
      Toast3d("已到底");
    }
  };

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
        <Button variant={themeColor} onClick={handleUndo}>
          <Icon
            iconName="bi bi-arrow-90deg-left"
            title={preStep}
            placement="right"
          />
        </Button>
        <Button variant={themeColor} onClick={handleRedo}>
          <Icon
            iconName="bi bi-arrow-90deg-right"
            title={nextStep}
            placement="right"
          />
        </Button>
      </ButtonGroup>
    </Col>
  );
}
