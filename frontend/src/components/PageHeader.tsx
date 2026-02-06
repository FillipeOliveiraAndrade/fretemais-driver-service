import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  actions?: ReactNode;
};

export default function PageHeader({
  title,
  subtitle,
  eyebrow = "FreteMais",
  actions,
}: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--brand)]">
          {eyebrow}
        </p>
        <h1 className="mt-2 text-3xl font-[var(--font-display)] text-[var(--ink)]">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-2 text-sm text-[var(--muted)]">{subtitle}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
    </header>
  );
}
