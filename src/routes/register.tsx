import { createFileRoute } from "@tanstack/react-router";
import UserLayout from "@/layouts/UserLayout";
import ComingSoon from "@/components/ComingSoon";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Register — TrekVista Tours & Treks" },
      { name: "description", content: "Create your TrekVista account — TrekVista tour package management system." },
      { property: "og:title", content: "Register — TrekVista Tours & Treks" },
      { property: "og:description", content: "Create your TrekVista account — TrekVista tour package management system." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <UserLayout>
      <ComingSoon title="Register" subtitle="Create your TrekVista account." phase="Phase 3" />
    </UserLayout>
  );
}
