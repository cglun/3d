import {
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  Object3D,
  EquirectangularReflectionMapping,
  Object3DEventMap,
  Clock,
  PCFSoftShadowMap,
  Vector3,
  TubeGeometry,
  Vector2,
  Mesh,
  BoxGeometry,
  MeshStandardMaterial,
  Color,
  CatmullRomCurve3,
  LineBasicMaterial,
  BufferGeometry,
  Line,
} from "three";
import TWEEN from "three/addons/libs/tween.module.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import ThreeObj from "./ThreeObj";
import { GlbModel, RecordItem } from "../app/type";
import {
  createGroupIfNotExist,
  createUnrealBloomPass,
  getG2,
  getProjectData,
  glbLoader,
  manyou,
  setOutLinePassColor,
  strToJson,
} from "./utils";

import { RGBELoader } from "three/addons/loaders/RGBELoader.js";

import { runScript } from "./scriptDev";
import { enableShadow } from "./common3d";
import {
  BackgroundHDR,
  ExtraParams,
  hdr,
  HdrKey,
  SceneUserData,
} from "./Three3dConfig";
import { createDirectionalLight, createGridHelper } from "./factory3d";
import { OutlinePass } from "three/addons/postprocessing/OutlinePass.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { FXAAShader } from "three/addons/shaders/FXAAShader.js"; // 取消注释

import { Curves, ShaderPass } from "three/addons/Addons.js";
import sceneUserData from "./Three3dConfig";
import { GLOBAL_CONSTANT } from "./GLOBAL_CONSTANT";
import { getObjectWorldPosition } from "../viewer3d/viewer3dUtils";
export class Three3d extends ThreeObj {
  private _composer: EffectComposer;
  private _outlinePass: OutlinePass;
  private _scene: Scene;
  private _camera: PerspectiveCamera;
  private _renderer: WebGLRenderer;
  private _controls: OrbitControls;
  private _clock = new Clock();
  private _timeS = 0;
  get camera() {
    return this._camera;
  }
  get scene() {
    return this._scene;
  }
  get renderer() {
    return this._renderer;
  }
  get controls() {
    return this._controls;
  }
  get composer() {
    return this._composer;
  }
  get outlinePass() {
    return this._outlinePass;
  }

  get timeS() {
    return this._timeS;
  }
  set timeS(value) {
    this._timeS = value;
  }
  get clock() {
    return this._clock;
  }
  extraParams: ExtraParams = {
    actionMixerList: [],
    mixer: [],
    selectedMesh: [],
    modelList: [],
    modelSize: 0,
    loadedModel: 0,
    roamLine: {
      roamIsRunning: false,
      direction: new Vector3(),
      biNormal: new Vector3(),
      normal: new Vector3(),
      position: new Vector3(),
      lookAt: new Vector3(),
      speed: sceneUserData.customButtonList.roamButtonGroup.userSetting.speed,
      tubeGeometry: new TubeGeometry(new Curves.GrannyKnot(), 100, 2, 3, true),
    },
  };

  constructor(divElement: HTMLDivElement) {
    super(divElement);
    this.divElement = divElement;
    this._scene = this.initScene();
    this.resetScene();
    this._camera = this.initCamera();
    this._renderer = this.initRenderer();
    this._controls = this.initControls();

    const { composer, outlinePass } = this.initPostProcessing();
    this._composer = composer;
    this._outlinePass = outlinePass;

    this.divElement.appendChild(this.renderer.domElement);
    this._renderer.setAnimationLoop(() => this.animate());
    this.addCube();
  }
  addCube() {
    const cube = new Mesh(
      new BoxGeometry(1, 1, 1),
      // 使用 MeshStandardMaterial 并设置发光属性
      new MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00, // 设置发光颜色
        emissiveIntensity: 1, // 设置发光强度
      })
    );
    this.scene.add(cube);
  }

  private initScene(): Scene {
    const scene = new Scene();
    scene.name = "场景";
    return scene;
  }

  resetScene() {
    this.scene.userData = { ...sceneUserData };
    this.scene.children = [];

    this.setTextureBackground();
    const HELPER_GROUP = createGroupIfNotExist(
      this.scene,
      GLOBAL_CONSTANT.HELPER_GROUP
    );
    if (HELPER_GROUP) {
      HELPER_GROUP.add(createGridHelper());
      this.scene.add(HELPER_GROUP);
    }

    const { useShadow } = this.scene.userData.config3d;
    const light = createDirectionalLight();
    light.castShadow = useShadow;
    this.scene.add(light);
  }

  private initCamera(): PerspectiveCamera {
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

  private initRenderer(): WebGLRenderer {
    const renderer = new WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(this.divElement.offsetWidth, this.divElement.offsetHeight);

    renderer.shadowMap.type = PCFSoftShadowMap;
    //  renderer.name = "MainWebGLRenderer"; // 设置渲染器名字
    return renderer;
  }

  private initControls(): OrbitControls {
    return new OrbitControls(this.camera, this.renderer.domElement);
  }
  initPostProcessing() {
    const { offsetWidth, offsetHeight } = this.divElement;
    console.log(this.divElement, "this.divElement");

    const composer = new EffectComposer(this.renderer);

    const renderPass = new RenderPass(this.scene, this.camera);
    composer.addPass(renderPass);

    const outlinePass = new OutlinePass(
      new Vector2(offsetWidth, offsetHeight),
      this.scene,
      this.camera
    );

    composer.addPass(outlinePass);

    //设置颜色
    outlinePass.edgeStrength = 1; // 边缘强度
    outlinePass.edgeGlow = 0.4; // 边缘发光
    outlinePass.edgeThickness = 1; // 边缘厚度
    outlinePass.pulsePeriod = 1.16; // 脉冲周期

    const userData = this.scene.userData as SceneUserData;
    const color = userData.userCssStyle.topCard.modelHighlightColor;
    setOutLinePassColor(color, outlinePass);

    composer.addPass(createUnrealBloomPass(this.divElement));

    // 调整 FXAAShader 的抗锯齿质量参数
    const effectFXAA = new ShaderPass(FXAAShader);

    effectFXAA.uniforms["resolution"].value.set(
      1 / offsetWidth,
      1 / offsetHeight
    );
    composer.addPass(effectFXAA);

    const outputPass = new OutputPass();
    composer.addPass(outputPass);
    return { composer, outlinePass };
  }

  //反序列化
  deserialize(data: string, item: RecordItem) {
    const { scene, models, loader } = strToJson(data);

    // this.scene.children = [];
    const editor = this;

    loader.parse(scene, function (object: Object3D<Object3DEventMap>) {
      if (object instanceof Scene) {
        //  const { userData } = object;
        const _scene = editor.scene;
        _scene.userData = {
          ...(object.userData as SceneUserData),
          projectName: item.name,
          projectId: item.id,
          canSave: true,
        };

        const s = _scene.userData as SceneUserData;
        //是背景色
        if (s.backgroundHDR.isColor) {
          const bgColor = s.backgroundHDR as BackgroundHDR;
          _scene.background = new Color(bgColor.color);
        }
        //背景图HDR
        if (!s.backgroundHDR.isColor) {
          const rgbeLoader = new RGBELoader();
          const { backgroundHDR } = object.userData as SceneUserData;

          const { color, asBackground } = backgroundHDR;
          rgbeLoader.load(hdr[color as HdrKey], (texture) => {
            texture.mapping = EquirectangularReflectionMapping;
            _scene.background = null;
            if (asBackground) {
              _scene.background = texture;
            }
            _scene.environment = texture;
            const {
              backgroundBlurriness,
              backgroundIntensity,
              environmentIntensity,
            } = object;
            _scene.backgroundBlurriness = backgroundBlurriness;
            _scene.backgroundIntensity = backgroundIntensity;
            _scene.environmentIntensity = environmentIntensity;
          });
        }
        //const newCamera = this.initCamera();
        const { fixedCameraPosition } = object.userData as SceneUserData;
        if (fixedCameraPosition) {
          const { x, y, z } = fixedCameraPosition;
          editor.camera.position.set(x, y, z);
        }
      }
    });

    //this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.extraParams.modelList = models;
    //关闭掉进度，因为已经没模型可以加载了

    if (models.length === 0) {
      this.onLoadProgress(100);
      return;
    }
    models.forEach((model: GlbModel) => {
      this.extraParams.modelSize += model.userData.modelTotal;
      this.loadModelByUrl(model);
    });
  }
  //加载完后设置背景
  setTextureBackground() {
    const rgbeLoader = new RGBELoader();
    const { backgroundHDR } = this.scene.userData;
    const { color, isColor } = backgroundHDR;
    if (isColor) {
      const bgColor = backgroundHDR as BackgroundHDR;
      this.scene.background = new Color(bgColor.color);
    }
    if (!isColor) {
      rgbeLoader.load(hdr[color as HdrKey], (texture) => {
        texture.mapping = EquirectangularReflectionMapping;
        this.scene.background = null;
        if (backgroundHDR.asBackground) {
          this.scene.background = texture;
          // scene.backgroundBlurriness = 0; // @TODO: Needs PMREM
        }
        this.scene.environment = texture;
      });
    }
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
        this.extraParams.loadedModel += model.userData.modelTotal;

        if (this.extraParams.loadedModel === this.extraParams.modelSize) {
          this.loadEndRun();
          this.onLoadProgress(100);
        }
      },
      (xhr) => {
        model.userData.modelLoaded = xhr.loaded;
        let _loadedModel = 0,
          progress = 0;
        this.extraParams.modelList.forEach((model: GlbModel) => {
          const { modelLoaded } = model.userData;
          _loadedModel += modelLoaded;

          progress = parseFloat(
            ((_loadedModel / this.extraParams.modelSize) * 100).toFixed(2)
          );
        });
        //console.log("progress", progress);

        this.onLoadProgress(progress);
        if (progress >= 100) {
          this.loadEndRun();
        }
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
    const userData = this.scene.userData;
    const { css2d, css3d, useTween, FPS, useKeyframe, useComposer } =
      userData.config3d;

    const { mixer, roamLine } = this.extraParams;
    const T = this.clock.getDelta();
    this.timeS = this.timeS + T;
    let renderT = 1 / FPS;

    if (this.timeS >= renderT) {
      if (css2d) {
        //this.renderer.render(this.scene, this.camera);
      }
      if (css3d) {
        //extra3d.labelRenderer3d.render(scene, camera);
      }
      if (useTween) {
        TWEEN.update();
      }
      if (useKeyframe) {
        mixer.forEach((_mixer) => {
          _mixer.update(T);
        });
      }

      this.controls.update();
      if (roamLine) {
        const { speed } = userData.customButtonList.roamButtonGroup.userSetting;
        manyou(roamLine, this.camera, speed);
      }

      // 移除多余的渲染调用
      if (useComposer) {
        this.composer.render(); // 使用 composer 进行渲染
      } else {
        this.renderer.render(this.scene, this.camera);
      }
      this.timeS = 0;
    }
  }
  //加载完后统一执行
  private loadEndRun(): void {
    this.setTextureBackground();
    this.setCameraPosition();
  }
  private setCameraPosition() {
    return;
    const { fixedCameraPosition } = this.scene.userData.config3d;

    if (fixedCameraPosition) {
      const { x, y, z } = fixedCameraPosition;
      this.camera.position.set(x, y, z);
    }
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
    console.log("loadedModelsEnd");
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
  getCurveByEmptyMesh(curveEmptyGroupName: string): CatmullRomCurve3 {
    let vector: Vector3[] = [
      new Vector3(0, 0, 0),
      new Vector3(0, 0, 1),
      new Vector3(0, 0, 2),
    ];
    const _curve = createGroupIfNotExist(
      this.scene,
      curveEmptyGroupName,
      false
    );
    if (_curve) {
      vector = [];
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
      this.scene.add(line);
      return curve;
    }
    return new CatmullRomCurve3(vector, true, "centripetal");
  }
}
