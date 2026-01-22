export default function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-accent/50 rounded ${className}`} />;
}
