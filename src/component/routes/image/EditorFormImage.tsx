import { useEffect, useState } from "react";
import InputGroup from "react-bootstrap/esm/InputGroup";
import Form from "react-bootstrap/esm/Form";

import { loadAssets } from "@/app/http";
import { RecordItem } from "@/app/type";

import Card from "react-bootstrap/esm/Card";
import Container from "react-bootstrap/esm/Container";

export default function EditorFormImage({
  item,
  getNewItem,
}: {
  item: RecordItem;
  getNewItem: (item: RecordItem) => void;
}) {
  const [_item, _setItem] = useState<RecordItem>({ ...item });

  useEffect(() => {
    getNewItem(_item);
  }, [_item, getNewItem]); // 添加 getNewItem 到依赖项数组

  const defaultImage3dUrl = new URL(
    "@static/images/defaultImage3d.png",
    import.meta.url
  ).href;
  const defaultImage3d = (
    <Card.Img
      src={defaultImage3dUrl}
      variant="top"
      style={{ cursor: "crosshair", width: "300px" }}
    />
  );

  return (
    <Container fluid>
      <InputGroup size="sm">
        <InputGroup.Text id="inputGroup-sizing-sm">名称</InputGroup.Text>
        <Form.Control
          aria-label="Small"
          aria-describedby="inputGroup-sizing-sm"
          placeholder={_item.name}
          type="text"
          value={_item.name}
          onChange={(e) => {
            const item = { ..._item, name: e.target.value };
            _setItem(item);
          }}
        />
      </InputGroup>
      <InputGroup size="sm" className="mt-2">
        <InputGroup.Text id="inputGroup-sizing-sm">类型</InputGroup.Text>
        <Form.Control
          aria-label="Small"
          aria-describedby="inputGroup-sizing-sm"
          placeholder={_item.des}
          type="text"
          disabled={true}
          value={_item.des}
          onChange={(e) => {
            const item = { ..._item, des: e.target.value };
            _setItem(item);
          }}
        />
      </InputGroup>

      <div className="mt-2 d-flex flex-column align-items-center ">
        {_item.cover?.trim().length > 0 ? (
          <Card.Img
            style={{ height: "auto", width: "300px" }}
            src={loadAssets(item.cover)}
            variant="top"
          />
        ) : (
          defaultImage3d
        )}
      </div>
    </Container>
  );
}
