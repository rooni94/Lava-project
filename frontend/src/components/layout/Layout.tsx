import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import SupportChatWidget from "../support/SupportChatWidget";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();

  return (
    <div className="relative min-h-screen flex flex-col bg-surface text-secondary dark:bg-neutral-950 dark:text-neutral-100 transition-colors overflow-x-clip">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 neo-mesh" />
        <div className="absolute inset-0 bg-grid-mask opacity-45 dark:opacity-20" />
        <div className="absolute inset-0 grain-mask opacity-[0.07] dark:opacity-[0.05]" />
        <div className="absolute left-0 right-0 top-[96px] h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
      </div>
      <Navbar />
      <main className="flex-1 relative z-10">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      </main>
      <Footer />
      <SupportChatWidget />
    </div>
  );
}
