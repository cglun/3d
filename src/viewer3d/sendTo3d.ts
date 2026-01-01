// export default function sendTo3d(_options: object) {
//   let options = _options;
//   console.log(options, "optionsSendTo3d");
//   //@ts-expect-error 从2d获取选项
//   function getOptionsFrom2d() {
//     console.log(options, "optionsGetOptionsFrom2d");

//     return options;
//   }
// }
// 为 Window 类型添加 ObjectEditor3d 属性声明
declare global {
  interface Window {
    ObjectEditor3d: unknown;
  }
}

//定义一个window全局变量
window.ObjectEditor3d = {
  options: {}, // 初始化为空对象或根据实际需要设置默认值
};
