type StatusBadgeProps = {
  active: boolean;
};

export default function StatusBadge({ active }: StatusBadgeProps) {
  return (
    <span
      className={`rounded-full px-2 py-1 text-xs font-semibold ${
        active
          ? "bg-[rgba(15,118,110,0.12)] text-[var(--brand)]"
          : "bg-[rgba(245,158,11,0.15)] text-[var(--accent)]"
      }`}
    >
      {active ? "Ativo" : "Inativo"}
    </span>
  );
}
