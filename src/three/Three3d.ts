import {
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  Controls,
  Mesh,
  Object3D,
  EquirectangularReflectionMapping,
  Object3DEventMap,
  Clock,
  PCFSoftShadowMap,
} from "three";
import TWEEN from "three/addons/libs/tween.module.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import ThreeObj from "./ThreeObj";
import { GlbModel, RecordItem } from "../app/type";
import { getG2, getProjectData, glbLoader, strToJson } from "./utils";
import venice_sunset_1k from "/static/file3d/hdr/venice_sunset_1k.hdr?url";
import spruit_sunrise_1k from "/static/file3d/hdr/spruit_sunrise_1k.hdr?url";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";

import { runScript } from "./scriptDev";
import { enableShadow } from "./common3d";
import userData from "./Three3dConfig";
import { createNewScene } from "./factory3d";

export class Three3d extends ThreeObj {
  scene: Scene;
  camera: PerspectiveCamera;
  renderer: WebGLRenderer;
  controls: Controls<OrbitControls>;
  selectedMesh: Mesh[] = [];
  modelList: GlbModel[] = [];
  modelSize: number = 0;
  loadedModel: number = 0;

  constructor(divElement: HTMLDivElement) {
    super(divElement);
    this.divElement = divElement;
    this.scene = this.initScene();
    this.camera = this.initCamera();
    this.renderer = this.initRenderer();
    this.controls = this.initControls();

    this.scene.userData = { ...userData };
    this.renderer.setAnimationLoop(() => this.animate());
    this.divElement.appendChild(this.renderer.domElement);
  }

  initScene(): Scene {
    const scene = createNewScene();
    return scene;
  }

  initCamera(): PerspectiveCamera {
    const camera = new PerspectiveCamera(
      50,
      this.divElement.offsetWidth / this.divElement.offsetHeight,
      0.1,
      1000
    );
    camera.aspect = this.divElement.offsetWidth / this.divElement.offsetHeight;
    camera.name = "透视相机";
    camera.lookAt(0, 0, 0);
    camera.position.set(3, 4, 5);

    return camera;
  }

  initRenderer(): WebGLRenderer {
    const renderer = new WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(this.divElement.offsetWidth, this.divElement.offsetHeight);

    renderer.shadowMap.type = PCFSoftShadowMap;
    //  renderer.name = "MainWebGLRenderer"; // 设置渲染器名字
    return renderer;
  }

  initControls(): Controls<OrbitControls> {
    return new OrbitControls(this.camera, this.renderer.domElement);
  }

  //反序列化
  deserialize(data: string, item: RecordItem) {
    const { scene, models, loader } = strToJson(data);

    let newScene = this.initScene();
    loader.parse(scene, function (object: Object3D<Object3DEventMap>) {
      const { userData } = object;
      if (object instanceof Scene) {
        newScene = object;
        newScene.userData = {
          ...userData,
          projectName: item.name,
          projectId: item.id,
          canSave: true,
          selected3d: null,
        };
      }
      const backgroundHDR = userData.backgroundHDR;

      if (backgroundHDR) {
        const rgbeLoader = new RGBELoader();
        const { backgroundHDR } = object.userData;
        const hdr = {
          "venice_sunset_1k.hdr": venice_sunset_1k,
          "spruit_sunrise_1k.hdr": spruit_sunrise_1k,
        };

        const name = backgroundHDR.name as keyof typeof hdr;
        rgbeLoader.load(hdr[name], (texture) => {
          texture.mapping = EquirectangularReflectionMapping;
          newScene.background = null;
          if (backgroundHDR.asBackground) {
            newScene.background = texture;
          }
          newScene.environment = texture;
        });
      }
    });

    const newCamera = this.initCamera();
    const { fixedCameraPosition } = newScene.userData;
    if (fixedCameraPosition) {
      const { x, y, z } = fixedCameraPosition;
      newCamera.position.set(x, y, z);
    }

    this.scene = newScene;

    this.camera = newCamera;
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.modelList = models;
    //关闭掉进度，因为已经没模型可以加载了

    if (models.length === 0) {
      this.onLoadProgress(100);
      return;
    }
    models.forEach((model: GlbModel) => {
      this.modelSize += model.userData.modelTotal;
      this.loadModelByUrl(model);
    });
  }

  // 添加 private 修饰符
  private loadModelByUrl(model: GlbModel) {
    const loader = glbLoader();
    loader.load(
      model.userData.modelUrl + "?url",
      (gltf) => {
        const group = getG2(model, gltf, this.scene);
        enableShadow(group, this.scene);
        this.scene.add(group);
        this.loadedModel += model.userData.modelTotal;

        if (this.loadedModel === this.modelSize) {
          this.loadedModelsEnd();
          this.onLoadProgress(100);
        }
      },
      (xhr) => {
        model.userData.modelLoaded = xhr.loaded;
        let _loadedModel = 0,
          progress = 0;
        this.modelList.forEach((model: GlbModel) => {
          const { modelLoaded } = model.userData;
          _loadedModel += modelLoaded;

          progress = parseFloat(
            ((_loadedModel / this.modelSize) * 100).toFixed(2)
          );
        });
        //console.log("progress", progress);

        this.onLoadProgress(progress);
      },
      (error) => {
        this.onLoadError(error);
      }
    );
  }

  addOneModel(item: RecordItem) {
    getProjectData(item.id).then((res: string) => {
      const model = JSON.parse(res) as GlbModel;
      const loader = glbLoader();
      loader.load(
        model.userData.modelUrl + "?url",
        (gltf) => {
          const group = getG2(model, gltf, this.scene);
          enableShadow(group, this.scene);
          this.scene.add(group);
          this.onLoadProgress(100);
        },
        (xhr) => {
          const progress = parseFloat(
            ((xhr.loaded / model.userData.modelTotal) * 100).toFixed(2)
          );

          this.onLoadProgress(progress);
        },
        (error) => {
          console.error("An error happened", error);
          this.onLoadError(error);
        }
      );
    });
  }

  animate(): void {
    this.renderer.render(this.scene, this.camera);
    const delta = new Clock().getDelta();
    this.controls.update(delta);
    TWEEN.update();
  }
  runJavascript(): void {
    //阴影的设置
    const { useShadow } = this.scene.userData.config3d;
    this.renderer.shadowMap.enabled = useShadow;
    enableShadow(this.scene, this.scene);

    if (import.meta.env.MODE === "development") {
      runScript(this);
    }

    const { javascript } = this.scene.userData;
    if (javascript) {
      eval(javascript);
    }
  }

  loadedModelsEnd(): void {
    this.runJavascript();
  }
  onLoadProgress(_process: number) {}
  onLoadError(_error: unknown) {}

  onWindowResize() {
    const { offsetWidth, offsetHeight } = this.divElement;
    this.camera.aspect = offsetWidth / offsetHeight;
    this.camera.updateProjectionMatrix(); // 更新相机的投影矩阵
    this.renderer.setSize(offsetWidth, offsetHeight); // 更新渲染器的大小
    this.controls.update(0); // 更新控制器的状态，传递 delta 参数
  }
}
