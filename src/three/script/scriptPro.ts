import { Three3dEditor } from "@/three/threeObj/Three3dEditor";
import { Three3dViewer } from "@/three/threeObj/Three3dViewer";

export function runScriptPro(
  editorIns: Three3dEditor,
  viewerIns?: Three3dViewer
) {
  if (editorIns) {
    common(editorIns);
  }
  if (viewerIns) {
    common(viewerIns);
  }
  function common(contextIns: Three3dEditor | Three3dViewer) {
    const { javascript } = contextIns.scene.userData;
    eval(javascript);
  }
}
