import {
  Badge,
  Form,
  InputGroup,
  ListGroup,
  ListGroupItem,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import {
  ActionItemMap,
  APP_COLOR,
  CustomButtonListType,
  CustomButtonType,
} from "../../../../app/type";
import Icon from "../../Icon";

export default function UiButtonEditor({
  value,
  setValue,
}: {
  value: string;
  setValue: (value: string) => void;
}) {
  let customButtonList: CustomButtonListType | null = null;
  try {
    // 尝试解析 JSON 字符串
    customButtonList = JSON.parse(value);
  } catch (error) {
    console.error("解析JSON 字符串", error);
  }
  if (customButtonList === null) {
    return null; // 返回 null 避免潜在警告
  }
  const toggleButtonGroup = customButtonList.toggleButtonGroup?.listGroup;
  const roamButtonGroup = customButtonList.roamButtonGroup?.listGroup;
  const panelControllerButtonGroup =
    customButtonList.panelControllerButtonGroup?.listGroup;

  // 更新按钮组数据的通用函数
  function updateButtonGroup(
    buttonGroupKey: ButtonGroupKey,
    index: number,
    updateFn: (item: ActionItemMap) => ActionItemMap
  ) {
    // 创建 customButtonList 的副本
    const newCustomButtonList = { ...customButtonList };

    // 创建按钮组列表的副本
    const newListGroup = [...newCustomButtonList[buttonGroupKey]!.listGroup];
    // 创建当前按钮项的副本并更新
    newListGroup[index] = updateFn({ ...newListGroup[index] });
    // 更新副本中的按钮组列表
    newCustomButtonList[buttonGroupKey]!.listGroup = newListGroup;
    return newCustomButtonList;
  }
  type ButtonGroupKey =
    | "toggleButtonGroup"
    | "roamButtonGroup"
    | "panelControllerButtonGroup";
  function buttonGroupDiv(
    buttonGroup: ActionItemMap[],
    buttonGroupKey:
      | "toggleButtonGroup"
      | "roamButtonGroup"
      | "panelControllerButtonGroup"
  ) {
    return (
      <>
        {buttonGroup?.length > 0 &&
          getBadgeByType(customButtonList?.[buttonGroupKey]?.type || "TOGGLE")}
        <ListGroup horizontal className="mt-2 d-flex flex-wrap">
          {buttonGroup?.map((item, index) => {
            return (
              <ListGroupItem key={index} style={{ padding: 0, border: 0 }}>
                <InputGroup>
                  <InputGroup.Text
                    title="显示或隐藏按钮"
                    onClick={() => {
                      const newCustomButtonList = updateButtonGroup(
                        buttonGroupKey,
                        index,
                        (item) => ({ ...item, showButton: !item.showButton })
                      );
                      setValue(JSON.stringify(newCustomButtonList));
                    }}
                  >
                    <Icon
                      iconName={item.showButton ? "eye" : "eye-slash"}
                      title={item.showButton ? "按钮已显示" : "按钮已隐藏"}
                    />
                  </InputGroup.Text>
                  {!item.NAME_ID.includes("_AN_") &&
                    buttonGroupKey !== "panelControllerButtonGroup" && (
                      <InputGroup.Text
                        onClick={() => {
                          const newCustomButtonList = updateButtonGroup(
                            buttonGroupKey,
                            index,
                            (item) => ({
                              ...item,
                              groupCanBeRaycast: !item.groupCanBeRaycast,
                            })
                          );
                          setValue(JSON.stringify(newCustomButtonList));
                        }}
                      >
                        <OverlayTrigger
                          delay={{ show: 250, hide: 250 }}
                          overlay={
                            <Tooltip>
                              {item.groupCanBeRaycast ? "能" : "不能"} 选中
                              {item.NAME_ID}
                              模型组
                            </Tooltip>
                          }
                        >
                          <Form>
                            <Form.Check
                              defaultChecked={item.groupCanBeRaycast}
                              id={`check-${item.NAME_ID}`}
                              type="switch"
                            ></Form.Check>
                          </Form>
                        </OverlayTrigger>
                      </InputGroup.Text>
                    )}

                  {Array.isArray(item.showName)
                    ? item.showName.map((_item, innerIndex) => {
                        return (
                          <Form.Control
                            key={innerIndex}
                            placeholder={_item}
                            aria-label={_item}
                            aria-describedby={_item}
                            value={_item}
                            onChange={(e) => {
                              const newCustomButtonList = updateButtonGroup(
                                buttonGroupKey,
                                index,
                                (item) => {
                                  const newShowName = [
                                    ...(item.showName as string[]),
                                  ];
                                  newShowName[innerIndex] = e.target.value;
                                  return { ...item, showName: newShowName };
                                }
                              );
                              setValue(JSON.stringify(newCustomButtonList));
                            }}
                          />
                        );
                      })
                    : renderSingleShowName(item, index, buttonGroupKey)}
                </InputGroup>
              </ListGroupItem>
            );
          })}
        </ListGroup>
      </>
    );
  }

  function renderSingleShowName(
    item: ActionItemMap,
    index: number,
    buttonGroupKey: ButtonGroupKey
  ) {
    return (
      <Form.Control
        placeholder={item.NAME_ID}
        aria-label={item.NAME_ID}
        aria-describedby={item.NAME_ID}
        value={item.showName}
        onChange={(e) => {
          const newCustomButtonList = updateButtonGroup(
            buttonGroupKey,
            index,
            (item) => ({ ...item, showName: e.target.value })
          );
          setValue(JSON.stringify(newCustomButtonList));
        }}
      />
    );
  }

  function getBadgeByType(buttonGroup: CustomButtonType) {
    const name = "按钮组-";
    const typeName = {
      TOGGLE: `${name}切换`,
      DRAWER: `${name}拉伸`,
      STRETCH: `${name}拉伸`,
      ROAM: `${name}漫游`,
      PANEL_CONTROLLER: `${name}面板控制器`,
    };

    return <Badge bg={APP_COLOR.Primary}>{typeName[buttonGroup]}</Badge>;
  }

  return (
    <>
      {/* {canBeSelectedDiv(canBeSelectedGroup)} */}
      {buttonGroupDiv(toggleButtonGroup, "toggleButtonGroup")}
      {buttonGroupDiv(roamButtonGroup, "roamButtonGroup")}
      {buttonGroupDiv(panelControllerButtonGroup, "panelControllerButtonGroup")}
    </>
  );
}
