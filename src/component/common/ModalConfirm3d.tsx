import Button from "react-bootstrap/Button";
import Modal, { ModalProps } from "react-bootstrap/Modal";
import { createRoot } from "react-dom/client";

import { ConfirmButton } from "@/app/type";
// 从新文件中引入常量
import { _confirmButton } from "@/component/common/ModalConfirmUtils";

import Icon from "@/component/common/Icon";
import { styleBody } from "@/component/Editor/OutlineView/fontColor";

import { getButtonColor } from "@/three/utils/util4UI";
import ButtonGroup from "react-bootstrap/esm/ButtonGroup";
import { getEditorInstance } from "@/three/utils/utils";

let container = document.getElementById("toast3d_116");
if (container === null) {
  container = document.createElement("div");
  document.body.appendChild(container);
}
// 直接初始化 root 变量
const root = createRoot(container);

function ModalConfirm({
  title,
  body,
  confirmButton,
  size,
  callback,
}: {
  title: string;
  body: JSX.Element | string;
  confirmButton: ConfirmButton;
  size: ModalProps["size"];
  callback: () => void;
}) {
  const { userData } = getEditorInstance();
  const { themeColor } = userData.APP_THEME;
  const buttonColor = getButtonColor(themeColor);
  const onClose = () => {
    root.render(<></>);
  };
  return (
    <Modal
      size={size}
      show={confirmButton.show}
      onHide={onClose}
      animation={true}
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Header closeButton={confirmButton.closeButton}>
        <Modal.Title id="contained-modal-title-vcenter">
          <Icon iconName="info-circle" fontSize={1.2} gap={2} />
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      {confirmButton.hasButton && (
        <Modal.Footer>
          <ButtonGroup>
            <Button
              variant={buttonColor}
              style={{ borderColor: styleBody.color }}
              onClick={onClose}
            >
              <Icon iconName="x-circle" title="取消" />
            </Button>
            <Button
              variant={buttonColor}
              style={{ borderColor: styleBody.color }}
              onClick={() => {
                callback();
                onClose();
              }}
            >
              <Icon iconName="check-circle" title="确定" />
            </Button>
          </ButtonGroup>
        </Modal.Footer>
      )}
    </Modal>
  );
}

export default function ModalConfirm3d(
  {
    title = "ModalConfirm3d提示",
    body = "ModalConfirm3d内容",
    size = undefined,
    confirmButton = _confirmButton,
  }: {
    title: string;
    body: JSX.Element | string;
    size?: ModalProps["size"];
    confirmButton?: ConfirmButton;
  },
  callback = () => {}
) {
  root.render(
    <ModalConfirm
      title={title}
      size={size}
      body={body}
      confirmButton={confirmButton}
      callback={callback}
    />
  );
}
