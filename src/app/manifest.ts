import type { MetadataRoute } from "next";
import { site } from "@/data/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — Cortinas roller a medida`,
    short_name: site.name,
    description: "Cortinas roller a medida, telas importadas y accesorios para distribuidores en el Perú.",
    start_url: "/es",
    display: "standalone",
    background_color: "#FBF6E6",
    theme_color: "#144C42",
    lang: "es-PE",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
