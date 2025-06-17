//抽象类ThreeObj

import { CatmullRomCurve3 } from "three";
import { RecordItem } from "@/app/type";
export default abstract class ThreeObj {
  //属性
  // abstract _scene: Scene;
  // abstract _camera: Camera;
  // abstract _renderer: WebGLRenderer;
  // abstract _controls: Controls<OrbitControls>;
  // abstract _composer: EffectComposer;
  // //effectFXAA: ShaderPass,
  // abstract _outlinePass: OutlinePass;
  // abstract _clock: Clock;
  // abstract _timeS: number;
  divElement: HTMLDivElement;

  constructor(divElement: HTMLDivElement) {
    this.divElement = divElement;
  }

  // abstract initScene(): void;
  // abstract initCamera(): void;
  // abstract initRenderer(): void;
  // abstract initControls(): void;
  //反序列化
  abstract deserialize(str: string, item: RecordItem): void;
  // 移除抽象方法 loadModelByUrl
  abstract onWindowResize(): void;
  //运行javascript
  // abstract runJavascript(): void;
  //加载完模型
  abstract loadedModelsEnd(): void;
  //加载进度
  abstract onLoadProgress(process: number): void;
  //加载辉光高亮等效果
  abstract initPostProcessing(): void;
  // abstract animate(): void;
  abstract addOneModel(item: RecordItem): void;
  abstract setTextureBackground_test(): void;
  //通过给定的空物体创建曲线
  abstract getCurveByEmptyMesh(curveEmptyGroupName: string): CatmullRomCurve3;
}
