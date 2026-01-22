import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { fetchSiteSettings } from "../api/endpoints";

type Props = {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
};

export default function MetaHead({ title, description, image, url, type = "website" }: Props) {
  const { data: settings } = useQuery({ queryKey: ["site-settings"], queryFn: fetchSiteSettings });
  const finalTitle = title || settings?.seo_title || settings?.site_name || "LAVA";
  const finalDescription = description || settings?.meta_description;
  const finalImage = image || settings?.og_image || settings?.logo;
  const siteName = settings?.site_name || "LAVA";

  return (
    <Helmet>
      <title>{finalTitle}</title>
      {finalDescription && <meta name="description" content={finalDescription} />}
      <meta property="og:title" content={finalTitle} />
      {finalDescription && <meta property="og:description" content={finalDescription} />}
      {url && <meta property="og:url" content={url} />}
      <meta property="og:type" content={type} />
      {finalImage && <meta property="og:image" content={finalImage} />}
      <meta property="og:site_name" content={siteName} />
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );
}
