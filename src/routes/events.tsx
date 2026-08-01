import { createFileRoute } from "@tanstack/react-router";
import UserLayout from "@/layouts/UserLayout";
import ComingSoon from "@/components/ComingSoon";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events — TrekVista Tours & Treks" },
      { name: "description", content: "Upcoming and special adventure events — TrekVista tour package management system." },
      { property: "og:title", content: "Events — TrekVista Tours & Treks" },
      { property: "og:description", content: "Upcoming and special adventure events — TrekVista tour package management system." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <UserLayout>
      <ComingSoon title="Events" subtitle="Upcoming and special adventure events." phase="Phase 6" />
    </UserLayout>
  );
}
