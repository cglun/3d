import { GROUP } from "@/three/config/CONSTANT";
import { useEffect, useState } from "react";
import { CSS3DObject } from "three/examples/jsm/Addons.js";
import { Three3dViewer } from "@/three/threeObj/Three3dViewer";
import { Three3dEditor } from "@/three/threeObj/Three3dEditor";
import { getButtonGroupItemStyle } from "../../effects/utils";
import DragBarButton from "@/component/common/Button/DragBarButton";
import { Button } from "react-bootstrap";
import { useUpdateScene } from "@/app/hooks";
import { getThemeByScene } from "@/three/utils/util4UI";
import Icon from "@/component/common/Icon";
import { Group } from "three";
import { updateEmergencyPlan } from "@/app/utils";
import { transformCMD } from "@/three/command/cmd";
import emergencyPlanGui from "../emergencyPlanGui/emergencyPlanGui";
import { emergencyButton } from "./EmergencyButtonType";
import { getEditorInstance } from "@/three/utils/utils";
import emergencyPlanStepGui from "../emergencyPlanGui/emergencyPlanStepGui";

export default function EmergencyPlanButtonGroup({
  instance,
}: {
  instance: Three3dViewer | Three3dEditor;
}) {
  // 将所有 hooks 移到组件顶部
  const { updateScene } = useUpdateScene();
  const [, setTime] = useState(0);

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
          const buttonBase = item.userData.buttonBase || {
            ...emergencyButton,
          };
          const buttonStyle = getButtonGroupItemStyle(
            buttonBase,
            emergencyPlan.userData.buttonGroupStyle
          );

          return (
            <div key={item.uuid}>
              <button
                style={{ ...buttonStyle }}
                onClick={() => {
                  emergencyPlan.traverse((child) => {
                    if (child instanceof CSS3DObject) {
                      child.visible = false;
                    }
                  });

                  item.userData.showChildren = !item.userData.showChildren;
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
                  setTime(Date.now());
                }}
              >
                {item.name}
              </button>

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
                        key={_item.uuid}
                        style={{ ...buttonStyle }}
                        onClick={() => {
                          _item.children.forEach((child) => {
                            child.visible = true;
                          });
                          buttonBase.isClick = true;

                          if (isEditor) {
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
                {isEditor && item.userData.showChildren && (
                  <Button
                    size="sm"
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
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
}
