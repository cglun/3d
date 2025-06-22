import { Three3dEditor } from "@/three/threeObj/Three3dEditor";
import { Three3dViewer } from "@/three/threeObj/Three3dViewer";

export function runScriptPro(
  editorIns: Three3dEditor,
  viewerIns?: Three3dViewer
) {
  if (editorIns) {
    const { javascript } = editorIns.scene.userData;
    eval(javascript);
  }
  if (viewerIns) {
    const { javascript } = viewerIns.scene.userData;
    eval(javascript);
  }
}
