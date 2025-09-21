import Button from "react-bootstrap/esm/Button";
import ListGroupItem from "react-bootstrap/esm/ListGroupItem";

import ButtonGroup from "react-bootstrap/esm/ButtonGroup";
import Form from "react-bootstrap/esm/Form";

import { useRef, useState } from "react";
import Toast3d from "@/component/common/Toast3d/Toast3d";
import { getButtonColor, getThemeByScene } from "@/three/utils/util4UI";
import axios from "@/app/http";
import { APP_COLOR, MessageError } from "@/app/type";
import { useUpdateScene } from "@/app/hooks";
import Icon from "@/component/common/Icon";
import { errorMessage } from "@/app/utils";

export function UploadImage({ updateList = () => {} }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [curFile, setCurFile] = useState<File | null>(null);
  const [btn, setBtn] = useState<boolean>(true);
  const { scene } = useUpdateScene();
  const { themeColor } = getThemeByScene(scene);
  const buttonColor = getButtonColor(themeColor);

  async function handleUpload() {
    if (curFile) {
      const formData = new FormData();
      formData.append("file", curFile);

      const model = await uploadModels(formData);

      if (model) {
        axios
          .post("/project/create/", {
            name: model.name,
            des: JSON.stringify({
              type: "Image",
              description: "一张图",
              from: "EDITOR_3D",
            }),
            dataJson: JSON.stringify(model),
            cover: model.cover,
          })
          .then((res) => {
            if (res.data.code === 200) {
              Toast3d("保存成功");
              updateList();
            } else {
              Toast3d(res.data.message, "提示", APP_COLOR.Warning);
            }
          })
          .catch((error: MessageError) => {
            errorMessage(error);
          })
          .finally(() => {
            setBtn(true);
            setCurFile(null);
          });
      }
    }
  }

  function uploadModels(formData: FormData): Promise<{
    id: string;
    name: string;
    cover: string;
  }> {
    return new Promise((resolve, reject) => {
      axios
        .post("/material/upload/116", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          if (res.data.code !== 200) {
            Toast3d(res.data.message, "提示", APP_COLOR.Warning);
            return;
          }
          const { id, url } = res.data.result;
          const model = {
            id,
            name: curFile?.name || "图片名称",
            //cover: `/file/view/${fileId}?thumb=1`,
            cover: url,
          };

          resolve(model);
        })
        .catch((error: MessageError) => {
          reject(error);

          errorMessage(error);
        });
    });
  }

  return (
    <ListGroupItem>
      {btn ? (
        <Form.Group controlId="formFile">
          <Button variant={buttonColor} className="custom-file-upload">
            <Form.Label
              className="custom-file-progress"
              style={{
                cursor: "pointer",
                marginBottom: 0,
              }}
            >
              <Icon iconName="cloud-plus" fontSize={1.6} />
              <em style={{ fontSize: "1.4rem" }}>选择图片</em>
            </Form.Label>
          </Button>
          <Form.Control
            as="input"
            style={{ display: "none", marginBottom: 0 }}
            type="file"
            ref={fileRef}
            accept=".png,.jpg"
            onChange={() => {
              // 检查 fileRef.current 是否存在
              if (
                fileRef.current &&
                fileRef.current.files &&
                fileRef.current.files.length > 0
              ) {
                const curFile = fileRef.current.files[0];
                setCurFile(curFile);
                setBtn(false);
              } else {
                setBtn(true);
              }
            }}
          />
        </Form.Group>
      ) : (
        <div className="ellipsis-3d" style={{ width: "12rem" }}>
          <Form.Text>{curFile?.name}</Form.Text>
        </div>
      )}
      <ButtonGroup size="sm" className="mt-2">
        <Button
          variant={buttonColor}
          disabled={btn}
          onClick={() => {
            // 修改部分：清空文件输入框的值而不是将 current 设为 null
            if (fileRef.current) {
              fileRef.current.value = "";
            }
            setCurFile(null);
            setBtn(true);
          }}
        >
          <Icon iconName="trash2" title="清空" />
        </Button>
        <Button
          variant={buttonColor}
          onClick={() => {
            handleUpload();
          }}
          disabled={btn}
        >
          <Icon iconName="cloud-arrow-up" title="上传" />
        </Button>
      </ButtonGroup>
    </ListGroupItem>
  );
}
