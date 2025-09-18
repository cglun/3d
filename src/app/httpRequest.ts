import _axios from "@/app/http";
import { MessageError, RecordItem, ResponseData } from "@/app/type";

export type ProjectType = {
  from: "EDITOR_3D";
  type: "Mesh" | "Scene" | "Image" | string;
  description: string;
};

// 获取项目列表
export default async function getPageList(
  project: ProjectType = {
    from: "EDITOR_3D",
    type: "Image",
    description: "3d项目",
  }
) {
  return new Promise((resolve, reject) => {
    _axios
      .post<ResponseData>("/project/pageList/", { size: 1000 })
      .then((res) => {
        if (res.data.code === 200) {
          const message = res.data.message;
          if (message) {
            reject(message);
            return;
          }
          const list = res.data.data.records;
          const sceneList = list.filter((item: RecordItem) => {
            if (item.des.includes("EDITOR_3D")) {
              //const res = JSON.parse(item.des);
              if (item.des.includes(project.type)) {
                return item;
              }
            }
          });
          resolve(sceneList);
        }
      })
      .catch((error: MessageError) => {
        reject(error);
      });
  });
}
