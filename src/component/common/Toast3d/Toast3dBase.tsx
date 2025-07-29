import Toast from "react-bootstrap/esm/Toast";
import ToastContainer from "react-bootstrap/esm/ToastContainer";
import Icon from "@/component/common/Icon";
import { APP_COLOR, DELAY } from "@/app/type";

export default function Toast3dBase({
  content = "内容",
  title = "提示",
  type = APP_COLOR.Success,
  delay = DELAY.SHORT,
  show = true,
  callBackOnclose,
}: {
  content: string;
  title: string;
  type: APP_COLOR;
  delay: DELAY;
  show: boolean;
  callBackOnclose: () => void;
}) {
  return (
    <ToastContainer className="position-static">
      <Toast
        className="fixed-top mt-2 mx-auto"
        style={{ zIndex: 116116 }}
        onClose={() => {
          // 重新渲染组件以更新 Toast 的显示状态
          callBackOnclose();
        }}
        show={show}
        delay={delay}
        bg={type}
        autohide
      >
        <Toast.Header>
          <Icon iconName="info-circle" gap={1} />
          <strong className="me-auto ">{title}</strong>
        </Toast.Header>
        <Toast.Body
          className={type.toString() === APP_COLOR.Warning ? "text-dark" : ""}
        >
          {content}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
}
