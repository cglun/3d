import ListGroup from "react-bootstrap/esm/ListGroup";

import { useUpdateScene } from "@/app/hooks";
import Icon from "@/component/common/Icon";
import { styleBody } from "@/component/Editor/OutlineView/fontColor";
import { editorInstance } from "@/three/EditorInstance";
import sceneGUI from "../PropertyGUI/sceneGUI";

export function OutlineViewScene() {
  const { scene } = useUpdateScene();

  return (
    scene && (
      <ListGroup.Item
        className={"d-flex justify-content-between"}
        style={styleBody}
        onClick={() => {
          const editor = editorInstance.getEditor();
          //editor.createGUI("场景");
          sceneGUI(editor.scene);

          // editor.destroyGUI();
          // const userData = editor.scene.userData as SceneUserData;
          // userData.selected3d = scene;
          // updateScene(scene);
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
