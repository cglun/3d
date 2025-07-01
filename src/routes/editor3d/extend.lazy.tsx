import { createLazyFileRoute } from "@tanstack/react-router";
//@ts-expect-error
import App from "parasite/App";
import { Container } from "react-bootstrap";

export const Route = createLazyFileRoute("/editor3d/extend")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Container>
      <App />
    </Container>
  );
}
