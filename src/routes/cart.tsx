import { createFileRoute } from "@tanstack/react-router";
import UserLayout from "@/layouts/UserLayout";
import ComingSoon from "@/components/ComingSoon";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Cart — TrekVista Tours & Treks" },
      { name: "description", content: "Your selected gear and packages — TrekVista tour package management system." },
      { property: "og:title", content: "Cart — TrekVista Tours & Treks" },
      { property: "og:description", content: "Your selected gear and packages — TrekVista tour package management system." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <UserLayout>
      <ComingSoon title="Cart" subtitle="Your selected gear and packages." phase="Phase 7" />
    </UserLayout>
  );
}
