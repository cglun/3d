import ListGroup from "react-bootstrap/esm/ListGroup";
import { CardNumber } from "./CardNumber";
import CardImg from "react-bootstrap/esm/CardImg";
import { CardText } from "./CardText";

import { useUpdateScene } from "../../../../app/hooks";
import { getCardBackgroundUrl } from "../../../../three/utils";
import { editorInstance } from "../../../../three/EditorInstance";
import { UserCssStyle } from "../../../../three/Three3dConfig";

export default function CardTop({
  userDataStyles,
}: {
  userDataStyles: UserCssStyle;
}) {
  const { updateScene } = useUpdateScene();

  function updateValue(key: keyof UserCssStyle, val: number | string) {
    const { scene } = editorInstance.getEditor();
    const { userData } = scene;
    if (key === "cardBackgroundColor") {
      userData.userCssStyle.topCard.cardBackgroundUrl = "";
    }
    userData.userCssStyle.topCard[key] = val;
    updateScene(scene);
  }
  const defaultImage3dUrl = new URL(
    "/public/static/images/box.png",
    import.meta.url
  ).href;

  const {
    cardWidth,
    cardHeight,
    cardRadius,
    cardBackgroundColor,
    cardBackgroundUrl,
    headerFontSize,
    headerColor,
    bodyFontSize,
    bodyColor,
    modelHighlightColor,
    offsetX,
    offsetY,
    opacity,
    headerMarginTop,
    headerMarginLeft,
  } = userDataStyles;

  return (
    <>
      <ListGroup horizontal className="d-flex flex-wrap">
        <CardText
          cardKey="modelHighlightColor"
          cardValue={userDataStyles}
          placeholder="模型高亮边框颜色"
          type="color"
          tips="保存后看预览效果"
          getValue={(cardKey, val) => updateValue(cardKey, val)}
        />
        <CardNumber
          cardKey="cardWidth"
          cardValue={userDataStyles}
          placeholder="顶牌宽度"
          getValue={(cardKey, val) => updateValue(cardKey, val)}
        />
        <CardNumber
          cardKey="cardHeight"
          cardValue={userDataStyles}
          placeholder="顶牌高度"
          getValue={(cardKey, val) => updateValue(cardKey, val)}
        />

        <CardNumber
          cardKey="cardSize"
          cardValue={userDataStyles}
          placeholder="顶牌尺寸"
          tips="真实效果要到预览中查看"
          step={0.01}
          getValue={(cardKey, val) => updateValue(cardKey, val)}
        />

        <CardNumber
          cardKey="offsetX"
          cardValue={userDataStyles}
          placeholder="顶牌X轴偏移"
          tips="真实效果要到预览中查看"
          getValue={(cardKey, val) => updateValue(cardKey, val)}
        />

        <CardNumber
          cardKey="offsetY"
          cardValue={userDataStyles}
          placeholder="顶牌Y轴偏移"
          tips="真实效果要到预览中查看"
          getValue={(cardKey, val) => updateValue(cardKey, val)}
        />

        <CardNumber
          cardKey="cardRadius"
          cardValue={userDataStyles}
          placeholder="顶牌圆角"
          getValue={(cardKey, val) => updateValue(cardKey, val)}
        />

        <CardText
          cardKey="cardBackgroundColor"
          cardValue={userDataStyles}
          placeholder="顶牌背景颜色"
          type="color"
          tips="背景图URL将清空"
          getValue={(cardKey, val) => updateValue(cardKey, val)}
        />

        <CardNumber
          cardKey="opacity"
          cardValue={userDataStyles}
          placeholder="背景透明度"
          getValue={(cardKey, val) => updateValue(cardKey, val)}
          min={0}
          step={0.01}
          max={1}
        />
        <CardText
          cardKey="cardBackgroundUrl"
          cardValue={userDataStyles}
          placeholder="顶牌背景图URL地址"
          type="text"
          getValue={(cardKey, val) => updateValue(cardKey, val)}
        />

        <CardText
          cardKey="headerColor"
          cardValue={userDataStyles}
          placeholder="标题颜色"
          type="color"
          getValue={(cardKey, val) => updateValue(cardKey, val)}
        />

        <CardNumber
          cardKey="headerMarginTop"
          cardValue={userDataStyles}
          placeholder="标题上边距"
          getValue={(cardKey, val) => updateValue(cardKey, val)}
        />
        <CardNumber
          cardKey="headerMarginLeft"
          cardValue={userDataStyles}
          placeholder="标题左边距"
          getValue={(cardKey, val) => updateValue(cardKey, val)}
        />

        <CardNumber
          cardKey="headerFontSize"
          cardValue={userDataStyles}
          placeholder="标题字体大小"
          getValue={(cardKey, val) => updateValue(cardKey, val)}
        />

        <CardNumber
          cardKey="bodyFontSize"
          cardValue={userDataStyles}
          placeholder="内容字体大小"
          getValue={(cardKey, val) => updateValue(cardKey, val)}
        />

        <CardText
          cardKey="bodyColor"
          cardValue={userDataStyles}
          placeholder="内容字体颜色"
          type="color"
          getValue={(cardKey, val) => updateValue(cardKey, val)}
        />
      </ListGroup>
      <div
        className="d-flex flex-column align-items-center justify-content-center position-relative"
        style={{
          width: "100%",
          height: "400px",
          overflowY: "auto",
        }}
      >
        <div>
          <CardImg
            src={defaultImage3dUrl}
            style={{
              width: "130px",
              height: "130px",
              backgroundColor: modelHighlightColor,
            }}
          />
        </div>
        <div
          className="mark-label mark-label-controller-panel"
          style={{
            position: "absolute",
            top: 160 + offsetY + "px",
            left: 650 + offsetX + "px",
            width: cardWidth + "px",
            height: cardHeight + "px",

            borderRadius: cardRadius + "px",
            // 使用 rgba 格式设置背景色，结合十六进制颜色和透明度
            backgroundColor: cardBackgroundColor,
            opacity,
            // backgroundColor: `rgba(${parseInt(cardBackgroundColor.slice(1, 3), 16)}, ${parseInt(
            //   cardBackgroundColor.slice(3, 5),
            //   16
            // )}, ${parseInt(cardBackgroundColor.slice(5, 7), 16)}, ${
            //   cardBackgroundAlpha || 1
            // })`,
            backgroundImage: getCardBackgroundUrl(cardBackgroundUrl),

            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
            backgroundSize: "cover",
            padding: `${headerMarginTop}px ${headerMarginLeft}px  `,
            fontSize: bodyFontSize + "px",
            color: bodyColor,
          }}
        >
          <div
            className="mark-label-header"
            style={{
              fontSize: headerFontSize + "px",
              color: headerColor,
            }}
          >
            <i className="bi bi-eye"></i>
            <span className="ms-1">标题信息</span>
          </div>
          <div
            className="mark-label-body"
            style={{
              fontSize: bodyFontSize + "px",
              color: bodyColor,
            }}
          >
            <p>编号：116</p>
            <p>标题：标题</p>
            <p>日期：2008</p>
          </div>
        </div>
      </div>
    </>
  );
}
