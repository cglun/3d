import ListGroup from "react-bootstrap/esm/ListGroup";
import { CardNumber } from "./CardNumber";
import { CardText } from "./CardText";
import { UserStyles } from "../../../../app/type";
import { getScene } from "../../../../three/init3dEditor";
import { useUpdateScene } from "../../../../app/hooks";
import { getCardBackgroundUrl } from "../../../../three/utils";
import { SceneUserData } from "../../../../three/Three3dConfig";

export default function CardMark({
  userDataStyles,
}: {
  userDataStyles: UserStyles;
}) {
  const { updateScene } = useUpdateScene();
  function updateValue(key: keyof UserStyles, val: number | string) {
    const _userData = getScene().userData as SceneUserData;
    if (key === "cardBackgroundColor") {
      _userData.userCssStyleTopCard.cardBackgroundUrl = "";
    }
    (_userData.userCssStyleTopCard as any)[key] = val;
    updateScene(getScene());
  }

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
    offsetX,
    offsetY,
    opacity,
    headerMarginTop,
    headerMarginLeft,
  } = userDataStyles;

  return (
    <>
      <ListGroup horizontal className="d-flex flex-wrap">
        <CardNumber
          cardKey="cardWidth"
          cardValue={userDataStyles}
          placeholder="标签宽度"
          getValue={(cardKey, val) => updateValue(cardKey, val)}
        />
        <CardNumber
          cardKey="cardHeight"
          cardValue={userDataStyles}
          placeholder="标签高度"
          getValue={(cardKey, val) => updateValue(cardKey, val)}
        />
        <CardNumber
          cardKey="cardSize"
          cardValue={userDataStyles}
          placeholder="标签尺寸"
          tips="真实效果要到预览中查看"
          step={0.01}
          getValue={(cardKey, val) => updateValue(cardKey, val)}
        />

        <CardNumber
          cardKey="cardRadius"
          cardValue={userDataStyles}
          placeholder="标签圆角"
          getValue={(cardKey, val) => updateValue(cardKey, val)}
        />
        <CardText
          cardKey="cardBackgroundColor"
          cardValue={userDataStyles}
          placeholder="标签背景颜色"
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
          placeholder="标签背景图URL地址"
          type="text"
          getValue={(cardKey, val) => updateValue(cardKey, val)}
        />
        <CardText
          cardKey="headerColor"
          cardValue={userDataStyles}
          placeholder="字体颜色"
          type="color"
          getValue={(cardKey, val) => updateValue(cardKey, val)}
        />
        <CardNumber
          cardKey="headerMarginTop"
          cardValue={userDataStyles}
          placeholder="上边距"
          getValue={(cardKey, val) => updateValue(cardKey, val)}
        />
        <CardNumber
          cardKey="headerMarginLeft"
          cardValue={userDataStyles}
          placeholder="左边距"
          getValue={(cardKey, val) => updateValue(cardKey, val)}
        />
        <CardNumber
          cardKey="headerFontSize"
          cardValue={userDataStyles}
          placeholder="字体大小"
          getValue={(cardKey, val) => updateValue(cardKey, val)}
        />
      </ListGroup>
      <div
        className="d-flex flex-column align-items-center justify-content-center "
        style={{
          width: "100%",
          height: "400px",
          overflowY: "auto",
        }}
      >
        <div
          className="mark-label mark-label-controller-panel"
          style={{
            top: offsetY + "px",
            left: offsetX + "px",
            width: cardWidth + "px",
            lineHeight: cardHeight + "px",
            borderRadius: cardRadius + "px",
            // 使用 rgba 格式设置背景色，结合十六进制颜色和透明度
            backgroundColor: cardBackgroundColor,
            opacity,
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
            <span className="ms-1" title="字体信息">
              字体信息
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
