import React from "react";
import {
  AnimationMixer,
  ObjectLoader,
  PerspectiveCamera,
  WebGLRenderer,
  Group,
  Object3D,
  Object3DEventMap,
  Scene,
  Vector3,
} from "three";

import { GLTF } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { CSS2DRenderer } from "three/addons/renderers/CSS2DRenderer.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import axios from "@/app/http";
import sceneUserData, {
  ExtraParams,
  RoamLine,
  SceneUserData,
} from "@/three/config/Three3dConfig";
import { GROUP } from "@/three/config/CONSTANT";
import { GlbModel, UserDataType } from "@/app/type";
import { editorInstance } from "@/three/instance/EditorInstance";

//设置物体的变换
export function setGLTFTransform(model: GlbModel, gltf: GLTF) {
  const scene = gltf.scene;

  const { position, rotation, scale } = model;
  const group = new Group();
  group.name = model.name;
  group.add(...scene.children);
  group.userData = {
    ...model.userData,
    type: UserDataType.GlbModel,
  };
  group.position.set(position.x, position.y, position.z);

  // group.rotation.set(rotation._x, rotation._y, rotation._z, "XYZ");
  group.setRotationFromEuler(rotation);
  group.scale.set(scale.x, scale.y, scale.z);

  return group;
}
//创建group,如果group不存在,则创建group
export function createGroupIfNotExist_XX(
  contextScene: Object3D,
  name: string,
  createGroup: boolean = true
): Object3D | undefined {
  let group = contextScene.getObjectByName(name);

  if (group !== undefined) {
    return group;
  }
  if (createGroup) {
    group = new Group();
    group.name = name;
    if (name === GROUP.HELPER) {
      group.userData.isHelper = true;
    }
    return group;
  }
  return undefined;
}

//base64转码
export function base64(file: File) {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function onWindowResize(
  canvas: React.RefObject<HTMLDivElement>,
  camera: PerspectiveCamera,
  renderer: WebGLRenderer,
  labelRenderer: CSS2DRenderer | undefined
) {
  if (canvas.current !== null) {
    const width = canvas.current.offsetWidth;
    const height = canvas.current.offsetHeight;
    camera.aspect = width / height; // 设置相机的宽高比和视口的宽高比一致
    camera.updateProjectionMatrix(); // 更新相机的投影矩阵
    renderer.setSize(width, height); // 更新渲染器的大小
    if (labelRenderer) {
      labelRenderer.setSize(width, height);
    }
  }
  const accordionItem = document.querySelectorAll<HTMLElement>(
    "#editor-right .accordion-item"
  );
  if (accordionItem) {
    if (window.innerWidth < 1200) {
      accordionItem.forEach((item) => {
        item.style.height = "auto";
      });
      return;
    }
    accordionItem.forEach((item) => {
      item.style.height = "46vh";
    });
  }
}

//删除之前的标签
export function clearOldLabel(labelGroupName?: string) {
  const labelDiv = document.querySelectorAll(labelGroupName || ".mark-label");
  if (labelDiv.length > 0) {
    labelDiv.forEach((element) => {
      element.parentNode?.removeChild(element);
    });
  }
}
export function getTourSrc(tourObject: string) {
  let tourSrc = "/#/preview/";
  if (tourObject) {
    tourSrc = "/#/preview/" + tourObject;
    if (import.meta.env.DEV) {
      tourSrc = "http://localhost:5173/#/preview/" + tourObject;
    }
  }
  return tourSrc;
}

export function strToJson(str: string) {
  const { sceneJsonString, modelsJsonString, type } = JSON.parse(str);
  const scene: Scene = JSON.parse(sceneJsonString);

  const models = JSON.parse(modelsJsonString);

  const loader = new ObjectLoader();
  return { scene, models, type, loader };
}

export function getProjectData(id: number): Promise<string> {
  return new Promise((resolve, reject) => {
    axios
      .get(`/project/getProjectData/${id}`)
      .then((res) => {
        if (res.data.data) {
          const data = res.data.data;
          resolve(data);
        } else {
          reject(res.data.message);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function glbLoader() {
  const loader = new GLTFLoader();
  const baseurl = import.meta.env.BASE_URL;
  let path = `${baseurl}static/js/draco/gltf/`;
  if (import.meta.env.DEV) {
    path = `${baseurl}public/static/js/draco/gltf/`;
  }
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath(path);
  loader.setDRACOLoader(dracoLoader);
  return loader;
}

export function removeCanvasChild(canvas3d: React.RefObject<HTMLDivElement>) {
  if (canvas3d.current !== null) {
    const { children } = canvas3d.current;
    for (let i = 0; i < children.length; i++) {
      children[i].remove();
    }
  }
}

export function manyou(
  roamLine: RoamLine,
  camera: PerspectiveCamera,
  params: typeof sceneUserData.customButtonList.roamButtonGroup.userSetting
) {
  const {
    tubeGeometry,
    position,
    biNormal,
    lookAt,
    direction,
    normal,
    roamIsRunning,
    startTime,
  } = roamLine;

  if (!roamIsRunning) {
    roamLine.startTime = Date.now();
    return;
  }

  const time = Date.now() - startTime;
  const loopTime = (20 * 1000) / params.speed;
  const t = (time % loopTime) / loopTime;

  tubeGeometry.parameters.path.getPointAt(t, position);
  position.multiplyScalar(params.scale);
  const segments = tubeGeometry.tangents.length;
  const pickt = t * segments;
  const pick = Math.floor(pickt);
  const pickNext = (pick + 1) % segments;

  biNormal.subVectors(
    tubeGeometry.binormals[pickNext],
    tubeGeometry.binormals[pick]
  );
  biNormal.multiplyScalar(pickt - pick).add(tubeGeometry.binormals[pick]);

  tubeGeometry.parameters.path.getTangentAt(t, direction);

  normal.copy(biNormal).cross(direction);

  position.add(normal.clone().multiplyScalar(params.offset));

  camera.position.copy(position);

  tubeGeometry.parameters.path.getPointAt(
    (t + 30 / tubeGeometry.parameters.path.getLength()) % 1,
    lookAt
  );
  lookAt.multiplyScalar(params.scale);

  // camera orientation 2 - up orientation via normal

  if (!params.lookAhead) lookAt.copy(position).add(direction);
  const upVector = new Vector3(0, 1, 0);
  camera.matrix.lookAt(camera.position, lookAt, upVector);
  //camera.matrix.lookAt(camera.position, lookAt, normal);
  camera.matrixWorldNeedsUpdate = true;
  camera.quaternion.setFromRotationMatrix(camera.matrix);
  // camera.updateMatrixWorld();
}

//设置动画
export function setAnimateClip(
  gltf: GLTF,
  context: Scene,
  group: Object3D<Object3DEventMap>,
  extraParams: ExtraParams
) {
  const { config3d } = context.userData as SceneUserData;
  const { useKeyframe } = config3d;
  if (useKeyframe) {
    //设置关键帧动画
    const { mixer } = extraParams;
    const _mixer = new AnimationMixer(group);
    mixer.push(_mixer);
    gltf.animations.forEach((clip) => {
      const action = _mixer.clipAction(clip);
      action.play();
    });
  }
}

export function addMonkey() {
  const { scene } = editorInstance.getEditor();
  const blender = new URL(`@static/file3d/models/blender.glb`, import.meta.url)
    .href;

  const loader = glbLoader();
  loader.load(blender, function (gltf) {
    const group = new Group();
    group.name = "猴子";
    group.position.set(0, -1, 0);
    group.add(...gltf.scene.children);
    scene.add(group);
  });
}
