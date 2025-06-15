import { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import { Color, Fog, Light, OrthographicCamera, Vector2 } from "three";
import Card from "react-bootstrap/esm/Card";
import InputGroup from "react-bootstrap/esm/InputGroup";

import { ButtonGroup, Container } from "react-bootstrap";
import { useUpdateScene } from "@/app/hooks";
import { Input3d } from "@/component/Editor/Property3d/Input3d";
import { Selected3dName } from "@/component/Editor/Property3d/Selected3dName";
import { getButtonColor, getThemeByScene } from "@/threeUtils/util4UI";
import AlertBase from "@/component/common/AlertBase";

import { APP_COLOR } from "@/app/type";
import { InputAttrNumber } from "@/component/Editor/Property3d/InputAttrNumber";
import Toast3d from "@/component/common/Toast3d";
import {
  styleBody,
  styleHeader,
} from "@/component/Editor/OutlineView/fontColor";
import { editorInstance } from "@/three/EditorInstance";
import sceneUserData, { SceneUserData } from "@/three/Three3dConfig";

const step = 0.1;
function SceneProperty() {
  const { scene, updateScene } = useUpdateScene();
  const { themeColor } = getThemeByScene(scene);

  const editor = editorInstance.getEditor();
  let bgColor = "#000116";
  const background = scene.background;
  const [enableColor, setEnableColor] = useState(background instanceof Color);

  if (background !== null) {
    if (background instanceof Color) {
      bgColor = "#" + background.getHexString();
    }
  }
  let fogColor = "#000116";
  if (scene.fog !== null) {
    const fog = scene.fog;
    fogColor = "#" + fog.color.getHexString();
  }
  function setBgColorColor() {
    return (
      <InputGroup size="sm">
        <InputGroup.Text>背景色</InputGroup.Text>
        <Form.Control
          aria-label="small"
          aria-describedby="inputGroup-sizing-sm"
          type="color"
          value={bgColor}
          onChange={(e) => {
            editor.scene.background = new Color(e.target.value);
            editor.scene.environment = null;

            updateScene(editor.scene);
          }}
        />
      </InputGroup>
    );
  }
  function setBgColorTexture() {
    const enableTexture = scene.userData.backgroundHDR.asBackground;
    return (
      <>
        <Form className="border px-2">
          <Form.Check
            style={{ color: styleBody.color }}
            label="使用HDR作为背景"
            type="switch"
            id="custom-switch-hdr"
            checked={enableTexture}
            onChange={() => {
              const { backgroundHDR } = editor.scene.userData;
              backgroundHDR.asBackground = !backgroundHDR.asBackground;
              editor.setTextureBackground();
              updateScene(editor.scene);
            }}
          />
        </Form>
        <InputGroup size="sm">
          <InputGroup.Text style={{ color: styleBody.color }}>
            背景图
          </InputGroup.Text>
          <Form.Select
            aria-label="Default select example"
            disabled={!enableTexture}
            value={scene.userData.backgroundHDR.color}
            onChange={(e) => {
              editor.scene.userData.backgroundHDR.color = e.target.value;
              editor.setTextureBackground();
              updateScene(editor.scene);
            }}
          >
            <option value="venice_sunset_1k.hdr">环境贴图一</option>
            <option value="spruit_sunrise_1k.hdr">环境贴图二</option>
          </Form.Select>
        </InputGroup>
        <InputAttrNumber
          title={"模糊度"}
          min={0}
          max={1}
          disabled={!enableTexture}
          selected3d={editor.scene}
          attr={"backgroundBlurriness"}
          step={step}
        />
        <InputAttrNumber
          title={"透明度"}
          min={0}
          max={1}
          disabled={!enableTexture}
          selected3d={editor.scene}
          attr={"backgroundIntensity"}
          step={step}
        />
        <InputAttrNumber
          title={"光强度"}
          min={0}
          disabled={!enableTexture}
          selected3d={editor.scene}
          attr={"environmentIntensity"}
          step={step}
        />
      </>
    );
  }
  return (
    <Container fluid>
      <AlertBase
        type={APP_COLOR.Warning}
        text={"背景色和背景图，只能选择其一！"}
      />
      <ButtonGroup className="mb-2" size="sm">
        <Button
          style={{ color: styleBody.color, borderColor: styleBody.color }}
          variant={getButtonColor(themeColor)}
          onClick={() => {
            setEnableColor(!enableColor);
            editor.scene.userData.backgroundHDR = sceneUserData.backgroundHDR;
            const { backgroundHDR } = editor.scene.userData;
            backgroundHDR.asBackground = !backgroundHDR.asBackground;
            if (!backgroundHDR.asBackground) {
              editor.scene.background = new Color(bgColor);
              editor.scene.environment = null;
            }
            if (backgroundHDR.asBackground) {
              editor.scene.userData.backgroundHDR.asBackground = true;
              editor.setTextureBackground();
            }
            updateScene(editor.scene);
          }}
        >
          {enableColor ? "使用贴图" : "使用颜色"}
        </Button>
        <Button
          style={{ color: styleBody.color, borderColor: styleBody.color }}
          variant={getButtonColor(themeColor)}
          onClick={() => {
            // scene.background = new Color("#000");
            editor.scene.fog = null;
            Toast3d("雾气已重置");
            updateScene(editor.scene);
          }}
        >
          重置雾气
        </Button>
      </ButtonGroup>
      {enableColor ? setBgColorColor() : setBgColorTexture()}
      <InputGroup size="sm">
        <InputGroup.Text style={{ color: styleBody.color }}>
          雾气色
        </InputGroup.Text>
        <Form.Control
          aria-label="small"
          aria-describedby="inputGroup-sizing-sm"
          type="color"
          value={fogColor}
          onChange={(e) => {
            if (editor.scene.fog === null) {
              editor.scene.fog = new Fog(bgColor, 0, 116);
            }
            editor.scene.fog.color = new Color(e.target.value);

            updateScene(editor.scene);
          }}
        />
      </InputGroup>
      <InputAttrNumber
        title={"雾气近端"}
        min={0}
        selected3d={editor.scene.fog as Fog}
        attr={"near"}
        step={step}
      />
      <InputAttrNumber
        title={"雾气远端"}
        min={0}
        selected3d={editor.scene.fog as Fog}
        attr={"far"}
        step={step}
      />
    </Container>
  );
}

function CommonProperty() {
  const { scene } = useUpdateScene();
  const { selected3d } = scene.userData as SceneUserData;

  function LightProperty() {
    if (!(selected3d instanceof Light)) {
      return;
    }
    //  selected3d!.shadow!.mapSize.x = 33512; // default
    const camera = selected3d.shadow?.camera as OrthographicCamera;
    return (
      <>
        <InputAttrNumber
          title="亮度"
          min={0}
          selected3d={selected3d}
          attr={"intensity"}
          step={step}
        />
        <InputAttrNumber
          title="阴影宽"
          min={0}
          selected3d={selected3d.shadow?.mapSize as Vector2}
          attr={"x"}
          step={step}
        />
        <InputAttrNumber
          title="阴影高"
          min={0}
          selected3d={selected3d.shadow?.mapSize as Vector2}
          attr={"y"}
          step={step}
        />
        <InputAttrNumber
          title="阴影近端"
          min={0}
          selected3d={camera}
          attr={"near"}
          step={step}
        />
        <InputAttrNumber
          title="阴影远端"
          min={0}
          selected3d={camera}
          attr={"far"}
          step={step}
        />
        <InputAttrNumber
          title="阴影左端"
          min={-10000}
          selected3d={camera}
          attr={"left"}
          step={step}
        />
        <InputAttrNumber
          title="阴影右端"
          min={-10000}
          selected3d={camera}
          attr={"right"}
          step={step}
        />
        <InputAttrNumber
          title="阴影顶端"
          min={-10000}
          selected3d={camera}
          attr={"top"}
          step={step}
        />
        <InputAttrNumber
          title="阴影底端"
          min={-10000}
          selected3d={camera}
          attr={"bottom"}
          step={step}
        />
      </>
    );
  }

  return (
    selected3d && (
      <Container fluid>
        <Input3d transform={selected3d.position} title={"位置"} step={step} />
        <Input3d transform={selected3d.rotation} title={"旋转"} step={step} />
        <Input3d transform={selected3d.scale} title={"缩放"} step={step} />
        <Card>
          <Card.Header style={{ color: styleHeader.color }}>
            其他属性
          </Card.Header>
          <Card.Body>
            <Selected3dName />
            <LightProperty />
          </Card.Body>
        </Card>
      </Container>
    )
  );
}

// 移除 typeof 关键字，并添加类型注解，这里假设使用 SelectedObject 类型

export default function IndexChild() {
  const { selected3d } = editorInstance.getEditor().scene
    .userData as SceneUserData;

  if (selected3d === null) {
    return <AlertBase text={"空的"} type={APP_COLOR.Warning} />;
  }

  if (selected3d.type === "Scene") {
    return <SceneProperty />;
  }
  if (selected3d.type === "PerspectiveCamera") {
    return (
      <Input3d transform={selected3d.position} title={"位置"} step={step} />
    );
  }
  return <CommonProperty />;
}
