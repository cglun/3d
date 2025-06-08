import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/editor3d/")({
  component: RouteComponent,
});

//window.location.href = "/editor3d/model";
function RouteComponent() {
  return <div>首页</div>;
}
