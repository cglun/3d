import { OverlayTrigger, Tooltip } from "react-bootstrap";

// 修改为正确的类型合并语法
function Trigger3d({
  title = "title",
  width = "6rem",
}: {
  title: string;
  width?: string;
}) {
  return (
    <OverlayTrigger
      placement="top"
      delay={{ show: 250, hide: 250 }}
      overlay={<Tooltip>{title}</Tooltip>}
    >
      <div className="ellipsis-3d" style={{ width }}>
        {title}
      </div>
    </OverlayTrigger>
  );
}
export default Trigger3d;
