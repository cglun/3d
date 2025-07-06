import { Three3dEditor } from "@/three/threeObj/Three3dEditor";
import { Command } from "@/three/command/Command";

export class EditorInstance {
  // 存储单例实例
  private static instance: EditorInstance;
  three3dEditor!: Three3dEditor;

  private _undoStep: number = 0;

  // 撤销栈，存储已执行的命令
  private _undoStack: Command[] = [];

  // 将构造函数设为私有，防止外部实例化
  private constructor() {}

  // 静态方法，用于获取单例实例
  public static getInstance(): EditorInstance {
    if (!EditorInstance.instance) {
      EditorInstance.instance = new EditorInstance();
    }
    return EditorInstance.instance;
  }
  get undoStack() {
    return this._undoStack;
  }
  set undoStack(undoStack: Command[]) {
    this._undoStack = undoStack;
  }
  get undoStep() {
    return this._undoStep;
  }
  set undoStep(undoStep: number) {
    this._undoStep = undoStep;
  }

  // 获取 Three3dEditor 实例
  getEditor() {
    return this.three3dEditor;
  }

  // 设置 Three3dEditor 实例
  setEditor(three3dEditor: Three3dEditor) {
    this.three3dEditor = three3dEditor;
  } // 执行命令并将其添加到撤销栈
  executeCommand(command: Command) {
    command.execute();
    this.undoStack.push(command);
    const canDo = this.undoStep > 0;
    if (canDo) {
      this.undoStep--;
    }
    // 执行新命令后，清空重做栈
    const event = new CustomEvent("commandLengthChange", {
      detail: {
        flag: this.undoStack.length - 1,
      },
    });
    document.dispatchEvent(event);
  }
  do(index: number) {
    const command = this.undoStack[index];
    command.execute();
  }

  // 执行撤销操作
  undo() {
    const canDo = this.undoStep < this.undoStack.length - 1;
    if (canDo) {
      const index = this.undoStack.length - this.undoStep - 2;
      const command = this.undoStack[index];
      command.execute();
      this.undoStep++;
    }
    console.log("第" + this.undoStep + "位");

    return canDo;
  }

  // 执行重做操作
  redo() {
    const canDo = this.undoStep > 0;
    if (canDo) {
      // const command = this.undoStack.pop()!;
      const index = this.undoStack.length - this.undoStep;
      const command = this.undoStack[index];
      command.execute();
      this.undoStep--;
    }

    return canDo;
  }
  resetUndo() {
    this.undoStep = 0;
    this.undoStack = [];
  }
}

export const editorInstance = EditorInstance.getInstance();
