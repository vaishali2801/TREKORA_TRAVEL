import { createFileRoute } from "@tanstack/react-router";
import UserLayout from "@/layouts/UserLayout";
import ComingSoon from "@/components/ComingSoon";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Reviews — TrekVista Tours & Treks" },
      { name: "description", content: "What our travellers say — TrekVista tour package management system." },
      { property: "og:title", content: "Reviews — TrekVista Tours & Treks" },
      { property: "og:description", content: "What our travellers say — TrekVista tour package management system." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <UserLayout>
      <ComingSoon title="Reviews" subtitle="What our travellers say." phase="Phase 9" />
    </UserLayout>
  );
}
