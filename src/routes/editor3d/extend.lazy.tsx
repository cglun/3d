import { createLazyFileRoute } from "@tanstack/react-router";
import Button from "react-bootstrap/esm/Button";
import ButtonGroup from "react-bootstrap/esm/ButtonGroup";
import ListGroup from "react-bootstrap/esm/ListGroup";
import ListGroupItem from "react-bootstrap/esm/ListGroupItem";
import { useUpdateScene } from "@/app/hooks";
import {
  CustomButtonItem,
  customButtonListInit,
  SceneUserData,
} from "@/three/config/Three3dConfig";
import Icon from "@/component/common/Icon";
import { editorInstance } from "@/three/instance/EditorInstance";
import { ActionItemMap, APP_COLOR } from "@/app/type";
import { useState } from "react";
import { getButtonColor, getThemeByScene } from "@/three/utils/util4UI";
import { Vector3 } from "three";
export const Route = createLazyFileRoute("/editor3d/extend")({
  component: RouteComponent,
});

function RouteComponent() {
  const { scene, updateScene } = useUpdateScene();
  const { customButtonList } = scene.userData as SceneUserData;
  const { themeColor } = getThemeByScene(scene);
  const buttonColor = getButtonColor(themeColor);

  const { userButton } = customButtonList || { ...customButtonListInit };
  // const [buttonGroup, setButtonGroup] = useState<ActionItemMap[]>();
  const [buttonIndex, setButtonIndex] = useState(0);
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
              const { userButton, editor } = getCustomButtonList();
              const customButton = {
                name: "按钮组",
                type: "USER_BUTTON",
                listGroup: [],
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
                onClick={() => {
                  // setButtonGroup(item.listGroup);

                  setButtonIndex(index);
                  setShowAddButton(true);
                  console.log(buttonGroup, buttonIndex);
                  updateScene(editor.scene);
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
                const button = {
                  showName: "a",
                  NAME_ID: "a",
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

                updateScene(editor.scene);
              }}
            >
              <Icon iconName="plus-circle" gap={1} />
              按钮
            </Button>
          </ButtonGroup>
          {buttonGroup?.listGroup?.map((item, index) => {
            return (
              <ButtonGroup key={index}>
                <Button>{item.showName}</Button>
              </ButtonGroup>
            );
          })}
        </ListGroupItem>
      )}
    </ListGroup>
  );
}
