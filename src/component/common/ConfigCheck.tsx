import Form from "react-bootstrap/esm/Form";
import { useUpdateScene } from "@/app/hooks";

import InputGroup from "react-bootstrap/esm/InputGroup";

import OverlayTrigger from "react-bootstrap/esm/OverlayTrigger";
import Tooltip from "react-bootstrap/esm/Tooltip";
import { config3dInit } from "@/three/config/Three3dConfig";
import Icon from "@/component/common/Icon";
import { styleBody } from "@/component/Editor/OutlineView/fontColor";
import { getEditorInstance } from "@/three/utils/utils";

export function ConfigCheck({
  label = "label",
  configKey = "css2d",
  iconName = "play-circle-fill",
  toolTip = "toolTip",
  disabled = false,
  callBack,
}: {
  label: string;
  configKey: keyof typeof config3dInit;
  iconName: string;
  toolTip?: string;
  disabled?: boolean;
  callBack?: () => void;
}) {
  const { scene, updateScene, userData } = useUpdateScene();
  const config3d = userData.config3d || { ...config3dInit };
  if (typeof config3d[configKey] === "number") {
    return;
  }
  const checked = config3d[configKey];

  return (
    <InputGroup size="sm">
      <InputGroup.Text style={{ color: styleBody.color }}>
        <Icon iconName={iconName} gap={1} />
      </InputGroup.Text>
      <InputGroup.Text>
        <OverlayTrigger
          delay={{ show: 250, hide: 250 }}
          overlay={<Tooltip>{toolTip}</Tooltip>}
        >
          <Form>
            <Form.Check
              style={{ minHeight: "initial", marginBottom: "initial" }}
              id={`check-api-${iconName}`}
              type="switch"
              label={label}
              checked={checked}
              disabled={disabled}
              onChange={() => {
                const { userData } = getEditorInstance();
                const { config3d } = userData;
                (config3d[configKey] as boolean) = !config3d[configKey];
                if (callBack) {
                  callBack();
                }
                updateScene(scene);
              }}
            ></Form.Check>
          </Form>
        </OverlayTrigger>
      </InputGroup.Text>

      {/* <Form id={`switch${_configKey}`}>
        <Form.Label>
          <InputGroup.Text>
            <Trigger3d title={"dddd"} />
          </InputGroup.Text>
        </Form.Label>
        <Form.Check
          type="switch"
          checked={checked}
          disabled={disabled}
          onChange={() => {
            const _config3d =_____scene.userData.config3d;
            _config3d[_configKey] = !_config3d[_configKey];
            if (callBack) {
              callBack();
            }
            updateScene(scene);
          }}
        ></Form.Check>
      </Form> */}
    </InputGroup>
  );
}
