import ListGroup from "react-bootstrap/esm/ListGroup";

import { useUpdateScene } from "../../../app/hooks";
import Icon from "../../common/Icon";
import { styleBody } from "./fontColor";
import { editorInstance } from "../../../three/EditorInstance";
import { SceneUserData } from "../../../three/Three3dConfig";

export function OutlineViewScene() {
  const { scene, updateScene } = useUpdateScene();

  return (
    scene && (
      <ListGroup.Item
        className={"d-flex justify-content-between"}
        style={styleBody}
        onClick={() => {
          const { scene } = editorInstance.getEditor();
          const userData = scene.userData as SceneUserData;
          userData.selected3d = scene;
          updateScene(scene);
        }}
      >
        <div>
          <Icon iconName="box2" gap={1} color={styleBody.color} />
          场景
        </div>
      </ListGroup.Item>
    )
  );
}
