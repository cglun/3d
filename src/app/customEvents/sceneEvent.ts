// 定义事件类型
export type SceneReload = {
  // 可根据实际需求添加事件携带的数据结构
  sceneId: number;
  sceneName: string;
};

// 创建自定义事件
export const SceneReloadEvent = (detail: SceneReload) => {
  return new CustomEvent<SceneReload>("sceneReload", {
    detail,
    bubbles: true, // 事件是否冒泡
    cancelable: true, // 事件是否可取消
  });
};

// // 触发自定义事件示例
// const detail: SceneReload = {
//   sceneId: 116,
//   sceneName: "Example Scene",
// };
// document.dispatchEvent(SceneReloadEvent(detail));
