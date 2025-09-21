import { useUpdateScene } from "@/app/hooks";
import {
  customButtonGroupListInit,
  GenerateButtonGroup,
  SceneUserData,
} from "@/three/config/Three3dConfig";
import {
  getButtonGroupItemStyle,
  getButtonGroupStyle,
  getButtonPosition,
} from "@/component/routes/effects/utils";

import { memo, Suspense, useState } from "react";
import generateButtonGUI from "../generateButtonGUI";
import { editorInstance } from "@/three/instance/EditorInstance";

import customButtonGUI from "../customButtonGUI";
import CodeEditor from "../../script/CodeEditor";
import { getEditorInstance } from "@/three/utils/utils";
import customButtonGroupGUI from "../customButtonGroupGUI";
import Icon from "@/component/common/Icon";
import Button from "react-bootstrap/esm/Button";
import generateButtonGroupGUI from "../generateButtonGroupGUI";
import { getThemeByScene } from "@/three/utils/util4UI";
import AlertBase from "@/component/common/AlertBase";
import { ButtonGroup, ListGroup, ListGroupItem } from "react-bootstrap";
import { MathUtils } from "three";
import { APP_COLOR, CustomButtonItemMap } from "@/app/type";

const selectBackColor = {
  backgroundColor: "rgba(67, 43, 26, 0.88)",
  padding: "2px",
};
//生成按钮组
export default function PreButtonGroup() {
  const { userData } = useUpdateScene();
  const { customButtonGroupList, projectId } = userData;
  const [_groupIndex, _setGroupIndex] = useState(0);

  if (projectId === undefined) {
    return;
  }
  const { generateButtonGroup } = customButtonGroupList || {
    ...customButtonGroupListInit,
  };
  const { group } = generateButtonGroup;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ListGroup horizontal>
        <GenerateButtonGroupShow
          groupIndex={0}
          group={group}
          _groupIndex={_groupIndex}
          _setGroupIndex={_setGroupIndex}
        />
        <GenerateButtonGroupShow
          groupIndex={1}
          group={group}
          _groupIndex={_groupIndex}
          _setGroupIndex={_setGroupIndex}
        />
        <GenerateButtonGroupShow
          groupIndex={2}
          group={group}
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
  group,
  _groupIndex,
  _setGroupIndex,
}: {
  groupIndex: number;
  group: GenerateButtonGroup["group"];
  _groupIndex: number;
  _setGroupIndex: (value: number) => void;
  showGenateButtonGroup?: boolean;
}) {
  const { scene, updateScene } = useUpdateScene();
  const { themeColor } = getThemeByScene(scene);
  const { customButtonItem } = group[groupIndex];
  const { showGroup, buttonGroupStyle, listGroup } = customButtonItem;

  if (listGroup.length === 0) {
    return;
    return (
      <ListGroupItem>
        <AlertBase text={`${customButtonItem.name} 为空`} />
      </ListGroupItem>
    );
  }
  const { editor } = getEditorInstance();
  const positionStyle = getButtonGroupStyle(
    customButtonItem,
    showGroup,
    editor.divElement
  );

  return (
    <div
      style={{
        ...positionStyle,
        ...(_groupIndex === groupIndex && selectBackColor),
        visibility: "visible",
      }}
    >
      <ButtonGroup>
        <Button
          size="sm"
          style={{
            cursor: "move",
          }}
          variant={themeColor}
          onClick={() => {
            _setGroupIndex(groupIndex);
            generateButtonGroupGUI(groupIndex, updateScene);
          }}
          onDragStart={() => {
            _setGroupIndex(groupIndex);
            generateButtonGroupGUI(groupIndex, updateScene);
          }}
          draggable={true}
          onDragEnd={(e) => {
            const { customButtonGroupList, editor } = getEditorInstance();
            const { top, left } = getButtonPosition(e, editor.divElement);

            const { group } = customButtonGroupList.generateButtonGroup;
            const { buttonGroupStyle } = group[groupIndex].customButtonItem;
            buttonGroupStyle.top = top * 100;
            buttonGroupStyle.left = left * 100;

            generateButtonGroupGUI(groupIndex, updateScene);
            updateScene(editor.scene);
          }}
        >
          {group[groupIndex].customButtonItem.name}
        </Button>
        <Button
          variant={themeColor}
          onClick={() => {
            customButtonItem.showGroup = !customButtonItem.showGroup;
            updateScene(editor.scene);
          }}
        >
          <Icon
            iconName={showGroup ? "eye" : "eye-slash"}
            title={"显示与隐藏"}
          />
        </Button>
      </ButtonGroup>
      {showGroup &&
        listGroup.map((item, index) => {
          const buttonStyle = getButtonGroupItemStyle(item, buttonGroupStyle);
          const { showName, showButton } = item;
          return (
            <button
              key={index}
              style={buttonStyle}
              onClick={() => {
                const { customButtonGroupList, editor } = getEditorInstance();
                const { group } = customButtonGroupList.generateButtonGroup;
                const { listGroup } = group[groupIndex].customButtonItem;
                listGroup.forEach((_item) => {
                  _item.isClick = false;
                });

                item.isClick = true;
                generateButtonGUI(updateScene, listGroup, groupIndex, index);
                updateScene(editor.scene);
              }}
            >
              {showButton ? showName : isHide()}
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

  function selectParent(parentIndex: number) {
    setX(parentIndex);
    customButtonGroupGUI(
      customButtonGroupList.customButtonGroup.group[parentIndex],
      updateScene,
      parentIndex
    );
  }

  return group.map((item, index) => {
    const { listGroup, showGroup, buttonGroupStyle } = item;
    // const { group } = customButtonGroupList.customButtonGroup;
    const { editor } = getEditorInstance();
    const positionStyle = getButtonGroupStyle(
      group[index],
      showGroup,
      editor.divElement
    );

    return (
      <>
        <div
          key={index}
          style={{
            ...positionStyle,
            ...(index === x && selectBackColor),
            visibility: "visible",
          }}
        >
          <ButtonGroup>
            <Button
              variant={themeColor}
              style={{
                cursor: "move",
              }}
              size="sm"
              onClick={() => {
                selectParent(index);
              }}
              draggable={true}
              onDragStart={() => {
                setX(index);
              }}
              onDragEnd={(e) => {
                const { customButtonGroupList, editor } = getEditorInstance();
                const { top, left } = getButtonPosition(e, editor.divElement);

                const { group } = customButtonGroupList.customButtonGroup;
                const { buttonGroupStyle } = group[x];
                buttonGroupStyle.top = top * 100;
                buttonGroupStyle.left = left * 100;
                customButtonGroupGUI(group[x], updateScene, x);
                updateScene(editor.scene);
              }}
            >
              自定义
            </Button>
            <Button
              variant={themeColor}
              onClick={() => {
                item.showGroup = !item.showGroup;
                updateScene(editor.scene);
              }}
            >
              <Icon
                iconName={showGroup ? "eye" : "eye-slash"}
                title={"显示与隐藏"}
              />
            </Button>
            <Button
              variant={themeColor}
              size="sm"
              onMouseEnter={() => {
                selectParent(index);
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
              <Icon iconName="plus-square" title="添加按钮" />
            </Button>
          </ButtonGroup>
          {showGroup &&
            listGroup.map((_item, _index) => {
              const buttonStyle = getButtonGroupItemStyle(
                _item,
                buttonGroupStyle
              );
              const { showButton, showName } = _item;
              return (
                <button
                  key={_index}
                  style={buttonStyle}
                  onClick={() => {
                    setX(index);
                    setY(_index);
                    const { customButtonGroupList, editor } =
                      getEditorInstance();
                    const { group } = customButtonGroupList.customButtonGroup;
                    group[index].listGroup.forEach((_item) => {
                      _item.isClick = false;
                    });
                    _item.isClick = !_item.isClick;
                    customButtonGUI(
                      updateScene,
                      index,
                      _index,
                      setShowCodeWindow
                    );

                    updateScene(editor.scene);
                  }}
                >
                  {showButton ? showName : isHide()}
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

function isHide() {
  return (
    <div
      className={"text-" + APP_COLOR.Warning + " ms-1"}
      style={{ fontSize: "14px", backgroundColor: "#330c0cff" }}
    >
      [-已隐藏-]
    </div>
  );
}
