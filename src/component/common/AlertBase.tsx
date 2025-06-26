import { APP_COLOR } from "@/app/type";
import Icon from "@/component/common/Icon";
import { setClassName } from "@/three/utils/util4UI";
import Alert from "react-bootstrap/esm/Alert";

export default function AlertBase({
  text = "AlertBase内容",
  type = APP_COLOR.Danger,
  className = "",
}: {
  text: string;
  type?: APP_COLOR;
  className?: string;
}) {
  let iconClassName = setClassName("info-circle") + " me-1";
  if (type === APP_COLOR.Success) {
    iconClassName = setClassName("check-circle") + " me-1";
  }
  return (
    <Alert variant={type} className={className}>
      <Icon iconName={iconClassName} />
      {text}
    </Alert>
  );
}
