import {
  BufferGeometry,
  CatmullRomCurve3,
  Line,
  LineBasicMaterial,
  Object3D,
  Object3DEventMap,
  OrthographicCamera,
  PerspectiveCamera,
  Scene,
  TubeGeometry,
  Vector3,
} from "three";
import { ActionItemMap, CustomButtonListType } from "../../app/type";

import { createGroupIfNotExist } from "../../three/utils";
import { GLOBAL_CONSTANT } from "../../three/GLOBAL_CONSTANT";
import {
  getScene,
  getCamera,
  getControls,
  getUserData,
  getAll,
} from "../../three/init3dViewer";

import { cameraTween, meshTween } from "../../three/animate";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { getObjectWorldPosition, getUserSetting } from "../viewer3dUtils";
import { roamAnimation } from "./buttonGroup";

import { RoamLine } from "../../three/config3d";

// 显示模型-显示和隐藏
export function showModelByNameId(NAME_ID: string) {
  const MODEL_GROUP = createGroupIfNotExist(
    getScene(),
    GLOBAL_CONSTANT.MODEL_GROUP,
    false
  );
  if (MODEL_GROUP) {
    MODEL_GROUP.traverse((item) => {
      item.layers.set(1);
    });
  }

  const groups = createGroupIfNotExist(getScene(), NAME_ID, false);
  if (groups) {
    groups.traverse((item) => {
      item.layers.set(0);
    });
    showParentGroup(groups);
  }
  // 递归显示父级，新版本需要递归显示父级，才能显示模型
  function showParentGroup(group: Object3D<Object3DEventMap>) {
    group.layers.set(0);
    if (group.parent) {
      showParentGroup(group.parent);
    }
  }
}
export function showModelBackHome(customButtonList: CustomButtonListType) {
  if (customButtonList.toggleButtonGroup.type === "TOGGLE") {
    showModelByNameId(GLOBAL_CONSTANT.MODEL_GROUP);
    const { animationTime } = getUserSetting(customButtonList);
    cameraBackHome(getCamera(), getControls(), animationTime);
  }
}

// 显示模型-抽屉
export function drawerOutByNameId(
  item: ActionItemMap,
  customButtonList: CustomButtonListType
) {
  // 使用可选链操作符和默认值确保解构安全

  const MODEL_GROUP = createGroupIfNotExist(getScene(), item.NAME_ID, false);
  item.data = {
    isSelected: true,
    isRunning: true,
  };
  if (MODEL_GROUP) {
    const { x, y, z } = MODEL_GROUP.position;
    const { modelOffset, animationTime } = getUserSetting(customButtonList);

    meshTween(
      MODEL_GROUP,
      new Vector3(x + modelOffset.x, y + modelOffset.y, z + modelOffset.z),
      animationTime
    )
      .start()
      .onComplete(() => {
        item.data = {
          isSelected: true,
          isRunning: false,
        };
      });
  }
}
// 抽屉，回到初始位置
export function drawerBackHome(customButtonList: CustomButtonListType) {
  if (customButtonList.toggleButtonGroup.type === "DRAWER") {
    const { listGroup } = customButtonList.toggleButtonGroup;
    const userSetting = getUserSetting(getScene().userData.customButtonList);
    listGroup.forEach((_item: ActionItemMap) => {
      const _d = _item.data;
      if (_item.data?.isSelected && !_d?.isRunning) {
        const model = createGroupIfNotExist(getScene(), _item.NAME_ID, false);
        _item.data = {
          isRunning: true,
          isSelected: true,
        };

        if (model) {
          const mp = model.position;
          const { x, y, z } = userSetting.modelOffset;
          meshTween(
            model,
            new Vector3(mp.x - x, mp.y - y, mp.z - z),
            userSetting?.animationTime ?? 1000
          )
            .start()
            .onComplete(() => {
              _item.data = {
                isRunning: false,
                isSelected: false,
              };
            });
        }
      }
    });
  }
}
// 显示模型-拉伸
export function stretchModelByNameId(
  NAME_ID: string,
  customButtonList: CustomButtonListType
) {
  const MODEL_GROUP = createGroupIfNotExist(getScene(), NAME_ID, false);
  if (MODEL_GROUP) {
    const isStretch = MODEL_GROUP.userData.childrenIsStretch;
    const isStretchRunning = MODEL_GROUP.userData.childrenIsRunning;
    if (isStretchRunning) {
      return;
    }
    MODEL_GROUP.userData.childrenIsRunning = true;
    if (isStretch) {
      stretchListGroup(MODEL_GROUP, customButtonList, false);
      return;
    }
    stretchListGroup(MODEL_GROUP, customButtonList, true);
  }
}

//展开的模型回到初始位置
export function stretchModelBackHome(customButtonList: CustomButtonListType) {
  if (customButtonList.toggleButtonGroup.type === "STRETCH") {
    const MODEL_GROUP = createGroupIfNotExist(
      getScene(),
      GLOBAL_CONSTANT.MODEL_GROUP,
      false
    );
    if (!MODEL_GROUP) {
      return;
    }
    MODEL_GROUP.children.forEach((_item) => {
      const { children } = _item;
      for (let index = 0; index < children.length; index++) {
        const element = children[index];
        for (let index = 0; index < element.children.length; index++) {
          const _element = element.children[index];

          if (
            !element.userData.childrenIsRunning &&
            element.userData.childrenIsStretch
          ) {
            closeStretchModel(_element, customButtonList, index);
          }
        }

        // const { x, y, z } = element.position;

        //  stretchListGroup(element, customButtonList, false);
      }
      const { animationTime } = getUserSetting(customButtonList);
      cameraBackHome(getCamera(), getControls(), animationTime);
    });
  }
}

function closeStretchModel(
  group: Object3D<Object3DEventMap>,
  customButtonList: CustomButtonListType,
  index: number
) {
  const { x, y, z } = group.position;
  const { modelOffset, animationTime } = getUserSetting(customButtonList);

  meshTween(
    group,
    new Vector3(
      x - modelOffset.x * index,
      y - modelOffset.y * index,
      z - modelOffset.z * index
    ),
    animationTime
  )
    .start()
    .onComplete(() => {
      if (group.parent) {
        group.parent.userData.childrenIsStretch = false;
        group.parent.userData.childrenIsRunning = false;
      }
    });
}

function stretchListGroup(
  MODEL_GROUP: Object3D<Object3DEventMap>,
  customButtonList: CustomButtonListType,
  childrenIsStretch: boolean
) {
  const { animationTime, modelOffset } = getUserSetting(customButtonList);
  const array = MODEL_GROUP.children;
  const directionMultiplier = MODEL_GROUP.userData.childrenIsStretch ? -1 : 1;

  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    const { x, y, z } = element.position;
    meshTween(
      element,
      new Vector3(
        x + modelOffset.x * index * directionMultiplier,
        y + modelOffset.y * index * directionMultiplier,
        z + modelOffset.z * index * directionMultiplier
      ),
      animationTime
    )
      .start()
      .onComplete(() => {
        MODEL_GROUP.userData.childrenIsStretch = childrenIsStretch;
        MODEL_GROUP.userData.childrenIsRunning = false;
      });
  }
}

let isMoveCamera = false;
export function moveCameraSTRETCH(
  item: ActionItemMap,
  customButtonList: CustomButtonListType
) {
  const { NAME_ID } = item;

  const MODEL_GROUP = createGroupIfNotExist(getScene(), NAME_ID, false);

  if (MODEL_GROUP) {
    // 移动相机到指定位置
    const camera = getCamera();
    const controls = getControls();
    const { animationTime } = getUserSetting(customButtonList);
    if (isMoveCamera) {
      cameraBackHome(camera, controls, animationTime);
    } else {
      const fixedPosition =
        item.data?.cameraPosition ?? getUserData().fixedCameraPosition;

      cameraTween(
        camera,
        new Vector3(fixedPosition.x, fixedPosition.y, fixedPosition.z),
        animationTime
      ).start();
      const { x, y, z } = MODEL_GROUP.position;
      controls.target.set(x, y, z);
      controls.update();
      isMoveCamera = true;
    }
  }
}

export function moveCameraDRAWER(
  item: ActionItemMap,
  customButtonList: CustomButtonListType
) {
  const { NAME_ID } = item;

  const MODEL_GROUP = createGroupIfNotExist(getScene(), NAME_ID, false);

  if (MODEL_GROUP) {
    // 移动相机到指定位置
    const camera = getCamera();
    const controls = getControls();
    const { animationTime, cameraOffset } = getUserSetting(customButtonList);

    if (isMoveCamera && MODEL_GROUP.name === GLOBAL_CONSTANT.MODEL_GROUP) {
      cameraBackHome(camera, controls, animationTime);
    } else {
      if (MODEL_GROUP.name === GLOBAL_CONSTANT.MODEL_GROUP) {
        return;
      }
      const { x, y, z } = getObjectWorldPosition(MODEL_GROUP);

      const cameraPosition = new Vector3(
        x + cameraOffset.x,
        y + cameraOffset.y,
        z + cameraOffset.z
      );

      cameraTween(camera, cameraPosition, animationTime).start();
      controls.target.set(x, y, z);
      controls.update();
      isMoveCamera = true;
    }
  }
}

export function cameraBackHome(
  camera: PerspectiveCamera,
  controls: OrbitControls,
  animationTime: number
) {
  cameraTween(camera, getUserData().fixedCameraPosition, animationTime)
    .start()
    .onComplete(() => {
      controls.target.set(0, 0, 0);
      // window.a =
      isMoveCamera = false;
    });
}

//export let currentlyActionItemMap: (item: ActionItemMap) => void;
//currentlyActionItemMap = (item: ActionItemMap) => {};
function commonHandler(item: ActionItemMap) {
  if (_roamIsRunning) {
    roamAnimation(false);
  }
  if (document.getCurrentActionItemMap) {
    document.getCurrentActionItemMap(item);
  }
}

export function animateTOGGLE(
  item: ActionItemMap,
  customButtonList: CustomButtonListType
) {
  const { NAME_ID } = item;

  return {
    ...item,
    handler: () => {
      // if (_roamIsRunning) {
      //   roamAnimation(false);
      // }
      // document.getCurrentActionItemMap(item);
      commonHandler(item);
      item.isClick = !item.isClick;
      const { cameraOffset, animationTime } = getUserSetting(customButtonList);
      if (NAME_ID === GLOBAL_CONSTANT.MODEL_GROUP) {
        showModelByNameId(GLOBAL_CONSTANT.MODEL_GROUP);
        cameraBackHome(getCamera(), getControls(), animationTime);
        return;
      }
      showModelByNameId(NAME_ID);
      const model = createGroupIfNotExist(getScene(), NAME_ID, false);
      if (model) {
        const { x, y, z } = getObjectWorldPosition(model);
        const camera = getCamera();
        cameraTween(
          camera,
          new Vector3(
            x + cameraOffset.x,
            y + cameraOffset.y,
            z + cameraOffset.z
          ),
          animationTime
        )
          .start()
          .onComplete(() => {
            const controls = getControls();
            controls.target.set(x, y, z);
            controls.update();
          });
      }
    },
  };
}
export function animateDRAWER(
  item: ActionItemMap,
  customButtonList: CustomButtonListType
) {
  return {
    ...item,
    handler: () => {
      commonHandler(item);

      drawerBackHome(customButtonList);
      if (!item.data?.isSelected && !item.data?.isRunning) {
        drawerOutByNameId(item, customButtonList);
        moveCameraDRAWER(item, customButtonList);
      }
    },
  };
}
export function animateSTRETCH(
  item: ActionItemMap,
  customButtonList: CustomButtonListType
) {
  const { NAME_ID } = item;
  return {
    ...item,
    handler: () => {
      commonHandler(item);
      //如果是全景按钮，
      if (NAME_ID === GLOBAL_CONSTANT.MODEL_GROUP) {
        //const customButtonList = getScene().userData
        stretchModelBackHome(customButtonList);
        return;
      }
      stretchModelByNameId(NAME_ID, customButtonList);
      moveCameraSTRETCH(item, customButtonList);
      drawerBackHome(customButtonList);
    },
  };
}

export let _roamIsRunning = false;
//ROAM动画
export function animateROAM(
  scene: Scene,
  curveName: string,
  customButtonList: CustomButtonListType,
  isRunning: boolean
) {
  const vector: Vector3[] = [];
  const _curve = createGroupIfNotExist(scene, curveName, false);

  if (!_curve) {
    return;
  }

  _curve.children.forEach((child) => {
    const position = getObjectWorldPosition(child);
    vector.push(position);
  });
  const { speed } = getUserSetting(customButtonList, "roamButtonGroup");
  const curve = new CatmullRomCurve3(vector, true);

  const { roamLine } = getAll().parameters3d;
  roamLine.roamIsRunning = isRunning;
  roamLine.speed = speed;
  roamLine.tubeGeometry = new TubeGeometry(curve, 100, 2, 3, true);
}
export function animateROAM_bf(
  scene: Scene,
  camera: PerspectiveCamera,
  controls: OrbitControls,
  curveName: string,
  roamButtonGroup: CustomButtonListType["roamButtonGroup"],
  isRunning: boolean
) {
  const vector: Vector3[] = [];
  const _curve = createGroupIfNotExist(scene, curveName, false);
  if (!_curve) {
    return;
  }
  _roamIsRunning = isRunning;

  _curve.children.forEach((child) => {
    const position = getObjectWorldPosition(child);
    vector.push(position);
  });

  const curve = new CatmullRomCurve3(vector, true);

  //drawROAMLine(curve, scene);
  if (camera) {
    // 初始化进度变量
    let progress = 0;
    // 移动速度，可根据需要调整
    const speed = (roamButtonGroup?.userSetting?.speed ?? 2) / 10000;

    function moveModelAlongCurve() {
      if (progress <= 1 && _roamIsRunning) {
        // 根据进度获取曲线上的点
        const point = curve.getPoint(progress);
        // 设置相机的位置
        camera.position.copy(point);
        // 获取曲线的切线方向
        const tangent = curve.getTangent(progress).normalize();
        // 计算相机的目标点，使其始终朝前
        const target = camera.position.clone().add(tangent);

        // 设置相机的朝向
        //  model.lookAt(target.x, target.y, target.z);
        controls.target.set(target.x, target.y, target.z);
        controls.update();
        // 增加进度
        progress += speed;
        if (progress > 1) {
          progress = 0;
        }

        requestAnimationFrame(moveModelAlongCurve);
      }
    }

    // 开始移动
    moveModelAlongCurve();
  }
}
export function manyou(
  roamLine: RoamLine,
  camera: PerspectiveCamera | OrthographicCamera
) {
  //设置焦距为84

  const params = {
    spline: "GrannyKnot",
    scale: 1,
    extrusionSegments: 100,
    radiusSegments: 8,
    closed: true,
    animationView: false,
    lookAhead: true,
    cameraHelper: false,
  };

  const {
    tubeGeometry,
    position,
    biNormal,
    lookAt,
    direction,
    normal,
    roamIsRunning,
    speed,
  } = roamLine;
  if (!roamIsRunning) {
    return;
  }

  // if (tubeGeometry === undefined) {
  //   const pipeSpline = new CatmullRomCurve3(
  //     [
  //       new Vector3(0, -40, -40),
  //       new Vector3(0, 40, -40),
  //       new Vector3(0, 140, -40),
  //       new Vector3(0, 40, 40),
  //       new Vector3(0, -40, 40),
  //     ],
  //     true
  //   );

  //   roamLine.tubeGeometry = new TubeGeometry(pipeSpline, 100, 2, 3, true);

  //   return;
  // }
  const time = Date.now();
  const loopTime = 20 * 1000 * speed;
  const t = (time % loopTime) / loopTime;

  tubeGeometry.parameters.path.getPointAt(t, position);
  position.multiplyScalar(params.scale);

  // interpolation

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
  const offset = 15;

  normal.copy(biNormal).cross(direction);

  // we move on a offset on its  biNormal

  position.add(normal.clone().multiplyScalar(offset));

  camera.position.copy(position);

  tubeGeometry.parameters.path.getPointAt(
    (t + 30 / tubeGeometry.parameters.path.getLength()) % 1,
    lookAt
  );
  lookAt.multiplyScalar(params.scale);

  // camera orientation 2 - up orientation via normal

  if (!params.lookAhead) lookAt.copy(position).add(direction);
  camera.matrix.lookAt(camera.position, lookAt, normal);
  camera.quaternion.setFromRotationMatrix(camera.matrix);
}

export function drawROAMLine2(scene: Scene, roamName: string) {
  const vector: Vector3[] = [];
  const _curve = createGroupIfNotExist(scene, roamName, false);
  if (!_curve) {
    return;
  }

  _curve.children.forEach((child) => {
    const position = getObjectWorldPosition(child);
    vector.push(position);
  });

  const curve = new CatmullRomCurve3(vector, true, "centripetal"); //"centripetal" | "chordal" | "catmullrom"

  const points = curve.getPoints(150); // 创建线条材质
  const material = new LineBasicMaterial({ color: 0xff0000 });
  // 创建 BufferGeometry 并设置顶点
  const geometry = new BufferGeometry().setFromPoints(points);

  // 创建线条对象
  const line = new Line(geometry, material);

  //将线条添加到场景中
  scene.add(line);
}
export function drawROAMLine(scene: Scene, roamName: string) {
  const vector: Vector3[] = [];
  const _curve = createGroupIfNotExist(scene, roamName, false);
  if (!_curve) {
    return;
  }

  _curve.children.forEach((child) => {
    const position = getObjectWorldPosition(child);
    vector.push(position);
  });

  const curve = new CatmullRomCurve3(vector, true, "centripetal"); //"centripetal" | "chordal" | "catmullrom"

  // getAll().parameters3d.roamLine.tubeGeometry = new TubeGeometry(

  const points = curve.getPoints(150); // 创建线条材质
  const material = new LineBasicMaterial({ color: 0xff0000 });
  // 创建 BufferGeometry 并设置顶点
  const geometry = new BufferGeometry().setFromPoints(points);

  // 创建线条对象
  const line = new Line(geometry, material);
  scene.add(line);
  return curve;
  //将线条添加到场景中

  //   curve,
  //   100, // 曲线上的点数量
  //   2, //  TubeGeometry 的半径
  //   3, //  TubeGeometry 的半径分段数
  //   true //  TubeGeometry 是否为闭合
  // );
}
