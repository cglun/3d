import React, { useEffect } from "react";
import ListGroup from "react-bootstrap/esm/ListGroup";
import Container from "react-bootstrap/esm/Container";
import { Search3d } from "@/component/common/Search3d";
import _axios from "@/app/http";
import { MessageError, RecordItem, ResponseData } from "@/app/type";
import { errorMessage } from "@/app/utils";
import { UploadImage } from "@/component/routes/extend/extendButton/imagesList/UploadImage";
import ListImageCard from "@/component/routes/extend/extendButton/imagesList/ListImageCard";

export default function ImagesList() {
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
            if (item.des === "Image") {
              return item;
            }
          });
          setList(sceneList);
          setFilterList(sceneList);
          setIsLoading(false);
        }
      })
      .catch((error: MessageError) => {
        errorMessage(error);
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
        <Search3d list={list} setFilterList={handleFilterList} type="图片" />
        {/* 修改部分：使用 noArgUpdateList 替代 updateList */}
        <UploadImage updateList={noArgUpdateList} />
      </ListGroup>
      <ListImageCard
        list={filterList}
        setList={setFilterList}
        isLoading={isLoading}
        error={error}
      ></ListImageCard>
    </Container>
  );
}
