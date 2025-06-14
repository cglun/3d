import { Three3dEditor } from "@/three/Three3dEditor";

export class EditorInstance {
  // 存储单例实例
  private static instance: EditorInstance;
  three3dEditor!: Three3dEditor;

  // 将构造函数设为私有，防止外部实例化
  private constructor() {}

  // 静态方法，用于获取单例实例
  public static getInstance(): EditorInstance {
    if (!EditorInstance.instance) {
      EditorInstance.instance = new EditorInstance();
    }
    return EditorInstance.instance;
  }

  // 获取 Three3dEditor 实例
  getEditor() {
    return this.three3dEditor;
  }

  // 设置 Three3dEditor 实例
  setEditor(three3dEditor: Three3dEditor) {
    this.three3dEditor = three3dEditor;
  }
}

export const editorInstance = EditorInstance.getInstance();
