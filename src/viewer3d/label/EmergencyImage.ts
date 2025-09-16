import { Vector3 } from "three";

import {
  CSS3DObject,
  CSS3DSprite,
} from "three/examples/jsm/renderers/CSS3DRenderer.js";
import { userCssStyle, UserCssStyle } from "@/three/config/Three3dConfig";
import { getCardBackgroundUrl } from "@/three/utils/util4UI";

export interface MarkLabelProps {
  markName: string;
}

export class EmergencyImage {
  div = document.createElement("div");
  markLabelProps: MarkLabelProps = {
    markName: "标签名称",
  };

  userDataStyles = {
    ...userCssStyle,
  } as UserCssStyle;

  css3DSprite = new CSS3DSprite(this.div);

  constructor(markLabelProps: MarkLabelProps, userDataStyles: UserCssStyle) {
    this.markLabelProps = markLabelProps;
    this.userDataStyles = userDataStyles;
    this.createDiv();
    this.createCss3dLabel();
  }

  private createCss3dLabel(position = { x: 0, y: 0, z: 0 } as Vector3) {
    const css3DSprite = new CSS3DObject(this.div);
    css3DSprite.name = this.markLabelProps.markName;
    const { cardSize } = this.userDataStyles;
    css3DSprite.scale.set(cardSize, cardSize, cardSize);
    css3DSprite.userData = this.markLabelProps;
    const { x, y, z } = position;
    css3DSprite.position.set(x, y, z);
    css3DSprite.rotation.set(-Math.PI / 2, 0, 0);
    this.css3DSprite = css3DSprite;
    this.css3DSprite.userData = {
      ...this.css3DSprite.userData,
      styles: this.userDataStyles,
    };
  }

  private createDiv() {
    this.div.className = "mark-label mark-label-controller-panel";
    const labelStyle = this.div.style;
    const { cardBackgroundUrl } = this.userDataStyles;
    labelStyle.backgroundImage = getCardBackgroundUrl(cardBackgroundUrl);
    labelStyle.width = this.userDataStyles.cardWidth + "px";
    labelStyle.height = this.userDataStyles.cardHeight + "px";
    labelStyle.backgroundColor = "transparent";
    labelStyle.backgroundRepeat = "no-repeat";
    labelStyle.backgroundPosition = "center center";
  }
}
