import { createLazyFileRoute } from "@tanstack/react-router";
import { Button, ButtonGroup } from "react-bootstrap";
import { getCamera, getControls } from "../../three/init3dEditor";
import { Mesh, MeshBasicMaterial, PerspectiveCamera, Scene } from "three";
import { cameraTween } from "../../three/animate";
import Toast3d from "../../component/common/Toast3d";
import { getButtonColor, getThemeByScene } from "../../app/utils";
import { useUpdateScene } from "../../app/hooks";
import { styleBody } from "../../component/Editor/OutlineView/fontColor";

import { cameraBackHome } from "../../viewer3d/buttonList/animateByButton";

import { getAll } from "../../three/init3dViewer";
import { editorInstance } from "../../three/EditorInstance";

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
  function getScene() {
    return editorInstance.getEditor().scene;
  }

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
            const { fixedCameraPosition } = getScene().userData;
            const camera = editorInstance.getEditor().camera;
            camera.position.set(8, 8, 8);
            cameraTween(camera, fixedCameraPosition).start();
            console.log(getScene().userData);
          }}
        >
          相机动画
        </Button>
      </ButtonGroup>
      <ButtonGroup className="mt-2 ms-2" size="sm">
        <Button
          style={{
            borderColor: styleBody.color,
          }}
          variant={btnColor}
          onClick={() => {
            // drawROAMLine(getScene(), "漫游动画1");
            // drawROAMLine(getScene(), "漫游动画1");
            const a = getAll().parameters3d.roamLine.tubeGeometry;
            getAll().parameters3d.roamLine.roamIsRunning = true;

            const material = new MeshBasicMaterial({ color: 0x00ff00 });
            // 创建网格对象
            const tubeMesh = new Mesh(a, material);
            // 将网格添加到场景中
            getScene().add(tubeMesh);
            console.log(getCamera());

            //          const controls = getControls();
            // const { animationTime } = getUserSetting(scene.userData.customButtonList);
            // cameraBackHome(camera as PerspectiveCamera, controls, animationTime);
          }}
        >
          绘制漫游线
        </Button>
        <Button
          style={{
            borderColor: styleBody.color,
          }}
          variant={btnColor}
          onClick={() => {
            // drawROAMLine(getScene(), "漫游动画1");
            // drawROAMLine(getScene(), "漫游动画1");
            const a = getAll().parameters3d.roamLine.tubeGeometry;
            getAll().parameters3d.roamLine.roamIsRunning = false;

            const material = new MeshBasicMaterial({ color: 0x00ff00 });
            // 创建网格对象
            const tubeMesh = new Mesh(a, material);
            // 将网格添加到场景中
            getScene().add(tubeMesh);
            const camera = getCamera();

            const controls = getControls();
            // const { animationTime } = getUserSetting(
            //   getScene().userData.customButtonList
            // );
            cameraBackHome(camera as PerspectiveCamera, controls, 1000);
          }}
        >
          停止漫游线
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
