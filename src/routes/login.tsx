import { createFileRoute } from "@tanstack/react-router";
import UserLayout from "@/layouts/UserLayout";
import ComingSoon from "@/components/ComingSoon";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — TrekVista Tours & Treks" },
      { name: "description", content: "Sign in to your TrekVista account — TrekVista tour package management system." },
      { property: "og:title", content: "Login — TrekVista Tours & Treks" },
      { property: "og:description", content: "Sign in to your TrekVista account — TrekVista tour package management system." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <UserLayout>
      <ComingSoon title="Login" subtitle="Sign in to your TrekVista account." phase="Phase 3" />
    </UserLayout>
  );
}
