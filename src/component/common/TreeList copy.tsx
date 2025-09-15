import React, { memo, useState } from "react";

import {
  AmbientLight,
  DirectionalLight,
  Group,
  Light,
  Mesh,
  Object3D,
  Object3DEventMap,
} from "three";
import ListGroupItem from "react-bootstrap/esm/ListGroupItem";
import Container from "react-bootstrap/esm/Container";
import Button from "react-bootstrap/esm/Button";
import { CSS3DSprite } from "three/addons/renderers/CSS3DRenderer.js";
import ModalConfirm3d from "@/component/common/ModalConfirm3d";
import AlertBase from "@/component/common/AlertBase";
import Toast3d from "@/component/common/Toast3d/Toast3d";
import { APP_COLOR } from "@/app/type";
import { useUpdateScene } from "@/app/hooks";
import Icon from "@/component/common/Icon";
import { styleBody } from "@/component/Editor/OutlineView/fontColor";
import { editorInstance } from "@/three/instance/EditorInstance";
import { getObjectNameByName } from "@/three/utils/util4UI";

import directionalLightGUI from "@/component/Editor/PropertyGUI/lightGUI/directionalLightGUI";
import ambientLightGUI from "@/component/Editor/PropertyGUI/lightGUI/ambientLightGUI";
import meshGroupGUI from "@/component/Editor/PropertyGUI/meshGroupGUI";

import css3CSS3DSpriteGUI from "@/component/Editor/PropertyGUI/css3DSpriteGUI";
import { GROUP } from "@/three/config/CONSTANT";
import { transformCMD } from "@/three/command/cmd";
import emergencyPlanGui from "@/component/routes/extend/emergencyPlanGui/emergencyPlanGui";

function TreeNode({
  node,
  onToggle,
}: {
  node: Object3D<Object3DEventMap>;
  onToggle: (uuid: string, isExpanded: boolean) => void;
}) {
  // 确保所有的 useState 调用和 useUpdateScene 调用都在条件返回之前
  const [isExpanded, setIsExpanded] = useState(false);
  const [delBtn, setDelBtn] = useState(false);
  const { updateScene } = useUpdateScene();
  const hasChildren = node.children.length > 0;

  if (node.userData.isHelper) {
    return null;
  }

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    const editor = editorInstance.getEditor();
    const editorObject = editor.scene.getObjectByProperty("uuid", node.uuid);
    if (editorObject === undefined) {
      return;
    }

    editor.currentSelected3d = editorObject;
    editor.destroyGUI();
    const parentGroup = editorObject?.parent?.name;
    if (parentGroup === GROUP.LIGHT) {
      if (editorObject instanceof DirectionalLight) {
        editor.transformControl.attach(editorObject);
        transformCMD(editorObject, () => directionalLightGUI(editorObject));
      }
      if (editorObject instanceof AmbientLight) {
        ambientLightGUI(editorObject);
        transformCMD(editorObject, () => ambientLightGUI(editorObject));
      }
      return;
    }

    if (parentGroup === GROUP.MODEL) {
      const isGroup = editorObject?.parent?.name.includes(GROUP.MODEL);
      if (isGroup) {
        transformCMD(editorObject, () => meshGroupGUI(editorObject as Group));
        editor.transformControl.attach(editorObject as Group);
      }
      return;
    }

    if (parentGroup === GROUP.EMERGENCY_PLAN) {
      transformCMD(editorObject, () =>
        emergencyPlanGui(editorObject as Group, updateScene)
      );
      editor.transformControl.attach(editorObject as Group);

      return;
    }

    if (parentGroup === GROUP.EMERGENCY_PLAN) {
    }

    if (editorObject instanceof CSS3DSprite) {
      transformCMD(editorObject, () => css3CSS3DSpriteGUI(editorObject));
      editor.transformControl.attach(editorObject);
      return;
    }

    if (editorObject) {
      onToggle(editorObject.uuid, !isExpanded);
    }
    editor.transformControl.detach();
    updateScene(editor.scene);
  };

  const delMesh = (e: React.MouseEvent<HTMLButtonElement>, item: Object3D) => {
    e.stopPropagation();
    e.preventDefault();
    ModalConfirm3d(
      {
        title: "删除",
        body: (
          <AlertBase type={APP_COLOR.Danger} text={getObjectNameByName(item)} />
        ),
      },
      () => {
        const editor = editorInstance.getEditor();
        const { scene, transformControl } = editor;
        const targetItem = scene.getObjectByProperty("uuid", item.uuid);

        if (targetItem === undefined) {
          return;
        }
        if (targetItem instanceof CSS3DSprite) {
          editor.MARK_LABEL_GROUP.remove(targetItem);
          editor.destroyGUI();
          updateScene(scene);
          return;
        }
        if (targetItem.parent === null) {
          return;
        }

        targetItem.parent.remove(targetItem);

        if (transformControl) {
          transformControl.detach();
        }
        editor.destroyGUI();
        updateScene(scene);
        Toast3d(`【${getObjectNameByName(item)}】已删除`);
      }
    );
    // 删除提示
  };
  function getLogo(item: Object3D) {
    let logo = "hexagon";
    // 修改为使用 instanceof 检查类型
    if (item instanceof Mesh) logo = "box-seam";
    if (item instanceof Group) logo = "folder";
    // if (item instanceof Group) logo = "collection";
    if (item instanceof Light) logo = "lightbulb";
    if (item instanceof CSS3DSprite) logo = "pin-map";
    return <Icon iconName={logo} gap={1} />;
  }

  const light = `d-flex justify-content-between`;
  // const light = `d-flex justify-content-between ${node.userData.isSelected && "text-warning"}`;
  let showDelBtn = delBtn && node?.parent?.name.includes("_GROUP");
  if (node instanceof CSS3DSprite) {
    showDelBtn = delBtn && true;
  }
  return (
    <ListGroupItem>
      <Container
        fluid
        className={light}
        onClick={handleToggle}
        onMouseEnter={() => setDelBtn(true)}
        onMouseLeave={() => setDelBtn(false)}
        style={styleBody}
      >
        <div>
          {getLogo(node)}
          {getObjectNameByName(node)}
        </div>
        <div>
          {showDelBtn && (
            <Button
              className="me-1"
              size="sm"
              variant={APP_COLOR.Dark}
              onClick={(e) => delMesh(e, node)}
            >
              <Icon iconName="trash" title="删除" />
            </Button>
          )}
          {hasChildren &&
            (isExpanded ? (
              <Icon iconName="dash-square" title="收缩" />
            ) : (
              <Icon iconName="plus-square" title="展开" />
            ))}
        </div>
      </Container>
      {isExpanded && hasChildren && (
        <>
          {node.children.map((child) => (
            <TreeNode key={child.uuid} node={child} onToggle={onToggle} />
          ))}
        </>
      )}
    </ListGroupItem>
  );
}

function TreeList({ data }: { data: Object3D[] }) {
  return (
    <>
      {data.map((node: Object3D<Object3DEventMap>) => (
        <TreeNode key={node.uuid} node={node} onToggle={() => {}} />
      ))}
    </>
  );
}

export default memo(TreeList);
