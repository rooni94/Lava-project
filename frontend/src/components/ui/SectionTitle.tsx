import { motion } from "framer-motion";

type Props = {
  title: string;
  subtitle?: string;
  titleStyle?: React.CSSProperties;
  align?: "center" | "start";
};

export default function SectionTitle({ title, subtitle, titleStyle, align = "center" }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`space-y-3 mb-8 ${align === "start" ? "text-start" : "text-center"}`}
    >
      <h2 className="theme-h2 font-bold text-secondary dark:text-neutral-50" style={titleStyle}>
        {title}
      </h2>
      {subtitle && <p className={`text-secondary/70 dark:text-neutral-300 ${align === "start" ? "max-w-3xl" : "max-w-3xl mx-auto"}`}>{subtitle}</p>}
      <div className={`w-16 h-1 bg-primary rounded-full ${align === "start" ? "" : "mx-auto"}`} />
    </motion.div>
  );
}
