import { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import { Color, Fog, Light, OrthographicCamera, Texture, Vector2 } from "three";
import Card from "react-bootstrap/esm/Card";
import InputGroup from "react-bootstrap/esm/InputGroup";

import { ButtonGroup, Container } from "react-bootstrap";
import { useUpdateScene } from "../../../app/hooks";
import { Input3d } from "./Input3d";
import { InputAttrText } from "./InputAttrText";
import { getButtonColor, getThemeByScene } from "../../../app/utils";
import AlertBase from "../../common/AlertBase";
import { setTextureBackground } from "../../../three/common3d";
import { sceneUserData } from "../../../three/config3d";
import { APP_COLOR, SelectedObject } from "../../../app/type";
import { InputAttrNumber } from "./InputAttrNumber";
import Toast3d from "../../common/Toast3d";
import { styleBody, styleHeader } from "../OutlineView/fontColor";
import { editorInstance } from "../../../three/EditorInstance";
import { SceneUserData } from "../../../three/Three3dConfig";

const step = 0.1;
function SceneProperty() {
  const { scene, updateScene } = useUpdateScene();

  const { themeColor } = getThemeByScene(scene);

  const _scene = editorInstance.getEditor().scene;
  let bgColor = "#000116";
  const background = _scene.background as Color | Texture;
  const [enableColor, setEnableColor] = useState(background instanceof Color);

  if (background !== null) {
    if (background instanceof Color) {
      bgColor = "#" + background.getHexString();
    }
  }
  let fogColor = "#000116";
  if (_scene.fog !== null) {
    const fog = _scene.fog;
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
            _scene.background = new Color(e.target.value);
            _scene.environment = null;
            updateScene(_scene);
          }}
        />
      </InputGroup>
    );
  }
  function setBgColorTexture() {
    const enableTexture = _scene.userData.backgroundHDR.asBackground;
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
              const { backgroundHDR } = _scene.userData;
              backgroundHDR.asBackground = !backgroundHDR.asBackground;
              setTextureBackground(_scene);
              updateScene(_scene);
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
            value={_scene.userData.backgroundHDR.name}
            onChange={(e) => {
              _scene.userData.backgroundHDR.name = e.target.value;
              setTextureBackground(_scene);
              updateScene(_scene);
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
          selected3d={_scene}
          attr={"backgroundBlurriness"}
          step={step}
        />
        <InputAttrNumber
          title={"透明度"}
          min={0}
          max={1}
          disabled={!enableTexture}
          selected3d={_scene}
          attr={"backgroundIntensity"}
          step={step}
        />
        <InputAttrNumber
          title={"光强度"}
          min={0}
          disabled={!enableTexture}
          selected3d={_scene}
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
            _scene.userData.backgroundHDR = sceneUserData.backgroundHDR;
            const { backgroundHDR } = _scene.userData;
            backgroundHDR.asBackground = !backgroundHDR.asBackground;
            if (!backgroundHDR.asBackground) {
              _scene.background = new Color(bgColor);
              _scene.environment = null;
            }
            if (backgroundHDR.asBackground) {
              _scene.userData.backgroundHDR.asBackground = true;
              setTextureBackground(_scene);
            }
            updateScene(_scene);
          }}
        >
          {enableColor ? "使用贴图" : "使用颜色"}
        </Button>
        <Button
          style={{ color: styleBody.color, borderColor: styleBody.color }}
          variant={getButtonColor(themeColor)}
          onClick={() => {
            // _scene.background = new Color("#000");
            _scene.fog = null;
            Toast3d("雾气已重置");
            updateScene(_scene);
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
            if (_scene.fog === null) {
              _scene.fog = new Fog(bgColor, 0, 116);
            }
            _scene.fog.color = new Color(e.target.value);

            updateScene(_scene);
          }}
        />
      </InputGroup>
      <InputAttrNumber
        title={"雾气近端"}
        min={0}
        selected3d={_scene.fog as Fog}
        attr={"near"}
        step={step}
      />
      <InputAttrNumber
        title={"雾气远端"}
        min={0}
        selected3d={_scene.fog as Fog}
        attr={"far"}
        step={step}
      />
    </Container>
  );
}

function CommonProperty({ selected3d }: { selected3d: SelectedObject }) {
  // const { type } = selected3d.parent;
  // let canSetShadow = true;
  // // if (type && type === "Scene") {
  // //   canSetShadow = true;
  // // }

  // function findTopLevelParent(object) {

  //   canSetShadow =
  //     object.userData.type === UserDataType.GlbModel ? true : false;
  //   if (object.parent) {
  //     return findTopLevelParent(object.parent);
  //   } else {
  //     return object; // 如果没有父对象，返回当前对象，即顶层父对象
  //   }
  // }
  // findTopLevelParent(selected3d);
  // debugger;

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
            <InputAttrText
              title={"名称"}
              selected3d={selected3d}
              attr={"name"}
            />

            <LightProperty />
          </Card.Body>
        </Card>
      </Container>
    )
  );
}

// 移除 typeof 关键字，并添加类型注解，这里假设使用 SelectedObject 类型

export default function IndexChild() {
  const { scene } = useUpdateScene();
  const { selected3d } = scene.userData as SceneUserData;

  if (selected3d === null || selected3d === undefined) {
    return;
  }
  if (selected3d.type === "Scene") {
    return <SceneProperty />;
  }
  if (selected3d.type === "PerspectiveCamera") {
    return (
      <Input3d transform={selected3d.position} title={"位置"} step={step} />
    );
  }
  return <CommonProperty selected3d={selected3d} />;
}
