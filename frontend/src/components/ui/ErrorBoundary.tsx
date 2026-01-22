import { Component, ReactNode } from "react";

type Props = { children: ReactNode };
type State = { hasError: boolean };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("Unhandled error", error);
  }

  render() {
    if (this.state.hasError) {
      const isAr = typeof document !== "undefined" && document.documentElement.lang === "ar";
      return (
        <div className="min-h-screen grid place-items-center bg-surface dark:bg-neutral-950 text-secondary dark:text-neutral-100">
          <div className="bg-white dark:bg-neutral-900 shadow rounded-2xl p-6 text-center border border-accent/40 dark:border-neutral-800">
            <p className="text-xl font-bold mb-2 text-red-600 dark:text-red-400">
              {isAr ? "حدث خطأ غير متوقع" : "Something went wrong"}
            </p>
            <p className="text-sm text-secondary/70 dark:text-neutral-300">
              {isAr
                ? "يرجى إعادة تحميل الصفحة أو التواصل مع الفريق الفني."
                : "Please reload the page or contact the technical team if the issue persists."}
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
