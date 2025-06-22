import { createLazyFileRoute } from "@tanstack/react-router";
import { Button, Form, InputGroup, ListGroup } from "react-bootstrap";

import { ConfigCheck } from "@/component/common/ConfigCheck";

import { useUpdateScene } from "@/app/hooks";
import Toast3d from "@/component/common/Toast3d";

import { APP_COLOR, DELAY } from "@/app/type";
import { useEffect, useState } from "react";
import { getButtonColor, getThemeByScene } from "@/three/utils/util4UI";
import Icon from "@/component/common/Icon";

import { styleBody } from "@/component/Editor/OutlineView/fontColor";
import { editorInstance } from "@/three/instance/EditorInstance";
import { config3dInit, SceneUserData } from "@/three/config/Three3dConfig";

export const Route = createLazyFileRoute("/editor3d/config")({
  component: RouteComponent,
});

function RouteComponent() {
  const { scene, updateScene } = useUpdateScene();
  const t = localStorage.getItem("TOKEN");
  const [token, setToken] = useState(t || "TOKEN");
  const { themeColor } = getThemeByScene(scene);
  const btnColor = getButtonColor(themeColor);

  useEffect(() => {
    // 确保在组件加载时，scene.userData.config3d 已经存在
    if (scene.userData.config3d === undefined) {
      const _scene = scene.clone();
      _scene.userData.config3d = { ...config3dInit };
      updateScene(_scene);
    }
  }, []);

  if (scene.userData.config3d === undefined) {
    return;
  }
  const { FPS } = scene.userData.config3d || 0;

  // // 关键帧动画设置
  // function setKeyframe() {
  //   const { useKeyframe } = getScene().userData.config3d || 0;
  //   if (useKeyframe) {
  //     Toast3d("保存后，重新加载生效!", "提示", APP_COLOR.Warning, DELAY.LONG);
  //   }
  // }

  function configToken() {
    if (import.meta.env.DEV) {
      return (
        <ListGroup.Item>
          <InputGroup size="sm">
            <InputGroup.Text style={{ color: styleBody.color }}>
              <Icon iconName="key" gap={1} />
              TOKEN
            </InputGroup.Text>
            <Form.Control
              placeholder={token}
              aria-label={token}
              value={token === "TOKEN" ? "" : token}
              onChange={(e) => {
                setToken(e.target.value.trim());
              }}
            />
            <Button
              variant={btnColor}
              style={{ borderColor: styleBody.color }}
              onClick={() => {
                localStorage.setItem("TOKEN", token);
                Toast3d("设置成功!", "提示", APP_COLOR.Success, DELAY.LONG);
                setTimeout(() => {
                  window.location.reload();
                }, 1000);
              }}
            >
              <Icon iconName="bi bi-check-lg" title="保存" fontSize={1} />
            </Button>
            <Button
              variant={btnColor}
              style={{ borderColor: styleBody.color }}
              onClick={() => {
                localStorage.removeItem("TOKEN");
                Toast3d("清除成功!", "提示", APP_COLOR.Success);
                setTimeout(() => {
                  window.location.reload();
                }, 1000);
              }}
            >
              <Icon iconName="trash" title="清除" fontSize={1} />
            </Button>
          </InputGroup>
        </ListGroup.Item>
      );
    }
  }

  return (
    <ListGroup horizontal className="mt-2">
      <ListGroup.Item>
        <ConfigCheck
          toolTip="相机视角动画"
          iconName="bi bi-play-circle-fill"
          label="启用Tween"
          configKey="useTween"
        />
      </ListGroup.Item>
      <ListGroup.Item>
        <ConfigCheck
          label="投射阴影"
          iconName="bi bi-shield-shaded"
          toolTip="模型阴影"
          configKey="useShadow"
          callBack={() => {
            const editor = editorInstance.getEditor();

            const { shadowMap } = editor.renderer;
            const { config3d } = editor.scene.userData as SceneUserData;
            shadowMap.enabled = config3d.useShadow;

            editor.enableShadow(editor.MODEL_GROUP);
            editor.enableShadow(editor.LIGHT_GROUP);
            updateScene(editor.scene);
          }}
        />
      </ListGroup.Item>
      <ListGroup.Item>
        <ConfigCheck
          iconName="brush"
          label="关键帧动画"
          configKey="useKeyframe"
          toolTip={"设置并保存后，重新加载场景生效"}
        />
      </ListGroup.Item>
      <ListGroup.Item>
        <ConfigCheck
          iconName="diagram-2"
          // iconName="node-plus-fill"
          label="使用合成"
          configKey="useComposer"
          toolTip="后期合成、模型高亮等"
        />
      </ListGroup.Item>
      <ListGroup.Item>
        <InputGroup size="sm">
          <InputGroup.Text style={{ color: styleBody.color }}>
            <Icon iconName="clipboard2-pulse" gap={1} />
            帧率
          </InputGroup.Text>
          <Form.Select
            aria-label="FPS"
            value={FPS}
            onChange={(e) => {
              const { scene } = editorInstance.getEditor();
              const { config3d } = scene.userData as SceneUserData;

              config3d.FPS = Number(e.target.value);
              Toast3d("当前帧率：" + e.target.value);
              updateScene(scene);
            }}
          >
            <option value={6}>6 (垃圾)</option>
            <option value={24}>24 (能用)</option>
            <option value={30}>30 (够用)</option>
            <option value={60}>60 (好用)</option>
            <option value={120}>120 (顶级)</option>
          </Form.Select>
        </InputGroup>
      </ListGroup.Item>
      {configToken()}
    </ListGroup>
  );
}
