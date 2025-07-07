import Button from "react-bootstrap/esm/Button";
import ButtonGroup from "react-bootstrap/esm/ButtonGroup";
import ListGroup from "react-bootstrap/esm/ListGroup";
import ListGroupItem from "react-bootstrap/esm/ListGroupItem";
import Tab from "react-bootstrap/esm/Tab";
import Tabs from "react-bootstrap/esm/Tabs";
import { useUpdateScene } from "@/app/hooks";
import {
  customButtonGroupListInit,
  SceneUserData,
} from "@/three/config/Three3dConfig";
import Icon from "@/component/common/Icon";
import { useState } from "react";
import { getButtonColor, getThemeByScene } from "@/three/utils/util4UI";
import CodeEditor from "@/component/routes/script/CodeEditor";
import CustomButtonGroup from "@/component/routes/extend/extendButton/CustomButtonGroup";
import GenerateButtonGroup from "@/component/routes/extend/extendButton/GenerateButtonGroup";
import { editorInstance } from "@/three/instance/EditorInstance";

export default function Index() {
  const { scene } = useUpdateScene();
  const { customButtonGroupList } = scene.userData as SceneUserData;
  const { themeColor } = getThemeByScene(scene);
  const buttonColor = getButtonColor(themeColor);

  const customButtonGroupListString = JSON.stringify(
    customButtonGroupList || { ...customButtonGroupListInit },
    null,
    2
  );

  const [showCodeWindow, setShowCodeWindow] = useState(false);

  return (
    <Tabs
      defaultActiveKey="home"
      id="uncontrolled-tab-example"
      onSelect={(e) => {
        if (e === "contact") {
          setShowCodeWindow(true);
        }
      }}
    >
      <Tab eventKey="home" title="生成">
        <GenerateButtonGroup />
      </Tab>
      <Tab eventKey="profile" title="自定义">
        <CustomButtonGroup />
      </Tab>
      <Tab eventKey="contact" title="代码编辑">
        {showCodeWindow ? (
          <CodeEditor
            tipsTitle="代码编辑"
            language="json"
            code={customButtonGroupListString}
            isValidate={true}
            show={showCodeWindow}
            setShow={setShowCodeWindow}
            callback={(code) => {
              const _userData = editorInstance.getEditor().scene
                .userData as SceneUserData;
              _userData.customButtonGroupList = JSON.parse(code);
            }}
          />
        ) : (
          <ListGroup>
            <ListGroupItem>
              <ButtonGroup size="sm">
                <Button
                  variant={buttonColor}
                  onClick={() => setShowCodeWindow(true)}
                >
                  <Icon iconName="file-code" /> 编辑
                </Button>
              </ButtonGroup>
            </ListGroupItem>
          </ListGroup>
        )}
      </Tab>
    </Tabs>
  );
}
