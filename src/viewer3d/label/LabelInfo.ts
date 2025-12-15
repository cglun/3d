import { CatmullRomCurve3, Object3D, Object3DEventMap, Vector3 } from "three";
import { TourWindow } from "@/app/MyContext";

import { CSS3DSprite } from "three/addons/renderers/CSS3DRenderer.js";
import { getObjectWorldPosition } from "@/three/utils/utils";

import { UserCssStyle, userCssStyle } from "@/three/config/Three3dConfig";

import { getCardBackgroundUrl, setClassName } from "@/three/utils/util4UI";

import { LineGeometry, LineMaterial, Line2 } from "three/addons/Addons.js";
import { hexToRgb } from "@/component/routes/effects/utils";

export class LabelInfo {
  mesh;
  div = document.createElement("div");
  userDataStyles = { ...userCssStyle };
  name = "";
  tourObject = {
    id: "id",
    title: "title",
  };
  formItem = {
    pallet_code: "000071",
    core_code: "HC100_2",
    project_id: "9e87e09d-e788-11ef-966c-347379a081b8",
    data_id: "3bff82d1-201b-11f0-b126-347379a081b8",
    archives_id: "cc08c89d-264e-4698-aa95-3b960aede2f5",
    core_box_code: 31,
    storehouse: "北库房",
    location_code: "20-002-002",
  };

  css3DSprite = new CSS3DSprite(this.div);
  dispatchTourWindow: React.Dispatch<TourWindow>;
  trigger?: (params: string) => void;

  constructor(
    mesh: Object3D<Object3DEventMap>,
    userDataStyles: UserCssStyle,
    dispatchTourWindow: React.Dispatch<TourWindow>,
    formItem?: typeof this.formItem,
    trigger?: (params: string) => void
  ) {
    this.mesh = mesh;
    this.dispatchTourWindow = dispatchTourWindow;
    this.trigger = trigger;

    //  const _userData = scene.userData as SceneUserData;
    // this.userDataStyles = _userData.userCssStyle.topCard;
    this.userDataStyles = userDataStyles;
    // this.size = _userData.userCssStyleTopCard.cardSize;
    this.init(formItem || this.formItem);
  }
  init(formItem: typeof this.formItem) {
    // this.tourObject.title = getObjectNameByName(this.mesh);

    this.formItem = formItem;
    this.createDiv();
    this.createCss3dLabel();
  }
  private createCss3dLabel() {
    const css3DSprite = new CSS3DSprite(this.div);
    // 标签名称为 location_code
    /**  
      设置 CSS3DSprite 的名称为标签的 location_code，以便后续通过名称进行识别和操作。
       */

    css3DSprite.name = "SPRITE-" + this.mesh.name;
    const { x, y, z } = getObjectWorldPosition(this.mesh);
    css3DSprite.position.set(x, y, z);
    const { cardSize } = this.userDataStyles;
    css3DSprite.scale.set(cardSize, cardSize, cardSize);

    this.css3DSprite = css3DSprite;
  }

  private createDiv() {
    this.div.className = `mark-label mark-label-controller-panel`;
    this.div.id = `SPRITE-${this.mesh.name}`;
    const labelStyle = this.div.style;
    const {
      headerFontSize,
      cardRadius,
      cardBackgroundColor,
      cardBackgroundUrl,
      cardBackgroundWidth,
      cardBackgroundHeight,
      bodyFontSize,
      headerColor,
      cardHeight,
      cardWidth,
      headerMarginTop,
      headerMarginLeft,
      offsetX,
      offsetY,
      enableCardBackgroundUrl,
      opacity,
      bodyColor,
      codeString,
    } = this.userDataStyles;

    labelStyle.width = cardWidth + "px";
    labelStyle.height = cardHeight + "px";
    labelStyle.paddingLeft = headerMarginLeft + "px";
    labelStyle.paddingTop = headerMarginTop + "px ";

    //labelStyle.paddingLeft = headerMarginTop + "px " + headerMarginLeft + "px";
    labelStyle.borderRadius = cardRadius + "px";
    labelStyle.backgroundColor = `rgba(${hexToRgb(cardBackgroundColor)}, ${opacity})`;
    labelStyle.backgroundPosition = "center center";
    labelStyle.backgroundSize = "cover";
    if (enableCardBackgroundUrl) {
      labelStyle.backgroundImage = getCardBackgroundUrl(cardBackgroundUrl);
      labelStyle.backgroundSize =
        cardBackgroundWidth + "%" + " " + cardBackgroundHeight + "%";
      labelStyle.backgroundColor = "transparent";

      labelStyle.backgroundPosition = "0 0";
      labelStyle.backgroundRepeat = "no-repeat";
      labelStyle.backgroundOrigin = "padding-box";
    }

    labelStyle.fontSize = bodyFontSize + "px";
    labelStyle.color = headerColor;
    //const { x, y, z } = getObjectWorldPosition(this.mesh);

    labelStyle.top = offsetY + "px";
    labelStyle.left = offsetX + "px";
    if (cardBackgroundUrl.trim().length === 0) {
      labelStyle.backgroundColor = `${cardBackgroundColor}`;
      labelStyle.backgroundImage = "";
    }

    const header = document.createElement("div");
    header.className = "mark-label-header";
    header.style.fontSize = headerFontSize + "px";
    header.style.color = headerColor;
    // header.style.marginTop = headerMarginTop + "px";
    // header.style.marginLeft = headerMarginLeft + "px";

    const eye = document.createElement("i");
    eye.className = setClassName("eye");
    eye.style.cursor = "pointer";

    eye.setAttribute("data-tour-id", this.tourObject.id);

    // eye.addEventListener("click", () => {
    // 使用箭头函数保证 this 指向实例
    // if (this.dispatchTourWindow) {
    //   this.dispatchTourWindow({
    //     type: "tourWindow",
    //     payload: {
    //       show: true,
    //       title: this.tourObject.title,
    //       tourSrc: getTourSrc(this.tourObject.id),
    //     },
    //   });
    // }

    // if (this.trigger) {
    //   this.trigger(this.formItem.core_code.toString());
    // }
    // });
    header.appendChild(eye);

    const title = document.createElement("span");
    title.style.fontSize = headerColor + "px";
    title.style.color = headerColor;
    title.className = "ms-1";
    // title.textContent = this.formItem.district;

    const container = document.createElement("div");
    container.className = "mark-label-body";
    container.style.fontSize = bodyFontSize + "px";
    //container.style.marginLeft = headerMarginLeft + "px";
    container.style.color = bodyColor;

    new Function("title", "container", "formItem", "fontColor", codeString)(
      title,
      container,
      this.formItem,
      this.userDataStyles.bodyColor
    );
    header.appendChild(title);

    this.div.appendChild(header);
    this.div.appendChild(container);
  }
  setName(name: string) {
    this.name = name;
  }
  createLine(color: string) {
    // const a=new Vector3(this., 0, 0);
    const { x, y, z } = getObjectWorldPosition(this.mesh);
    const { offsetY, cardSize } = this.userDataStyles;
    const size = cardSize;
    const start = new Vector3(x, y, z);
    const end = new Vector3(x, y - offsetY * size, z);

    const vector = [start, end];
    // const vector = [start.multiply(this.size), end.multiply(this.size)];
    const curve = new CatmullRomCurve3(vector);
    // const curve = new CatmullRomCurve3(vector, true);

    const points = curve.getPoints(50);
    const lineWidth = 3; // 线条宽度
    // 使用 LineGeometry
    const geometry = new LineGeometry();
    geometry.setPositions(points.flatMap((p) => [p.x, p.y, p.z]));

    const material = new LineMaterial({
      color,
      linewidth: lineWidth,
      transparent: true, // 开启透明度
      opacity: 0.8, // 设置透明度，让线条有发光感
    });
    // 在渲染器初始化后设置分辨率
    material.resolution.set(window.innerWidth, window.innerHeight);
    material.depthTest = false;

    // 创建 Line2 对象
    const line = new Line2(geometry, material);
    line.visible = true;
    return line;
  }
}
