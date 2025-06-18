import ListGroup from "react-bootstrap/esm/ListGroup";

import Icon from "@/component/common/Icon";
import { styleBody } from "@/component/Editor/OutlineView/fontColor";
import { editorInstance } from "@/three/EditorInstance";
import sceneGUI from "../PropertyGUI/sceneGUI";

export function OutlineViewScene() {
  return (
    <ListGroup.Item
      className={"d-flex justify-content-between"}
      style={styleBody}
      onClick={() => {
        const editor = editorInstance.getEditor();
        editor.currentSelected3d = editor.scene;
        editor.transformControl?.detach();
        sceneGUI(editor.scene);
      }}
    >
      <div>
        <Icon iconName="box2" gap={1} color={styleBody.color} />
        场景
      </div>
    </ListGroup.Item>
  );
}
