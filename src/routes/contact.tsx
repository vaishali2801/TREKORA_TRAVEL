import { createFileRoute } from "@tanstack/react-router";
import UserLayout from "@/layouts/UserLayout";
import ComingSoon from "@/components/ComingSoon";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — TrekVista Tours & Treks" },
      { name: "description", content: "Reach out to our travel experts — TrekVista tour package management system." },
      { property: "og:title", content: "Contact — TrekVista Tours & Treks" },
      { property: "og:description", content: "Reach out to our travel experts — TrekVista tour package management system." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <UserLayout>
      <ComingSoon title="Contact" subtitle="Reach out to our travel experts." phase="Phase 10" />
    </UserLayout>
  );
}
