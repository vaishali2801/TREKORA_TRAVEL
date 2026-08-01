import { createFileRoute } from "@tanstack/react-router";
import UserLayout from "@/layouts/UserLayout";
import ComingSoon from "@/components/ComingSoon";

export const Route = createFileRoute("/packages")({
  head: () => ({
    meta: [
      { title: "Packages — TrekVista Tours & Treks" },
      { name: "description", content: "Browse and filter every trek and tour — TrekVista tour package management system." },
      { property: "og:title", content: "Packages — TrekVista Tours & Treks" },
      { property: "og:description", content: "Browse and filter every trek and tour — TrekVista tour package management system." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <UserLayout>
      <ComingSoon title="Packages" subtitle="Browse and filter every trek and tour." phase="Phase 4" />
    </UserLayout>
  );
}
