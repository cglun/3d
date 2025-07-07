import { createLazyFileRoute } from "@tanstack/react-router";

import CustomButton from "@/component/routes/extend/extendButton/Index";
import { useEffect } from "react";
import { stopRoam } from "@/component/routes/effects/utils";
import { editorInstance } from "@/three/instance/EditorInstance";
import PreButtonGroup from "@/component/routes/extend/extendButton/PreButtonGroup";
export const Route = createLazyFileRoute("/editor3d/extend")({
  component: RouteComponent,
});

function RouteComponent() {
  useEffect(() => {
    return () => {
      stopRoam();
      const editor = editorInstance.getEditor();
      editor.destroyGUI();
    };
  }, []);

  return (
    <>
      <CustomButton />
      <PreButtonGroup dev={"editor3d"} />
    </>
  );
}
