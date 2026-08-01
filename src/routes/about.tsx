import { createFileRoute } from "@tanstack/react-router";
import UserLayout from "@/layouts/UserLayout";
import ComingSoon from "@/components/ComingSoon";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — TrekVista Tours & Treks" },
      { name: "description", content: "Our story, mission and vision — TrekVista tour package management system." },
      { property: "og:title", content: "About — TrekVista Tours & Treks" },
      { property: "og:description", content: "Our story, mission and vision — TrekVista tour package management system." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <UserLayout>
      <ComingSoon title="About" subtitle="Our story, mission and vision." phase="Phase 13" />
    </UserLayout>
  );
}
