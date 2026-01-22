import { ReactNode } from "react";

type Props = {
  label: string;
  value: ReactNode;
};

export default function StatCard({ label, value }: Props) {
  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 shadow border border-accent/30 dark:border-neutral-800">
      <div className="text-3xl font-extrabold text-primary mb-1">{value}</div>
      <div className="text-sm text-secondary/80 dark:text-neutral-300">{label}</div>
    </div>
  );
}
