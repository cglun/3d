import { memo } from "react";
import { Button, ButtonGroup, Card, Container, Spinner } from "react-bootstrap";
import AlertBase from "../common/AlertBase";
import { getThemeByScene } from "../../app/utils";
import { APP_COLOR, GlbModel, RecordItem } from "../../app/type";
import ModalConfirm3d from "../common/ModalConfirm3d";
import Toast3d from "../common/Toast3d";
import EditorForm from "../common/EditorForm";
import axios, { loadAssets } from "../../app/http";
import { setScene, getScene } from "../../three/init3dEditor";

import { getProjectData, glbLoader, getG2 } from "../../three/utils";
import { useUpdateScene } from "../../app/hooks";

import { createNewScene } from "../../three/factory3d";
import Trigger3d from "../common/Trigger3d";

import { useLocation, useNavigate } from "@tanstack/react-router";
import Icon from "../common/Icon";
import { editorInstance } from "../../three/EditorInstance";
import { enableShadow } from "../../three/common3d";

interface Props {
  list: RecordItem[];
  setList: (list: RecordItem[]) => void;
  isLoading: boolean;
  error: string;
}
function RecordItemCard(props: Props) {
  const { list, setList, isLoading, error } = props;
  const { scene, updateScene } = useUpdateScene();
  const { themeColor } = getThemeByScene(scene);
  const navigate = useNavigate();
  const location = useLocation();

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
              const { projectId } = getScene().userData;
              if (item.id === projectId) {
                const newScene = createNewScene();
                setScene(newScene);
                updateScene(newScene);
              }
            } else {
              Toast3d(res.data, "提示", APP_COLOR.Warning);
            }
          })
          .catch((error) => {
            Toast3d(error, "提示", APP_COLOR.Warning);
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
        body: <EditorForm item={item} getNewItem={getNewItem} />,
      },
      () => {
        axios
          .post(`/project/update/`, {
            id: item.id,
            name: newI.name,
            des: newI.des,
            cover: loadAssets(newI.cover),
          })
          .then((res) => {
            if (res.data.data) {
              Toast3d(`【${item.name}】已修改`);
            } else {
              Toast3d(res.data, "提示", APP_COLOR.Warning);
            }
          })
          .catch((error) => {
            Toast3d(error, "提示", APP_COLOR.Warning);
          });

        Toast3d(`【${item.name}】已修改 `);
      }
    );
  }

  function loadMesh(item: RecordItem) {
    getProjectData(item.id)
      .then((res: string) => {
        // loadOneModel(JSON.parse(res), scene);
        const { scene, camera } = editorInstance.getEditor();
        const { parameters3d } = scene.userData;
        const model = JSON.parse(res) as GlbModel;
        const loader = glbLoader();

        loader.load(
          model.userData.modelUrl + "?url",
          function (gltf) {
            const group = getG2(model, gltf, scene);
            enableShadow(group, scene);
            scene.add(group);

            //  getProgress(100);
          },
          function (xhr) {
            const progress = parseFloat(
              ((xhr.loaded / model.userData.modelTotal) * 100).toFixed(2)
            );
          },
          function (error) {}
        );
      })
      .catch((error) => {
        Toast3d(error, "提示", APP_COLOR.Danger);
      });
  }

  //默认图片
  const defaultImage3dUrl = new URL(
    "/static/images/defaultImage3d.png",
    import.meta.url
  ).href;

  //获取url的参数 值
  const urlParams = new URLSearchParams(window.location.search);
  const sceneId = urlParams.get("sceneId");

  return (
    <Container fluid className="d-flex flex-wrap">
      {list.map((item: RecordItem, index: number) => {
        let selectStyle =
          item.des === "Scene" && scene.userData.projectId === item.id
            ? "bg-success"
            : "";

        if (sceneId && sceneId === item.id.toString()) {
          selectStyle = "bg-success";
        }

        const cardBodyImg = (
          <Card.Img
            src={loadAssets(item.cover)}
            variant="top"
            style={{ cursor: "crosshair", width: "6rem" }}
          />
        );

        const defaultImage3d = (
          <Card.Img
            src={defaultImage3dUrl}
            variant="top"
            style={{ cursor: "crosshair", width: "6rem" }}
          />
        );
        //<i className="bi bi-image" style={{ fontSize: "4rem" }}></i>
        const cardBody =
          item.cover?.trim().length > 0 ? cardBodyImg : defaultImage3d;

        return (
          <Card className="ms-2 mt-2" key={index}>
            <Card.Header style={{ width: "6rem" }} className={selectStyle}>
              {item.name.trim() === "" ? (
                <span className="text-warning"> 未命名</span>
              ) : (
                <Trigger3d
                  title={
                    (item.des === "Scene" ? item.id + "_" : "") + item.name
                  }
                />
              )}
            </Card.Header>
            <Card.Body
              className="d-flex flex-column text-center"
              style={{ padding: "0" }}
            >
              <div
                onClick={() => {
                  const pathname = location.pathname;

                  if (item.des === "Scene") {
                    const url = `${pathname}?sceneId=${item.id}`;
                    navigate({
                      to: url,
                    });
                    return;
                  }

                  loadMesh(item);
                }}
              >
                {cardBody}
              </div>

              <ButtonGroup aria-label="Basic example" className="mt-2">
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
export default memo(RecordItemCard);
