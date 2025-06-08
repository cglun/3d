import {
  BoxHelper,
  Camera,
  EquirectangularReflectionMapping,
  Group,
  Object3D,
  OrthographicCamera,
  PerspectiveCamera,
  Raycaster,
  Scene,
  Vector2,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import TWEEN from "three/addons/libs/tween.module.js";
import venice_sunset_1k from "/static/file3d/hdr/venice_sunset_1k.hdr?url";
import spruit_sunrise_1k from "/static/file3d/hdr/spruit_sunrise_1k.hdr?url";
import { GLOBAL_CONSTANT } from "./GLOBAL_CONSTANT";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { manyou } from "../viewer3d/buttonList/animateByButton";

import { UserDataType } from "../app/type";

import { Config3d, enableScreenshot, Extra3d, Parameters3d } from "./config3d";

import { createGroupIfNotExist } from "./utils";

export function enableShadow(group: Scene | Group | Object3D, context: Scene) {
  const { useShadow } = context.userData.config3d;

  group.traverse((child: Object3D) => {
    if (child.userData.isHelper) {
      return;
    }
    if (child.type !== "AmbientLight") {
      // 修改部分
      if (Object.prototype.hasOwnProperty.call(child, "castShadow")) {
        child.castShadow = useShadow;
      }

      if (Object.prototype.hasOwnProperty.call(child, "receiveShadow")) {
        child.receiveShadow = useShadow;
      }
    }
  });
}

//射线 拾取物体
export function raycasterSelect(
  event: MouseEvent,
  camera: Camera,
  scene: Scene,
  divElement: HTMLElement
) {
  const raycaster = new Raycaster();
  const pointer = new Vector2();
  pointer.x = (event.offsetX / divElement.offsetWidth) * 2 - 1;
  pointer.y = -(event.offsetY / divElement.offsetHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);

  // 计算物体和射线的焦点
  const intersects = raycaster.intersectObjects(scene.children, true);
  if (intersects.length > 0) {
    // 你可以根据intersects数组中的信息来处理相交事件，比如改变相交物体的颜色等
    return intersects;
  }
  return [];
}

export function setBoxHelper(selectedMesh: Object3D, scene: Scene) {
  const HELPER_GROUP = createGroupIfNotExist(
    scene,
    GLOBAL_CONSTANT.HELPER_GROUP
  );

  const BOX_HELPER = scene.getObjectByName(
    GLOBAL_CONSTANT.BOX_HELPER
  ) as BoxHelper;
  if (!BOX_HELPER) {
    const boxHelper = new BoxHelper(selectedMesh, 0xffff00);
    boxHelper.name = GLOBAL_CONSTANT.BOX_HELPER;
    boxHelper.userData = {
      type: UserDataType.BoxHelper,
      isHelper: true,
      isSelected: false,
    };
    HELPER_GROUP?.add(boxHelper);
  } else {
    BOX_HELPER.visible = true;
    BOX_HELPER.setFromObject(selectedMesh);
    BOX_HELPER.update();
  }
  if (HELPER_GROUP) {
    scene.add(HELPER_GROUP);
  }
}
// 显示或隐藏BOX_HELPER
export function hideBoxHelper(scene: Scene) {
  const boxHelper = scene.getObjectByName(GLOBAL_CONSTANT.BOX_HELPER);
  if (boxHelper) {
    boxHelper.visible = false;
  }
}
export interface AnimateProps {
  scene: Scene;
  camera: PerspectiveCamera | OrthographicCamera;
  controls: OrbitControls;
  renderer: WebGLRenderer;
  extra3d: Extra3d;
  parameters3d: Parameters3d;
  composer?: EffectComposer;
}
export function commonAnimate(animateProps: AnimateProps) {
  const { scene, camera, controls, renderer, extra3d, parameters3d, composer } =
    animateProps;

  const { css2d, css3d, useTween, FPS, useKeyframe, useComposer } = animateProps
    .scene.userData.config3d as Config3d;

  const { clock, mixer, roamLine } = parameters3d;
  const T = clock.getDelta();
  parameters3d.timeS = parameters3d.timeS + T;
  let renderT = 1 / FPS;
  // 如果截图,帧率拉满
  if (enableScreenshot.enable) {
    renderT = enableScreenshot.renderTime;
  }
  if (parameters3d.timeS >= renderT) {
    if (extra3d.labelRenderer2d && css2d) {
      extra3d.labelRenderer2d.render(scene, camera);
    }
    if (extra3d.labelRenderer3d && css3d) {
      extra3d.labelRenderer3d.render(scene, camera);
    }
    if (useTween) {
      TWEEN.update();
    }
    if (useKeyframe) {
      mixer.forEach((_mixer) => {
        _mixer.update(T);
      });
    }

    controls.update();
    if (roamLine) {
      manyou(roamLine, camera);
    }

    renderer.render(scene, camera);

    if (composer && useComposer) {
      composer.render(); // 使用 composer 进行渲染
    }
    parameters3d.timeS = 0;
  }
}

//环境贴图设置
export function setTextureBackground(scene: Scene) {
  const rgbeLoader = new RGBELoader();
  const { backgroundHDR } = scene.userData;

  //开发正常，打包后，有问题
  // const hdr = new URL(
  //   `/static/file3d/hdr/${backgroundHDR.name}`,
  //   import.meta.url
  // ).href;

  const hdr = {
    "venice_sunset_1k.hdr": venice_sunset_1k,
    "spruit_sunrise_1k.hdr": spruit_sunrise_1k,
  };

  const name = backgroundHDR.name as keyof typeof hdr;
  rgbeLoader.load(hdr[name], (texture) => {
    texture.mapping = EquirectangularReflectionMapping;
    scene.background = null;
    if (backgroundHDR.asBackground) {
      scene.background = texture;
      // scene.backgroundBlurriness = 0; // @TODO: Needs PMREM
    }
    scene.environment = texture;
  });
}
