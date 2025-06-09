import { useState } from "react";
import {
  Button,
  ButtonGroup,
  Container,
  Form,
  ListGroup,
} from "react-bootstrap";
import { createLazyFileRoute } from "@tanstack/react-router";
import CodeEditor from "../../component/common/routes/script/CodeEditor";
import { useUpdateScene } from "../../app/hooks";
import AlertBase from "../../component/common/AlertBase";
import { APP_COLOR, CustomButtonType } from "../../app/type";
import { getButtonColor, getThemeByScene } from "../../app/utils";
import Toast3d from "../../component/common/Toast3d";
import ModalConfirm3d from "../../component/common/ModalConfirm3d";
import { Vector3 } from "three";
import {
  generatePanelControllerButtonGroup,
  generateRoamButtonGroup,
  generateToggleButtonGroup,
} from "../../viewer3d/buttonList/buttonGroup";
import Icon from "../../component/common/Icon";
import { styleBody } from "../../component/Editor/OutlineView/fontColor";
import {
  CustomButtonList,
  customButtonListInit,
  SceneUserData,
} from "../../three/Three3dConfig";
import { editorInstance } from "../../three/EditorInstance";

export const Route = createLazyFileRoute("/editor3d/script")({
  component: RouteComponent,
});

function RouteComponent() {
  const { scene, updateScene } = useUpdateScene(); // const [javaScriptCode, setJavaScriptCode] = useState<string>(javascript);
  const [showJavaScript, setShowJavaScript] = useState(false); // 是否为调试场景[调试场景不允许修改代码]
  const [show, setShow] = useState(false); // 使用可选属性和类型断言
  const [showAllConfig, setShowAllConfig] = useState(false); // 使用可选属性和类型断言
  const [isSet, setIsSet] = useState(false);

  const ud = scene.userData as SceneUserData;
  const userData = JSON.stringify(ud, null, 3);

  const { javascript, projectId, customButtonList } = ud;
  const buttonList = JSON.stringify(customButtonList, null, 5);

  const [buttonType, setButtonType] = useState<CustomButtonType>("TOGGLE");
  // const [buttonType, setButtonType] = useState<CustomButtonType>(
  //   customButtonList.toggleButtonGroup.type as CustomButtonType
  // );

  if (scene.userData === undefined) {
    return;
  }
  // 获取主题颜色
  const { themeColor } = getThemeByScene(scene);
  const buttonColor = getButtonColor(themeColor);

  // 生成按钮组
  function generateButton() {
    setIsSet(false);
    const { toggleButtonGroup } = JSON.parse(buttonList);

    const gerToggleButtonGroup = generateToggleButtonGroup(
      toggleButtonGroup.listGroup,
      getScene(),
      buttonType
    );

    const offset = 1;

    const modelPositionOffset = {
      TOGGLE: new Vector3(0, 0, 0),
      STRETCH: new Vector3(0, offset, 0),
      DRAWER: new Vector3(offset, 0, 0),
      ROAM: new Vector3(0, 0, 0),
      PANEL_CONTROLLER: new Vector3(0, 0, 0),
    };
    const cameraPositionOffset = {
      TOGGLE: new Vector3(offset, 0, 0),
      STRETCH: new Vector3(0, offset, 0),
      DRAWER: new Vector3(offset, offset, 0),
      ROAM: new Vector3(0, 0, 0),
      PANEL_CONTROLLER: new Vector3(0, 0, 0),
    };
    //customButtonListInit.toggleButtonGroup.userSetting
    const buttonGroup: CustomButtonList = {
      toggleButtonGroup: {
        ...customButtonListInit.toggleButtonGroup,
        type: buttonType,
        userSetting: {
          cameraOffset: cameraPositionOffset[buttonType],
          modelOffset: modelPositionOffset[buttonType],
          animationTime: 300,
          speed: 0,
        },
        listGroup: gerToggleButtonGroup,
      },
      roamButtonGroup: {
        ...customButtonListInit.roamButtonGroup,
        listGroup: generateRoamButtonGroup(),
      },
      panelControllerButtonGroup: {
        ...customButtonListInit.panelControllerButtonGroup,
        listGroup: generatePanelControllerButtonGroup(),
      },
    };
    getScene().userData.customButtonList = buttonGroup;
    updateScene(getScene());
    Toast3d("已生成按钮组");
  }
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
        {projectId && projectId !== -1 && (
          <ListGroup.Item>
            <ButtonGroup size="sm">
              <Button
                variant={buttonColor}
                style={{ borderColor: styleBody.color }}
                onClick={() => {
                  setShowJavaScript(true);
                }}
              >
                <Icon iconName="pencil" gap={1} />
                代码
              </Button>
              <Button
                variant={buttonColor}
                style={{ borderColor: styleBody.color }}
                onClick={() => {
                  setShow(true);
                }}
              >
                <Icon iconName="pencil" gap={1} />
                按钮
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
            </ButtonGroup>
            <CodeEditor
              tipsTitle="脚本编辑"
              code={javascript}
              isValidate={true}
              show={showJavaScript}
              setShow={setShowJavaScript}
              callback={function (value): void {
                scene.userData.javascript = value;
                updateScene(scene);
              }}
            />
            <CodeEditor
              tipsTitle="按钮组编辑"
              isValidate={true}
              language="json"
              code={buttonList}
              show={show}
              setShow={setShow}
              callback={(value) => {
                try {
                  getScene().userData.customButtonList = JSON.parse(value);
                  updateScene(getScene());
                } catch (error) {
                  if (error instanceof Error) {
                    ModalConfirm3d({
                      title: "提示",
                      body: error.message,
                      confirmButton: {
                        show: true,
                        closeButton: true,
                        hasButton: true,
                      },
                    });
                  }
                }
              }}
            >
              <ButtonGroup size="sm">
                {isSet ? (
                  <>
                    <Form key={"inline-radio-2"}>
                      <Form.Check
                        defaultChecked={buttonType === "TOGGLE"}
                        inline
                        label="切换"
                        name="buttonType"
                        type={"radio"}
                        id={`inline-radio-1`}
                        onClick={() => {
                          setButtonType("TOGGLE");
                        }}
                      />
                      <Form.Check
                        defaultChecked={buttonType === "STRETCH"}
                        inline
                        label="拉伸"
                        name="buttonType"
                        type={"radio"}
                        id={`inline-radio-2`}
                        onClick={() => {
                          setButtonType("STRETCH");
                        }}
                      />
                      <Form.Check
                        defaultChecked={buttonType === "DRAWER"}
                        inline
                        label="抽屉"
                        name="buttonType"
                        type={"radio"}
                        id={`inline-radio-3`}
                        onClick={() => {
                          setButtonType("DRAWER");
                        }}
                      />
                    </Form>
                    <Button variant={buttonColor} onClick={generateButton}>
                      生成按钮
                    </Button>
                  </>
                ) : (
                  <Button
                    variant={buttonColor}
                    onClick={() => {
                      getScene().userData.customButtonList =
                        customButtonListInit;
                      updateScene(getScene());
                      setButtonType(buttonType);
                      setIsSet(true);
                      Toast3d("已重置按钮组");
                    }}
                  >
                    <Icon iconName="recycle" /> 重置
                  </Button>
                )}
              </ButtonGroup>
            </CodeEditor>
            <CodeEditor
              tipsTitle="一键配置"
              language="json"
              code={userData}
              isValidate={true}
              show={showAllConfig}
              setShow={setShowAllConfig}
              callback={function (value): void {
                getScene().userData = JSON.parse(value);
                getScene().userData.projectId = projectId; // 防止项目id丢失
                updateScene(scene);
              }}
            />
          </ListGroup.Item>
        )}
      </ListGroup>
    </Container>
  );
}
