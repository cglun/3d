import { createLazyFileRoute } from "@tanstack/react-router";

import CustomButton from "@/component/routes/extend/extendButton/Index";
import { useEffect } from "react";
import { stopRoam } from "@/component/routes/effects/utils";
export const Route = createLazyFileRoute("/editor3d/extend")({
  component: RouteComponent,
});

function RouteComponent() {
  useEffect(() => {
    return () => {
      stopRoam();
    };
  }, []);

  return (
    <>
      <CustomButton />
      <div id="buttonGroupDiv"></div>
    </>
  );
}
