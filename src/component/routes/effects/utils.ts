import { TourWindow } from "@/app/MyContext";
import { ActionItemBase, APP_COLOR } from "@/app/type";
import Toast3d from "@/component/common/Toast3d";
import { GROUP } from "@/three/config/CONSTANT";
import { ButtonGroupStyle, UserCssStyle } from "@/three/config/Three3dConfig";
import { editorInstance } from "@/three/instance/EditorInstance";
import { Three3dEditor } from "@/three/threeObj/Three3dEditor";

import { cameraEnterAnimation } from "@/three/utils/util4Camera";

import { LabelInfo } from "@/viewer3d/label/LabelInfo";
import { MarkLabel } from "@/viewer3d/label/MarkLabel";
import { Dispatch } from "react";

import { NumberController } from "three/examples/jsm/libs/lil-gui.module.min.js";

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
  const label = editor.scene.getObjectByName(labelName);
  if (label) {
    label.visible = true;
    return label;
  } else {
    const label = new MarkLabel(editor.scene, dispatchTourWindow, {
      markName: "标签",
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
    markName: "预览标签",
    logo: "geo-alt",
    showEye: false,
    tourObject: {
      id: "id",
      title: "title",
    },
  });

  editor.TEST_GROUP.add(markLabel.css3DSprite);
  testLabel.markLabel = markLabel;
  testLabel.markLabel.css3DSprite.name = GROUP.TEST + "_markLabel";

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
  testLabel.labelInfo.name = GROUP.TEST + "_labelInfo";
  editor.TEST_GROUP.add(testLabel.labelInfo.css3DSprite);
  return testLabel.labelInfo;
}

export function createTestLabel(
  editor: Three3dEditor,
  dispatchTourWindow: Dispatch<TourWindow>,
  show: { markVisible: boolean; labelVisible: boolean; cubeVisible: boolean }
) {
  const { markVisible, labelVisible, cubeVisible } = show;
  const marker = getMarkLabelTest(editor, dispatchTourWindow);
  const labelInfo = getLabelInfo(editor, dispatchTourWindow);

  const cube = editor.scene.getObjectByName(GROUP.TEST + "_cube");
  if (cube) cube.visible = cubeVisible;

  marker.css3DSprite.visible = markVisible;
  labelInfo.css3DSprite.visible = labelVisible;
  return { marker, labelInfo };
}

export function stopRoam() {
  const editor = editorInstance.getEditor();
  const { roamLine } = editor.extraParams;

  if (roamLine && roamLine.roamIsRunning) {
    // roamLine.position = new Vector3(0, 0, 0);
    roamLine.roamIsRunning = false;
    cameraEnterAnimation(editor);
  }
}
// 辅助函数：将十六进制颜色值转换为 RGB 值
export function hexToRgb(hex: string): string {
  hex = hex.replace(/^#/, "");
  const hexCode =
    hex.length === 3
      ? hex
          .split("")
          .map((c) => c + c)
          .join("")
      : hex;
  const bigint = parseInt(hexCode, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r}, ${g}, ${b}`;
}

export function useBackgroundColor(
  object: UserCssStyle,
  style: CSSStyleDeclaration
) {
  const rgbaColor = `rgba(${hexToRgb(object.cardBackgroundColor)}, ${object.opacity})`;
  style.backgroundColor = rgbaColor;
  style.backgroundImage = "";
}

export function useBackgroundImage(
  object: UserCssStyle,
  style: CSSStyleDeclaration,
  imgHeight: NumberController<UserCssStyle, "cardHeight">,
  imgWidth: NumberController<UserCssStyle, "cardWidth">
) {
  const rgbaColor = `rgba(${hexToRgb(object.cardBackgroundColor)}, 0)`;
  style.backgroundColor = rgbaColor;
  style.backgroundImage = `url("${object.cardBackgroundUrl}")`;
  // 创建 Image 对象
  const img = new Image();
  img.src = object.cardBackgroundUrl;

  img.onload = () => {
    // 图片加载完成后获取宽高
    const width = img.naturalWidth;
    const height = img.naturalHeight;
    imgWidth.setValue(width);
    imgHeight.setValue(height);
  };

  img.onerror = () => {
    Toast3d("图片加载失败", "提示", APP_COLOR.Danger);
    console.error("图片加载失败");
  };
}

export function showButtonGroupDiv(groupStyle: ButtonGroupStyle) {
  const div = document.querySelector("#buttonGroupDiv") as HTMLElement;
  const editor = editorInstance.getEditor();
  const { offsetWidth, offsetHeight } = editor.divElement;
  const { gap, direction } = groupStyle;
  const divStyle = div.style;
  divStyle.left = `${(groupStyle.left * offsetWidth) / 100}px`;
  divStyle.top = `${(groupStyle.top * offsetHeight) / 100}px`;

  divStyle.visibility = "visible";
  divStyle.display = "flex";
  divStyle.position = "absolute";
  divStyle.rowGap = `${gap}px`;
  divStyle.columnGap = `${gap}px`;
  divStyle.flexDirection = direction;
  divStyle.backgroundColor = "transparent";
  //  position: "absolute",
  //   zIndex: 1000,
  //   top: `${buttonPanel?.positionY || 0}px`,
  //   left: `${buttonPanel?.positionX || 0}px`,
  //   // 使用 gap 对应的标准 CSS 属性 rowGap 和 columnGap
  //   rowGap: `${buttonPanel?.marginLeft || 0}px`,
  //   columnGap: `${buttonPanel?.marginLeft || 0}px`,
  //   flexDirection: buttonPanel.direction,
  return div;
}

//生成按钮
export function generatePreviewButton(
  listGroup: ActionItemBase[],
  groupStyle: ButtonGroupStyle
) {
  const {
    width,
    height,
    borderColor,
    borderWidth,
    opacity,
    borderRadius,
    fontSize,
    color,
    colorIsClick,
    marginTop,
    marginLeft,
    backgroundColor,
    backgroundColorIsClick,
    backgroundUrl,
    backgroundUrlIsClick,
    useBackgroundUrl,
    borderColorIsClick,
  } = groupStyle;

  const div = document.getElementById("buttonGroupDiv") as HTMLElement;

  if (div) {
    div.innerHTML = "";
    if (listGroup.length === 0) {
      div.style.visibility = "hidden";
      return;
    }

    listGroup.forEach((item) => {
      const button = document.createElement("button");
      button.innerHTML = item.showName;
      const btnStyle = button.style;
      btnStyle.backgroundColor = "transparent";
      btnStyle.color = item.isClick ? colorIsClick : color;
      console.log(item.isClick, item.showName);

      if (!useBackgroundUrl) {
        const bgColor = item.isClick ? backgroundColorIsClick : backgroundColor;
        const rgbaColor = `rgba(${hexToRgb(bgColor)}, ${opacity})`;
        btnStyle.backgroundColor = rgbaColor;
        btnStyle.backgroundImage = "";
      }

      if (useBackgroundUrl) {
        const bgUrl = item.isClick ? backgroundUrlIsClick : backgroundUrl;
        btnStyle.backgroundImage = `url(${bgUrl})`;
      }
      btnStyle.marginTop = marginTop + "px";
      btnStyle.marginLeft = marginLeft + "px";
      btnStyle.width = width + "px";
      btnStyle.height = height + "px";
      btnStyle.borderColor = item.isClick ? borderColorIsClick : borderColor;
      btnStyle.borderWidth = borderWidth + "px";
      btnStyle.borderRadius = borderRadius + "px";
      btnStyle.fontSize = fontSize + "px";
      btnStyle.backgroundSize = `${width}px ${height}px`;
      btnStyle.backgroundRepeat = "no-repeat";

      div.appendChild(button);
    });
  }

  // const background = isClick
  //   ? buttonPanel?.backgroundUrl || ""
  //   : buttonPanel?.backgroundUrlNotSelect || "";
  // const backgroundColor = isClick
  //   ? buttonPanel?.backgroundColor || "rgb(255, 255, 255)"
  //   : buttonPanel?.backgroundColorNotSelect || "rgb(116, 116, 116)";

  // const color = isClick
  //   ? buttonPanel?.color || "rgb(255, 255, 255)"
  //   : buttonPanel.colorNotSelect || "rgb(255, 255, 255)";
  // return {
  //   // top: buttonPanel?.positionY || 0 + "px",
  //   // left: buttonPanel?.positionX || 0 + "px",
  //   width: (buttonPanel?.width || 100) + "px",
  //   lineHeight: (buttonPanel?.height || 30) + "px",
  //   marginLeft: (buttonPanel?.marginLeft || 0) + "px",
  //   fontSize: (buttonPanel?.fontSize || 22) + "px",
  //   color: `${color}`,
  //   backgroundImage: `url(${background})`,
  //   backgroundSize: `${buttonPanel?.width || 100}px ${
  //     buttonPanel?.height || 30
  //   }px`,
  //   borderColor: buttonPanel?.borderColor || "rgb(5, 145, 145)",
  //   borderWidth: (buttonPanel?.borderWidth || 0) + "px",
  //   backgroundColor,
  //   backgroundRepeat: "no-repeat",
  //   borderRadius: (buttonPanel?.borderRadius || 4) + "px",
}
