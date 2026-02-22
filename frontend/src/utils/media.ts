const apiBase = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:8000/api" : "/api");
const mediaBase =
  import.meta.env.VITE_MEDIA_BASE_URL ||
  apiBase.replace(/\/api\/?$/, "") ||
  (import.meta.env.DEV ? "http://localhost:8000" : "");

export function resolveMediaUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;
  if (path.startsWith("/media/")) return `${mediaBase}${path}`;
  if (path.startsWith("/")) return `${mediaBase}${path}`;
  return `${mediaBase}/media/${path}`;
}

export function isVideoUrl(url?: string | null): boolean {
  if (!url) return false;
  const clean = String(url).split("?")[0].split("#")[0].toLowerCase();
  return /\.(mp4|webm|mov|mkv|avi|m4v)$/i.test(clean);
}
