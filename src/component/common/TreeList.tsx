import React, { memo } from "react";

import { APP_COLOR } from "@/app/type";
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
import Toast3d from "@/component/common/Toast3d";

import { useUpdateScene } from "@/app/hooks";
import Icon from "@/component/common/Icon";
import { styleBody } from "@/component/Editor/OutlineView/fontColor";
import { editorInstance } from "@/three/instance/EditorInstance";
import { getObjectNameByName } from "@/three/utils/util4UI";

import directionalLightGUI from "../Editor/PropertyGUI/lightGUI/directionalLightGUI";
import ambientLightGUI from "../Editor/PropertyGUI/lightGUI/ambientLightGUI";
import meshGroupGUI from "../Editor/PropertyGUI/meshGroupGUI";

import css3CSS3DSpriteGUI from "../Editor/PropertyGUI/css3CSS3DSpriteGUI";
import { GROUP } from "@/three/config/CONSTANT";

function TreeNode({
  node,
  onToggle,
}: {
  node: Object3D<Object3DEventMap>;
  onToggle: (uuid: string, isExpanded: boolean) => void;
}) {
  const hasChildren = node.children && node.children.length > 0;
  // 确保所有的 useState 调用和 useUpdateScene 调用都在条件返回之前
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [delBtn, setDelBtn] = React.useState(false);

  const { updateScene } = useUpdateScene();

  if (node.userData.isHelper) {
    return null;
  }

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    const editor = editorInstance.getEditor();
    const editorObject = editor.scene.getObjectByProperty("uuid", node.uuid);
    if (editorObject) {
      editor.currentSelected3d = editorObject;
    }

    editor.destroyGUI();
    if (editorObject instanceof DirectionalLight) {
      editor.transformControl.attach(editorObject);
      directionalLightGUI(editorObject);
    }
    if (editorObject instanceof AmbientLight) {
      ambientLightGUI(editorObject);
    }
    if (editorObject instanceof Group || editorObject instanceof Mesh) {
      meshGroupGUI(editorObject);

      editor.transformControl.attach(editorObject);
    }

    if (editorObject instanceof CSS3DSprite) {
      //editor.HELPER_GROUP.add(editorObject);
      // editor.MARK_LABEL_GROUP.add(editorObject);
      // editor.scene.add(editor.MARK_LABEL_GROUP);
      // const editorObject1 = editor.scene.getObjectByName(
      //   GROUP.MARK_LABEL_GROUP
      // );
      // if (editorObject1) {
      //   editorObject1.add(editorObject);
      // }
      css3CSS3DSpriteGUI(editorObject);
      const group = editor.scene.getObjectByName(GROUP.MARK_LABEL);
      group?.remove(editorObject);
      group?.add(editorObject);

      // editor.transformControl.detach();

      editor.transformControl.attach(editorObject);
    }

    if (editorObject?.parent?.parent?.name === GROUP.ROAM) {
      editor.transformControl.attach(editorObject);
    }
    if (editorObject?.parent?.name.includes("_GROUP")) {
      editorObject.userData.isSelected = !editorObject.userData.isSelected;
    }

    // resetTextWarning(node);

    const { scene } = editor;
    //setTransformControls(node);
    if (editorObject) {
      onToggle(editorObject.uuid, !isExpanded);
    }

    updateScene(scene);
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

  const light = `d-flex justify-content-between ${node.userData.isSelected && "text-warning"}`;

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
          {delBtn && node?.parent?.name.includes("_GROUP") ? (
            <Button
              className="me-1"
              size="sm"
              variant={APP_COLOR.Dark}
              onClick={(e) => delMesh(e, node)}
            >
              <Icon iconName="trash" title="删除" />
            </Button>
          ) : (
            ""
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
