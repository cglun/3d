import { createLazyFileRoute } from "@tanstack/react-router";
import Button from "react-bootstrap/esm/Button";
import ButtonGroup from "react-bootstrap/esm/ButtonGroup";
import ListGroup from "react-bootstrap/esm/ListGroup";
import ListGroupItem from "react-bootstrap/esm/ListGroupItem";
import { useUpdateScene } from "@/app/hooks";
import {
  buttonGroupStyleInit,
  CustomButtonItem,
  customButtonListInit,
  SceneUserData,
} from "@/three/config/Three3dConfig";
import Icon from "@/component/common/Icon";
import { editorInstance } from "@/three/instance/EditorInstance";
import { ActionItemMap, APP_COLOR } from "@/app/type";
import { useEffect, useState } from "react";
import { getButtonColor, getThemeByScene } from "@/three/utils/util4UI";
import { MathUtils, Vector3 } from "three";

import buttonGroupGUI from "@/component/routes/extend/buttonGroupGUI";
import buttonGUI from "@/component/routes/extend/buttonGUI";
import CodeEditor from "@/component/routes/script/CodeEditor";
export const Route = createLazyFileRoute("/editor3d/extend")({
  component: RouteComponent,
});

function RouteComponent() {
  const { scene, updateScene } = useUpdateScene();
  const { customButtonList, customJavaScript } =
    scene.userData as SceneUserData;
  const { themeColor } = getThemeByScene(scene);
  const buttonColor = getButtonColor(themeColor);

  const { userButton } = customButtonList || { ...customButtonListInit };

  const [buttonIndex, setButtonIndex] = useState(0);
  const [showCodeWindow, setShowCodeWindow] = useState(false);
  const [showFuncButton, setShowFuncButton] = useState(false);

  useEffect(() => {
    setButton();
  }, [userButton.group]); // 依赖项为 userButton.group，当它变化时重新执行

  function setButton() {
    let num = 0;
    userButton.group.forEach((item) => {
      if (item.listGroup.length > 0) {
        num++;
      }
    });
    if (num > 0) {
      setShowFuncButton(true);
    }
  }

  let buttonGroup = userButton.group[buttonIndex];

  const [showAddButton, setShowAddButton] = useState(false);
  const editor = editorInstance.getEditor();
  function getCustomButtonList() {
    const { customButtonList } = editor.scene.userData as SceneUserData;
    const { userButton } = customButtonList;
    return { userButton, editor };
  }
  return (
    <ListGroup>
      <ListGroupItem>
        <ButtonGroup size="sm" className="me-2">
          <Button
            variant={APP_COLOR.Success}
            onClick={() => {
              //添加自定义按钮组
              const { userButton } = getCustomButtonList();
              const customButton = {
                name: "按钮组",
                type: "USER_BUTTON",
                listGroup: [],
                showGroup: true,
                buttonGroupStyle: {
                  ...buttonGroupStyleInit,
                },
              } as CustomButtonItem;
              userButton.group.push(customButton);
              setShowAddButton(false);

              updateScene(editor.scene);
            }}
          >
            <Icon iconName="plus-circle" gap={1} />
            按钮组
          </Button>
          {showFuncButton && (
            <Button
              variant={APP_COLOR.Success}
              onClick={() => {
                setShowCodeWindow(true);
              }}
            >
              <Icon iconName="file-code" gap={1} />
              实现方法
            </Button>
          )}
        </ButtonGroup>
        {userButton.group.map((item, index) => {
          return (
            <ButtonGroup key={index} size="sm">
              <Button
                variant={buttonColor}
                active={buttonIndex === index}
                onClick={() => {
                  // setButtonGroup(item.listGroup);

                  setButtonIndex(index);
                  setShowAddButton(true);
                  buttonGroupGUI(updateScene, index);
                }}
              >
                <Icon iconName="pencil" gap={1} /> {item.name}
              </Button>
            </ButtonGroup>
          );
        })}
      </ListGroupItem>
      {showAddButton && (
        <ListGroupItem>
          <ButtonGroup size="sm" className="me-2">
            <Button
              variant={APP_COLOR.Success}
              onClick={() => {
                const button: ActionItemMap = {
                  showName: "按钮",

                  NAME_ID: MathUtils.generateUUID(),
                  showButton: false,
                  isClick: false,
                  groupCanBeRaycast: false,
                  data: {
                    isSelected: false,
                    isRunning: false,
                    cameraViewerPosition: new Vector3(0, 0, 0),
                  },
                };
                const { userButton, editor } = getCustomButtonList();
                userButton.group[buttonIndex].listGroup.push(button);
                // setButtonGroup(buttonGroup);
                setButton();
                updateScene(editor.scene);
              }}
            >
              <Icon iconName="plus-circle" gap={1} />
              按钮
            </Button>
          </ButtonGroup>
          <ButtonGroup>
            {buttonGroup?.listGroup?.map((item, index) => {
              return (
                <Button
                  key={index}
                  variant={buttonColor}
                  active={item.isClick}
                  onClick={() => {
                    buttonGUI(updateScene, buttonIndex, index);
                    item.isClick = true;

                    item.handler?.(item.NAME_ID);
                    updateScene(editor.scene);
                  }}
                >
                  <Icon iconName="pencil " gap={1} title="编辑按钮" />
                  {item.showName}
                </Button>
              );
            })}
          </ButtonGroup>
        </ListGroupItem>
      )}{" "}
      <CodeEditor
        tipsTitle="自定义按钮实现"
        code={customJavaScript}
        isValidate={true}
        show={showCodeWindow}
        setShow={setShowCodeWindow}
        callback={function (value): void {
          const { scene } = editorInstance.getEditor();
          scene.userData.customJavaScript = value;
          updateScene(scene);
        }}
      />
    </ListGroup>
  );
}
