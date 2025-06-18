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
  Color,
  CatmullRomCurve3,
  Group,
  DirectionalLight,
} from "three";

import TWEEN from "three/addons/libs/tween.module.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import ThreeObj from "@/three/ThreeObj";
import { GlbModel, RecordItem } from "@/app/type";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import { runScriptDev } from "@/three/scriptDev";
import { enableShadow } from "@/three/common3d";
import { ExtraParams, hdr, HdrKey, SceneUserData } from "@/three/Three3dConfig";
import { OutlinePass } from "three/addons/postprocessing/OutlinePass.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { FXAAShader } from "three/addons/shaders/FXAAShader.js";
import { CSS2DRenderer } from "three/addons/renderers/CSS2DRenderer.js";
import { CSS3DRenderer } from "three/addons/renderers/CSS3DRenderer.js";
import { Curves, GLTF, ShaderPass } from "three/addons/Addons.js";
import sceneUserData from "@/three/Three3dConfig";
import { GLOBAL_CONSTANT } from "@/three/GLOBAL_CONSTANT";
import { getObjectWorldPosition } from "@/viewer3d/viewer3dUtils";
import { TourWindow } from "@/app/MyContext";
import { MarkLabel } from "@/viewer3d/label/MarkLabel";
import {
  createLabelRenderer,
  createPerspectiveCamera,
  createUnrealBloomPass,
} from "@/threeUtils/factory3d";
import {
  clearOldLabel,
  getProjectData,
  glbLoader,
  manyou,
  setAnimateClip,
  setGLTFTransform,
  strToJson,
} from "@/threeUtils/util4Scene";
import { cameraEnterAnimation } from "@/threeUtils/util4Camera";
import { Dispatch } from "react";
import { LabelInfoPanelController } from "@/viewer3d/label/LabelInfoPanelController";
import { editorInstance } from "@/three/EditorInstance";
import { viewerInstance } from "@/three/ViewerInstance";
import { runScriptPro } from "@/three/scriptPro";

export class Three3d extends ThreeObj {
  private _composer: EffectComposer;
  private _outlinePass: OutlinePass;
  private _scene: Scene;
  private _camera: PerspectiveCamera;
  private _renderer: WebGLRenderer;
  private _controls: OrbitControls;
  private _clock = new Clock();
  private _timeS = 0;
  private _labelRenderer2d: CSS2DRenderer;
  private _labelRenderer3d: CSS3DRenderer;
  private _dispatchTourWindow: Dispatch<TourWindow>;
  private _labelInfoPanelController: LabelInfoPanelController | null = null;
  private _MODEL_GROUP: Group = new Group();
  private _MARK_LABEL_GROUP: Group = new Group();
  private _LIGHT_GROUP: Group = new Group();
  get LIGHT_GROUP() {
    return this._LIGHT_GROUP;
  }
  set LIGHT_GROUP(value) {
    this._LIGHT_GROUP = value;
  }
  get MARK_LABEL_GROUP() {
    return this._MARK_LABEL_GROUP;
  }
  set MARK_LABEL_GROUP(value) {
    this._MARK_LABEL_GROUP = value;
  }

  get MODEL_GROUP() {
    return this._MODEL_GROUP;
  }
  set MODEL_GROUP(value) {
    this._MODEL_GROUP = value;
  }
  get labelInfoPanelController() {
    if (this._labelInfoPanelController === null) {
      this._labelInfoPanelController = new LabelInfoPanelController(
        this.dispatchTourWindow,
        this.scene
      );
    }
    return this._labelInfoPanelController;
  }
  set labelInfoPanelController(value: LabelInfoPanelController | null) {
    this._labelInfoPanelController = value;
  }

  private _extraParams: ExtraParams = {
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
      tubeGeometry: new TubeGeometry(new Curves.GrannyKnot(), 100, 2, 3, true),
    },
  };
  private _tubeMesh: Mesh | null;
  get tubeMesh() {
    return this._tubeMesh;
  }
  set tubeMesh(value) {
    this._tubeMesh = value;
  }

  get extraParams() {
    return this._extraParams;
  }
  set extraParams(value) {
    this._extraParams = value;
  }
  set dispatchTourWindow(value: Dispatch<TourWindow>) {
    this._dispatchTourWindow = value;
  }
  get dispatchTourWindow() {
    return this._dispatchTourWindow;
  }
  get labelRenderer2d() {
    return this._labelRenderer2d;
  }
  set labelRenderer2d(value) {
    this._labelRenderer2d = value;
  }
  get labelRenderer3d() {
    return this._labelRenderer3d;
  }
  set labelRenderer3d(value) {
    this._labelRenderer3d = value;
  }

  get camera() {
    return this._camera;
  }
  get scene() {
    return this._scene;
  }
  get renderer() {
    return this._renderer;
  }
  set renderer(value) {
    this._renderer = value;
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

  constructor(
    divElement: HTMLDivElement,
    dispatchTourWindow: Dispatch<TourWindow>
  ) {
    super(divElement);
    this.divElement = divElement;
    this._scene = this.initScene();
    this.resetScene();

    this.MARK_LABEL_GROUP.name = GLOBAL_CONSTANT.MARK_LABEL_GROUP;
    this.MODEL_GROUP.name = GLOBAL_CONSTANT.MODEL_GROUP;
    this.LIGHT_GROUP.name = GLOBAL_CONSTANT.LIGHT_GROUP;

    this.scene.add(this.MARK_LABEL_GROUP);
    this.scene.add(this.MODEL_GROUP);
    this.scene.add(this.LIGHT_GROUP);

    this._camera = this.initCamera();
    this._renderer = this.initRenderer();
    this._controls = this.initControls();
    this._dispatchTourWindow = dispatchTourWindow;
    this._labelRenderer2d = createLabelRenderer(divElement, "2d");
    this._labelRenderer3d = createLabelRenderer(divElement, "3d");

    const { composer, outlinePass } = this.initPostProcessing();
    this._composer = composer;
    this._outlinePass = outlinePass;
    this.divElement.appendChild(this.renderer.domElement);
    this.renderer.setAnimationLoop(() => this.animate());
    this._tubeMesh = null;
    this._labelInfoPanelController = null;
    //this.addCube();
  }

  private initScene(): Scene {
    const scene = new Scene();
    scene.name = "场景";
    return scene;
  }
  //重置场景
  resetScene() {
    this.scene.userData = { ...sceneUserData };
    this.extraParams.mixer = [];
    this.MARK_LABEL_GROUP.children = [];
    this.MODEL_GROUP.children = [];
    this.LIGHT_GROUP.children = [];

    clearOldLabel();
    this.setTextureBackground_test();
  }

  private initCamera(): PerspectiveCamera {
    const camera = createPerspectiveCamera(this.divElement);
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

    const composer = new EffectComposer(this.renderer);

    const renderPass = new RenderPass(this.scene, this.camera);
    composer.addPass(renderPass);

    const outlinePass = new OutlinePass(
      new Vector2(offsetWidth, offsetHeight),
      this.scene,
      this.camera
    );

    composer.addPass(outlinePass);
    const userData = this.scene.userData as SceneUserData;

    const {
      canSeeColor,
      noSeeColor,
      edgeStrength,
      edgeGlow,
      edgeThickness,
      pulsePeriod,
    } = userData.userCssStyle.modelEdgeHighlight;
    //设置颜色
    outlinePass.edgeStrength = edgeStrength; // 边缘强度
    outlinePass.edgeGlow = edgeGlow; // 边缘发光
    outlinePass.edgeThickness = edgeThickness; // 边缘厚度
    outlinePass.pulsePeriod = pulsePeriod; // 脉冲周期

    outlinePass.visibleEdgeColor.set(canSeeColor); // 可见边缘颜色
    outlinePass.hiddenEdgeColor.set(noSeeColor); // 不可见边缘颜色

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
    loader.parse(scene, (object: Object3D<Object3DEventMap>) => {
      if (object instanceof Scene) {
        this.scene.children = [];
        //在编辑器里增加灯光辅助
        const light = object.getObjectByName(GLOBAL_CONSTANT.LIGHT_GROUP);

        light?.children.forEach((item) => {
          //  加上helper
          if (item instanceof DirectionalLight) {
            this.LIGHT_GROUP.add(item);
          }
        });

        this.scene.add(this.LIGHT_GROUP); //更新
        const markLabelGroup = object.getObjectByName(
          GLOBAL_CONSTANT.MARK_LABEL_GROUP
        );
        this.MARK_LABEL_GROUP.copy(markLabelGroup!);
        this.scene.add(this.MARK_LABEL_GROUP);

        this.scene.add(this.MODEL_GROUP);

        this.scene.userData = {
          ...(object.userData as SceneUserData),
          projectName: item.name,
          projectId: item.id,
        };
        this.scene.userData.APP_THEME.sceneCanSave = true;
        this.setTextureBackground_test(object);
      }
    });

    //this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.extraParams.modelList = models;
    //关闭掉进度，因为已经没模型可以加载了

    if (models.length === 0) {
      this.onLoadProgress(100);
      this.loadEndRun();

      return;
    }
    models.forEach((model: GlbModel) => {
      this.extraParams.modelSize += model.userData.modelTotal;
      this.loadModelByUrl(model);
    });
  }
  setTextureBackground_test(object?: Scene) {
    const { backgroundHDR } = this.scene.userData as SceneUserData;
    const { asBackground, HDRName, isColor, color } = backgroundHDR; //是背景色
    if (isColor) {
      this.scene.background = new Color(color);
    }
    //背景图HDR
    if (!isColor) {
      const rgbeLoader = new RGBELoader();
      //const { backgroundHDR } = object.userData as SceneUserData;

      rgbeLoader.load(hdr[HDRName as HdrKey], (texture) => {
        texture.mapping = EquirectangularReflectionMapping;
        this.scene.background = null;
        if (asBackground) {
          this.scene.background = texture;
        }
        this.scene.environment = texture;
        if (object) {
          const {
            backgroundBlurriness,
            backgroundIntensity,
            environmentIntensity,
          } = object;
          this.scene.backgroundBlurriness = backgroundBlurriness;
          this.scene.backgroundIntensity = backgroundIntensity;
          this.scene.environmentIntensity = environmentIntensity;
          this.scene.fog = object.fog;
        }
      });
    }
  }

  //加载模型后，要设置标签
  private setLabelGroup(
    labelGroup: Object3D<Object3DEventMap>
  ): Object3D<Object3DEventMap>[] {
    const group: Object3D<Object3DEventMap>[] = [];
    labelGroup.children.forEach((item: Object3D<Object3DEventMap>) => {
      const mark = new MarkLabel(this.scene, this.dispatchTourWindow, {
        markName: item.name,
        logo: item.userData.logo,
        showEye: item.userData.showEye,
        tourObject: item.userData.tourObject,
      });
      const label = mark.css3DSprite;

      const { x, y, z } = item.position;
      label.position.set(x, y, z);
      // item.userData.needDelete = true;
      group.push(label);
    });
    return group;
  }

  // 添加 private 修饰符
  private loadModelByUrl(model: GlbModel) {
    const loader = glbLoader();
    loader.load(
      model.userData.modelUrl + "?url",
      (gltf: GLTF) => {
        //设置动画，设置模型组的位置，旋转和缩放
        const group = setGLTFTransform(model, gltf);
        this.MODEL_GROUP.add(group);
        //设置动画
        setAnimateClip(gltf, this.scene, group, this.extraParams);
        enableShadow(group, this.scene);

        this.extraParams.loadedModel += model.userData.modelTotal;

        if (this.extraParams.loadedModel === this.extraParams.modelSize) {
          this.loadEndRun();
          this.onLoadProgress(100);
        }
      },
      (xhr: { loaded: number }) => {
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
      (error: unknown) => {
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
        (gltf: GLTF) => {
          const group = setGLTFTransform(model, gltf);
          enableShadow(group, this.scene);

          this.MODEL_GROUP.add(group);
          this.onLoadProgress(100);
        },
        (xhr: { loaded: number }) => {
          const progress = parseFloat(
            ((xhr.loaded / model.userData.modelTotal) * 100).toFixed(2)
          );

          this.onLoadProgress(progress);
        },
        (error: unknown) => {
          console.error("An error happened", error);
          this.onLoadError(error);
        }
      );
    });
  }
  splineCamera = new PerspectiveCamera(
    85,
    this.divElement.offsetWidth / this.divElement.offsetHeight,
    0.1,
    1000
  );
  animate(): void {
    const { config3d, customButtonList } = this.scene.userData as SceneUserData;
    const { css2d, css3d, useTween, FPS, useKeyframe, useComposer } = config3d;

    const { mixer, roamLine } = this.extraParams;
    const delta = this.clock.getDelta();
    this.timeS = this.timeS + delta;
    const renderT = 1 / FPS;

    if (this.timeS >= renderT) {
      if (css2d) {
        this.labelRenderer2d.render(this.scene, this.camera);
      }
      if (css3d) {
        this.labelRenderer3d.render(this.scene, this.camera);
      }
      if (useTween) {
        TWEEN.update();
      }
      if (useKeyframe) {
        mixer.forEach((_mixer) => {
          _mixer.update(delta);
        });
      }
      this.controls.update();
      if (roamLine) {
        const { userSetting } = customButtonList.roamButtonGroup;
        manyou(roamLine, this.camera, userSetting);
      }

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
    cameraEnterAnimation(this);
    this.setTextureBackground_test();
    this.loadedModelsEnd();
    const labelGroup = this.scene.getObjectByName(
      GLOBAL_CONSTANT.MARK_LABEL_GROUP
    );

    if (labelGroup) {
      const _labelGroup = this.setLabelGroup(labelGroup);
      labelGroup.children = _labelGroup;
    }
  }

  runJavascript(): void {
    //阴影的设置
    const { useShadow } = this.scene.userData.config3d;
    this.renderer.shadowMap.enabled = useShadow;
    enableShadow(this.scene, this.scene);

    if (import.meta.env.MODE === "development") {
      const editorIns = editorInstance?.getEditor();
      runScriptDev(editorIns);
    }

    const { javascript } = this.scene.userData;

    if (javascript) {
      //@ts-ignore注意：在执行代码时，确保 this 指向正确的 ,对象在这里执行 javascript 代码
      const editorIns = editorInstance?.getEditor();
      //@ts-ignore注意：在执行代码时，确保 this 指向正确的 ,对象在这里执行 javascript 代码
      const viewerIns = viewerInstance?.getViewer();
      runScriptPro(editorIns, viewerIns);
      // eval(javascript);
    }
  }

  loadedModelsEnd(): void {
    console.log("loadedModelsEnd");
  }
  //移除未使用的 @ts-expect-error 注释
  onLoadProgress(_process: number) {}
  // 移除未使用的 @ts-expect-error 注释
  onLoadError(_error: unknown) {}

  onWindowResize() {
    const { offsetWidth, offsetHeight } = this.divElement;
    this.camera.aspect = offsetWidth / offsetHeight;
    this.camera.updateProjectionMatrix(); // 更新相机的投影矩阵
    this.renderer.setSize(offsetWidth, offsetHeight); // 更新渲染器的大小
    this.controls.update(0); // 更新控制器的状态，传递 delta 参数
  }
  setOutLinePassColor() {
    const outlinePass = this.outlinePass;
    const {
      edgeStrength,
      edgeThickness,
      pulsePeriod,
      canSeeColor,
      noSeeColor,
    } = this.scene.userData.userCssStyle.modelEdgeHighlight;
    outlinePass.edgeStrength = edgeStrength;
    outlinePass.edgeThickness = edgeThickness;
    outlinePass.pulsePeriod = pulsePeriod;
    outlinePass.visibleEdgeColor.set(canSeeColor);
    outlinePass.hiddenEdgeColor.set(noSeeColor);
  }
  getCurveByEmptyMesh(curveEmptyGroupName: string): CatmullRomCurve3 {
    let vector: Vector3[] = [
      new Vector3(-40, 0, -40),
      new Vector3(40, 0, -40),
      new Vector3(140, 0, -40),
      new Vector3(40, 0, 40),
      new Vector3(-40, 0, 40),
    ];

    const _curve = this.scene.getObjectByName(curveEmptyGroupName);

    if (_curve) {
      vector = [];
      _curve.children.forEach((child: Object3D<Object3DEventMap>) => {
        const position = getObjectWorldPosition(child);
        vector.push(position);
      });

      const curve = new CatmullRomCurve3(vector, true, "catmullrom"); //"centripetal" | "chordal" | "catmullrom"

      // const points = curve.getPoints(150); // 创建线条材质
      // const material = new LineBasicMaterial({ color: 0xff0000 });
      // // 创建 BufferGeometry 并设置顶点
      // const geometry = new BufferGeometry().setFromPoints(points);

      // // 创建线条对象
      // const line = new Line(geometry, material);
      // this.scene.add(line);

      return curve;
    }
    return new CatmullRomCurve3(vector, true, "catmullrom");
  }
}
