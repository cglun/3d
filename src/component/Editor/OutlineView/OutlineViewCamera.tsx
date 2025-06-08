import ListGroup from "react-bootstrap/esm/ListGroup";
import Button from "react-bootstrap/esm/Button";
import { APP_COLOR } from "../../../app/type";
import Toast3d from "../../common/Toast3d";
import { cameraTween } from "../../../three/animate";
import { useUpdateCamera, useUpdateScene } from "../../../app/hooks";
import Icon from "../../common/Icon";
import { styleBody } from "./fontColor";
import { getButtonColor } from "../../../app/utils";
import { editorInstance } from "../../../three/EditorInstance";
import { SceneUserData } from "../../../three/Three3dConfig";

export function OutlineViewCamera() {
  const { updateScene } = useUpdateScene();
  const { camera } = useUpdateCamera();

  return (
    camera && (
      <ListGroup.Item
        className={"d-flex justify-content-between"}
        style={styleBody}
        onClick={() => {
          // object3D.userData.isSelected = !object3D.userData.isSelected;
          const { camera, scene } = editorInstance.getEditor();
          const userData = scene.userData as SceneUserData;
          userData.selected3d = camera;
          updateScene(scene);
        }}
      >
        <div>
          <Icon iconName="camera-reels" gap={1} />
          {camera.name}
        </div>
        <div>
          <Button
            size="sm"
            as="div"
            style={{ borderWidth: 0 }}
            variant={getButtonColor(APP_COLOR.Dark)}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const { camera, scene } = editorInstance.getEditor();
              scene.userData.fixedCameraPosition = camera.position.clone();

              Toast3d("初始位置已设置");
            }}
          >
            <Icon
              iconName="pin-angle"
              title="固定相机位置"
              fontSize={0.8}
              color={styleBody.color}
            />
          </Button>
          <Button
            size="sm"
            style={{ borderWidth: 0 }}
            variant={getButtonColor(APP_COLOR.Dark)}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const { camera, scene } = editorInstance.getEditor();
              const { fixedCameraPosition } = scene.userData;

              cameraTween(camera, fixedCameraPosition, 500).start();
            }}
          >
            <Icon
              iconName="display"
              title="到初始位置"
              fontSize={0.8}
              color={styleBody.color}
            />
          </Button>
        </div>
      </ListGroup.Item>
    )
  );
}
