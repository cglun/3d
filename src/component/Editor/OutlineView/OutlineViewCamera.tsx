import ListGroup from "react-bootstrap/esm/ListGroup";
import Button from "react-bootstrap/esm/Button";
import { APP_COLOR } from "@/app/type";
import Toast3d from "@/component/common/Toast3d";
import { useUpdateCamera } from "@/app/hooks";
import Icon from "@/component/common/Icon";
import { styleBody } from "@/component/Editor/OutlineView/fontColor";

import { editorInstance } from "@/three/instance/EditorInstance";
import { SceneUserData } from "@/three/config/Three3dConfig";
import { getButtonColor } from "@/three/utils/util4UI";
import { cameraEnterAnimation } from "@/three/utils/util4Camera";
import cameraGUI from "@/component/Editor/PropertyGUI/cameraGUI";
import { transformCMD } from "@/three/command/cmd";

export function OutlineViewCamera() {
  const { camera } = useUpdateCamera();
  return (
    camera && (
      <ListGroup.Item
        className={"d-flex justify-content-between"}
        style={styleBody}
        onClick={() => {
          const editor = editorInstance.getEditor();
          editor.currentSelected3d = editor.camera;
          transformCMD(editor.camera, () => cameraGUI(editor.camera));
          editor.transformControl?.detach();
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
              const userData = scene.userData as SceneUserData;
              userData.cameraPosition.start = camera.position.clone();

              Toast3d("设置成功");
            }}
          >
            <Icon
              iconName="pin-angle"
              title="开始位置"
              fontSize={0.8}
              color={styleBody.color}
            />
          </Button>
          <Button
            size="sm"
            as="div"
            style={{ borderWidth: 0 }}
            variant={getButtonColor(APP_COLOR.Dark)}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const { camera, scene } = editorInstance.getEditor();
              const userData = scene.userData as SceneUserData;
              userData.cameraPosition.end = camera.position.clone();

              Toast3d("设置成功");
            }}
          >
            <Icon
              iconName="pin"
              title="结束位置"
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
              cameraEnterAnimation(editorInstance.getEditor());
            }}
          >
            <Icon
              iconName="display"
              title="预览效果"
              fontSize={0.8}
              color={styleBody.color}
            />
          </Button>
        </div>
      </ListGroup.Item>
    )
  );
}
