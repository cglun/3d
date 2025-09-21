import { useEffect, useReducer, useState } from "react";
import Alert from "react-bootstrap/esm/Alert";
import { createRootRoute } from "@tanstack/react-router";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import EditorTop from "@/component/Editor/EditorTop";
import Col from "react-bootstrap/esm/Col";
import EditorBottom from "@/component/Editor/EditorBottom";
import OutlineView from "@/component/Editor/OutlineView/Index";
import EditorViewer3d from "@/component/Editor/EditorViewer3d";
import _axios from "@/app/http";
import {
  initEditorCamera,
  initEditorScene,
  initTourWindow,
  MyContext,
} from "@/app/MyContext";
import { reducerCamera, reducerScene, reducerTour } from "@/app/reducer";

import { APP_COLOR, MessageError, RecordItem, ResponseData } from "@/app/type";
import UpdateDateBase from "@/component/common/UpdateDateBase";

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
  const [pageList, setPageList] = useState<RecordItem[]>([]);

  let upZiDuan = true;

  const upZiDuanStor = localStorage.getItem("upZiDuan");
  if (upZiDuanStor === undefined) {
    upZiDuan = true;
  }
  if (upZiDuanStor === "true") {
    upZiDuan = false;
  }

  useEffect(() => {
    _axios
      .post<ResponseData>("/project/pageList/", { size: 1000 })
      .then((res) => {
        if (res.data.code === 200) {
          const message = res.data.message;
          if (message) {
            setPageList([]);
          }
          const list = res.data.data.records;
          const sceneList = list.filter((item: RecordItem) => {
            if (
              item.des === "Scene" ||
              item.des === "Mesh" ||
              item.des === "Image"
            ) {
              return item;
            }
          });
          setPageList(sceneList);
        }
      })
      .catch((error: MessageError) => {
        console.error(error);
      });
  }, []);
  if (upZiDuan) {
    return <UpdateDateBase pageList={pageList} />;
  }
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
