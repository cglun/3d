import { GROUP } from "@/three/config/CONSTANT";

// 定义 Action 类型，代表一个无参数无返回值的函数
type Action = () => void;
export enum CMD {
  "transform" = "变换",
  "rename" = "重命名",
  "mesh" = "网格",
  "sprite" = "精灵",
}

export class Command {
  private cmd: CMD;
  private objectName: string;
  private objectParent: string;

  private objectParentString = {
    [GROUP.NONE]: "NONE",
    [GROUP.MODEL]: "模型",
    [GROUP.HELPER]: "辅助",
    [GROUP.MARK_LABEL]: "标签",
    [GROUP.LIGHT]: "光源",
    [GROUP.GEOMETRY]: "几何体",
    [GROUP.BOX]: "盒子",
    [GROUP.ENV]: "环境",
    [GROUP.ROAM]: "漫游",
    [GROUP.TEST]: "测试",
  };

  // 存储执行操作的函数
  private action: Action;
  constructor(
    action: Action,
    cmd: CMD,
    objectName: string,
    objectParent: string
  ) {
    this.action = action;
    this.cmd = cmd;
    this.objectName = objectName;
    this.objectParent = objectParent;
  }

  // 执行操作
  execute() {
    this.action();
    // 检查 objectParent 是否为 GROUP 枚举中的值
    const groupKeys = Object.values(GROUP);
    const parentLabel = groupKeys.includes(this.objectParent as GROUP)
      ? this.objectParentString[this.objectParent as GROUP]
      : GROUP.NONE;

    if (parentLabel === GROUP.NONE) {
      console.log(`${this.objectName}->${this.cmd}`);
      return;
    }
    console.log(`${parentLabel}->${this.objectName}->${this.cmd}`);
  }
}
