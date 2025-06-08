import React from "react";
import { createRootRoute } from "@tanstack/react-router";
import {
  initEditorCamera,
  initEditorScene,
  initTourWindow,
  MyContext,
} from "../app/MyContext";
import { reducerCamera, reducerScene, reducerTour } from "../app/reducer";
import Editor from "../component/Editor/Index";
import { Alert } from "react-bootstrap";
import { APP_COLOR } from "../app/type";

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => (
    <Alert variant={APP_COLOR.Danger}>404 Not Found</Alert>
  ),
});

function RootComponent() {
  const [scene, dispatchScene] = React.useReducer(
    reducerScene,
    initEditorScene
  );
  const [tourWindow, dispatchTourWindow] = React.useReducer(
    reducerTour,
    initTourWindow
  );
  const [camera, dispatchCamera] = React.useReducer(
    reducerCamera,
    initEditorCamera
  );

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
