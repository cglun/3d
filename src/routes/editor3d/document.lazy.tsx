import ListGroup from "react-bootstrap/esm/ListGroup";
import ListGroupItem from "react-bootstrap/esm/ListGroupItem";
import ButtonGroup from "react-bootstrap/esm/ButtonGroup";
import Button from "react-bootstrap/esm/Button";
import Modal from "react-bootstrap/esm/Modal";
import Badge from "react-bootstrap/esm/Badge";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useUpdateScene } from "@/app/hooks";
import { getButtonColor, getThemeByScene } from "@/three/utils/util4UI";
import Icon from "@/component/common/Icon";
import { APP_COLOR } from "@/app/type";

export const Route = createLazyFileRoute("/editor3d/document")({
  component: RouteComponent,
});

function RouteComponent() {
  const { scene } = useUpdateScene();
  const { themeColor } = getThemeByScene(scene);
  const buttonColor = getButtonColor(themeColor);
  const log = [
    {
      list: [
        {
          logoName: "x-diamond",
          position: "底部栏",
          buttonName: "扩展",
          des: "生成按钮移动到扩展栏，原来的UI编辑弃用，按钮组支持拖拽设置位置，可以删除和更改按钮样式等。",
        },
      ],
      updateTime: "2025年7月3日-2025年7月10",
    },
    {
      list: [
        {
          logoName: "x-diamond",
          position: "底部栏",
          buttonName: "扩展",
          des: "扩展功能，增加自定义按钮，样式自定义等。",
        },
      ],
      updateTime: "2025年7月3日",
    },
    {
      list: [
        {
          logoName: "bi bi-clock-history",
          position: "左侧栏",
          buttonName: "历史记录",
          des: "增加历史记录功能，记录用户操作。",
        },
      ],
      updateTime: "2025年6月28日",
    },
    {
      list: [
        {
          logoName: "bi bi-arrow-90deg-left",
          position: "左侧栏",
          buttonName: "上一步",
          des: "增加上一步功能，移动，旋转，缩放。",
        },
        {
          logoName: "bi bi-arrow-90deg-right",
          position: "左侧栏",
          buttonName: "下一步",
          des: "增加下一步功能，移动，旋转，缩放。",
        },
      ],
      updateTime: "2025年6月27日",
    },
    {
      list: [
        {
          logoName: "pin-map",
          position: "底部栏",
          buttonName: "标签",
          des: "标签宽高可以根据图片，自动计算。",
        },
        {
          logoName: "bi bi-stars",
          position: "底部栏",
          buttonName: "特效",
          des: "漫游路线重置到起点。",
        },
      ],
      updateTime: "2025年6月25日",
    },
    {
      list: [
        {
          logoName: "bi bi-stars",
          position: "底部栏",
          buttonName: "特效",
          des: "标签和顶牌移动到标签栏。",
        },
        {
          logoName: "bi bi-arrows-move",
          position: "左侧栏",
          buttonName: "控制器",
          des: "即将增加撤销功能。",
        },
      ],
      updateTime: "2025年6月24日",
    },
    {
      list: [
        {
          logoName: "bi bi-stars",
          position: "底部栏",
          buttonName: "特效",
          des: "标签和立方体在切换其他功能时，可以隐藏。",
        },
        {
          logoName: "bi bi-stars",
          position: "底部栏",
          buttonName: "特效",
          des: "漫游路径增加张力参数，可以调整线条形状。",
        },
      ],
      updateTime: "2025年6月22日",
    },
    {
      list: [
        {
          logoName: "bi bi-stars",
          position: "底部栏",
          buttonName: "特效",
          des: "漫游路径优化，路线更平滑。 ",
        },
        {
          logoName: "bi bi-stars",
          position: "底部栏",
          buttonName: "特效",
          des: "标签/顶牌背景bug修复。",
        },
      ],
      updateTime: "2025年6月21日",
    },
    {
      list: [
        {
          logoName: "bi bi-arrow-clockwise",
          position: "右上角",
          buttonName: "刷新",
          des: "增加刷新按钮。",
        },
        {
          logoName: "archive",
          position: "右侧栏",
          buttonName: "大纲",
          des: "分类显示。",
        },
      ],
      updateTime: "2025年6月19日",
    },

    {
      list: [
        {
          logoName: "file-text",
          position: "底部栏",
          buttonName: "日志",
          des: "原为文档，现改为更新日志。",
        },
        {
          logoName: "plus-square",
          position: "右上角",
          buttonName: "新建场景",
          des: "新建场景后，直接进入新场景，不再需要到场景列表切换。",
        },
        {
          logoName: "badge-3d",
          position: "左上角",
          buttonName: "切换场景",
          des: "3d列表，新增修复功能，由于更新导致无法打开场景，可使用修复功能修复！",
        },
        {
          logoName: "bi bi-stars",
          position: "底部栏",
          buttonName: "特效",
          des: "重新制作操作界面",
        },
        {
          logoName: "lightbulb",
          position: "右侧栏",
          buttonName: "灯光",
          des: "修复灯光加载问题",
        },
      ],
      updateTime: "2025年6月16日",
    },
  ];

  const [show, setShow] = useState(false); // 是否为调试场景[调试场景不允许修改代码]
  useEffect(() => {
    setShow(true);
  }, []);
  const handleClose = () => {
    setShow(false);
  };
  return (
    <ListGroup>
      <ListGroupItem>
        <ButtonGroup size="sm">
          {!show ? (
            <Button
              variant={buttonColor}
              onClick={() => {
                setShow(true);
              }}
            >
              <Icon iconName="eye" gap={1} title="查看场景" />
              日志
            </Button>
          ) : (
            <Modal size="xl" show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>更新日志</Modal.Title>
              </Modal.Header>
              <Modal.Body
                style={{
                  height: "76vh",
                  overflowY: "scroll",
                  scrollbarWidth: "thin",
                }}
              >
                {log.map((item, index) => {
                  const { updateTime, list } = item;
                  return (
                    <ListGroup key={index} className="mb-3">
                      <ListGroupItem>
                        {/* <AlertBase text={updateTime} type={APP_COLOR.Warning} /> */}
                        <Badge
                          bg={getButtonColor(APP_COLOR.Dark)}
                          text={APP_COLOR.Secondary}
                        >
                          <Icon iconName="clock" gap={1} />
                          更新时间：{updateTime}
                        </Badge>
                      </ListGroupItem>
                      {list.map((_item, _index: number) => {
                        return (
                          <ListGroupItem key={_index}>
                            {_index + 1}、{_item.position}【
                            <Badge
                              bg={getButtonColor(APP_COLOR.Dark)}
                              text={APP_COLOR.Warning}
                            >
                              <Icon iconName={_item.logoName} />
                            </Badge>
                            <span className={`text-${APP_COLOR.Warning}`}>
                              {_item.buttonName}
                            </span>
                            】{_item.des}
                          </ListGroupItem>
                        );
                      })}
                    </ListGroup>
                  );
                })}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  关闭
                </Button>
              </Modal.Footer>
            </Modal>
          )}
        </ButtonGroup>
      </ListGroupItem>
    </ListGroup>
  );
}
