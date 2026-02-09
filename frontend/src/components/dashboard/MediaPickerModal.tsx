import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../api/client";

type MediaItem = { id: number; file: string; media_type: string; title?: string; category?: string };

export default function MediaPickerModal({
  open,
  title,
  onClose,
  onPick,
}: {
  open: boolean;
  title?: string;
  onClose: () => void;
  onPick: (urls: string[]) => void;
}) {
  const [selected, setSelected] = useState<number[]>([]);
  const [query, setQuery] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["media-picker", "image"],
    enabled: open,
    queryFn: async (): Promise<MediaItem[]> => {
      const res = await api.get("/media/?media_type=image");
      return res.data.results ?? res.data;
    },
  });

  const items = useMemo(() => {
    const list = (data || []).filter((i) => i.media_type === "image");
    if (!query.trim()) return list;
    const q = query.trim().toLowerCase();
    return list.filter((i) => (i.title || "").toLowerCase().includes(q) || (i.category || "").toLowerCase().includes(q));
  }, [data, query]);

  const pick = () => {
    const urls = (data || [])
      .filter((i) => selected.includes(i.id))
      .map((i) => i.file)
      .filter(Boolean);
    onPick(urls);
    setSelected([]);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white dark:bg-neutral-950 rounded-2xl border border-accent/30 dark:border-neutral-800 overflow-hidden">
        <div className="px-4 py-3 flex items-center justify-between border-b border-accent/30 dark:border-neutral-800">
          <div className="font-semibold text-secondary dark:text-neutral-50">{title || "Pick images"}</div>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-3 py-1 rounded-lg border border-accent/30 dark:border-neutral-800">
              Close
            </button>
            <button
              onClick={pick}
              disabled={!selected.length}
              className="px-3 py-1 rounded-lg bg-primary text-white disabled:opacity-50"
            >
              Add ({selected.length})
            </button>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title or category…"
            className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-800"
          />

          {isLoading ? (
            <div className="text-sm text-secondary/70 dark:text-neutral-300">Loading…</div>
          ) : items.length === 0 ? (
            <div className="text-sm text-secondary/70 dark:text-neutral-300">No images found.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    setSelected((prev) => (prev.includes(item.id) ? prev.filter((id) => id !== item.id) : [...prev, item.id]))
                  }
                  className={`text-left border rounded-xl overflow-hidden bg-white dark:bg-neutral-900 ${
                    selected.includes(item.id) ? "ring-2 ring-primary" : "border-accent/30 dark:border-neutral-800"
                  }`}
                >
                  <img src={item.file} alt={item.title || "Media"} className="w-full h-28 object-cover" loading="lazy" />
                  <div className="p-2">
                    <div className="text-xs font-semibold text-secondary dark:text-neutral-50 truncate">{item.title || "Untitled"}</div>
                    <div className="text-[11px] text-secondary/60 dark:text-neutral-400 truncate">{item.category || "General"}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

