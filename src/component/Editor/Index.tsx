import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import EditorTop from "@/component/Editor/EditorTop";
import Col from "react-bootstrap/esm/Col";
import EditorBottom from "@/component/Editor/EditorBottom";
import OutlineView from "@/component/Editor/OutlineView/Index";
import EditorViewer3d from "@/component/Editor/EditorViewer3d";
export default function Index() {
  return (
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
  );
}
