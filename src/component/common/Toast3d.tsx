import { useEffect, useState } from "react";
import { Toast as BootToast } from "react-bootstrap";
import { createRoot } from "react-dom/client";
import { APP_COLOR, DELAY } from "../../app/type";

import Icon from "./Icon";
/**
 * 消息提示
 * 用法：Toast3d("成功添加");
 */
interface Toast {
  title: string;
  content: string | JSX.Element;
  type: APP_COLOR;
  delay: DELAY;
  show: boolean;
}
function App116({ update, _toast }: { update: number; _toast: Toast }) {
  const [toast, setToast] = useState<Toast>(_toast);
  const { show, delay, type, title, content } = toast;
  // 修改部分：将 _toast 添加到依赖数组中
  useEffect(() => {
    setToast({ ..._toast, show: true });
  }, [update, _toast]);
  return (
    <BootToast
      className="fixed-top mt-2 mx-auto"
      style={{ zIndex: 116116 }}
      onClose={() => {
        setToast({ ...toast, show: false });
      }}
      show={show}
      delay={delay}
      bg={type}
      autohide
    >
      <BootToast.Header>
        <Icon iconName="info-circle" gap={1} />
        <strong className="me-auto ">{title}</strong>
      </BootToast.Header>
      <BootToast.Body
        className={type.toString() === APP_COLOR.Warning ? "text-dark" : ""}
      >
        {content}
      </BootToast.Body>
    </BootToast>
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
