import { useEffect, useState } from "react";

import InputGroup from "react-bootstrap/esm/InputGroup";
import Form from "react-bootstrap/esm/Form";
import { APP_COLOR, DELAY, SelectedObject } from "../../../app/type";
import Toast3d from "../../common/Toast3d";

export function InputUserDataText({
  title,
  selected3d,
}: {
  title: string;
  selected3d: SelectedObject;
}) {
  const [value, setValue] = useState("");
  useEffect(() => {
    setValue(JSON.stringify(selected3d.userData));
  }, [selected3d]); // 添加 'attr' 到依赖项数组

  return (
    selected3d && (
      <InputGroup size="sm">
        <InputGroup.Text>{title}</InputGroup.Text>
        <Form.Control
          style={{ minHeight: "6rem" }}
          aria-label="Small"
          aria-describedby="inputGroup-sizing-sm"
          type="text"
          placeholder={value}
          value={value}
          title={value}
          onMouseLeave={() => {
            try {
              const _value = JSON.parse(value);
              selected3d.userData = _value;
            } catch (error) {
              console.error(error);
              Toast3d("数据格式错误", "错误", APP_COLOR.Danger, DELAY.LONG);
            }
          }}
          onChange={(e) => {
            // const _value = JSON.parse(e.target.value);
            setValue(e.target.value);
          }}
        />
      </InputGroup>
    )
  );
}
