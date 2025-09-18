import { RecordItem } from "@/app/type";
import { Button, Container } from "react-bootstrap";
import _axios from "@/app/http";
import { ProjectType } from "@/app/httpRequest";
export default function UpdateDateBase({
  pageList,
}: {
  pageList: RecordItem[];
}) {
  return (
    <Container>
      <Button
        onClick={() => {
          pageList.map((item: any) => {
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
              .then((res: any) => {
                if (res.data.data) {
                  console.log(res.data.data);
                }
              });
          });

          localStorage.setItem("upZiDuan", "true");
          setTimeout(() => {
            window.location.reload();
          }, 1010);
        }}
      >
        更新字段
      </Button>
      {pageList.map((item) => (
        <div key={item.id}>
          【{item.id}】{item.name}
        </div>
      ))}
    </Container>
  );
}
