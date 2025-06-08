import React, { useContext, useEffect } from "react";
import { HTTP_TYPE } from "./type";
import { MyContext } from "./MyContext";
import { PerspectiveCamera, Scene } from "three";

export default function useFetch(url: string, type: HTTP_TYPE) {
  const [data, setData] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch("/api", {
      method: type,
      headers: {
        Authorization: `Bearer  APP_CONFIG.TOKEN`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setData(data.payload);
        //console.log(data);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [url, type]); // 添加 'type' 到依赖项数组

  return { data, isLoading, error };
}

export function useUpdateScene() {
  const { scene, dispatchScene } = useContext(MyContext);
  // 定义一个泛型 T 来替代 any 类型
  function updateScene<T extends Scene>(payload: T) {
    dispatchScene({ type: "setScene", payload: payload });
  }
  return { scene: scene.payload, updateScene };
}

export function useUpdateCamera() {
  const { camera, dispatchCamera } = useContext(MyContext);
  // 定义一个泛型 T 来替代 any 类型
  function updateCamera<T extends PerspectiveCamera>(payload: T) {
    dispatchCamera({ type: "setCamera", payload: payload });
  }
  return { camera: camera.payload, updateCamera };
}
