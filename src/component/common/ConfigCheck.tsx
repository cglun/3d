import Form from "react-bootstrap/esm/Form";
import { useUpdateScene } from "@/app/hooks";

import InputGroup from "react-bootstrap/esm/InputGroup";

import OverlayTrigger from "react-bootstrap/esm/OverlayTrigger";
import Tooltip from "react-bootstrap/esm/Tooltip";
import { editorInstance } from "@/three/instance/EditorInstance";
import { Config3d } from "@/three/config/Three3dConfig";
import Icon from "@/component/common/Icon";
import { styleBody } from "@/component/Editor/OutlineView/fontColor";
export function ConfigCheck({
  label = "label",
  configKey = "css2d",
  iconName = "play-circle-fill",
  toolTip = "toolTip",
  disabled = false,
  callBack,
}: {
  label: string;
  configKey: keyof Config3d;
  iconName: string;
  toolTip?: string;
  disabled?: boolean;
  callBack?: () => void;
}) {
  const { scene, updateScene } = useUpdateScene();
  const checked = scene.userData.config3d[configKey];

  return (
    <InputGroup size="sm">
      <InputGroup.Text style={{ color: styleBody.color }}>
        <Icon iconName={iconName} gap={1} />
        {label}
      </InputGroup.Text>
      <InputGroup.Text>
        <OverlayTrigger
          delay={{ show: 250, hide: 250 }}
          overlay={<Tooltip>{toolTip}</Tooltip>}
        >
          <Form>
            <Form.Check
              type="switch"
              checked={checked}
              disabled={disabled}
              onChange={() => {
                const { scene } = editorInstance.getEditor();
                const _config3d = scene.userData.config3d;
                _config3d[configKey] = !_config3d[configKey];
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
