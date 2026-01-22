export const applyTheme = (theme: "light" | "dark") => {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
  localStorage.setItem("theme", theme);
};

export const getInitialTheme = (): "light" | "dark" => {
  const stored = localStorage.getItem("theme");
  if (stored === "dark") return "dark";
  return "light";
};
