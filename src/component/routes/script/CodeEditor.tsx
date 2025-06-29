import React, { useState, useEffect } from "react";
import Tabs from "react-bootstrap/esm/Tabs";
import Tab from "react-bootstrap/esm/Tab";
import Modal from "react-bootstrap/esm/Modal";
import ButtonGroup from "react-bootstrap/esm/ButtonGroup";
import Button from "react-bootstrap/esm/Button";

import Editor from "@monaco-editor/react";
import { monaco } from "react-monaco-editor";

import ModalConfirm3d from "@/component/common/ModalConfirm3d";
import { useUpdateScene } from "@/app/hooks";
import { APP_COLOR } from "@/app/type";
import UiButtonEditor from "@/component/routes/script/UiButtonEditor";
import Toast3d from "@/component/common/Toast3d";
import Icon from "@/component/common/Icon";
import { editorInstance } from "@/three/instance/EditorInstance";
import {
  CustomButtonList,
  customButtonListInit,
} from "@/three/config/Three3dConfig";
import { getThemeByScene } from "@/three/utils/util4UI";

interface CodeEditorProps {
  language?: string;
  code: string;
  show: boolean;
  tipsTitle: string;
  callback?: (value: string) => void;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  isValidate: boolean;
  children?: React.ReactNode;
  readOnly?: boolean;
}

// 使用 forwardRef 高阶函数
const CodeEditor = (props: CodeEditorProps) => {
  const {
    language = "javascript",
    show,
    setShow,
    children,
    code,
    tipsTitle,
    callback,
    isValidate,
    readOnly = false,
  } = props;
  const [error, setError] = useState(false);

  const [value, setValue] = useState<string>(code);
  const { scene } = useUpdateScene();
  const { themeColor } = getThemeByScene(scene);

  useEffect(() => {
    setValue(code);
  }, [code]);

  function handleClose() {
    if (!isValidate) {
      setShow(false);
      return;
    }
    if (error) {
      ModalConfirm3d(
        {
          title: "提示",
          body: "有语法错误，将不会保存到数据库中!",
          confirmButton: {
            show: true,
            closeButton: true,
            hasButton: true,
          },
        },
        () => {
          setShow(false);
          setError(false);
        }
      );
      return;
    }

    if (callback) {
      callback(value.replace(/'/g, '"'));
    }

    setShow(false);
  }
  function handleEditorChange(value: string | undefined) {
    if (value !== undefined) {
      setValue(value);
    }
  }
  const [monacoEditor, setMonacoEditor] =
    useState<monaco.editor.IStandaloneCodeEditor | null>(null);

  // 格式化代码函数
  const formatCode = async () => {
    if (monacoEditor) {
      // 获取格式化操作实例
      const formatAction = monacoEditor.getAction(
        "editor.action.formatDocument"
      );
      // 检查操作实例是否存在
      if (formatAction) {
        // 存在则执行格式化操作
        await formatAction.run();
        // 滚动到代码开头
        const position = { lineNumber: 1, column: 1 };
        monacoEditor.revealPosition(position, monaco.editor.ScrollType.Smooth);
        monacoEditor.setPosition(position);
      }
    }
  };
  function commonEditor() {
    return (
      <Editor
        height="66vh"
        defaultLanguage={language}
        defaultValue={"{}"}
        value={value}
        onChange={handleEditorChange}
        theme={themeColor ? `vs-${themeColor}` : "vs-dark"}
        onValidate={(e) => {
          setError(e.length > 0);
        }}
        onMount={(editor) => {
          setMonacoEditor(editor);
        }}
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: true,
          fontSize: 14,
          wordWrap: "on",
          readOnly,
          // 启用格式化功能
          formatOnType: true,
          formatOnPaste: true,
        }}
      />
    );
  }

  function getToggleButton() {
    if (tipsTitle === "按钮组编辑") {
      return (
        <Tabs
          defaultActiveKey="home"
          id="uncontrolled-tab-example"
          onSelect={() => {
            let customButtonList: CustomButtonList = customButtonListInit;
            try {
              // 尝试解析 JSON 字符串
              customButtonList = JSON.parse(value) as CustomButtonList;
            } catch (error) {
              // 解析失败，打印错误信息
              console.error("JSON 解析失败:", error);
              Toast3d("JSON 解析失败", "错误", APP_COLOR.Danger);
            }

            formatCode();
            const { scene } = editorInstance.getEditor();
            // 使用解析好的 customButtonList 变量
            scene.userData.customButtonList = customButtonList;
          }}
        >
          <Tab eventKey="home" title="UI编辑">
            <UiButtonEditor value={value} setValue={setValue}></UiButtonEditor>
          </Tab>
          <Tab eventKey="profile" title="代码编辑">
            {commonEditor()}
          </Tab>
        </Tabs>
      );
    }
  }

  return (
    <Modal size="xl" show={show} onHide={handleClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{tipsTitle ? tipsTitle : "代码编辑器"}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0 mt-1">
        {tipsTitle === "按钮组编辑" ? getToggleButton() : commonEditor()}
      </Modal.Body>
      <Modal.Footer>
        {children}
        <ButtonGroup size="sm">
          <Button variant={APP_COLOR.Danger} onClick={handleClose}>
            <Icon iconName="x-circle" title="关闭" />
          </Button>
        </ButtonGroup>
      </Modal.Footer>
    </Modal>
  );
};

export default CodeEditor;
