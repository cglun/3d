import { useState } from "react";
import ListGroup from "react-bootstrap/esm/ListGroup";
import ButtonGroup from "react-bootstrap/esm/ButtonGroup";
import Button from "react-bootstrap/esm/Button";
import Container from "react-bootstrap/esm/Container";
import { createLazyFileRoute } from "@tanstack/react-router";
import CodeEditor from "@/component/routes/script/CodeEditor";
import { useUpdateScene } from "@/app/hooks";
import AlertBase from "@/component/common/AlertBase";
import { APP_COLOR } from "@/app/type";
import { getButtonColor, getThemeByScene } from "@/three/utils/util4UI";
import Icon from "@/component/common/Icon";
import { styleBody } from "@/component/Editor/OutlineView/fontColor";
import { SceneUserData } from "@/three/config/Three3dConfig";
import { editorInstance } from "@/three/instance/EditorInstance";
import UpdateDateBase from "@/component/common/UpdateDateBase";
import ModalConfirm3d from "@/component/common/ModalConfirm3d";

export const Route = createLazyFileRoute("/editor3d/script")({
  component: RouteComponent,
});

function RouteComponent() {
  const { scene, updateScene } = useUpdateScene(); // const [javaScriptCode, setJavaScriptCode] = useState<string>(javascript);
  const [showJavaScript, setShowJavaScript] = useState(false); // 是否为调试场景[调试场景不允许修改代码]
  const [showAllConfig, setShowAllConfig] = useState(false); // 使用可选属性和类型断言
  const [showCustomInput, setShowCustomInput] = useState(false); // 是否为调试场景[调试场景不允许修改代码]
  const [showCustomOutput, setShowCustomOutput] = useState(false); // 是否为调试场景[调试场景不允许修改代码]
  const { javascript, projectId, customInputList, customOutputList } =
    scene.userData as SceneUserData;

  // 获取主题颜色
  const { themeColor } = getThemeByScene(scene);
  const buttonColor = getButtonColor(themeColor);

  //复制一份数据，然后去掉对象的selected3d属性，不然要序列化会报错，要报废

  const userDataString = JSON.stringify(scene.userData, null, 3);

  function getScene() {
    const { scene } = editorInstance.getEditor();
    return scene;
  }
  return (
    <Container fluid>
      <ListGroup.Item>
        <AlertBase
          className="mb-0 mt-0"
          type={APP_COLOR.Secondary}
          text={
            "开发调试，可以在【/src/three/scriptDev.ts】中编写脚本进行调试，调试完成后，复制到此处保存!"
          }
        />
      </ListGroup.Item>

      <ListGroup>
        {/* {projectId && projectId !== -1 && ( */}

        <ListGroup.Item>
          <ButtonGroup size="sm">
            <Button
              variant={buttonColor}
              style={{ borderColor: styleBody.color }}
              onClick={() => {
                setShowJavaScript(true);
              }}
            >
              <Icon iconName="file-code" gap={1} />
              代码
            </Button>
            <Button
              variant={buttonColor}
              style={{ borderColor: styleBody.color }}
              onClick={() => {
                setShowCustomInput(true);
              }}
            >
              <Icon iconName="node-plus-fill" gap={1} />
              输入
            </Button>
            <Button
              variant={buttonColor}
              style={{ borderColor: styleBody.color }}
              onClick={() => {
                setShowCustomOutput(true);
              }}
            >
              <Icon iconName="node-minus-fill" gap={1} />
              输出
            </Button>

            <Button
              variant={buttonColor}
              style={{ borderColor: styleBody.color }}
              onClick={() => {
                setShowAllConfig(true);
              }}
            >
              <Icon iconName="building-gear" gap={1} />
              一键配置
            </Button>
            <Button
              variant={buttonColor}
              style={{ borderColor: styleBody.color }}
              onClick={() => {
                ModalConfirm3d({
                  title: "更新字段",
                  body: <UpdateDateBase />,
                  size: "lg",
                  confirmButton: {
                    show: true,
                    hasButton: false,
                    closeButton: true,
                  },
                });
              }}
            >
              <Icon iconName="bi bi-arrow-clockwise" gap={1} />
              更新字段
            </Button>
          </ButtonGroup>
          <CodeEditor
            tipsTitle="脚本编辑"
            code={javascript}
            isValidate={true}
            show={showJavaScript}
            setShow={setShowJavaScript}
            callback={function (value): void {
              getScene().userData.javascript = value;
              updateScene(scene);
            }}
          />
          <CodeEditor
            tipsTitle="INPUT"
            language="javascript"
            code={customInputList}
            isValidate={true}
            show={showCustomInput}
            setShow={setShowCustomInput}
            callback={function (value): void {
              getScene().userData.customInputList = value;
              updateScene(scene);
            }}
          />
          <CodeEditor
            tipsTitle="OUTPUT"
            language="javascript"
            code={customOutputList}
            isValidate={true}
            show={showCustomOutput}
            setShow={setShowCustomOutput}
            callback={function (value): void {
              getScene().userData.customOutputList = value;
              updateScene(scene);
            }}
          />

          <CodeEditor
            tipsTitle="一键配置"
            language="json"
            code={userDataString}
            isValidate={true}
            show={showAllConfig}
            setShow={setShowAllConfig}
            callback={function (value): void {
              getScene().userData = JSON.parse(value);
              getScene().userData.projectId = projectId; // 防止项目id丢失
              updateScene(getScene());
            }}
          />
        </ListGroup.Item>
      </ListGroup>
    </Container>
  );
}
