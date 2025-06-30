import { createLazyFileRoute } from "@tanstack/react-router";
//@ts-expect-error
import testComponent from "@static/extends/components/testComponent";
export const Route = createLazyFileRoute("/editor3d/extend")({
  component: RouteComponent,
});

function RouteComponent() {
  console.log(testComponent());

  return <div></div>;
}
