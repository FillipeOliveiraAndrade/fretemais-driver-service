import type { ReactNode } from "react";

type AlertProps = {
  variant: "success" | "error";
  children: ReactNode;
  onDismiss?: () => void;
};

export default function Alert({ variant, children, onDismiss }: AlertProps) {
  const styles =
    variant === "success"
      ? "border-[rgba(16,185,129,0.25)] bg-[rgba(16,185,129,0.12)] text-[rgba(6,95,70,0.9)]"
      : "border-[rgba(239,68,68,0.2)] bg-[rgba(239,68,68,0.08)] text-[rgba(153,27,27,0.9)]";

  return (
    <div className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-sm ${styles}`}>
      <span>{children}</span>
      {onDismiss ? (
        <button
          type="button"
          className="text-xs font-semibold uppercase tracking-[0.2em]"
          onClick={onDismiss}
        >
          Fechar
        </button>
      ) : null}
    </div>
  );
}
