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
  const { customButtonList } = scene.userData as SceneUserData;
  const { themeColor } = getThemeByScene(scene);
  const buttonColor = getButtonColor(themeColor);

  const { userButton } = customButtonList || { ...customButtonListInit };

  const [buttonGroupIndex, setButtonGroupIndex] = useState(0);
  const [childButtonIndex, setChildButtonIndex] = useState(0);
  const [showCodeWindow, setShowCodeWindow] = useState(false);

  const [showAddButton, setShowAddButton] = useState(false);
  const codeString =
    userButton.group[buttonGroupIndex]?.listGroup[childButtonIndex]
      ?.codeString || "";

  function setButton() {
    let num = 0;
    userButton.group.forEach((item) => {
      if (item.listGroup.length > 0) {
        num++;
      }
    });

    if (num === 0) {
      setShowAddButton(false);

      return;
    }
    setShowAddButton(true);
  }
  useEffect(() => {
    setButton();
  }, [scene]); // 依赖项为 userButton.group，当它变化时重新执行

  const buttonGroup = userButton.group[buttonGroupIndex];
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
        </ButtonGroup>
        {userButton.group.map((item, index) => {
          return (
            <ButtonGroup key={index} size="sm">
              <Button
                variant={buttonColor}
                active={buttonGroupIndex === index}
                onClick={() => {
                  // setButtonGroup(item.listGroup);
                  setButtonGroupIndex(index);
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
                const showName = "按钮";
                const NAME_ID = MathUtils.generateUUID();
                const button: ActionItemMap = {
                  showName,
                  NAME_ID,
                  showButton: true,
                  isClick: false,
                  groupCanBeRaycast: false,
                  data: {
                    isSelected: false,
                    isRunning: false,
                    cameraViewerPosition: new Vector3(0, 0, 0),
                  },
                  codeString: ` //实现NAME_ID:${NAME_ID} `,
                };
                const { userButton, editor } = getCustomButtonList();
                userButton.group[buttonGroupIndex].listGroup.push(button);
                // setButtonGroup(buttonGroup);
                setButton();
                updateScene(editor.scene);
              }}
            >
              <Icon iconName="plus-circle" gap={1} />
              按钮
            </Button>
          </ButtonGroup>
          <ButtonGroup size="sm">
            {buttonGroup?.listGroup?.map((item, index) => {
              return (
                <Button
                  key={index}
                  variant={buttonColor}
                  active={item.isClick}
                  onClick={() => {
                    buttonGUI(
                      updateScene,
                      buttonGroupIndex,
                      index,
                      setShowCodeWindow
                    );
                    setChildButtonIndex(index);
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
      )}
      <CodeEditor
        tipsTitle="自定义按钮实现"
        code={codeString}
        isValidate={true}
        show={showCodeWindow}
        setShow={setShowCodeWindow}
        callback={function (value): void {
          const { scene } = editorInstance.getEditor();
          const { customButtonList } = scene.userData as SceneUserData;
          customButtonList.userButton.group[buttonGroupIndex].listGroup[
            childButtonIndex
          ].codeString = value;
          updateScene(scene);
        }}
      />
    </ListGroup>
  );
}
