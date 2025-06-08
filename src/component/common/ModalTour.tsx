import { Modal } from "react-bootstrap";
import { MyContext } from "../../app/MyContext";
import { useContext } from "react";
export default function ModalTour() {
  const { tourWindow, dispatchTourWindow } = useContext(MyContext);
  const { show, tourSrc, title } = tourWindow.payload;

  return (
    <>
      <Modal
        fullscreen
        show={show}
        onHide={() => {
          dispatchTourWindow({
            type: "tourWindow",
            payload: {
              show: false,
              title: "标题",
              tourSrc: "116",
            },
          });
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: 0 }}>
          {show && (
            <div style={{ height: "100%", width: "100%" }}>
              <iframe src={tourSrc} width={"100%"} height={"100%"}></iframe>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}
