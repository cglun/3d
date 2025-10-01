import { APP_COLOR, MessageError, RecordItem, ResponseData } from "@/app/type";
import { Button, Container } from "react-bootstrap";
import _axios from "@/app/http";
import { ProjectType } from "@/app/httpRequest";
import { useEffect, useState } from "react";
export default function UpdateDateBase() {
  const [pageList, setPageList] = useState<RecordItem[]>([]);
  useEffect(() => {
    _axios
      .post<ResponseData>("/project/pageList/", { size: 1000 })
      .then((res) => {
        if (res.data.code === 200) {
          const message = res.data.message;
          if (message) {
            setPageList([]);
          }
          const list = res.data.data.records;
          const sceneList = list.filter((item: RecordItem) => {
            if (
              item.des === "Scene" ||
              item.des === "Mesh" ||
              item.des === "Image"
            ) {
              return item;
            }
          });
          setPageList(sceneList);
        }
      })
      .catch((error: MessageError) => {
        console.error(error);
      });
  }, []);
  return (
    <Container>
      <Button
        disabled={!(pageList.length > 0)}
        variant={APP_COLOR.Success}
        onClick={() => {
          pageList.map((item: RecordItem) => {
            const description: ProjectType = {
              type: item.des,
              description: "说明：" + item.des,
              from: "EDITOR_3D",
            };
            _axios
              .post(`/project/update/`, {
                id: item.id,
                des: JSON.stringify(description),
              })

              .then(
                (res: {
                  data: {
                    data: string;
                  };
                }) => {
                  if (res.data.data) {
                    console.log(res.data.data);
                  }
                }
              );
          });

          setTimeout(() => {
            window.location.reload();
          }, 1010);
        }}
      >
        {pageList.length > 0 ? "更新" : "暂无更新"}
      </Button>
      {pageList.map((item) => (
        <div key={item.id}>
          【{item.id}】{item.name}
        </div>
      ))}
    </Container>
  );
}
