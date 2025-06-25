import ListGroup from "react-bootstrap/esm/ListGroup";
import ListGroupItem from "react-bootstrap/esm/ListGroupItem";
import ButtonGroup from "react-bootstrap/esm/ButtonGroup";
import Button from "react-bootstrap/esm/Button";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useUpdateScene } from "@/app/hooks";

import { useContext, useEffect } from "react";
import { getButtonColor, getThemeByScene } from "@/three/utils/util4UI";
import Icon from "@/component/common/Icon";
import { MyContext } from "@/app/MyContext";
import modelHighlightGUI from "@/component/routes/effects/gui/modelHighlightGUI";
import roamGUI from "@/component/routes/effects/gui/roamGUI";
import { stopRoam } from "@/component/routes/effects/utils";
import { editorInstance } from "@/three/instance/EditorInstance";
import { GROUP } from "@/three/config/CONSTANT";

// 定义一个变量来保存 GUI 实例

export const Route = createLazyFileRoute("/editor3d/effects")({
  component: RouteComponent,
});

function RouteComponent() {
  const { scene } = useUpdateScene();
  const { themeColor } = getThemeByScene(scene);
  const buttonColor = getButtonColor(themeColor);
  const { dispatchTourWindow } = useContext(MyContext);
  useEffect(() => {
    const editor = editorInstance.getEditor();
    const testGroup = editor.scene.getObjectByName(GROUP.TEST);
    if (testGroup) testGroup.visible = true;

    editor.TEST_GROUP.children.forEach((item) => {
      item.visible = false;
      if (item.type === "Mesh") {
        item.visible = true;
      }
    });

    return () => {
      editor.outlinePass.selectedObjects = [];

      if (testGroup) testGroup.visible = false;
      editor.destroyGUI();
      stopRoam();
    };
  }, []);
  // const userData = scene.userData as SceneUserData;

  // const { topCard, markLabel } =
  //   userData.userCssStyle || sceneUserData.userCssStyle;

  // 先检查条件，避免在组件渲染逻辑中提前返回
  // let earlyReturnElement = null;
  // if (userData.projectId === -1) {
  //   earlyReturnElement = <AlertBase text={"到左上脚3d中加载场景！"} />;
  // } else if (!userData.config3d?.useComposer) {
  //   earlyReturnElement = <AlertBase text={"请到设置中开启合成"} />;
  // }

  // 如果有需要提前返回的元素，直接返回
  // if (earlyReturnElement) {
  //   return earlyReturnElement;
  // }

  // function handleClose() {
  // if (hasGui && editor.guiInstance) {
  //   // 销毁 GUI 实例
  //   editor.destroyGUI();
  //   setHasGui(false);
  // }
  // setShow(false);
  //}

  return (
    <ListGroup horizontal className="mt-2">
      <ListGroupItem>
        <ButtonGroup size="sm">
          <Button
            variant={buttonColor}
            onClick={() => {
              stopRoam();
              modelHighlightGUI(dispatchTourWindow);
            }}
          >
            <Icon iconName="bi bi-highlights" gap={1} title="模型选中高亮" />
            高亮
          </Button>
        </ButtonGroup>
        <ButtonGroup className="ms-2" size="sm">
          <Button variant={buttonColor} onClick={roamGUI}>
            <Icon iconName=" bi bi-person-walking" gap={1} />
            漫游
          </Button>
        </ButtonGroup>
      </ListGroupItem>
    </ListGroup>
  );
}
