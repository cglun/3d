import { memo } from "react";
import Spinner from "react-bootstrap/esm/Spinner";
import Container from "react-bootstrap/esm/Container";
import Card from "react-bootstrap/esm/Card";
import ButtonGroup from "react-bootstrap/esm/ButtonGroup";
import Button from "react-bootstrap/esm/Button";
import AlertBase from "@/component/common/AlertBase";
import { APP_COLOR, MessageError, RecordItem } from "@/app/type";
import ModalConfirm3d from "@/component/common/ModalConfirm3d";
import Toast3d from "@/component/common/Toast3d/Toast3d";
import axios, { loadAssets } from "@/app/http";
import { useUpdateScene } from "@/app/hooks";
import Trigger3d from "@/component/common/Trigger3d";
import Icon from "@/component/common/Icon";
import { getThemeByScene } from "@/three/utils/util4UI";
import { errorMessage } from "@/app/utils";
import EditorFormImage from "@/component/routes/image/EditorFormImage";

interface Props {
  list: RecordItem[];
  setList: (list: RecordItem[]) => void;
  isLoading: boolean;
  error: string;
}
function ListImageCard(props: Props) {
  const { list, setList, isLoading, error } = props;
  const { scene } = useUpdateScene();

  const { themeColor } = getThemeByScene(scene);

  //错误提示
  if (error.trim().length > 0) {
    return <AlertBase type={APP_COLOR.Warning} text={error} />;
  }

  //加载中……
  if (isLoading) {
    return <Spinner animation="grow" />;
  }

  //无数据
  if (list.length === 0) {
    return <AlertBase type={APP_COLOR.Warning} text={"无数据"} />;
  }

  function deleteBtn(item: RecordItem, index: number) {
    ModalConfirm3d(
      {
        title: "删除",
        body: <AlertBase type={APP_COLOR.Danger} text={item.name} />,
      },
      () => {
        axios
          .get(`/project/del/${item.id}`)
          .then((res) => {
            if (res.data.code === 200) {
              const newList = list.filter((_, i) => i !== index);
              setList(newList);
              Toast3d(`【${item.name}】已删除`);
            } else {
              Toast3d(res.data, "提示", APP_COLOR.Danger);
            }
          })
          .catch((error: MessageError) => {
            errorMessage(error);
          });
      }
    );
  }

  function editorBtn(item: RecordItem, _index: number) {
    let newI = { ...item };
    function getNewItem(_newItem: RecordItem) {
      const newList = list.map((item, index) => {
        if (index === _index) {
          newI = _newItem;
          return _newItem;
        }
        return item;
      });
      setList(newList);
    }

    ModalConfirm3d(
      {
        title: "编辑",
        body: <EditorFormImage item={item} getNewItem={getNewItem} />,
      },
      () => {
        axios
          .post(`/project/update/`, {
            id: item.id,
            name: newI.name,
          })
          .then((res) => {
            if (res.data.data) {
              Toast3d(`【${item.name}】已修改`);
            } else {
              Toast3d(res.data, "提示", APP_COLOR.Warning);
            }
          })
          .catch((error: MessageError) => {
            errorMessage(error);
          });

        Toast3d(`【${item.name}】已修改 `);
      }
    );
  }

  //默认图片
  const defaultImage3dUrl = new URL(
    "@static/images/defaultImage3d.png",
    import.meta.url
  ).href;

  return (
    <Container fluid className="d-flex flex-wrap">
      {list.map((item: RecordItem, index: number) => {
        const cardBodyImg = (
          <Card.Img
            src={loadAssets(item.cover)}
            variant="top"
            style={{ cursor: "crosshair", height: "6rem", width: "auto" }}
          />
        );

        const defaultImage3d = (
          <Card.Img
            src={defaultImage3dUrl}
            variant="top"
            style={{ cursor: "crosshair", height: "6rem", width: "auto" }}
          />
        );
        //<i className="bi bi-image" style={{ fontSize: "4rem" }}></i>
        const cardBody =
          item.cover?.trim().length > 0 ? cardBodyImg : defaultImage3d;

        return (
          <Card className="ms-2 mt-2" key={index}>
            <Card.Header style={{ width: "auto" }}>
              {item.name.trim() === "" ? (
                <span className="text-warning"> 未命名</span>
              ) : (
                <Trigger3d title={item.name} width="6rem" />
              )}
            </Card.Header>
            <Card.Body
              className="d-flex flex-column text-center"
              style={{ padding: "0" }}
            >
              <div>{cardBody}</div>

              <ButtonGroup aria-label="Basic example" className="mt-2">
                <Button
                  variant={themeColor}
                  size="sm"
                  onClick={async () => {
                    try {
                      const imageSrc = loadAssets(item.cover);
                      await navigator.clipboard.writeText(imageSrc);

                      Toast3d("图片地址已复制");
                    } catch (err) {
                      console.error("Failed to copy: ", err);
                      Toast3d("复制失败", "提示", APP_COLOR.Danger);
                    }
                  }}
                >
                  <Icon iconName="bi bi-copy" title="复制图片地址" />
                </Button>

                <Button
                  variant={themeColor}
                  size="sm"
                  onClick={() => editorBtn(item, index)}
                >
                  <Icon iconName="pencil" title="编辑" />
                </Button>

                <Button
                  variant={themeColor}
                  size="sm"
                  onClick={() => deleteBtn(item, index)}
                >
                  <Icon iconName="trash" title="删除" />
                </Button>
              </ButtonGroup>
            </Card.Body>
          </Card>
        );
      })}
    </Container>
  );
}
export default memo(ListImageCard);
