"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { ApiRequestError } from "@/lib/api";
import {
  buildDriverSearchParams,
  EMPTY_FILTERS,
  fetchDrivers,
  parseDriverSearchParams,
  type Driver,
  type DriverFilters,
  type DriverSortValue,
} from "@/lib/drivers";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import Alert from "@/components/Alert";
import Card from "@/components/Card";
import PageHeader from "@/components/PageHeader";
import DriversFilters from "@/components/drivers/DriversFilters";
import DriversTable from "@/components/drivers/DriversTable";

const SUCCESS_MESSAGES: Record<string, string> = {
  created: "Motorista criado com sucesso.",
  updated: "Motorista atualizado com sucesso.",
  deleted: "Motorista excluido com sucesso.",
};

export default function DriversPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { logout } = useRequireAuth();

  const [filters, setFilters] = useState<DriverFilters>(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<DriverFilters>(
    EMPTY_FILTERS
  );
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [page, setPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortValue, setSortValue] = useState<DriverSortValue>("CREATED_AT_DESC");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successKey, setSuccessKey] = useState("");

  useEffect(() => {
    const parsed = parseDriverSearchParams(searchParams);
    setFilters(parsed.filters);
    setAppliedFilters(parsed.filters);
    setPage(parsed.page);
    setSortValue(parsed.sortValue);
    setSuccessKey(parsed.success);
  }, [searchParams]);

  const updateQueryParams = useCallback(
    (nextFilters: DriverFilters, nextPage: number, nextSort: DriverSortValue) => {
      const params = buildDriverSearchParams(nextFilters, nextPage, nextSort);
      const query = params.toString();
      router.push(query ? `/drivers?${query}` : "/drivers");
    },
    [router]
  );

  const loadDrivers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchDrivers(appliedFilters, page, sortValue);
      setDrivers(data.content ?? []);
      setTotalElements(data.totalElements ?? 0);
      setTotalPages(data.totalPages ?? 0);

      if (typeof data.number === "number" && data.number !== page) {
        setPage(data.number);
      }
    } catch (err) {
      if (err instanceof ApiRequestError && err.status === 401) {
        router.push("/login");
        return;
      }

      setError(err instanceof Error ? err.message : "Erro ao carregar dados.");
    } finally {
      setIsLoading(false);
    }
  }, [appliedFilters, page, sortValue, router]);

  useEffect(() => {
    loadDrivers();
  }, [loadDrivers]);

  const handleFieldChange = (
    field: "text" | "city" | "state",
    value: string
  ) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleApplyFilters = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateQueryParams(filters, 0, sortValue);
  };

  const handleClearFilters = () => {
    setFilters(EMPTY_FILTERS);
    updateQueryParams(EMPTY_FILTERS, 0, sortValue);
  };

  const toggleVehicleType = (type: string) => {
    setFilters((prev) => ({
      ...prev,
      vehicleTypes: prev.vehicleTypes.includes(type)
        ? prev.vehicleTypes.filter((item) => item !== type)
        : [...prev.vehicleTypes, type],
    }));
  };

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 0 || nextPage >= totalPages) {
      return;
    }

    updateQueryParams(appliedFilters, nextPage, sortValue);
  };

  const handleSortChange = (value: DriverSortValue) => {
    setSortValue(value);
    updateQueryParams(appliedFilters, 0, value);
  };

  const handleDismissSuccess = () => {
    updateQueryParams(appliedFilters, page, sortValue);
  };

  const totalLabel =
    totalElements === 1
      ? "1 motorista encontrado"
      : `${totalElements} motoristas encontrados`;
  const successMessage = SUCCESS_MESSAGES[successKey];

  return (
    <main className="min-h-screen bg-[var(--bg)] px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <PageHeader
          title="Motoristas parceiros"
          subtitle="Consulte, filtre e gerencie a base interna de motoristas."
          actions={
            <>
              <Link
                href="/drivers/new"
                className="rounded-xl bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-[var(--brand-dark)]"
              >
                Novo motorista
              </Link>
              <button
                type="button"
                className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--ink)]"
                onClick={logout}
              >
                Sair
              </button>
            </>
          }
        />

        <Card>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-[var(--ink)]">
                Filtros de busca
              </h2>
              <p className="text-sm text-[var(--muted)]">
                Combine os filtros para refinar os resultados por localidade e
                tipo de veiculo.
              </p>
            </div>

            <DriversFilters
              filters={filters}
              totalLabel={totalLabel}
              onFieldChange={handleFieldChange}
              onToggleVehicleType={toggleVehicleType}
              onApply={handleApplyFilters}
              onClear={handleClearFilters}
            />
          </div>
        </Card>

        <Card>
          <div className="flex flex-col gap-4">
            {successMessage ? (
              <Alert variant="success" onDismiss={handleDismissSuccess}>
                {successMessage}
              </Alert>
            ) : null}

            {error ? <Alert variant="error">{error}</Alert> : null}

            <DriversTable
              drivers={drivers}
              isLoading={isLoading}
              sortValue={sortValue}
              onSortChange={handleSortChange}
            />

            <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-[var(--muted)]">
              <span>
                Mostrando {drivers.length} de {totalElements}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 0 || isLoading}
                >
                  Anterior
                </button>
                <span className="px-2 text-xs text-[var(--muted)]">
                  Pagina {totalPages === 0 ? 0 : page + 1} de {totalPages}
                </span>
                <button
                  type="button"
                  className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page + 1 >= totalPages || isLoading}
                >
                  Proxima
                </button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
