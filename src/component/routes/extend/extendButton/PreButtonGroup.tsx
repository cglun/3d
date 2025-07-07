import { useUpdateScene } from "@/app/hooks";
import {
  customButtonGroupListInit,
  GenerateButtonGroup,
  SceneUserData,
} from "@/three/config/Three3dConfig";
import {
  generateButtonGroupItem,
  getButtonGroupStyle,
} from "@/component/routes/effects/utils";

import {
  getPanelControllerButtonGroup,
  getRoamListByRoamButtonMap,
  getToggleButtonGroup,
} from "@/viewer3d/buttonList/buttonGroup";
import { GenerateButtonItemMap } from "@/app/type";

import { memo, useState } from "react";
import generateButtonGUI from "../generateButtonGUI";
import { editorInstance } from "@/three/instance/EditorInstance";
import { viewerInstance } from "@/three/instance/ViewerInstance";
import customButtonGUI from "../customButtonGUI";
import CodeEditor from "../../script/CodeEditor";

//生成按钮组
export default function PreButtonGroup({
  dev = "editor3d",
}: {
  dev: "editor3d" | "viewer3d";
}) {
  const { scene } = useUpdateScene();
  const { customButtonGroupList } = scene.userData as SceneUserData;
  const { generateButtonGroup } = customButtonGroupList || {
    ...customButtonGroupListInit,
  };

  return (
    <div>
      <GenerateButtonGroupShow
        dev={dev}
        groupIndex={0}
        generateButtonGroup={generateButtonGroup}
      />
      <GenerateButtonGroupShow
        dev={dev}
        groupIndex={1}
        generateButtonGroup={generateButtonGroup}
      />
      <GenerateButtonGroupShow
        dev={dev}
        groupIndex={2}
        generateButtonGroup={generateButtonGroup}
      />

      <CustomButtonGroupShow dev={dev} />
    </div>
  );
}

function GenerateButtonGroupShow({
  groupIndex,
  generateButtonGroup,
  dev,
}: {
  groupIndex: number;
  generateButtonGroup: GenerateButtonGroup;
  dev: "editor3d" | "viewer3d";
}) {
  const { updateScene } = useUpdateScene();
  const positionStyle = getButtonGroupStyle(
    generateButtonGroup.group[groupIndex].customButtonItem
  );
  const { showGroup, buttonGroupStyle } =
    generateButtonGroup.group[groupIndex].customButtonItem;

  let listGroup = [] as GenerateButtonItemMap[];
  if (groupIndex === 0) {
    listGroup = getToggleButtonGroup(groupIndex, generateButtonGroup);
  }
  if (groupIndex === 1) {
    listGroup = getRoamListByRoamButtonMap();
  }
  if (groupIndex === 2) {
    listGroup = getPanelControllerButtonGroup();
  }
  return (
    <div
      style={{
        ...positionStyle,
        visibility: showGroup ? "visible" : "hidden",
        flexDirection: buttonGroupStyle.direction === "row" ? "row" : "column",
        position: "absolute",
      }}
    >
      {listGroup.map((item, index) => {
        const buttonStyle = generateButtonGroupItem(item, buttonGroupStyle);
        const showButtonStyle = {
          opacity: item.showButton ? "initial" : 0.4,
          // 拆分 border 属性
          borderWidth: item.showButton ? "initial" : "1px",
          borderStyle: item.showButton ? "initial" : "dashed",
          borderColor: item.showButton ? "initial" : "#ff0000",
        };
        if (dev === "viewer3d") {
          return;
        }

        return (
          <button
            key={index}
            style={{
              ...buttonStyle,
              ...showButtonStyle,
            }}
            onClick={() => {
              const editor = editorInstance.getEditor();
              const { customButtonGroupList } = editor.scene
                .userData as SceneUserData;
              const { listGroup } =
                customButtonGroupList.generateButtonGroup.group[groupIndex]
                  .customButtonItem;
              listGroup.forEach((_item, _index) => {
                _item.isClick = false;
              });

              item.handler(item.NAME_ID);
              item.isClick = true;
              generateButtonGUI(updateScene, listGroup, groupIndex, index);

              updateScene(editor.scene);
            }}
          >
            {item.showName}
          </button>
        );
      })}
    </div>
  );
}
memo(GenerateButtonGroupShow);

function CustomButtonGroupShow({ dev }: { dev: "editor3d" | "viewer3d" }) {
  const { scene, updateScene } = useUpdateScene();
  const { customButtonGroupList } = scene.userData as SceneUserData;
  const { group } = customButtonGroupList.customButtonGroup;
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [showCodeWindow, setShowCodeWindow] = useState(false);
  const codeString = group[x]?.listGroup[y]?.codeString || "";

  return group.map((item, index) => {
    const { listGroup, showGroup, buttonGroupStyle } = item;

    const positionStyle = getButtonGroupStyle(
      customButtonGroupList.customButtonGroup.group[index]
    );
    return (
      <>
        <div
          style={{
            ...positionStyle,
            visibility: showGroup ? "visible" : "hidden",
            flexDirection:
              buttonGroupStyle.direction === "row" ? "row" : "column",
            position: "absolute",
          }}
        >
          {listGroup.map((_item, _index) => {
            const buttonStyle = generateButtonGroupItem(
              _item,
              buttonGroupStyle
            );
            const showButtonStyle = {
              opacity: _item.showButton ? "initial" : 0.4,
              // 拆分 border 属性
              borderWidth: _item.showButton ? "initial" : "1px",
              borderStyle: _item.showButton ? "initial" : "dashed",
              borderColor: _item.showButton ? "initial" : "#ff0000",
            };
            if (dev === "viewer3d") {
              return;
            }
            return (
              <button
                style={{ ...buttonStyle, ...showButtonStyle }}
                onClick={() => {
                  console.log(`名称：${_item.showName},ID：${_item.NAME_ID} `);

                  const viewerIns = viewerInstance?.getViewer();

                  if (viewerIns) {
                    new Function("viewerIns", _item.codeString)(viewerIns);
                    //如果是预览模式，不执行下面的了。
                    return;
                  }
                  const editorIns = editorInstance?.getEditor();
                  if (editorIns) {
                    const { customButtonGroupList } = editorIns.scene
                      .userData as SceneUserData;
                    customButtonGroupList.customButtonGroup.group[
                      index
                    ].listGroup.forEach((_item, _index) => {
                      _item.isClick = false;
                    });
                    _item.isClick = !_item.isClick;
                    customButtonGUI(
                      updateScene,
                      index,
                      _index,
                      setShowCodeWindow
                    );
                    setX(index);
                    setY(_index);
                    updateScene(editorIns.scene);
                    new Function("editorIns", _item.codeString)(editorIns);
                  }
                }}
              >
                {_item.showName}
              </button>
            );
          })}
        </div>
        <CodeEditor
          tipsTitle="实现按钮事件"
          code={codeString}
          isValidate={true}
          show={showCodeWindow}
          setShow={setShowCodeWindow}
          callback={function (value): void {
            const { scene } = editorInstance.getEditor();
            const { customButtonGroupList } = scene.userData as SceneUserData;
            const { group } = customButtonGroupList.customButtonGroup;
            group[x].listGroup[y].codeString = value;
            updateScene(scene);
          }}
        />
      </>
    );
  });
}
