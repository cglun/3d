import { createLazyFileRoute } from "@tanstack/react-router";

import CustomButton from "@/component/routes/extend/extendButton/Index";
export const Route = createLazyFileRoute("/editor3d/extend")({
  component: RouteComponent,
});

function RouteComponent() {
  return <CustomButton />;
}
