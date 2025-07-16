import Toast from "react-bootstrap/esm/Toast";
import { APP_COLOR, DELAY } from "@/app/type";

import Icon from "@/component/common/Icon";
import ToastContainer from "react-bootstrap/esm/ToastContainer";

/**
 * 消息提示
 * 用法：Toast3d("成功添加");
 */

export interface Toast3dPlusProps {
  content: string;
  title: string;
  type: APP_COLOR;
  delay: DELAY;
  show: boolean;
}

export default function Toast3dPlus({
  toast3dPlusProps,
  setToast3dPlusProps,
}: {
  toast3dPlusProps: Toast3dPlusProps;
  setToast3dPlusProps: (props: Toast3dPlusProps) => void;
}) {
  const { content, title, type, delay, show } = toast3dPlusProps;
  return (
    <ToastContainer className="position-static">
      <Toast
        className="fixed-top mt-2 mx-auto"
        style={{ zIndex: 116116 }}
        onClose={() => {
          // 重新渲染组件以更新 Toast 的显示状态
          setToast3dPlusProps({
            ...toast3dPlusProps,
            show: false,
          });
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
