import { useEffect, useState } from "react";
import Form from "react-bootstrap/esm/Form";
import InputGroup from "react-bootstrap/esm/InputGroup";
import { styleBody } from "../OutlineView/fontColor";

// 严格约束泛型 T，确保 T 的所有属性值类型为 number
export function InputAttrNumber<T>({
  title,
  selected3d,
  attr,
  min,
  max,
  step = 0.1,
  disabled = false,
}: {
  title: string;
  selected3d: T;
  min?: number;
  max?: number;
  attr: keyof T;
  step: number;
  disabled?: boolean;
}) {
  const [value, setValue] = useState<number>(0);
  // console.log(Object.prototype.hasOwnProperty.call(selected3d, attr));

  useEffect(() => {
    // 先检查 selected3d 是否为 null 或 undefined
    if (
      selected3d != null &&
      Object.prototype.hasOwnProperty.call(selected3d, attr)
    ) {
      setValue(selected3d[attr] as number);
    }
  }, [selected3d, attr]); // 添加 'attr' 到依赖项数组

  return (
    selected3d &&
    Object.prototype.hasOwnProperty.call(selected3d, attr) && (
      <InputGroup size="sm">
        <InputGroup.Text style={{ color: styleBody.color }}>
          {title}
        </InputGroup.Text>
        <Form.Control
          aria-label="Small"
          aria-describedby="inputGroup-sizing-sm"
          placeholder={"属性：" + attr.toString()}
          type="number"
          step={step}
          title={"属性：" + attr.toString()}
          value={value}
          min={min}
          max={max}
          disabled={disabled}
          onChange={(e) => {
            const _value = parseFloat(e.target.value);
            if (Number.isNaN(_value)) {
              return;
            }
            // 创建一个新对象来避免直接修改原始对象
            //@ts-expect-error 绕过类型检查，直接修改泛型对象的属性，因类型系统无法确定属性可写性
            selected3d[attr] = _value;
            setValue(_value);
          }}
        />
      </InputGroup>
    )
  );
}
