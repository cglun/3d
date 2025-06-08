import { createContext } from "react";

import { PerspectiveCamera, Scene } from "three";

export type EditorScene = { type: string; payload: Scene };
export type EditorCamera = { type: string; payload: PerspectiveCamera };
export type TourWindow = {
  type: string;
  payload: {
    show: boolean;
    tourSrc: string;
    title: string;
  };
};

export const initEditorScene: EditorScene = {
  type: "scene",
  payload: new Scene(),
};
export const initTourWindow: TourWindow = {
  type: "tourWindow",
  payload: {
    show: false,
    title: "全景漫游",
    tourSrc: "",
  },
};

export const initEditorCamera: EditorCamera = {
  type: "camera",
  payload: new PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  ),
};

export const MyContext = createContext<{
  scene: EditorScene;
  dispatchScene: React.Dispatch<EditorScene>;
  tourWindow: TourWindow;
  dispatchTourWindow: React.Dispatch<TourWindow>;
  camera: EditorCamera;
  dispatchCamera: React.Dispatch<EditorCamera>;
}>({
  scene: initEditorScene,
  dispatchScene: () => {},
  tourWindow: initTourWindow,
  dispatchTourWindow: () => {},
  camera: initEditorCamera,
  dispatchCamera: () => {},
});
