import { Group } from "three";
import { GROUP } from "@/three/config/CONSTANT";
import { useEffect, useState } from "react";
import { CSS3DObject } from "three/examples/jsm/Addons.js";
import { Three3dViewer } from "@/three/threeObj/Three3dViewer";
import { Three3dEditor } from "@/three/threeObj/Three3dEditor";
import DragBarButton from "@/component/common/Button/DragBarButton";
import { Button, ButtonGroup } from "react-bootstrap";
import { useUpdateScene } from "@/app/hooks";
import { getThemeByScene } from "@/three/utils/util4UI";
import Icon from "@/component/common/Icon";
import { updateEmergencyPlan } from "@/app/utils";
import { transformCMD } from "@/three/command/cmd";
import emergencyPlanGui from "@/component/routes/extend/emergencyPlanGui/emergencyPlanGui";
import { emergencyButton } from "@/component/routes/extend/extendButton/EmergencyButtonType";
import { getEditorInstance } from "@/three/utils/utils";
import emergencyPlanStepGui from "@/component/routes/extend/emergencyPlanGui/emergencyPlanStepGui";
import { SceneUserData } from "@/three/config/Three3dConfig";
import { cameraTween } from "@/three/animate/animate";
import Toast3d from "@/component/common/Toast3d/Toast3d";
import { APP_COLOR } from "@/app/type";
import { getButtonGroupItemStyle } from "@/component/routes/effects/utils";

export default function EmergencyPlanButtonGroup({
  instance,
}: {
  instance: Three3dViewer | Three3dEditor;
}) {
  // 将所有 hooks 移到组件顶部
  const { updateScene } = useUpdateScene();
  const [, setTime] = useState(0);
  const [showChildrenButton, setShowChildrenButton] = useState(true);

  // 使用 useEffect 来正确处理事件监听器的添加和移除
  useEffect(() => {
    // 使用类型断言来避免 CustomEvent 类型问题
    const handleEmergencyUpdate = (e: Event) => {
      // 断言为自定义事件类型并检查 detail 是否存在
      const customEvent = e as CustomEvent;
      if (customEvent.detail && typeof customEvent.detail.time === "number") {
        setTime(customEvent.detail.time);
      }
    };

    document.addEventListener(
      "EmergencyResponsePlanButtonGroupUpdate",
      handleEmergencyUpdate
    );

    // 清理函数，在组件卸载时移除事件监听器
    return () => {
      document.removeEventListener(
        "EmergencyResponsePlanButtonGroupUpdate",
        handleEmergencyUpdate
      );
    };
  }, []); // 空依赖数组表示只在组件挂载和卸载时执行

  // 现在再进行条件判断和返回
  const isEditor = instance instanceof Three3dEditor;

  if (instance === undefined) {
    return;
  }

  const { scene } = instance;
  const { themeColor } = getThemeByScene(scene);
  const emergencyPlan = scene.children.find((item) => {
    if (item.name === GROUP.EMERGENCY_PLAN) {
      return item;
    }
  });
  if (!emergencyPlan) {
    return;
  }

  function createRippleEffect(e: React.MouseEvent<HTMLButtonElement>) {
    // 创建涟漪效果
    const ripple = document.createElement("span");
    ripple.classList.add("press-ripple");

    // 设置涟漪位置
    const targetElement = e.target as HTMLElement;
    const rect = targetElement.getBoundingClientRect();

    ripple.style.left = e.clientX - rect.left + "px";
    ripple.style.top = e.clientY - rect.top + "px";

    targetElement.appendChild(ripple);

    // 动画结束后移除
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  const { left, top, gap, showGroup, direction, enable } =
    emergencyPlan.userData.buttonGroupStyle;
  const { offsetWidth, offsetHeight } = instance.divElement;

  const positionStyle = {
    left: `${(left * offsetWidth) / 100}px`,
    top: `${(top * offsetHeight) / 100}px`,
    display: "flex",
    rowGap: `${gap}px`,
    columnGap: `${gap}px`,
    backgroundColor: "transparent",
    position: "absolute",
    visibility: showGroup ? "visible" : "hidden",
    flexDirection: direction === "row" ? "row" : "column",
    zIndex: 1,
  } as React.CSSProperties;

  return (
    <div style={positionStyle}>
      {isEditor && (
        <DragBarButton
          buttonGroupStyle={emergencyPlan.userData.buttonGroupStyle}
          scene={scene}
          emergencyGroup={emergencyPlan as Group}
        />
      )}

      {enable &&
        emergencyPlan.children &&
        emergencyPlan.children.map((item) => {
          const { cameraPosition } = instance.scene.userData as SceneUserData;
          const buttonBase = item.userData.buttonBase || {
            ...emergencyButton,
            cameraViewer: cameraPosition.end,
          };
          const buttonStyle = getButtonGroupItemStyle(
            buttonBase,
            emergencyPlan.userData.buttonGroupStyle
          );

          return (
            <div key={item.uuid} className="super-press-btn-container">
              <div style={{ display: "flex", flexDirection: "row" }}>
                <button
                  className="super-press-btn"
                  style={{ ...buttonStyle }}
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    createRippleEffect(e);

                    emergencyPlan.traverse((child) => {
                      if (child instanceof CSS3DObject) {
                        child.visible = false;
                      }
                    });

                    // item.userData.showChildren = false;

                    // if (!item.userData.showChildren) {
                    //   item.userData.showChildren = true;
                    // }
                    //如果已经显示子节点，则不把子节点隐藏

                    if (item.userData.showChildren) {
                      setShowChildrenButton(!showChildrenButton);
                    } else {
                      setShowChildrenButton(true);
                    }

                    emergencyPlan.children.forEach((_item) => {
                      _item.userData.buttonBase.isClick = false;
                      const { children } = _item;
                      if (children) {
                        children.forEach((_child) => {
                          _child.userData.buttonBase.isClick = false;
                        });
                      }
                    });
                    item.userData.buttonBase.isClick = true;
                    const { cameraViewer } = item.userData.buttonBase;

                    if (cameraViewer) {
                      cameraTween(instance.camera, cameraViewer, 1000).start();
                    }

                    if (isEditor) {
                      instance.currentSelected3d = item;
                      transformCMD(item, () =>
                        emergencyPlanGui(item as Group, updateScene)
                      );
                      instance.transformControl.attach(item);
                    }

                    emergencyPlan.traverse((child) => {
                      if (child.uuid === item.uuid) {
                        child.userData.showChildren = true;
                      } else {
                        child.userData.showChildren = false;
                      }
                    });
                    updateScene(instance.scene);
                  }}
                >
                  {item.name}
                </button>
                <div>
                  {isEditor &&
                    item.userData.showChildren &&
                    showChildrenButton && (
                      <ButtonGroup className="ms-1" size="sm">
                        <Button
                          variant={themeColor}
                          onMouseEnter={() => {}}
                          onClick={() => {
                            const { editor } = getEditorInstance();
                            const step = new Group();
                            step.name = "步骤" + (item.children.length + 1);
                            step.userData.buttonBase = {
                              ...emergencyButton,
                            };
                            item.add(step);
                            updateScene(editor.scene);
                          }}
                        >
                          <Icon
                            iconName="plus-square"
                            fontSize={0.8}
                            title="添加步骤"
                          />
                        </Button>
                        <Button
                          variant={themeColor}
                          onMouseEnter={() => {}}
                          onClick={() => {
                            const { editor } = getEditorInstance();
                            const { buttonBase } =
                              editor.currentSelected3d.userData;
                            buttonBase.cameraViewer =
                              editor.camera.position.clone();
                            Toast3d("视角已设置", "提示", APP_COLOR.Success);
                            updateScene(editor.scene);
                          }}
                        >
                          <Icon
                            iconName="camera"
                            fontSize={0.8}
                            title={`${item.name}视角`}
                          />
                        </Button>
                      </ButtonGroup>
                    )}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  // flexDirection: "column",
                  marginLeft: "20px",
                  lineHeight: "16px",
                  flexDirection: direction === "row" ? "row" : "column",
                }}
              >
                {item.userData.showChildren &&
                  showChildrenButton &&
                  item.children.map((_item) => {
                    const buttonBase = _item.userData.buttonBase || {
                      ...emergencyButton,
                    };
                    const buttonStyle = getButtonGroupItemStyle(
                      buttonBase,
                      emergencyPlan.userData.buttonGroupStyle
                    );
                    return (
                      <button
                        className="super-press-btn"
                        key={_item.uuid}
                        style={{ ...buttonStyle }}
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                          createRippleEffect(e);

                          _item.children.forEach((child) => {
                            child.visible = true;
                          });
                          buttonBase.isClick = true;

                          if (isEditor) {
                            instance.currentSelected3d = _item;
                            transformCMD(_item, () =>
                              emergencyPlanStepGui(_item as Group, updateScene)
                            );
                            instance.transformControl.attach(_item);
                          }
                          updateEmergencyPlan();
                        }}
                      >
                        {_item.name}
                      </button>
                    );
                  })}
              </div>
            </div>
          );
        })}
    </div>
  );
}
