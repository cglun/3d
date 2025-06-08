import { Three3dViewer } from "./Three3dViewer";

export class ViewerInstance {
  // 存储单例实例
  private static instance: ViewerInstance;
  three3dViewer!: Three3dViewer;

  // 将构造函数设为私有，防止外部实例化
  private constructor() {}

  // 静态方法，用于获取单例实例
  public static getInstance(): ViewerInstance {
    if (!ViewerInstance.instance) {
      ViewerInstance.instance = new ViewerInstance();
    }
    return ViewerInstance.instance;
  }

  // 获取 Three3dViewer 实例
  getViewer() {
    return this.three3dViewer;
  }

  // 设置 Three3dViewer 实例
  setViewer(three3dViewer: Three3dViewer) {
    this.three3dViewer = three3dViewer;
  }
}

export const viewerInstance = ViewerInstance.getInstance();
