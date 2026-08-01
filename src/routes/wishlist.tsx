import { createFileRoute } from "@tanstack/react-router";
import UserLayout from "@/layouts/UserLayout";
import ComingSoon from "@/components/ComingSoon";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Wishlist — TrekVista Tours & Treks" },
      { name: "description", content: "Saved packages and products — TrekVista tour package management system." },
      { property: "og:title", content: "Wishlist — TrekVista Tours & Treks" },
      { property: "og:description", content: "Saved packages and products — TrekVista tour package management system." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <UserLayout>
      <ComingSoon title="Wishlist" subtitle="Saved packages and products." phase="Phase 11" />
    </UserLayout>
  );
}
