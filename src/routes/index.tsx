import { createFileRoute } from "@tanstack/react-router";
import App from "../App";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Step Into Wonder" },
      { name: "description", content: "An immersive parallax journey into boundless digital worlds." },
      { property: "og:title", content: "Step Into Wonder" },
      { property: "og:description", content: "An immersive parallax journey into boundless digital worlds." },
    ],
  }),
  component: Index,
});

function Index() {
  return <App />;
}
