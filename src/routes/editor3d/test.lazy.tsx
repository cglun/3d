import { createLazyFileRoute } from "@tanstack/react-router";
import { Button, ButtonGroup } from "react-bootstrap";

import { Scene } from "three";
import Toast3d from "../../component/common/Toast3d";
import { useUpdateScene } from "../../app/hooks";
import { styleBody } from "../../component/Editor/OutlineView/fontColor";
import { editorInstance } from "../../three/EditorInstance";
import { getButtonColor, getThemeByScene } from "../../threeUtils/util4UI";
import { cameraEnterAnimation } from "../../threeUtils/util4Camera";
export const Route = createLazyFileRoute("/editor3d/test")({
  component: RouteComponent,
});

function RouteComponent() {
  const { scene } = useUpdateScene();
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
            console.log(instance.camera);
          }}
        >
          相机动画
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
