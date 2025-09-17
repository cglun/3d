import ImagesList from "@/component/routes/extend/extendButton/imagesList/ImagesList";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/editor3d/image")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ImagesList />;
}
