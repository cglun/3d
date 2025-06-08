//抽象类ThreeObj
import { Camera, Controls, Scene, WebGLRenderer } from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RecordItem } from "../app/type";

export default abstract class ThreeObj {
  //属性
  abstract scene: Scene;
  abstract camera: Camera;
  abstract renderer: WebGLRenderer;
  abstract controls: Controls<OrbitControls>;
  divElement: HTMLDivElement;

  constructor(divElement: HTMLDivElement) {
    this.divElement = divElement;
  }

  abstract initScene(): void;
  abstract initCamera(): void;
  abstract initRenderer(): void;
  abstract initControls(): void;
  //反序列化
  abstract deserialize(str: string, item: RecordItem): void;
  // 移除抽象方法 loadModelByUrl
  abstract onWindowResize(): void;
  //运行javascript
  abstract runJavascript(): void;
  //加载完模型
  abstract loadedModelsEnd(): void;
  //加载进度
  abstract onLoadProgress(process: number): void;
  abstract animate(): void;
}
