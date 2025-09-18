import { GROUP } from "@/three/config/CONSTANT";
import { useEffect, useState } from "react";
import { Scene } from "three";

import { CSS3DObject } from "three/examples/jsm/Addons.js";

export default function EmergencyPlanButtonGroup({ scene }: { scene: Scene }) {
  // const { scene, updateScene } = useUpdateScene();
  const [, setTime] = useState(0);

  // if (scene.children.length === 0) {
  //   return;
  // }
  // if (scene.getObjectByName === undefined) {
  //   return;
  // }
  // const emergencyPlan = scene?.getObjectByName(GROUP.EMERGENCY_PLAN);
  const emergencyPlan = scene?.children?.find((item) => {
    if (item.name === GROUP.EMERGENCY_PLAN) {
      return item;
    }
  });
  // 使用useEffect来正确处理事件监听器的添加和移除
  useEffect(() => {
    // 使用类型断言来避免CustomEvent类型问题
    const handleEmergencyUpdate = (e: Event) => {
      // 断言为自定义事件类型并检查detail是否存在
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

  return (
    emergencyPlan?.userData.enableEMERGENCY_PLAN_GROUP && (
      <>
        <div
          style={{
            height: "60%",
            fontSize: "24px",
            fontWeight: "bold",
            color: "#888",
            border: "2px dashed #ccc",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
            position: "absolute",
            top: "10%",
            left: "6%",

            width: "150px",
          }}
        >
          {emergencyPlan?.children &&
            emergencyPlan?.children.map((item) => {
              return (
                <div key={item.uuid}>
                  <button
                    style={{
                      lineHeight: "20px",
                      width: "100%",
                      fontSize: "16px",
                    }}
                    onClick={() => {
                      emergencyPlan?.traverse((child) => {
                        if (child instanceof CSS3DObject) {
                          child.visible = false;
                        }
                      });
                      item.userData.showChildren = !item.userData.showChildren;

                      emergencyPlan.traverse((child) => {
                        if (child.uuid === item.uuid) {
                          child.userData.showChildren = true;
                        } else {
                          child.userData.showChildren = false;
                        }
                      });
                      setTime(Date.now());
                      // updateScene(editor.scene);
                    }}
                  >
                    {item.name}
                  </button>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      marginLeft: "20px",
                      lineHeight: "16px",
                    }}
                  >
                    {item.userData.showChildren &&
                      item.children.map((_item) => (
                        <button
                          key={_item.uuid}
                          style={{ fontSize: "14px" }}
                          onClick={() => {
                            _item.children.forEach((child) => {
                              child.visible = true;
                            });
                          }}
                        >
                          {_item.name}
                        </button>
                      ))}
                  </div>
                </div>
              );
            })}
        </div>
        {/* <button
          onClick={() => {
            emergencyPlan?.traverse((child) => {
              if (child instanceof CSS3DObject) {
                child.visible = false;
              }
            });
          }}
        >
          隐藏全部
        </button> */}
      </>
    )
  );
}
