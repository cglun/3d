import { useEffect, useState } from "react";
import { Object3D } from "three";
import InputGroup from "react-bootstrap/esm/InputGroup";
import Form from "react-bootstrap/esm/Form";
import { SelectedObject } from "../../../app/type";
import { GLOBAL_CONSTANT } from "../../../three/GLOBAL_CONSTANT";
import { styleBody } from "../OutlineView/fontColor";

export function InputAttrText({
  title,
  selected3d,
  attr,
}: {
  title: string;
  selected3d: SelectedObject;
  attr: keyof typeof Object3D.prototype;
}) {
  const [value, setValue] = useState("");
  useEffect(() => {
    // 先检查 selected3d 是否为 null 或 undefined
    if (
      selected3d != null &&
      Object.prototype.hasOwnProperty.call(selected3d, attr)
    ) {
      setValue(selected3d[attr] as string);
    }
  }, [selected3d, attr]); // 添加 'attr' 到依赖项数组

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
          {title}
        </InputGroup.Text>
        <Form.Control
          aria-label="Small"
          aria-describedby="inputGroup-sizing-sm"
          type="text"
          disabled={hasValueInGlobalConstant(value)}
          placeholder={value}
          value={value}
          title={value}
          onChange={(e) => {
            const _value = e.target.value;
            //@ts-expect-error
            selected3d[attr] = _value;
            setValue(_value);
          }}
        />
      </InputGroup>
    )
  );
}
