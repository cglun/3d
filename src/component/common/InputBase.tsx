import { useEffect, useState } from "react";
import Container from "react-bootstrap/esm/Container";
import Form from "react-bootstrap/esm/Form";
import InputGroup from "react-bootstrap/esm/InputGroup";

export default function InputBase({
  name = "新场景",
  des = "场景描述",
  placeholder = "场景名",
  getValue, // 明确指定 getValue 的类型
}: {
  name?: string;
  des?: string;
  placeholder?: string;
  getValue: (sceneName: string, des: string, description: string) => void;
}) {
  const [sceneName, setSceneName] = useState(name);
  const [sceneDes, setSceneDes] = useState(des);
  const [description, setDescription] = useState("这是一个新场景");

  useEffect(() => {
    getValue(sceneName, sceneDes, description);
  }, [getValue, description, sceneName, sceneDes]); // 添加 getValue 到依赖项数组

  return (
    <Container fluid>
      <InputGroup size="sm" className="mt-2">
        <InputGroup.Text id="inputGroup-sizing-sm">名称</InputGroup.Text>
        <Form.Control
          aria-label="Small"
          aria-describedby="inputGroup-sizing-sm"
          placeholder={placeholder}
          type="text"
          value={sceneName}
          onChange={(e) => {
            setSceneName(() => e.target.value);
          }}
        />
      </InputGroup>
      <InputGroup size="sm" className="mt-2">
        <InputGroup.Text id="inputGroup-sizing-sm">描述</InputGroup.Text>
        <Form.Control
          aria-label="Small"
          aria-describedby="inputGroup-sizing-sm"
          placeholder={placeholder}
          type="text"
          value={description}
          onChange={(e) => {
            setDescription(() => e.target.value);
          }}
        />
      </InputGroup>
      <InputGroup size="sm" className="mt-2">
        <InputGroup.Text id="inputGroup-sizing-sm">类型</InputGroup.Text>
        <Form.Control
          aria-label="Small"
          aria-describedby="inputGroup-sizing-sm"
          placeholder={placeholder}
          type="text"
          disabled={true}
          value={sceneDes}
          onChange={(e) => {
            setSceneDes(() => e.target.value);
          }}
        />
      </InputGroup>
    </Container>
  );
}
