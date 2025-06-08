import { createLazyFileRoute } from "@tanstack/react-router";
import CodeEditor from "../../component/common/routes/script/CodeEditor";
import { Button, ButtonGroup, ListGroup, ListGroupItem } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useUpdateScene } from "../../app/hooks";
import { getButtonColor, getThemeByScene } from "../../app/utils";
export const Route = createLazyFileRoute("/editor3d/document")({
  component: RouteComponent,
});

function RouteComponent() {
  const codeStr = `

  /* 一、获取列表list(包含场景和模型)
    接口地址：/project/pageList/
     请求方式：POST
     请求参数：
     */
  const params =  {   
      "size": 1000// 获取1000条数据
    }
   //得到场景列表：
    const sceneList = list.filter((item) => {
            if (item.des === "Scene") {
              return item;
            }
          });
  
    //得到模型列表：
    const meshList = list.filter((item) => {
            if (item.des === "Mesh") {
              return item;
            }
          });
  
//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
    //二、与3D交互相关的接口
      //1、引入Viewer3d组件
      import Viewer3d from "remoteApp/Viewer3d";
  
      //2、使用callBack回调函数,获取three实例
      const [threeInstance, setThreeInstance] = useState(null);      
      function callBack(instance ) {
        setThreeInstance(instance);
      }
      //3、获取场景、控制器、相机
     const { scene,controls,camera} = threeInstance;          
    
      //完整事例：到2D项目查看，地址：/src/pages/viewer3d/index.tsx       
    
//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

   /** 三、使用javascript脚本控制与3d交互
      1、获取场景、控制器、相机。*/
      const scene = getScene();
      const controls=getControls();
      const camera=getCamera();  
       

  `;
  const { scene } = useUpdateScene();
  const { themeColor } = getThemeByScene(scene);
  const buttonColor = getButtonColor(themeColor);

  const [code] = useState<string>(codeStr);
  const [show, setShow] = useState(false); // 是否为调试场景[调试场景不允许修改代码]
  useEffect(() => {
    setShow(true);
  }, []);
  return (
    <ListGroup>
      <ListGroupItem>
        {!show && (
          <ButtonGroup size="sm">
            <Button
              variant={buttonColor}
              onClick={() => {
                setShow(true);
              }}
            >
              查看文档
            </Button>
          </ButtonGroup>
        )}
        {show && (
          <ListGroupItem>
            <CodeEditor
              code={code}
              tipsTitle="文档"
              isValidate={false}
              show={show}
              setShow={setShow}
              callback={function (): void {}}
              readOnly={true}
            />
          </ListGroupItem>
        )}
      </ListGroupItem>
    </ListGroup>
  );
}
