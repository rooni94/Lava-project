import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSiteSettings } from "../api/endpoints";
import { applySiteTheme } from "../utils/theme";

export default function SiteThemeLoader() {
  const { data } = useQuery({
    queryKey: ["site-settings"],
    queryFn: fetchSiteSettings,
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  useEffect(() => {
    applySiteTheme(data || undefined);
  }, [data]);

  return null;
}
