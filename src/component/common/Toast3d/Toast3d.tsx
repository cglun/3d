import { createRoot } from "react-dom/client";
import Toast from "react-bootstrap/esm/Toast";
import ToastContainer from "react-bootstrap/esm/ToastContainer";
import { APP_COLOR, DELAY } from "@/app/type";
import Icon from "@/component/common/Icon";
import Toast3dBase from "@/component/common/Toast3d/Toast3dBase";

/**
 * 消息提示
 * 用法：Toast3d("成功添加");
 */

let container = document.getElementById("toast3d_116");
if (container === null) {
  container = document.createElement("div");
  document.body.appendChild(container);
}
const root = createRoot(container);
export default function Toast3d(
  content: string = "内容",
  title: string = "提示",
  type: APP_COLOR = APP_COLOR.Success,
  delay: DELAY = DELAY.SHORT,
  show: boolean = true
) {
  root.render(
    <Toast3dBase
      content={content}
      title={title}
      type={type}
      delay={delay}
      show={show}
      callBackOnclose={function () {
        root.render(<></>);
      }}
    />
  );

  return;

  root.render(
    <ToastContainer className="position-static">
      <Toast
        className="fixed-top mt-2 mx-auto"
        style={{ zIndex: 116116 }}
        onClose={() => {
          // 重新渲染组件以更新 Toast 的显示状态
          root.render(<></>);
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
