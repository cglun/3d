import InputGroup from "react-bootstrap/esm/InputGroup";
import Form from "react-bootstrap/esm/Form";
import { GLOBAL_CONSTANT } from "../../../three/GLOBAL_CONSTANT";
import { styleBody } from "../OutlineView/fontColor";
import { useUpdateScene } from "../../../app/hooks";
import { SceneUserData } from "../../../three/Three3dConfig";
import { editorInstance } from "../../../three/EditorInstance";

export function Selected3dName() {
  const { scene, updateScene } = useUpdateScene();
  const { selected3d } = scene.userData as SceneUserData;

  /**
   * 判断 GLOBAL_CONSTANT 是否包含指定的值
   * @param value - 需要查找的值
   * @returns 如果包含返回 true，否则返回 false
   */
  function hasValueInGlobalConstant(value: unknown): boolean {
    // 获取 GLOBAL_CONSTANT 的所有键
    const keys = Object.keys(GLOBAL_CONSTANT) as Array<
      keyof typeof GLOBAL_CONSTANT
    >;
    for (const key of keys) {
      if (GLOBAL_CONSTANT[key] === value) {
        return true;
      }
    }
    return false;
  }

  return (
    selected3d && (
      <InputGroup size="sm">
        <InputGroup.Text style={{ color: styleBody.color }}>
          名字
        </InputGroup.Text>
        <Form.Control
          aria-label="Small"
          aria-describedby="inputGroup-sizing-sm"
          type="text"
          disabled={hasValueInGlobalConstant(selected3d.name)}
          placeholder={"请输入名字"}
          value={selected3d.name}
          title={selected3d.name}
          onChange={(e) => {
            const _value = e.target.value;
            const { scene } = editorInstance.getEditor();
            const { selected3d } = scene.userData as SceneUserData;
            if (!hasValueInGlobalConstant(_value) && selected3d !== null) {
              selected3d.name = _value;
              updateScene(scene);
            }
          }}
        />
      </InputGroup>
    )
  );
}
