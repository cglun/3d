import { useEffect, useState } from "react";
import InputGroup from "react-bootstrap/esm/InputGroup";
import Form from "react-bootstrap/esm/Form";
import Viewer3d from "@/viewer3d/Viewer3d";
import Toast3d from "@/component/common/Toast3d";

import axios, { loadAssets } from "@/app/http";
import { APP_COLOR, MessageError, RecordItem } from "@/app/type";

import Icon from "@/component/common/Icon";
import { editorInstance } from "@/three/instance/EditorInstance";

import {
  base64ToBlob,
  blobToFile,
  getButtonColor,
} from "@/three/utils/util4UI";
import Card from "react-bootstrap/esm/Card";
import Container from "react-bootstrap/esm/Container";
import ButtonGroup from "react-bootstrap/esm/ButtonGroup";
import Button from "react-bootstrap/esm/Button";
import { errorMessage } from "@/app/utils";

import { viewerInstance } from "@/three/instance/ViewerInstance";

export default function EditorForm({
  item,
  getNewItem,
}: {
  item: RecordItem;
  getNewItem: (item: RecordItem) => void;
}) {
  const [_item, _setItem] = useState<RecordItem>({ ...item });
  const [imgBase64, setImgBase64] = useState("");
  const { scene } = editorInstance.getEditor();
  // const { themeColor } = getThemeByScene(scene);

  const { themeColor } = scene.userData.APP_THEME;
  //sceneUserData.APP_THEME.themeColor = themeColor;
  const buttonColor = getButtonColor(themeColor);
  const [loadScene, setLoadScene] = useState<boolean>(false);
  useEffect(() => {
    getNewItem(_item);
  }, [_item, getNewItem]); // 添加 getNewItem 到依赖项数组

  function uploadScreenshot() {
    const blob = base64ToBlob(imgBase64, "image/png");
    const file = blobToFile(blob, "截图.png");
    const formData = new FormData();
    formData.append("file", file);
    axios
      .post("/material/upload/116", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.data.code !== 200) {
          Toast3d(res.data.message, "提示", APP_COLOR.Warning);
          return;
        }
        const item = { ..._item, cover: res.data.result.url };
        _setItem(item);
        Toast3d(res.data.message, "提示", APP_COLOR.Success);
      })
      .catch((error: MessageError) => {
        errorMessage(error);
      });
  }
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
        {loadScene ? (
          <Viewer3d
            canvasStyle={{ height: "300px", width: "300px", margin: "0 auto" }}
            item={item}
            callBack={() => {}}
          />
        ) : _item.cover?.trim().length > 0 ? (
          <Card.Img
            style={{ height: "300px", width: "300px" }}
            src={loadAssets(item.cover)}
            variant="top"
          />
        ) : (
          defaultImage3d
        )}
        <ButtonGroup className="mt-2" size="sm">
          <Button
            variant={buttonColor}
            onClick={() => {
              setLoadScene(true);
            }}
          >
            <Icon iconName="bi bi-boxes" title="使用场景" />
          </Button>

          <Button
            variant={buttonColor}
            disabled={!loadScene}
            onClick={() => {
              const viewer = viewerInstance.getViewer();
              const imgBase64 = viewer.takeScreenshot(300, 300);
              setImgBase64(imgBase64);
              Toast3d("截图成功");
            }}
          >
            <Icon iconName="camera" title="截图" />
          </Button>

          <Button
            variant={buttonColor}
            disabled={imgBase64.trim() === ""}
            onClick={uploadScreenshot}
          >
            <Icon iconName="cloud-arrow-up" title="上传截图" />
          </Button>
        </ButtonGroup>
      </div>
    </Container>
  );
}
