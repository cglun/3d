/**
 * 工具类
 */

import { Object3D, Scene } from "three";
import { APP_COLOR } from "@/app/type";
import { editorInstance } from "@/three/instance/EditorInstance";
import sceneUserData from "@/three/config/Three3dConfig";

export function getButtonColor(theme: APP_COLOR) {
  const color = theme === "dark" ? "light" : "dark";
  return "outline-" + color;
}

export function setClassName(className: string): string {
  const editor = editorInstance.getEditor();
  let iconFill = "";
  if (editor) {
    iconFill = editor.scene.userData.APP_THEME.iconFill;
  }
  return `bi bi-${className}${iconFill}`;
}

export function base64ToBlob(base64: string, mimeType = "image/png") {
  // 去掉base64的头部信息（如果有）
  const byteString = atob(base64.split(",")[1]);
  // 修正代码，根据条件更新 mimeType
  mimeType =
    mimeType.split("/")[0] === "image"
      ? `image/${mimeType.split("/")[1]}`
      : "text/plain";
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  // 封装为Blob对象
  return new Blob([ab], { type: mimeType });
}
export function blobToFile(blob: Blob, fileName: string) {
  // 在浏览器环境中，可以使用File构造函数来创建File对象
  try {
    return new File([blob], fileName, { type: blob.type });
  } catch (error) {
    // 如果File构造函数不可用（例如在某些Node.js环境中），则直接返回Blob
    console.warn(error);
    return blob;
  }
}

export function getThemeByScene(scene: Scene) {
  let theme = sceneUserData.APP_THEME;
  if (scene.userData.APP_THEME) {
    theme = scene.userData.APP_THEME;
  }
  return theme;
}

export function fixedEditorLeft(fixed = true) {
  const editorLeft = document.getElementById("editor-left");
  const editorRight = document.getElementById("editor-right");
  editorLeft?.classList.remove("position-fixed");
  editorRight!.style.overflowY = "scroll";
  if (fixed) {
    editorLeft?.classList.add("position-fixed");
    editorRight!.style.overflowY = "hidden";
  }
}
export function getObjectNameByName(object3D: Object3D): string {
  return object3D.name.trim() === "" ? object3D.type : object3D.name;
}
export function getCardBackgroundUrl(cardBackgroundUrl: string) {
  if (cardBackgroundUrl.includes("/file/view/")) {
    return `url(${cardBackgroundUrl.includes("/file/view/") && location.origin + cardBackgroundUrl})`;
  }

  return `url(${cardBackgroundUrl})`;
}
