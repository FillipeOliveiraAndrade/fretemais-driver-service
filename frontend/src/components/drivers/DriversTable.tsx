import Link from "next/link";

import { type Driver, SORT_OPTIONS, type DriverSortValue } from "@/lib/drivers";
import StatusBadge from "@/components/StatusBadge";

const skeletonRows = Array.from({ length: 5 }, (_, index) => (
  <tr key={`skeleton-${index}`} className="animate-pulse">
    <td className="px-4 py-4">
      <div className="h-3 w-32 rounded-full bg-[var(--border)]" />
      <div className="mt-2 h-3 w-24 rounded-full bg-[var(--border)]" />
    </td>
    <td className="px-4 py-4">
      <div className="h-3 w-24 rounded-full bg-[var(--border)]" />
    </td>
    <td className="px-4 py-4">
      <div className="h-3 w-20 rounded-full bg-[var(--border)]" />
    </td>
    <td className="px-4 py-4">
      <div className="h-3 w-24 rounded-full bg-[var(--border)]" />
    </td>
    <td className="px-4 py-4">
      <div className="h-3 w-16 rounded-full bg-[var(--border)]" />
    </td>
    <td className="px-4 py-4 text-right">
      <div className="ml-auto h-6 w-20 rounded-lg bg-[var(--border)]" />
    </td>
  </tr>
));

type DriversTableProps = {
  drivers: Driver[];
  isLoading: boolean;
  sortValue: DriverSortValue;
  onSortChange: (value: DriverSortValue) => void;
};

export default function DriversTable({
  drivers,
  isLoading,
  sortValue,
  onSortChange,
}: DriversTableProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-[var(--ink)]">
          Lista de motoristas
        </h2>
        <div className="flex items-center gap-3 text-xs text-[var(--muted)]">
          <span>Ordenar por</span>
          <select
            className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-xs text-[var(--ink)]"
            value={sortValue}
            onChange={(event) => onSortChange(event.target.value as DriverSortValue)}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--border)]">
        <table className="w-full border-collapse text-left text-sm" aria-busy={isLoading}>
          <thead className="bg-[var(--bg)] text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3">Motorista</th>
              <th className="px-4 py-3">Contato</th>
              <th className="px-4 py-3">Cidade/UF</th>
              <th className="px-4 py-3">Veiculos</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {isLoading ? (
              skeletonRows
            ) : drivers.length === 0 ? (
              <tr>
                <td
                  className="px-4 py-6 text-center text-sm text-[var(--muted)]"
                  colSpan={6}
                >
                  Nenhum motorista encontrado.
                </td>
              </tr>
            ) : (
              drivers.map((driver) => (
                <tr key={driver.id} className="hover:bg-[var(--bg)]">
                  <td className="px-4 py-4">
                    <div className="font-semibold text-[var(--ink)]">
                      {driver.name}
                    </div>
                    <div className="text-xs text-[var(--muted)]">
                      {driver.email}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-[var(--muted)]">
                    {driver.phone || "-"}
                  </td>
                  <td className="px-4 py-4 text-[var(--muted)]">
                    {driver.city} / {driver.state}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      {driver.vehicleTypes.map((vehicle) => (
                        <span
                          key={vehicle}
                          className="rounded-full border border-[var(--border)] px-2 py-1 text-xs text-[var(--muted)]"
                        >
                          {vehicle}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge active={driver.active} />
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Link
                      href={`/drivers/${driver.id}`}
                      className="rounded-lg border border-[var(--border)] px-3 py-1 text-xs font-semibold text-[var(--ink)]"
                    >
                      Ver detalhes
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
