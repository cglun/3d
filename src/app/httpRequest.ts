import _axios from "@/app/http";
import { MessageError, RecordItem, ResponseData } from "@/app/type";

export type ProjectType = {
  name: "3D_PROJECT";
  type: "Mesh" | "Scene" | "Image";
  description: string;
};

// 获取项目列表
export default async function getPageList(
  project: ProjectType = {
    name: "3D_PROJECT",
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
            if (item.des === project.type) {
              return item;
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
