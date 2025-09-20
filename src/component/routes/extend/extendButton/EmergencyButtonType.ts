import { buttonGroupStyleInit } from "@/three/config/Three3dConfig";

export const emergencyButton = {
  buttonBase: {
    showName: "名字",
    NAME_ID: "string",
    showButton: true, //是否显示按钮
    isClick: false, //是否点击, 改变选中状态
    style: {
      offsetWidth: 0,
      offsetHeight: 0,
    },
  },
  groupStyle: { ...buttonGroupStyleInit },
};

export const emergencyButtonGroup = {
  ...buttonGroupStyleInit,
  showGroup: true,
  enable: true,
  direction: "column",
};
