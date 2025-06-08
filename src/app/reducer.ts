import { EditorCamera, EditorScene, TourWindow } from "./MyContext";

/**
 * 处理 TourWindow 状态的 reducer 函数
 * @param {TourWindow} tourWindow - 当前的 TourWindow 状态
 * @param {TourWindow} action - 触发状态更新的动作
 * @returns {TourWindow} - 更新后的 TourWindow 状态
 */
export function reducerTour(
  tourWindow: TourWindow,
  action: TourWindow
): TourWindow {
  switch (action.type) {
    case "tourWindow":
      // 确保返回的对象严格符合 TourWindow 类型
      return {
        ...tourWindow,
        payload: { ...action.payload },
      } as TourWindow;
    default:
      return tourWindow;
  }
}

/**
 * 处理 EditorScene 状态的 reducer 函数
 * @param {EditorScene} scene - 当前的 EditorScene 状态
 * @param {EditorScene} action - 触发状态更新的动作
 * @returns {EditorScene} - 更新后的 EditorScene 状态
 */
export function reducerScene(
  scene: EditorScene,
  action: EditorScene
): EditorScene {
  switch (action.type) {
    case "setScene":
      // 确保返回的对象严格符合 EditorScene 类型
      return {
        ...scene,
        payload: { ...action.payload },
      } as EditorScene;
    default:
      return scene;
  }
}

export function reducerCamera(
  camera: EditorCamera,
  action: EditorCamera
): EditorCamera {
  switch (action.type) {
    case "setCamera":
      // 确保返回的对象严格符合 EditorScene 类型
      return {
        ...camera,
        payload: { ...action.payload },
      } as EditorCamera;
    default:
      return camera;
  }
}
