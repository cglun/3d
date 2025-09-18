import React, { useEffect } from "react";
import ListGroup from "react-bootstrap/esm/ListGroup";
import Container from "react-bootstrap/esm/Container";
import { Search3d } from "@/component/common/Search3d";
import _axios from "@/app/http";
import { MessageError, RecordItem } from "@/app/type";
import { errorMessage } from "@/app/utils";

import getPageList from "@/app/httpRequest";
import { UploadImage } from "@/component/routes/image/UploadImage";
import ListImageCard from "@/component/routes/image/ListImageCard";

export default function ImagesList() {
  const [list, setList] = React.useState<RecordItem[]>([]);
  const [filterList, setFilterList] = React.useState<RecordItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [updateTime, setUpdateTime] = React.useState(0);

  useEffect(() => {
    setIsLoading(true);
    getPageList({ name: "3D_PROJECT", type: "Image", description: "图片" })
      .then((res) => {
        if (Array.isArray(res)) {
          setList(res);
          setFilterList(res);
          setIsLoading(false);
        }
      })
      .catch((error: MessageError) => {
        errorMessage(error);
        if (typeof error === "string") {
          setError(error);
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
