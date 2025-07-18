import { useNavigate, Outlet, useLocation } from "@tanstack/react-router";
import Container from "react-bootstrap/esm/Container";
import Nav from "react-bootstrap/esm/Nav";
import Icon from "@/component/common/Icon";
import { useState } from "react";

export default function EditorBottom() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showIcons, setShowIcons] = useState(false);
  const BASE_URL = import.meta.env.BASE_URL;
  function handleSelect(eventKey: string | null) {
    if (eventKey !== null) {
      navigate({
        to: eventKey + location.searchStr,
      });
    }
  }
  let defaultActiveKey = location.href;

  if (location.href.includes("sceneId=")) {
    defaultActiveKey = location.pathname;
    // navigate({ to: location.href });
  }
  const tabsList = [
    {
      title: "首页",
      path: "",
      icon: "house-door",
    },
    {
      title: "模型",
      path: "model",
      icon: "bi bi-boxes",
    },
    {
      title: "几何体",
      path: "mesh",
      icon: "box",
    },
    {
      title: "标签",
      path: "mark",
      icon: "pin-map",
    },
    {
      title: "脚本",
      path: "script",
      icon: "bi bi-javascript",
      // icon: "bi bi-filetype-js",
    },
    {
      title: "特效",
      path: "effects",
      icon: "bi bi-stars",
    },
    {
      title: "配置",
      path: "config",
      icon: "gear",
    },
    {
      title: "扩展",
      path: "extend",
      icon: "x-diamond",
    },
    {
      title: "测试",
      path: "test",
      icon: "triangle",
    },
    {
      title: "预览",
      path: "preView",
      icon: "eye",
    },

    {
      title: "日志",
      path: "document",
      icon: "file-text",
      // icon: "file-earmark-word",
    },
    {
      title: "关于",
      path: "about",
      icon: "info-circle",
    },
  ];
  return (
    <Container fluid>
      <Nav
        variant="tabs"
        // activeKey={import.meta.env.BASE_URL}
        defaultActiveKey={defaultActiveKey}
        onSelect={(eventKey) => handleSelect(eventKey)}
      >
        {tabsList.map((item, index) => {
          const { title, path, icon } = item;
          if (index === 0) {
            return (
              <Nav.Item
                key={index}
                onClick={() => {
                  setShowIcons(!showIcons);
                }}
              >
                <Nav.Link>
                  {showIcons ? (
                    <Icon iconName="bi bi-chevron-right" title="收起logo" />
                  ) : (
                    <Icon iconName="bi bi-chevron-down" title="展开logo" />
                  )}
                </Nav.Link>
              </Nav.Item>
            );
          }

          if (item.title === "测试" && import.meta.env.PROD) {
            return;
          }

          return (
            <Nav.Item key={index}>
              <Nav.Link eventKey={BASE_URL + path}>
                <Icon
                  iconName={icon}
                  title={title}
                  gap={showIcons ? 1 : 0}
                  fontSize={1.16}
                />
                {showIcons && title}
              </Nav.Link>
            </Nav.Item>
          );
        })}
      </Nav>
      <Container fluid>
        <Outlet />
      </Container>
    </Container>
  );
}
