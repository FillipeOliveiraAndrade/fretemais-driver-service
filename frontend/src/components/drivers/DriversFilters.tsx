import type { FormEvent } from "react";

import { VEHICLE_TYPES, type DriverFilters } from "@/lib/drivers";

type DriversFiltersProps = {
  filters: DriverFilters;
  totalLabel: string;
  onFieldChange: (field: "text" | "city" | "state", value: string) => void;
  onToggleVehicleType: (type: string) => void;
  onApply: (event: FormEvent<HTMLFormElement>) => void;
  onClear: () => void;
};

export default function DriversFilters({
  filters,
  totalLabel,
  onFieldChange,
  onToggleVehicleType,
  onApply,
  onClear,
}: DriversFiltersProps) {
  return (
    <form
      className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr_0.8fr]"
      onSubmit={onApply}
    >
      <div>
        <label
          className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]"
          htmlFor="search"
        >
          Busca
        </label>
        <input
          id="search"
          name="search"
          placeholder="Nome, email ou telefone"
          value={filters.text}
          onChange={(event) => onFieldChange("text", event.target.value)}
          className="mt-2 w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--brand)] focus:ring-2 focus:ring-[rgba(15,118,110,0.25)]"
        />
      </div>
      <div>
        <label
          className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]"
          htmlFor="state"
        >
          UF
        </label>
        <select
          id="state"
          name="state"
          value={filters.state}
          onChange={(event) => onFieldChange("state", event.target.value)}
          className="mt-2 w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--brand)] focus:ring-2 focus:ring-[rgba(15,118,110,0.25)]"
        >
          <option value="">Todas</option>
          <option value="SP">SP</option>
          <option value="RJ">RJ</option>
          <option value="MG">MG</option>
          <option value="PR">PR</option>
        </select>
      </div>
      <div>
        <label
          className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]"
          htmlFor="city"
        >
          Cidade
        </label>
        <input
          id="city"
          name="city"
          placeholder="Ex.: Campinas"
          value={filters.city}
          onChange={(event) => onFieldChange("city", event.target.value)}
          className="mt-2 w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--brand)] focus:ring-2 focus:ring-[rgba(15,118,110,0.25)]"
        />
      </div>

      <div className="lg:col-span-3">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
          Tipos de veiculo
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {VEHICLE_TYPES.map((type) => (
            <label
              key={type}
              className="flex items-center gap-2 rounded-full border border-[var(--border)] px-3 py-1 text-xs font-medium text-[var(--ink)]"
            >
              <input
                type="checkbox"
                name="vehicles"
                value={type}
                checked={filters.vehicleTypes.includes(type)}
                onChange={() => onToggleVehicleType(type)}
                className="h-3.5 w-3.5 rounded border-[var(--border)] accent-[var(--brand)]"
              />
              {type}
            </label>
          ))}
        </div>
      </div>

      <div className="lg:col-span-3 flex flex-wrap items-center justify-between gap-3 pt-2">
        <p className="text-sm text-[var(--muted)]">{totalLabel}</p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-xl border border-[var(--border)] px-4 py-2 text-xs font-semibold text-[var(--ink)]"
            onClick={onClear}
          >
            Limpar filtros
          </button>
          <button
            type="submit"
            className="rounded-xl bg-[var(--brand)] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[var(--brand-dark)]"
          >
            Aplicar filtros
          </button>
        </div>
      </div>
    </form>
  );
}
