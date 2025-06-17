import { Accordion, ListGroup, ListGroupItem } from "react-bootstrap";

import IndexChild, {
  SceneProperty,
} from "@/component/Editor/Property3d/IndexChild";

import { useEffect, useRef } from "react";
import Icon from "@/component/common/Icon";
import { useUpdateScene } from "@/app/hooks";
import { Scene } from "three";

/**
 * 物体属性
 * @returns
 */

export default function Index() {
  const { scene } = useUpdateScene();
  const select = scene.userData.selected3d;
  const refAccordion = useRef<HTMLDivElement>(null);
  const gap = 1;
  useEffect(() => {
    const focusHandler = () => {
      if (refAccordion.current) {
        refAccordion.current.style.overflow = "hidden";
      }
    };
    const mouseLeaveHandler = () => {
      if (refAccordion.current) {
        refAccordion.current.style.overflowY = "scroll";
      }
    };
    let inputList = null;
    if (refAccordion.current) {
      inputList = refAccordion.current.querySelectorAll('input[type="number"]');

      inputList.forEach((input) => {
        input.addEventListener("focus", focusHandler);
        input.addEventListener("click", focusHandler);
        input.addEventListener("mouseleave", mouseLeaveHandler);
      });
    }
    return () => {
      if (refAccordion.current) {
        inputList?.forEach((input) => {
          input.removeEventListener("focus", focusHandler);
          input.removeEventListener("click", focusHandler);
          input.removeEventListener("mouseleave", mouseLeaveHandler);
        });
      }
    };
  }, [select]); // 建议添加依赖数组，避免不必要的重复执行

  return (
    <Accordion.Item eventKey="1" ref={refAccordion}>
      <Accordion.Header>
        <Icon iconName="menu-button" gap={gap} />
        属性
      </Accordion.Header>
      <Accordion.Body id="gui-container-property" className="py-0">
        {/* {select && (
          <ListGroup>
            <ListGroupItem>{select.name}</ListGroupItem>
            <ListGroupItem>
              <SceneProperty />
            </ListGroupItem>
          </ListGroup>
        )} */}
      </Accordion.Body>
    </Accordion.Item>
  );
}
