import { createFileRoute } from "@tanstack/react-router";
import UserLayout from "@/layouts/UserLayout";
import ComingSoon from "@/components/ComingSoon";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — TrekVista Tours & Treks" },
      { name: "description", content: "Your bookings, orders and details — TrekVista tour package management system." },
      { property: "og:title", content: "Profile — TrekVista Tours & Treks" },
      { property: "og:description", content: "Your bookings, orders and details — TrekVista tour package management system." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <UserLayout>
      <ComingSoon title="Profile" subtitle="Your bookings, orders and details." phase="Phase 11" />
    </UserLayout>
  );
}
