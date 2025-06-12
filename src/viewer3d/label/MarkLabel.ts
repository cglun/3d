import { Vector3 } from "three";
import { TourWindow } from "../../app/MyContext";
import { setClassName } from "../../app/utils";
import { getCardBackgroundUrl } from "../../three/utils";
import { CSS3DSprite } from "three/examples/jsm/renderers/CSS3DRenderer.js";

import { UserStyles } from "../../app/type";
import { SceneUserData } from "../../three/Three3dConfig";
import { editorInstance } from "../../three/EditorInstance";

export class MarkLabel {
  div = document.createElement("div");

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
  markName = "标注名称";
  logo = "geo-alt";

  css3DSprite = new CSS3DSprite(this.div);
  dispatchTourWindow: React.Dispatch<TourWindow>;

  constructor(
    dispatchTourWindow: React.Dispatch<TourWindow>,
    markName: string,
    logo: string
  ) {
    this.dispatchTourWindow = dispatchTourWindow;
    const { scene } = editorInstance.getEditor();

    const _userData = scene.userData as SceneUserData;

    this.userDataStyles = _userData.userCssStyle.markLabel;
    this.markName = markName;
    this.logo = logo;

    this.init();
  }
  init() {
    this.createDiv();
    this.createCss3dLabel();
  }
  private createCss3dLabel(position = { x: 0, y: 0, z: 0 } as Vector3) {
    const css3DSprite = new CSS3DSprite(this.div);
    css3DSprite.name = "MARK_" + this.markName;
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

    const eye = document.createElement("i");

    eye.className = setClassName(this.logo);

    header.appendChild(eye);

    const title = document.createElement("span");
    title.style.fontSize = this.userDataStyles.headerColor + "px";
    title.style.color = this.userDataStyles.headerColor;
    title.className = "ms-1";
    title.textContent = this.markName;
    header.appendChild(title);

    this.div.appendChild(header);
  }
}
