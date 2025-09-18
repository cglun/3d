import { useUpdateScene } from "@/app/hooks";
import { GROUP } from "@/three/config/CONSTANT";
import { getEditorInstance } from "@/three/utils/utils";

import { CSS3DObject } from "three/examples/jsm/Addons.js";

export default function EmerGencyPlanButtonGroup() {
  const { scene, updateScene } = useUpdateScene();
  // if (scene.children.length === 0) {
  //   return;
  // }
  // if (scene.getObjectByName === undefined) {
  //   return;
  // }
  // const emergencyPlan = scene?.getObjectByName(GROUP.EMERGENCY_PLAN);
  const emergencyPlan = scene.children.find((item) => {
    if (item.name === GROUP.EMERGENCY_PLAN) {
      return item;
    }
  });
  return (
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
          cursor: "not-allowed",
          width: "150px",
        }}
      >
        {emergencyPlan?.children &&
          emergencyPlan?.children.map((item) => {
            return (
              <div key={item.uuid}>
                <button
                  onClick={() => {
                    emergencyPlan?.traverse((child) => {
                      if (child instanceof CSS3DObject) {
                        child.visible = false;
                      }
                    });
                    item.userData.showChildren = !item.userData.showChildren;
                    const { editor } = getEditorInstance();
                    emergencyPlan.traverse((child) => {
                      if (child.uuid === item.uuid) {
                        child.userData.showChildren = true;
                      } else {
                        child.userData.showChildren = false;
                      }
                    });

                    updateScene(editor.scene);
                  }}
                >
                  {item.name}
                </button>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginLeft: "10px",
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
      <button
        onClick={() => {
          emergencyPlan?.traverse((child) => {
            if (child instanceof CSS3DObject) {
              child.visible = false;
            }
          });
        }}
      >
        隐藏全部
      </button>
    </>
  );
}
