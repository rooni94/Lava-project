const apiBase = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
const mediaBase =
  import.meta.env.VITE_MEDIA_BASE_URL || apiBase.replace(/\/api\/?$/, "") || "http://localhost:8000";

export function resolveMediaUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;
  if (path.startsWith("/media/")) return `${mediaBase}${path}`;
  if (path.startsWith("/")) return `${mediaBase}${path}`;
  return `${mediaBase}/media/${path}`;
}
