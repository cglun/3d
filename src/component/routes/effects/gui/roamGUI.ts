import {
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  TubeGeometry,
} from "three";
import {
  RoamButtonUserSetting,
  SceneUserData,
} from "@/three/config/Three3dConfig";
import { cameraEnterAnimation } from "@/three/utils/util4Camera";
import { editorInstance } from "@/three/instance/EditorInstance";
export default function roamGUI() {
  const editor = editorInstance.getEditor();
  editor.outlinePass.selectedObjects = [];

  const { customButtonList } = editorInstance.getEditor().scene
    .userData as SceneUserData;
  const { userSetting } = customButtonList.roamButtonGroup;
  const folderGeometry = editor.createGUI("漫游");

  const { roamLine } = editorInstance.getEditor().extraParams;
  if (roamLine) {
    roamLine.roamIsRunning = true;
    addTube(userSetting);
    folderGeometry
      .add(roamLine, "roamIsRunning")
      .name("启动/停止")
      .onChange(function () {
        const { tubeMesh } = editor;
        if (!roamLine.roamIsRunning) {
          cameraEnterAnimation(editor);
        }
        if (tubeMesh === null) {
          addTube(userSetting);
        }
      });
  }
  folderGeometry
    .add(userSetting, "scale", 0.1, 10)
    .name("缩放比例")
    .step(0.1)
    .onChange(function () {
      setScale(editorInstance.getEditor().tubeMesh!, userSetting);
    });
  folderGeometry.add(userSetting, "speed", 0.01, 20).name("速度").step(0.01);
  folderGeometry
    .add(userSetting, "tension", -1, 1, 0.001)
    .name("张力")
    .onChange(() => {
      addTube(userSetting);
    });
  folderGeometry
    .add(userSetting, "extrusionSegments", 5, 1160)
    .name("曲线分段")
    .step(5)
    .onChange(function () {
      addTube(userSetting);
    });
  folderGeometry
    .add(userSetting, "radiusSegments", 1, 12)
    .name("半径分段")
    .step(1)
    .onChange(function () {
      addTube(userSetting);
    });
  folderGeometry
    .add(userSetting, "offset", -20, 20)
    .name("偏移量")
    .step(0.01)
    .onChange(function () {
      addTube(userSetting);
    });
  folderGeometry
    .add(userSetting, "radius", 0.01, 20)
    .name("半径")
    .step(0.01)
    .onChange(function () {
      addTube(userSetting);
    });
  folderGeometry
    .add(userSetting, "closed")
    .name("是否闭合")
    .onChange(function () {
      addTube(userSetting);
    });

  folderGeometry.add(userSetting, "lookAhead").name("向前看");

  function addTube(params: RoamButtonUserSetting) {
    const { tubeMesh } = editorInstance.getEditor();
    if (tubeMesh !== null) {
      tubeMesh.parent?.remove(tubeMesh);
      tubeMesh.geometry.dispose();
    }
    const { extraParams, scene } = editorInstance.getEditor();

    const curvePath = editorInstance
      .getEditor()
      .getCurveByEmptyMesh("漫游动画1", userSetting.tension);

    const { roamLine } = extraParams;
    curvePath.closed = true;

    if (roamLine) {
      // roamLine.roamIsRunning = true;
      roamLine.tubeGeometry = new TubeGeometry(
        curvePath, //曲线
        params.extrusionSegments, //曲线的分段数量
        params.radius, //意味着生成的管道半径为 1 个单位。
        params.radiusSegments, //指定管道圆周方向的分段数量
        params.closed //是否闭合
      );
    }
    const material = new MeshLambertMaterial({ color: 0xff00ff });
    const wireframeMaterial = new MeshBasicMaterial({
      color: 0x000000,
      opacity: 0.3,
      wireframe: true,
      transparent: true,
    });

    const mesh = new Mesh(roamLine?.tubeGeometry, material);
    const wireframe = new Mesh(roamLine?.tubeGeometry, wireframeMaterial);
    mesh.add(wireframe);
    mesh.scale.set(params.scale, params.scale, params.scale);
    scene.add(mesh);
    setScale(mesh, params);

    editorInstance.getEditor().tubeMesh = mesh;
  }
  function setScale(mesh: Mesh, params: RoamButtonUserSetting) {
    mesh.scale.set(params.scale, params.scale, params.scale);
  }
}
