import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiProxyTarget = env.VITE_API_PROXY_TARGET;
  const wsProxyTarget = env.VITE_WS_PROXY_TARGET || apiProxyTarget;

  return {
    plugins: [react()],
    define: {
      __APP_NAME__: JSON.stringify(env.VITE_SITE_NAME || "LAVA"),
    },
    server: {
      port: 5173,
      proxy: apiProxyTarget
        ? {
            "/api": {
              target: apiProxyTarget,
              changeOrigin: true,
              secure: true,
            },
            ...(wsProxyTarget
              ? {
                  "/ws": {
                    target: wsProxyTarget,
                    changeOrigin: true,
                    secure: true,
                    ws: true,
                  },
                }
              : {}),
          }
        : undefined,
    },
  };
});
