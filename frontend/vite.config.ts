import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react()],
    define: {
      __APP_NAME__: JSON.stringify(env.VITE_SITE_NAME || "LAVA"),
    },
    server: {
      port: 5173,
    },
  };
});
