import { APP_COLOR } from "@/app/type";
import Button from "react-bootstrap/esm/Button";
import ButtonGroup from "react-bootstrap/esm/ButtonGroup";
import ListGroup from "react-bootstrap/esm/ListGroup";
import ListGroupItem from "react-bootstrap/esm/ListGroupItem";
import {
  buttonGroupStyleInit,
  CustomButtonItem2,
} from "@/three/config/Three3dConfig";
import Icon from "@/component/common/Icon";

import { getEditorInstance } from "@/three/utils/utils";
import { useUpdateScene } from "@/app/hooks";

export default function CustomButtonGroup() {
  const { updateScene } = useUpdateScene();
  return (
    <ListGroup>
      <ListGroupItem>
        <ButtonGroup size="sm" className="me-2">
          <Button
            variant={APP_COLOR.Success}
            onClick={() => {
              //添加自定义按钮组
              const { editor, customButtonGroupList } = getEditorInstance();
              const { group } = customButtonGroupList.customButtonGroup;
              const groupIndex = group.length + 1;
              const customButton = {
                name: `按钮组${groupIndex}`,
                type: "USER_BUTTON",
                listGroup: [],
                showGroup: true,
                buttonGroupStyle: {
                  ...buttonGroupStyleInit,
                  top: buttonGroupStyleInit.top + groupIndex * 3.16,
                },
              } as CustomButtonItem2;
              group.push(customButton);
              updateScene(editor.scene);
            }}
          >
            <Icon iconName="plus-circle" gap={1} />
            按钮组
          </Button>
        </ButtonGroup>
      </ListGroupItem>
    </ListGroup>
  );
}
