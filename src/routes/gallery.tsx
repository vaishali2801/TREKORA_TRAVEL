import { createFileRoute } from "@tanstack/react-router";
import UserLayout from "@/layouts/UserLayout";
import ComingSoon from "@/components/ComingSoon";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — TrekVista Tours & Treks" },
      { name: "description", content: "Moments from our expeditions — TrekVista tour package management system." },
      { property: "og:title", content: "Gallery — TrekVista Tours & Treks" },
      { property: "og:description", content: "Moments from our expeditions — TrekVista tour package management system." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <UserLayout>
      <ComingSoon title="Gallery" subtitle="Moments from our expeditions." phase="Phase 8" />
    </UserLayout>
  );
}
