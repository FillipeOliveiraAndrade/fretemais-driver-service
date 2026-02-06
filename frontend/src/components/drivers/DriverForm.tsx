import type { FormEvent } from "react";

import { VEHICLE_TYPES, type DriverPayload } from "@/lib/drivers";
import Alert from "@/components/Alert";

export type DriverFormValues = DriverPayload;

type DriverFormProps = {
  values: DriverFormValues;
  onChange: (field: keyof DriverFormValues, value: string) => void;
  onToggleVehicleType: (type: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  submitLabel: string;
  isSubmitting?: boolean;
  error?: string | null;
  statusLabel?: string;
  onDelete?: () => void;
  deleteLabel?: string;
};

export default function DriverForm({
  values,
  onChange,
  onToggleVehicleType,
  onSubmit,
  onCancel,
  submitLabel,
  isSubmitting,
  error,
  statusLabel,
  onDelete,
  deleteLabel = "Excluir motorista",
}: DriverFormProps) {
  return (
    <form className="grid gap-6 lg:grid-cols-2" onSubmit={onSubmit}>
      <div className="lg:col-span-2">
        <h2 className="text-lg font-semibold text-[var(--ink)]">
          Informacoes basicas
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Estes dados sao usados nas buscas e no contato com o motorista.
        </p>
      </div>

      <div>
        <label className="text-sm font-medium text-[var(--ink)]" htmlFor="name">
          Nome completo
        </label>
        <input
          id="name"
          name="name"
          value={values.name}
          onChange={(event) => onChange("name", event.target.value)}
          placeholder="Ex.: Marina Soares"
          className="mt-2 w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--brand)] focus:ring-2 focus:ring-[rgba(15,118,110,0.25)]"
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium text-[var(--ink)]" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={values.email}
          onChange={(event) => onChange("email", event.target.value)}
          placeholder="nome@exemplo.com"
          className="mt-2 w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--brand)] focus:ring-2 focus:ring-[rgba(15,118,110,0.25)]"
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium text-[var(--ink)]" htmlFor="phone">
          Telefone
        </label>
        <input
          id="phone"
          name="phone"
          value={values.phone ?? ""}
          onChange={(event) => onChange("phone", event.target.value)}
          placeholder="+55 11 98888-0000"
          className="mt-2 w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--brand)] focus:ring-2 focus:ring-[rgba(15,118,110,0.25)]"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-[var(--ink)]" htmlFor="city">
          Cidade
        </label>
        <input
          id="city"
          name="city"
          value={values.city}
          onChange={(event) => onChange("city", event.target.value)}
          placeholder="Ex.: Campinas"
          className="mt-2 w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--brand)] focus:ring-2 focus:ring-[rgba(15,118,110,0.25)]"
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium text-[var(--ink)]" htmlFor="state">
          UF
        </label>
        <select
          id="state"
          name="state"
          value={values.state}
          onChange={(event) => onChange("state", event.target.value)}
          className="mt-2 w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--brand)] focus:ring-2 focus:ring-[rgba(15,118,110,0.25)]"
          required
        >
          <option value="">Selecione</option>
          <option value="SP">SP</option>
          <option value="RJ">RJ</option>
          <option value="MG">MG</option>
          <option value="PR">PR</option>
        </select>
      </div>

      <div className="lg:col-span-2">
        <p className="text-sm font-medium text-[var(--ink)]">Tipos de veiculo</p>
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
                checked={values.vehicleTypes.includes(type)}
                onChange={() => onToggleVehicleType(type)}
                className="h-3.5 w-3.5 rounded border-[var(--border)] accent-[var(--brand)]"
              />
              {type}
            </label>
          ))}
        </div>
      </div>

      {error ? (
        <div className="lg:col-span-2">
          <Alert variant="error">{error}</Alert>
        </div>
      ) : null}

      <div className="lg:col-span-2 flex flex-wrap items-center justify-between gap-4">
        {statusLabel ? (
          <div className="text-xs text-[var(--muted)]">
            Status atual: <span className="font-semibold">{statusLabel}</span>
          </div>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-3">
          {onDelete ? (
            <button
              type="button"
              className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--ink)]"
              onClick={onDelete}
            >
              {deleteLabel}
            </button>
          ) : null}
          <button
            type="button"
            className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--ink)]"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`rounded-xl bg-[var(--brand)] px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-[var(--brand-dark)] ${
              isSubmitting ? "cursor-not-allowed opacity-70" : ""
            }`}
          >
            {isSubmitting ? "Salvando..." : submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}
