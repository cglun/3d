import { useEffect, useState } from "react";
import Form from "react-bootstrap/esm/Form";

export function Switch3d<T extends Record<keyof T, boolean>>({
  title,
  selected3d,
  attr,
}: {
  title: string;
  selected3d: T;
  attr: keyof T;
}) {
  // 确保 selected3d[attr] 是布尔类型
  const initialChecked =
    typeof selected3d[attr] === "boolean" ? selected3d[attr] : false;
  const [checked, setChecked] = useState<boolean>(initialChecked);

  useEffect(() => {
    if (typeof selected3d[attr] === "boolean") {
      setChecked(selected3d[attr]);
    }
  }, [selected3d, attr]);

  return (
    Object.prototype.hasOwnProperty.call(selected3d, attr) && (
      <div className="d-flex justify-content-between flex-wrap p-1">
        <span>{title}</span>
        <Form className="ms-2">
          <Form.Check
            type="switch"
            checked={checked}
            onChange={() => {
              if (typeof selected3d[attr] === "boolean") {
                //@ts-expect-error 因 selected3d 可能为只读对象，类型系统禁止直接修改属性，需绕过类型检查更新属性值
                selected3d[attr] = !checked;
                setChecked(!checked);
              }
            }}
          />
        </Form>
      </div>
    )
  );
}
