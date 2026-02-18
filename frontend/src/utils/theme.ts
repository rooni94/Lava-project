export type ThemeMode = "light" | "dark";

export const applyTheme = (theme: ThemeMode) => {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
  localStorage.setItem("theme", theme);
};

export const getInitialTheme = (): ThemeMode => {
  const stored = localStorage.getItem("theme");
  if (stored === "light") return "light";
  if (stored === "dark") return "dark";

  if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }

  return "light";
};

const DEFAULT_THEME = {
  primary_color: "#580213",
  secondary_color: "#222222",
  accent_color: "#CCCCCC",
  surface_color: "#F8F9FA",
  background_color: "#F8F9FA",
  text_color: "#1F2937",
  heading_color: "#222222",
  primary_color_dark: "#FF4A75",
  secondary_color_dark: "#E5E7EB",
  accent_color_dark: "#374151",
  surface_color_dark: "#111827",
  background_color_dark: "#0B0F17",
  text_color_dark: "#E5E7EB",
  heading_color_dark: "#F9FAFB",
  body_font_family: "Cairo, Tajawal, 'IBM Plex Sans Arabic', sans-serif",
  body_font_family_en: "Manrope, Sora, sans-serif",
  heading_font_family: "Cairo, Tajawal, 'IBM Plex Sans Arabic', sans-serif",
  heading_font_family_en: "Sora, Manrope, sans-serif",
  font_size_base: 16,
  font_size_h1: 36,
  font_size_h2: 30,
  font_size_h3: 24,
  font_size_h4: 20,
  font_size_h5: 18,
  font_size_h6: 16,
};

type ThemeSettings = Partial<typeof DEFAULT_THEME>;

const hexToRgb = (hex?: string): string => {
  if (!hex) return "0 0 0";
  const normalized = hex.replace("#", "").trim();
  if (normalized.length === 3) {
    const r = parseInt(normalized[0] + normalized[0], 16);
    const g = parseInt(normalized[1] + normalized[1], 16);
    const b = parseInt(normalized[2] + normalized[2], 16);
    return `${r} ${g} ${b}`;
  }
  if (normalized.length === 6) {
    const r = parseInt(normalized.slice(0, 2), 16);
    const g = parseInt(normalized.slice(2, 4), 16);
    const b = parseInt(normalized.slice(4, 6), 16);
    return `${r} ${g} ${b}`;
  }
  return "0 0 0";
};

export const applySiteTheme = (settings?: ThemeSettings | null) => {
  const merged = { ...DEFAULT_THEME, ...(settings || {}) };
  const root = document.documentElement;

  root.style.setProperty("--color-primary", hexToRgb(merged.primary_color));
  root.style.setProperty("--color-secondary", hexToRgb(merged.secondary_color));
  root.style.setProperty("--color-accent", hexToRgb(merged.accent_color));
  root.style.setProperty("--color-surface", hexToRgb(merged.surface_color));
  root.style.setProperty("--color-bg", hexToRgb(merged.background_color));
  root.style.setProperty("--color-text", hexToRgb(merged.text_color));
  root.style.setProperty("--color-heading", hexToRgb(merged.heading_color));

  root.style.setProperty("--color-primary-dark", hexToRgb(merged.primary_color_dark));
  root.style.setProperty("--color-secondary-dark", hexToRgb(merged.secondary_color_dark));
  root.style.setProperty("--color-accent-dark", hexToRgb(merged.accent_color_dark));
  root.style.setProperty("--color-surface-dark", hexToRgb(merged.surface_color_dark));
  root.style.setProperty("--color-bg-dark", hexToRgb(merged.background_color_dark));
  root.style.setProperty("--color-text-dark", hexToRgb(merged.text_color_dark));
  root.style.setProperty("--color-heading-dark", hexToRgb(merged.heading_color_dark));

  root.style.setProperty("--font-body", merged.body_font_family || DEFAULT_THEME.body_font_family);
  root.style.setProperty("--font-body-ltr", merged.body_font_family_en || DEFAULT_THEME.body_font_family_en);
  root.style.setProperty("--font-heading", merged.heading_font_family || DEFAULT_THEME.heading_font_family);
  root.style.setProperty("--font-heading-ltr", merged.heading_font_family_en || DEFAULT_THEME.heading_font_family_en);

  root.style.setProperty("--font-size-base", `${merged.font_size_base || DEFAULT_THEME.font_size_base}px`);
  root.style.setProperty("--font-size-h1", `${merged.font_size_h1 || DEFAULT_THEME.font_size_h1}px`);
  root.style.setProperty("--font-size-h2", `${merged.font_size_h2 || DEFAULT_THEME.font_size_h2}px`);
  root.style.setProperty("--font-size-h3", `${merged.font_size_h3 || DEFAULT_THEME.font_size_h3}px`);
  root.style.setProperty("--font-size-h4", `${merged.font_size_h4 || DEFAULT_THEME.font_size_h4}px`);
  root.style.setProperty("--font-size-h5", `${merged.font_size_h5 || DEFAULT_THEME.font_size_h5}px`);
  root.style.setProperty("--font-size-h6", `${merged.font_size_h6 || DEFAULT_THEME.font_size_h6}px`);
};
