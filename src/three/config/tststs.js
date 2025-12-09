(function inputList() {
  const input1 = {
    id: "input1",
    name: "高亮模型",
    handler: ` const globalVar = window.GlobalStore["GLOBAL_DATA_TO3D"];
    if (globalVar !== undefined) {
      const listPosition = new Map();
      globalVar.rows.forEach((element) => {
        listPosition.set(
          element.yx_location_code,
          element.yx_location_code.split("-")[0]
        );
      });
      const list = [];
      listPosition.forEach((value, key) => {
        const model = store.viewer.scene.getObjectByName(value);
        list.push(model);
      });
      const outlinePass = store.viewer.outlinePass;
      outlinePass.selectedObjects = list;
    }`,
  };

  const input2 = {
    id: "input2",
    name: "输入demo",
    handler: `alert(116)`,
  };
  return [input1, input2];
})();
