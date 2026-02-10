import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

export default function ScrollToTop() {
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    // Preserve scroll position on back/forward navigation.
    if (navigationType === "POP") return;

    // Let the new route render first so hash targets exist.
    requestAnimationFrame(() => {
      const hash = (location.hash || "").replace("#", "");
      if (hash) {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ block: "start" });
          return;
        }
      }
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
  }, [navigationType, location.pathname, location.search, location.hash]);

  return null;
}
