import {
  BoxHelper,
  Camera,
  EquirectangularReflectionMapping,
  Group,
  Object3D,
  Raycaster,
  Scene,
  Vector2,
} from "three";

import { RGBELoader } from "three/addons/loaders/RGBELoader.js";

import { GLOBAL_CONSTANT } from "@/three/GLOBAL_CONSTANT";

import { UserDataType } from "@/app/type";

import { hdr, HdrKey } from "@/three/Three3dConfig";
import { createGroupIfNotExist } from "@/threeUtils/util4Scene";

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
export function raycasterSelect_xx(
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

export function setBoxHelper_xx(selectedMesh: Object3D, scene: Scene) {
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

//环境贴图设置
export function setTextureBackground_test_xx(scene: Scene) {
  const rgbeLoader = new RGBELoader();
  const { backgroundHDR } = scene.userData;

  //开发正常，打包后，有问题
  // const hdr = new URL(
  //   `/static/file3d/hdr/${backgroundHDR.color}`,
  //   import.meta.url
  // ).href;

  // const color = backgroundHDR.color as HdrKey;
  const { color, isColor } = backgroundHDR;
  if (!isColor) {
    rgbeLoader.load(hdr[color as HdrKey], (texture) => {
      texture.mapping = EquirectangularReflectionMapping;
      scene.background = null;
      if (backgroundHDR.asBackground) {
        scene.background = texture;
        // scene.backgroundBlurriness = 0; // @TODO: Needs PMREM
      }
      scene.environment = texture;
    });
  }
}
