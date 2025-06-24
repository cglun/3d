import { Accordion } from "react-bootstrap";

import Icon from "@/component/common/Icon";

/**
 * 物体属性
 * @returns
 */

export default function Index_xx() {
  // const { scene } = useUpdateScene();

  // const refAccordion = useRef<HTMLDivElement>(null);
  // const gap = 1;
  // useEffect(() => {
  //   const focusHandler = () => {
  //     if (refAccordion.current) {
  //       refAccordion.current.style.overflow = "hidden";
  //     }
  //   };
  //   const mouseLeaveHandler = () => {
  //     if (refAccordion.current) {
  //       refAccordion.current.style.overflowY = "scroll";
  //     }
  //   };
  //   let inputList = null;
  //   if (refAccordion.current) {
  //     inputList = refAccordion.current.querySelectorAll('input[type="number"]');

  //     inputList.forEach((input) => {
  //       input.addEventListener("focus", focusHandler);
  //       input.addEventListener("click", focusHandler);
  //       input.addEventListener("mouseleave", mouseLeaveHandler);
  //     });
  //   }
  //   return () => {
  //     if (refAccordion.current) {
  //       inputList?.forEach((input) => {
  //         input.removeEventListener("focus", focusHandler);
  //         input.removeEventListener("click", focusHandler);
  //         input.removeEventListener("mouseleave", mouseLeaveHandler);
  //       });
  //     }
  //   };
  // }, [select]); // 建议添加依赖数组，避免不必要的重复执行

  return (
    <Accordion.Item eventKey="1">
      <Accordion.Header>
        <Icon iconName="menu-button" gap={1} />
        属性
      </Accordion.Header>
      <Accordion.Body id="gui-container-property">
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
