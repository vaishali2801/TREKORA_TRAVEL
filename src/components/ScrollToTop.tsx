import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

/** Scrolls the window to the top on every route change. */
export default function ScrollToTop() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
}
