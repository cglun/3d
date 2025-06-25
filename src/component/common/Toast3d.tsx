import { useEffect, useState } from "react";
import Toast from "react-bootstrap/esm/Toast";
import { createRoot } from "react-dom/client";
import { APP_COLOR, DELAY } from "@/app/type";

import Icon from "@/component/common/Icon";
/**
 * 消息提示
 * 用法：Toast3d3d("成功添加");
 */
interface Toast3d {
  title: string;
  content: string | JSX.Element;
  type: APP_COLOR;
  delay: DELAY;
  show: boolean;
}
function App116({ update, _toast }: { update: number; _toast: Toast3d }) {
  const [toast, setToast3d] = useState<Toast3d>(_toast);
  const { show, delay, type, title, content } = toast;
  // 修改部分：将 _toast 添加到依赖数组中
  useEffect(() => {
    setToast3d({ ..._toast, show: true });
  }, [update, _toast]);
  return (
    <Toast
      className="fixed-top mt-2 mx-auto"
      style={{ zIndex: 116116 }}
      onClose={() => {
        setToast3d({ ...toast, show: false });
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
  );
}
let container = document.getElementById("toast");
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
  show: boolean = false
) {
  const update = new Date().getTime();
  const toast = {
    title,
    content,
    type,
    delay,
    show,
  };
  root.render(<App116 update={update} _toast={toast} />);
}
