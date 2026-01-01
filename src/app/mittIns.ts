import mitt from "mitt";

const mittIns = mitt();

export default mittIns;
export const MITT_EVENT = {
  UPDATE_SCENE: "UPDATE_SCENE", //更新场景
};
