import { createLazyFileRoute } from "@tanstack/react-router";
import { Button, ButtonGroup } from "react-bootstrap";

import { Scene, Vector3 } from "three";
import Toast3d from "@/component/common/Toast3d";
import { useUpdateScene } from "@/app/hooks";
import { styleBody } from "@/component/Editor/OutlineView/fontColor";
import { editorInstance } from "@/three/EditorInstance";
import { getButtonColor, getThemeByScene } from "@/threeUtils/util4UI";
import { cameraEnterAnimation } from "@/threeUtils/util4Camera";
import { useEffect } from "react";
import { config3dInit } from "@/three/Three3dConfig";
export const Route = createLazyFileRoute("/editor3d/test")({
  component: RouteComponent,
});

function RouteComponent() {
  const { scene, updateScene } = useUpdateScene();

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
  const { userData } = scene;
  const { useTween } = userData.config3d;
  const { themeColor } = getThemeByScene(scene);
  const btnColor = getButtonColor(themeColor);

  return (
    <>
      <ButtonGroup className="mt-2 ms-2" size="sm">
        <ButtonXX />
        <ButtonXX attr="children" />
        <ButtonXX attr="userData" />
        <Button
          style={{
            borderColor: styleBody.color,
          }}
          variant={btnColor}
          disabled={!useTween}
          onClick={() => {
            const instance = editorInstance.getEditor();
            cameraEnterAnimation(instance);
            Toast3d("查看控制台");
            console.log(instance.camera);
          }}
        >
          相机动画
        </Button>
        <Button
          style={{
            borderColor: styleBody.color,
          }}
          variant={btnColor}
          onClick={() => {
            const instance = editorInstance.getEditor();

            Toast3d("查看控制台");
            const { x, y, z } = instance.camera.position;
            // 使用 parseFloat 将 toFixed(2) 返回的字符串转换为数字
            console.log(
              new Vector3(
                parseFloat(x.toFixed(2)),
                parseFloat(y.toFixed(2)),
                parseFloat(z.toFixed(2))
              )
            );
          }}
        >
          当前相机位置
        </Button>
      </ButtonGroup>
    </>
  );

  function ButtonXX({ attr }: { attr?: keyof typeof Scene.prototype }) {
    let title = "scene";
    if (attr) {
      title = "scene." + attr;
    }
    return (
      <Button
        variant={btnColor}
        style={{
          borderColor: styleBody.color,
        }}
        onClick={() => {
          const { scene } = editorInstance.getEditor();
          if (attr !== undefined) {
            console.log(scene[attr]);
          } else {
            console.log(scene);
          }
          Toast3d("查看控制台");
        }}
      >
        {title}
      </Button>
    );
  }
}
