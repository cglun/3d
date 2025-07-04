import { useState } from "react";
import ListGroup from "react-bootstrap/esm/ListGroup";
import ButtonGroup from "react-bootstrap/esm/ButtonGroup";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import { useUpdateScene } from "@/app/hooks";
import { APP_COLOR, CustomButtonType } from "@/app/type";
import { getButtonColor, getThemeByScene } from "@/three/utils/util4UI";
import Toast3d from "@/component/common/Toast3d";
import {
  generatePanelControllerButtonGroup,
  generateRoamButtonGroup,
  generateToggleButtonGroup,
  setUserSettingByType,
} from "@/viewer3d/buttonList/buttonGroup";
import Icon from "@/component/common/Icon";
import {
  CustomButtonItem,
  CustomButtonList,
  customButtonListInit,
  SceneUserData,
} from "@/three/config/Three3dConfig";
import { editorInstance } from "@/three/instance/EditorInstance";
import { ListGroupItem } from "react-bootstrap";
import ModalConfirm3d from "@/component/common/ModalConfirm3d";
import generateButtonGroupGUI from "../generateButtonGroupGUI";
import AlertBase from "@/component/common/AlertBase";
import generateButtonGUI from "../generateButtonGUI";
export default function GenerateButtonGroup() {
  const { scene, updateScene } = useUpdateScene(); // const [javaScriptCode, setJavaScriptCode] = useState<string>(javascript);
  const [isSet, setIsSet] = useState(false);
  const [buttonType, setButtonType] = useState<CustomButtonType>("TOGGLE");
  // 获取主题颜色
  const { themeColor } = getThemeByScene(scene);
  const buttonColor = getButtonColor(themeColor);
  //复制一份数据，然后去掉对象的selected3d属性，不然要序列化会报错，要报废
  const { customButtonList } = scene.userData as SceneUserData;

  const [customButtonKey, setCustomButtonKey] =
    useState<keyof CustomButtonList>("toggleButtonGroup");

  // 生成按钮组
  function generateButton() {
    setIsSet(false);
    const editor = editorInstance.getEditor();
    const { customButtonList } = editor.scene.userData as SceneUserData;
    const { toggleButtonGroup, roamButtonGroup, panelControllerButtonGroup } =
      customButtonList;
    toggleButtonGroup.customButtonItem.type = buttonType;
    toggleButtonGroup.customButtonItem.listGroup = generateToggleButtonGroup(
      editor.scene,
      buttonType
    );
    //设置模型和相机的偏移
    setUserSettingByType(toggleButtonGroup.userSetting, buttonType);
    roamButtonGroup.customButtonItem.listGroup = generateRoamButtonGroup();
    panelControllerButtonGroup.customButtonItem.listGroup =
      generatePanelControllerButtonGroup();

    updateScene(editor.scene);
    Toast3d("已生成按钮组");
  }
  function getScene() {
    const { scene } = editorInstance.getEditor();
    return scene;
  }

  return (
    <ListGroup>
      <ListGroupItem>
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
              <Button variant={APP_COLOR.Success} onClick={generateButton}>
                生成按钮
              </Button>
            </>
          ) : (
            <Button
              variant={APP_COLOR.Success}
              onClick={() => {
                ModalConfirm3d(
                  {
                    title: "确认提示",
                    body: "是否重置按钮组？",
                    confirmButton: {
                      show: true,
                      hasButton: true,
                    },
                  },
                  () => {
                    getScene().userData.customButtonList = customButtonListInit;
                    updateScene(getScene());
                    setButtonType(buttonType);
                    setIsSet(true);
                    Toast3d("已重置按钮组");
                  }
                );
              }}
            >
              <Icon iconName="recycle" /> 重置
            </Button>
          )}
        </ButtonGroup>
        {!isSet && (
          <ButtonGroup className="ms-2" size="sm">
            <Button
              variant={buttonColor}
              onClick={() => {
                setCustomButtonKey("toggleButtonGroup");
                generateButtonGroupGUI("toggleButtonGroup");
              }}
            >
              切换
            </Button>
            <Button
              variant={buttonColor}
              onClick={() => {
                setCustomButtonKey("roamButtonGroup");
                generateButtonGroupGUI("roamButtonGroup");
              }}
            >
              漫游
            </Button>
            <Button
              variant={buttonColor}
              onClick={() => {
                setCustomButtonKey("panelControllerButtonGroup");
                generateButtonGroupGUI("panelControllerButtonGroup");
              }}
            >
              标签控制
            </Button>
          </ButtonGroup>
        )}
      </ListGroupItem>
      <ListGroup>
        <ListGroupItem>
          <ShowGenerateButtonGroup
            customButtonKey={customButtonKey}
            customButtonList={customButtonList || customButtonListInit}
            buttonColor={buttonColor}
          />
        </ListGroupItem>
      </ListGroup>
    </ListGroup>
  );
}

function ShowGenerateButtonGroup({
  customButtonKey,
  customButtonList,
  buttonColor,
}: {
  customButtonKey: keyof CustomButtonList;
  customButtonList: CustomButtonList;
  buttonColor: string;
}) {
  const { updateScene } = useUpdateScene();
  if (customButtonKey === "userButton") {
    return;
  }
  const item = customButtonList[customButtonKey]
    .customButtonItem as CustomButtonItem;
  const { listGroup } = item;
  if (listGroup.length === 0) {
    return (
      <AlertBase text={`${item.name}组，按钮为空！`} type={APP_COLOR.Warning} />
    );
  }
  return (
    <ButtonGroup size="sm">
      {listGroup.map((item, index) => (
        <Button
          key={index}
          variant={buttonColor}
          onClick={() => {
            generateButtonGUI(updateScene, listGroup, index, customButtonKey);
          }}
        >
          {item.showName}
        </Button>
      ))}
    </ButtonGroup>
  );
}
