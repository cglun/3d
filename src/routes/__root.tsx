import { useReducer } from "react";
import { createRootRoute } from "@tanstack/react-router";
import { Alert } from "react-bootstrap";
import {
  initEditorCamera,
  initEditorScene,
  initTourWindow,
  MyContext,
} from "@/app/MyContext";
import { reducerCamera, reducerScene, reducerTour } from "@/app/reducer";
import Editor from "@/component/Editor/Index";

import { APP_COLOR } from "@/app/type";

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => (
    <Alert variant={APP_COLOR.Danger}>404 Not Found</Alert>
  ),
});

function RootComponent() {
  const [scene, dispatchScene] = useReducer(reducerScene, initEditorScene);
  const [tourWindow, dispatchTourWindow] = useReducer(
    reducerTour,
    initTourWindow
  );
  const [camera, dispatchCamera] = useReducer(reducerCamera, initEditorCamera);

  return (
    <MyContext.Provider
      value={{
        scene,
        dispatchScene,
        tourWindow,
        dispatchTourWindow,
        camera,
        dispatchCamera,
      }}
    >
      <Editor />
    </MyContext.Provider>
  );
}
