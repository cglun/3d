import { Scene, Vector3 } from "three";
import { TourWindow } from "../../app/MyContext";

import { CSS3DSprite } from "three/examples/jsm/renderers/CSS3DRenderer.js";

import { UserStyles } from "../../app/type";
import { SceneUserData } from "../../three/Three3dConfig";

import { getCardBackgroundUrl, setClassName } from "../../threeUtils/util4UI";
import { getTourSrc } from "../../threeUtils/util4Scene";

export interface MarkLabelProps {
  markName: string;
  logo: string;
  showEye: boolean;
  tourObject: { id: string; title: string };
}

export class MarkLabel {
  div = document.createElement("div");

  markLabelProps: MarkLabelProps = {
    markName: "标注名称",
    logo: "geo-alt",
    showEye: false,
    tourObject: { id: "", title: "" },
  };

  userDataStyles = {
    cardWidth: 116,
    cardHeight: 116,
    cardRadius: 0.8,
    cardBackgroundColor: "#d85555",
    cardBackgroundUrl: "/editor3d/public/static/images/defaultImage3d.png",
    headerFontSize: 18,
    headerColor: "#fe2ffe",
    bodyFontSize: 14,
    bodyColor: "#fee1e1",
    modelHighlightColor: "#aaffaa",
    offsetX: 116 / 2,
    offsetY: 116 / 2,
    headerMarginTop: 0,
    headerMarginLeft: 0,
    cardSize: 0.04,
  } as UserStyles;

  css3DSprite = new CSS3DSprite(this.div);
  dispatchTourWindow: React.Dispatch<TourWindow>;

  constructor(
    scene: Scene,
    dispatchTourWindow: React.Dispatch<TourWindow>,
    markLabelProps: MarkLabelProps
  ) {
    this.dispatchTourWindow = dispatchTourWindow;
    this.markLabelProps = markLabelProps;

    const _userData = scene.userData as SceneUserData;
    this.userDataStyles = _userData.userCssStyle.markLabel;
    this.createDiv();
    this.createCss3dLabel();
  }

  private createCss3dLabel(position = { x: 0, y: 0, z: 0 } as Vector3) {
    const css3DSprite = new CSS3DSprite(this.div);
    css3DSprite.name = this.markLabelProps.markName;

    css3DSprite.userData = this.markLabelProps;
    const { x, y, z } = position;
    css3DSprite.position.set(x, y, z);
    const { cardSize } = this.userDataStyles;
    css3DSprite.scale.set(cardSize, cardSize, cardSize);

    this.css3DSprite = css3DSprite;
  }

  private createDiv() {
    this.div.className = "mark-label mark-label-controller-panel";
    const labelStyle = this.div.style;
    const {
      headerFontSize,
      cardRadius,
      cardBackgroundColor,
      cardBackgroundUrl,
      bodyFontSize,
      headerColor,
      cardHeight,
      cardWidth,
      headerMarginTop,
      headerMarginLeft,
      offsetX,
      offsetY,
    } = this.userDataStyles;

    labelStyle.width = cardWidth + "px";
    labelStyle.lineHeight = cardHeight + "px";
    labelStyle.padding = headerMarginTop + "px " + headerMarginLeft + "px";
    labelStyle.borderRadius = cardRadius + "px";
    labelStyle.backgroundColor = cardBackgroundColor;
    labelStyle.backgroundImage = getCardBackgroundUrl(cardBackgroundUrl);
    labelStyle.backgroundRepeat = "no-repeat";
    labelStyle.backgroundPosition = "center center";
    labelStyle.backgroundSize = "cover";
    labelStyle.fontSize = bodyFontSize + "px";
    labelStyle.color = headerColor;

    labelStyle.top = offsetY + "px";
    labelStyle.left = offsetX + "px";

    const header = document.createElement("div");
    header.className = "mark-label-header";
    header.style.fontSize = headerFontSize + "px";
    header.style.color = headerColor;

    const logo = document.createElement("i");
    logo.className = setClassName(this.markLabelProps.logo);
    header.appendChild(logo);

    const title = document.createElement("span");
    title.style.fontSize = this.userDataStyles.headerColor + "px";
    title.style.color = this.userDataStyles.headerColor;
    title.className = "ms-1";
    title.textContent = this.markLabelProps.markName;
    header.appendChild(title);

    // 修改 header 样式
    header.style.display = "flex";
    header.style.alignItems = "center";

    if (this.markLabelProps.showEye) {
      const eye = document.createElement("i");
      eye.className = setClassName("eye");
      eye.style.cursor = "pointer";
      // 使用 margin-left: auto 实现右对齐
      eye.style.marginLeft = "auto";
      eye.addEventListener("click", () => {
        // 使用箭头函数保证 this 指向实例
        if (this.dispatchTourWindow) {
          const { id, title } = this.markLabelProps.tourObject;
          this.dispatchTourWindow({
            type: "tourWindow",
            payload: {
              show: true,
              title: title,
              tourSrc: getTourSrc(id),
            },
          });
        }
      });
      header.appendChild(eye);
    }

    this.div.appendChild(header);
  }
}
