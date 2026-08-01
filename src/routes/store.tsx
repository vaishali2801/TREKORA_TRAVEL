import { createFileRoute } from "@tanstack/react-router";
import UserLayout from "@/layouts/UserLayout";
import ComingSoon from "@/components/ComingSoon";

export const Route = createFileRoute("/store")({
  head: () => ({
    meta: [
      { title: "Store — TrekVista Tours & Treks" },
      { name: "description", content: "Buy or rent premium trekking equipment — TrekVista tour package management system." },
      { property: "og:title", content: "Store — TrekVista Tours & Treks" },
      { property: "og:description", content: "Buy or rent premium trekking equipment — TrekVista tour package management system." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <UserLayout>
      <ComingSoon title="Store" subtitle="Buy or rent premium trekking equipment." phase="Phase 7" />
    </UserLayout>
  );
}
