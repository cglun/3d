import { TourWindow } from "@/app/MyContext";
import { editorInstance } from "@/three/EditorInstance";
import { Three3dEditor } from "@/three/Three3dEditor";
import { cameraEnterAnimation } from "@/threeUtils/util4Camera";

import { LabelInfo } from "@/viewer3d/label/LabelInfo";
import { MarkLabel } from "@/viewer3d/label/MarkLabel";
import { Dispatch } from "react";

export function rgbaToHex_xx(rgba: string): string {
  if (rgba === undefined || rgba === null) {
    return "#000000";
  }

  // 匹配 rgba 和 rgb 格式的颜色值
  const match = rgba.match(
    /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/
  );
  if (!match) {
    return rgba.startsWith("#") ? rgba.slice(0, 7) : "#000000";
  }

  const r = parseInt(match[1], 10);
  const g = parseInt(match[2], 10);
  const b = parseInt(match[3], 10);

  // 将每个颜色分量转换为两位十六进制字符串
  const hexR = r.toString(16).padStart(2, "0");
  const hexG = g.toString(16).padStart(2, "0");
  const hexB = b.toString(16).padStart(2, "0");

  return `#${hexR}${hexG}${hexB}`;
}

export function setFontSize(div: HTMLDivElement, fontSize: number) {
  for (let index = 0; index < div.children.length; index++) {
    const element = div.children[index] as HTMLDivElement;
    element.style.fontSize = `${fontSize}px`;
  }
}

export function setLabelFontColor(div: HTMLDivElement, color: string) {
  for (let index = 0; index < div.children.length; index++) {
    const element = div.children[index] as HTMLDivElement;
    element.style.color = color;
  }
}

export function showLabel(
  labelName: string,
  dispatchTourWindow: Dispatch<TourWindow>
) {
  //创建lab
  const editor = editorInstance.getEditor();
  //let label: MarkLabel;
  let label = editor.scene.getObjectByName(labelName);
  if (label) {
    label.visible = true;
    return label;
  } else {
    const label = new MarkLabel(editor.scene, dispatchTourWindow, {
      markName: "此标签不会被保存",
      logo: "geo-alt",
      showEye: false,
      tourObject: {
        id: "id",
        title: "title",
      },
    });
    label.css3DSprite.name = labelName;
    label.css3DSprite.userData.isHelper = true;
    editor.scene.add(label.css3DSprite);
    return label;
  }
}
export function hideLabel(labelName: string) {
  const editor = editorInstance.getEditor();
  const label = editor.scene.getObjectByName(labelName);
  if (label) {
    label.visible = false;
  }
}
type TestLabelType = {
  markLabel: MarkLabel | null;
  labelInfo: LabelInfo | null;
};

export const testLabel: TestLabelType = {
  markLabel: null,
  labelInfo: null,
};
export function getMarkLabelTest(
  editor: Three3dEditor,
  dispatchTourWindow: Dispatch<TourWindow>
) {
  if (testLabel.markLabel) {
    return testLabel.markLabel;
  }
  const markLabel = new MarkLabel(editor.scene, dispatchTourWindow, {
    markName: "此标签不会被保存",
    logo: "geo-alt",
    showEye: false,
    tourObject: {
      id: "id",
      title: "title",
    },
  });
  testLabel.markLabel = markLabel;
  editor.scene.add(testLabel.markLabel.css3DSprite);
  return testLabel.markLabel;
}

export function getLabelInfo(
  editor: Three3dEditor,
  dispatchTourWindow: Dispatch<TourWindow>
) {
  if (testLabel.labelInfo) {
    return testLabel.labelInfo;
  }

  const cube = editor.addCube();

  testLabel.labelInfo = new LabelInfo(cube, editor.scene, dispatchTourWindow);
  editor.scene.add(testLabel.labelInfo.css3DSprite);
  return testLabel.labelInfo;
}

export function createTestLabel(
  editor: Three3dEditor,
  dispatchTourWindow: Dispatch<TourWindow>,
  show: { mark: boolean; label: boolean; blender: boolean }
) {
  const { mark, label, blender } = show;
  const marker = getMarkLabelTest(editor, dispatchTourWindow);
  const labelInfo = getLabelInfo(editor, dispatchTourWindow);

  const bl = editor.scene.getObjectByName("blender");
  if (bl) {
    bl.visible = blender;
  }
  marker.css3DSprite.visible = mark;
  labelInfo.css3DSprite.visible = label;
  return { marker, labelInfo };
}

export function stopRoam() {
  const editor = editorInstance.getEditor();
  const { roamLine } = editor.extraParams;
  if (roamLine !== undefined) {
    roamLine.roamIsRunning = false;
    cameraEnterAnimation(editor);
  }
}
