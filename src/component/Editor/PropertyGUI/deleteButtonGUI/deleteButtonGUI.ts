import { GUI } from "three/addons/libs/lil-gui.module.min.js";

export default function deleteButtonGUI(
  fun: { delButton: () => void },
  folder: GUI,
  objectName: string
) {
  const delButtonFolder = folder.add(fun, "delButton").name(`删除${objectName}`)
    .domElement.children[0].children[0].children[0] as HTMLElement;
  delButtonFolder.style.color = "rgb(220, 53, 69)";
}
