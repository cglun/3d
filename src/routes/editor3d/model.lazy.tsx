import { createLazyFileRoute } from "@tanstack/react-router";
import React, { useEffect } from "react";
import ListGroup from "react-bootstrap/esm/ListGroup";
import { Serch3d } from "../../component/Editor/Serch3d";
import { UploadModel } from "../../component/Editor/UploadModel";
import ListCard from "../../component/Editor/ListCard";
import _axios from "../../app/http";
import { Container } from "react-bootstrap";
import { RecordItem } from "../../app/type";

// 定义响应数据的类型
interface ResponseData {
  code: number;
  message: string;
  data: {
    records: {
      id: number;
      name: string;
      des: string;
      cover: string;
    }[];
  };
}

// 更新路由定义，添加 sceneID参数
export const Route = createLazyFileRoute("/editor3d/model")({
  component: ModelList,
});

function ModelList() {
  const [list, setList] = React.useState<RecordItem[]>([]);
  const [filterList, setFilterList] = React.useState<RecordItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [updateTime, setUpdateTime] = React.useState(0);

  useEffect(() => {
    setIsLoading(true);
    _axios
      .post<ResponseData>("/project/pageList/", { size: 1000 })
      .then((res) => {
        if (res.data.code === 200) {
          const message = res.data.message;
          if (message) {
            setError(message);
            return;
          }
          const list = res.data.data.records;
          const sceneList = list.filter((item) => {
            if (item.des === "Mesh") {
              return item;
            }
          });
          setList(sceneList);
          setFilterList(sceneList);
          setIsLoading(false);
        }
      });
  }, [updateTime]);

  function updateList(_time: number): void {
    setUpdateTime(_time);
  }
  // 创建一个适配函数，解决 setFilterList 类型不匹配问题
  const handleFilterList = (newList: RecordItem[]) => {
    const mappedList = newList.map((item) => {
      const foundItem = list.find((listItem) => listItem.name === item.name);
      return foundItem || { id: 0, name: item.name, des: "", cover: "" };
    });
    setFilterList(mappedList);
  };

  // 创建一个适配函数，解决 updateList 类型不匹配问题
  const noArgUpdateList = () => {
    const currentTime = Date.now();
    updateList(currentTime);
  };

  return (
    <Container fluid className="d-flex mt-2">
      <ListGroup>
        {/* 修改部分：使用 handleFilterList 替代 setFilterList */}
        <Serch3d list={list} setFilterList={handleFilterList} type="模型" />
        {/* 修改部分：使用 noArgUpdateList 替代 updateList */}
        <UploadModel updateList={noArgUpdateList} />
      </ListGroup>
      <ListCard
        list={filterList}
        setList={setFilterList}
        isLoading={isLoading}
        error={error}
      ></ListCard>
    </Container>
  );
}
