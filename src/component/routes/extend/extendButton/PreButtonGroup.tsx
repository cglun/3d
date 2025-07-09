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

import { memo, Suspense, useState } from "react";
import generateButtonGUI from "../generateButtonGUI";
import { editorInstance } from "@/three/instance/EditorInstance";
import { viewerInstance } from "@/three/instance/ViewerInstance";
import customButtonGUI from "../customButtonGUI";
import CodeEditor from "../../script/CodeEditor";
import { getEditorInstance, getShowButtonStyle } from "@/three/utils/utils";
import customButtonGroupGUI from "../customButtonGroupGUI";
import Icon from "@/component/common/Icon";
import Button from "react-bootstrap/esm/Button";
import generateButtonGroupGUI from "../generateButtonGroupGUI";
import { getThemeByScene } from "@/three/utils/util4UI";
import AlertBase from "@/component/common/AlertBase";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { MathUtils } from "three";
import { CustomButtonItemMap } from "@/app/type";

//生成按钮组
export default function PreButtonGroup() {
  const { userData } = useUpdateScene();
  const { customButtonGroupList, projectId } = userData;
  const [_groupIndex, _setGroupIndex] = useState(0);
  const { generateButtonGroup } = customButtonGroupList || {
    ...customButtonGroupListInit,
  };
  if (projectId === undefined) {
    return;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ListGroup horizontal>
        <GenerateButtonGroupShow
          groupIndex={0}
          generateButtonGroup={generateButtonGroup}
          _groupIndex={_groupIndex}
          _setGroupIndex={_setGroupIndex}
        />
        <GenerateButtonGroupShow
          groupIndex={1}
          generateButtonGroup={generateButtonGroup}
          _groupIndex={_groupIndex}
          _setGroupIndex={_setGroupIndex}
        />
        <GenerateButtonGroupShow
          groupIndex={2}
          generateButtonGroup={generateButtonGroup}
          _groupIndex={_groupIndex}
          _setGroupIndex={_setGroupIndex}
        />

        <CustomButtonGroupShow />
      </ListGroup>
    </Suspense>
  );
}

function GenerateButtonGroupShow({
  groupIndex,
  generateButtonGroup,
  _groupIndex,
  _setGroupIndex,
}: {
  groupIndex: number;
  generateButtonGroup: GenerateButtonGroup;
  _groupIndex: number;
  _setGroupIndex: (value: number) => void;
}) {
  const { scene, updateScene } = useUpdateScene();
  const { themeColor } = getThemeByScene(scene);
  const { customButtonItem } = generateButtonGroup.group[groupIndex];
  const { showGroup, buttonGroupStyle, listGroup } = customButtonItem;

  if (listGroup.length === 0) {
    return (
      <ListGroupItem>
        <AlertBase text={`${customButtonItem.name} 为空`} />
      </ListGroupItem>
    );
  }

  const positionStyle = getButtonGroupStyle(customButtonItem);
  let selectBackColor = {};
  if (_groupIndex === groupIndex) {
    selectBackColor = {
      borderColor: "red",
      borderWidth: "2px",
      backgroundColor: "rgba(36, 110, 11, 0.74)",
    };
  }
  return (
    <div
      style={{
        ...positionStyle,
        visibility: showGroup ? "visible" : "hidden",
        flexDirection: buttonGroupStyle.direction === "row" ? "row" : "column",
        position: "absolute",
        ...selectBackColor,
      }}
    >
      <Button
        size="sm"
        variant={themeColor}
        onClick={() => {
          _setGroupIndex(groupIndex);
          generateButtonGroupGUI(groupIndex, updateScene);
        }}
        draggable={true}
        onDragEnd={(e) => {
          const { clientX, clientY } = e;
          const top = clientY / window.innerHeight;
          const left = clientX / window.innerWidth;

          const { customButtonGroupList, editor } = getEditorInstance();
          const { group } = customButtonGroupList.generateButtonGroup;
          const { buttonGroupStyle } = group[groupIndex].customButtonItem;
          buttonGroupStyle.top = top * 100;
          buttonGroupStyle.left = left * 100;
          generateButtonGroupGUI(groupIndex, updateScene);
          updateScene(editor.scene);
        }}
      >
        <Icon iconName="bi bi-arrows-move" gap={1} />
        {generateButtonGroup.group[groupIndex].customButtonItem.name}
      </Button>
      {listGroup.map((item, index) => {
        const buttonStyle = generateButtonGroupItem(item, buttonGroupStyle);
        const showButtonStyle = getShowButtonStyle(item);

        return (
          <button
            key={index}
            style={{
              ...buttonStyle,
              ...showButtonStyle,
            }}
            onClick={() => {
              const { customButtonGroupList, editor } = getEditorInstance();
              const { group } = customButtonGroupList.generateButtonGroup;
              const { listGroup } = group[groupIndex].customButtonItem;
              listGroup.forEach((_item, _index) => {
                _item.isClick = false;
              });

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

function CustomButtonGroupShow() {
  const { updateScene, userData, scene } = useUpdateScene();
  const { customButtonGroupList } = userData;
  const { themeColor } = getThemeByScene(scene);
  const { group } = customButtonGroupList.customButtonGroup;
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [showCodeWindow, setShowCodeWindow] = useState(false);
  const codeString = group[x]?.listGroup[y]?.codeString || "";

  return group.map((item, index) => {
    const { listGroup, showGroup, buttonGroupStyle } = item;
    // const { group } = customButtonGroupList.customButtonGroup;
    const positionStyle = getButtonGroupStyle(group[index]);
    let selectBackColor = {};
    if (index === x) {
      selectBackColor = {
        borderColor: "red",
        borderWidth: "2px",
        backgroundColor: "rgba(36, 110, 11, 0.74)",
      };
    }
    return (
      <>
        <div
          key={index}
          style={{
            ...positionStyle,
            visibility: showGroup ? "visible" : "hidden",
            flexDirection:
              buttonGroupStyle.direction === "row" ? "row" : "column",
            position: "absolute",
            ...selectBackColor,
          }}
        >
          <Button
            variant={themeColor}
            size="sm"
            onMouseEnter={() => {
              setX(index);
              customButtonGroupGUI(
                customButtonGroupList.customButtonGroup.group[index],
                updateScene,
                index
              );
            }}
            draggable={true}
            onDragStart={() => {
              setX(index);
            }}
            onDragEnd={(e) => {
              //输出button的位置

              const { clientX, clientY } = e;
              const top = clientY / window.innerHeight;
              const left = clientX / window.innerWidth;
              const { customButtonGroupList, editor } = getEditorInstance();
              const { group } = customButtonGroupList.customButtonGroup;
              const { buttonGroupStyle } = group[x];
              buttonGroupStyle.top = top * 100;
              buttonGroupStyle.left = left * 100;
              customButtonGroupGUI(group[x], updateScene, x);
              updateScene(editor.scene);
            }}
          >
            <Icon iconName="bi bi-arrows-move" gap={1} /> {group[index].name}
          </Button>
          {listGroup.map((_item, _index) => {
            const buttonStyle = generateButtonGroupItem(
              _item,
              buttonGroupStyle
            );
            const showButtonStyle = getShowButtonStyle(_item);

            return (
              <button
                key={_index}
                style={{ ...buttonStyle, ...showButtonStyle }}
                onClick={() => {
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
          <Button
            variant={themeColor}
            size="sm"
            onMouseEnter={() => {
              setX(index);
              customButtonGroupGUI(
                customButtonGroupList.customButtonGroup.group[index],
                updateScene,
                index
              );
            }}
            onClick={() => {
              const { customButtonGroupList, editor } = getEditorInstance();
              const { group } = customButtonGroupList.customButtonGroup;
              const { listGroup, name } = group[x];
              // const item = listGroup[y];
              const buttonNum = listGroup.length + 1;
              const uuid = MathUtils.generateUUID();
              const item: CustomButtonItemMap = {
                NAME_ID: uuid,
                showName: `按钮${buttonNum}`,
                showButton: true,
                isClick: false,
                style: {
                  offsetWidth: 0,
                  offsetHeight: 0,
                },

                codeString: `//${name}_按钮${buttonNum}, NAME_ID: ${uuid}
console.log("${name}_按钮${buttonNum}");
              `,
              };
              listGroup.push(item);
              updateScene(editor.scene);
            }}
          >
            <Icon iconName="plus-square" gap={1} />
            按钮
          </Button>
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
