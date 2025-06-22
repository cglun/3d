import { useReducer } from "react";
import { createRootRoute } from "@tanstack/react-router";
import { Alert } from "react-bootstrap";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import EditorTop from "@/component/Editor/EditorTop";
import Col from "react-bootstrap/esm/Col";
import EditorBottom from "@/component/Editor/EditorBottom";
import OutlineView from "@/component/Editor/OutlineView/Index";
import EditorViewer3d from "@/component/Editor/EditorViewer3d";
import {
  initEditorCamera,
  initEditorScene,
  initTourWindow,
  MyContext,
} from "@/app/MyContext";
import { reducerCamera, reducerScene, reducerTour } from "@/app/reducer";

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
      <Container fluid style={{ height: "95vh" }}>
        <Row>
          <EditorTop />
        </Row>
        <Row>
          <Col xl={10}>
            <Row>
              <EditorViewer3d />
            </Row>
            <Row>
              <EditorBottom />
            </Row>
          </Col>

          <Col xl={2} id="editor-right">
            <OutlineView />
          </Col>
        </Row>
      </Container>
    </MyContext.Provider>
  );
}
