import { setClassName } from "../../app/utils";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  iconName: string; // 给 iconName 设置默认值 "search-heart"
  children?: React.ReactNode;
  gap?: 0 | 1 | 2 | 3; // 给 gap 设置默认值 1
  title?: string; // 给 title 设置默认值空字符串
  fontSize?: number; // 给 fontSize 设置默认值 16,
  placement?: "top" | "bottom" | "left" | "right"; // 给 placement 设置默认值 "top"
  color?: string; // 给 color 设置默认值空字符串
}
export default function Icon({
  iconName = "search-heart",
  gap = 0, // 给 gap 设置默认值 1
  title = "", // 给 title 设置默认值空字符串
  fontSize = 1, // 给 fontSize 设置默认值 16
  placement = "top", // 给 placement 设置默认值 "top"
  color,
}: IconProps) {
  let iconClass = setClassName(iconName) + ` me-${gap}`;
  if (iconName.includes("bi bi-")) {
    iconClass = iconName + ` me-${gap}`;
  }
  return (
    <>
      <OverlayTrigger
        placement={placement}
        delay={{ show: 116, hide: 250 }}
        overlay={title ? <Tooltip>{title}</Tooltip> : <></>}
      >
        <i
          className={iconClass}
          style={{ fontSize: `${fontSize}rem`, color }}
        ></i>
      </OverlayTrigger>
    </>
  );
}
