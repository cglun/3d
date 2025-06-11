import { createLazyFileRoute } from "@tanstack/react-router";
import { Button, ButtonGroup } from "react-bootstrap";

import {
  CatmullRomCurve3,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  Scene,
  TubeGeometry,
  Vector3,
} from "three";
import { cameraTween } from "../../three/animate";
import Toast3d from "../../component/common/Toast3d";
import { getButtonColor, getThemeByScene } from "../../app/utils";
import { useUpdateScene } from "../../app/hooks";
import { styleBody } from "../../component/Editor/OutlineView/fontColor";
import { editorInstance } from "../../three/EditorInstance";
import { SceneUserData } from "../../three/Three3dConfig";
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
            const { camera, scene } = editorInstance.getEditor();
            const { fixedCameraPosition } = scene.userData;
            // const camera = editorInstance.getEditor().camera;
            camera.position.set(8, 8, 8);
            cameraTween(camera, fixedCameraPosition).start();
            console.log(scene.userData);
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
            //drawROAMLine(getScene(), "漫游动画1");
            // drawROAMLine(getScene(), "漫游动画1");

            const { extraParams, scene } = editorInstance.getEditor();
            //@ts-expect-error
            const curvePath = editorInstance
              .getEditor()
              .getCurveByEmptyMesh("漫游动画1");
            const { roamLine } = extraParams;

            const sampleClosedSpline = new CatmullRomCurve3([
              new Vector3(-40, 0, -40),
              new Vector3(40, 0, -40),
              new Vector3(140, 0, -40),
              new Vector3(40, 0, 40),
              new Vector3(-40, 0, 40),
            ]);

            sampleClosedSpline.curveType = "catmullrom";
            sampleClosedSpline.closed = true;

            if (roamLine) {
              roamLine.roamIsRunning = true;

              roamLine.tubeGeometry = new TubeGeometry(
                sampleClosedSpline, //一个路径对象。
                600, //数值越大，线越平滑
                1, //默认值是 1，代表管的半径。数值越大，管就越粗。在你的代码里设置为 2，说明管的半径是 2 个单位
                3, //默认值是 8,横截面的分段数量。数值越大，管的横截面就越接近圆形
                closed //路径是否闭合
              );
            }
            const material = new MeshLambertMaterial({ color: 0xff00ff });
            const wireframeMaterial = new MeshBasicMaterial({
              color: 0x000000,
              opacity: 0.3,
              wireframe: true,
              transparent: true,
            });

            const mesh = new Mesh(roamLine!!.tubeGeometry, material);
            const wireframe = new Mesh(
              roamLine!!.tubeGeometry,
              wireframeMaterial
            );
            mesh.add(wireframe);

            scene.add(mesh);

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
            const { extraParams, camera, controls, scene } =
              editorInstance.getEditor();
            const { roamLine } = extraParams;

            if (roamLine) {
              roamLine.roamIsRunning = false;
              const _userData = scene.userData as SceneUserData;
              const { animationTime } =
                _userData.customButtonList.panelControllerButtonGroup
                  .userSetting;
              cameraTween(camera, userData.fixedCameraPosition, animationTime)
                .start()
                .onComplete(() => {
                  controls.target.set(0, 0, 0);
                });
            }
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
