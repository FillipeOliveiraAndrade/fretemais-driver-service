"use client";

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useCallback, useEffect, useState, type FormEvent } from "react";

import { ApiRequestError } from "@/lib/api";
import {
  deleteDriver,
  fetchDriver,
  type DriverPayload,
  updateDriver,
} from "@/lib/drivers";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import Alert from "@/components/Alert";
import Card from "@/components/Card";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import DriverForm, { type DriverFormValues } from "@/components/drivers/DriverForm";

const INITIAL_VALUES: DriverFormValues = {
  name: "",
  email: "",
  phone: "",
  city: "",
  state: "",
  vehicleTypes: [],
};

export default function DriverDetailPage() {
  const router = useRouter();
  const params = useParams();
  const driverId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const { logout } = useRequireAuth();

  const [form, setForm] = useState<DriverFormValues>(INITIAL_VALUES);
  const [active, setActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const loadDriver = useCallback(async () => {
    if (!driverId) {
      return;
    }

    setIsLoading(true);
    setLoadError(null);
    setNotFound(false);

    try {
      const data = await fetchDriver(driverId);

      setForm({
        name: data.name ?? "",
        email: data.email ?? "",
        phone: data.phone ?? "",
        city: data.city ?? "",
        state: data.state ?? "",
        vehicleTypes: data.vehicleTypes ?? [],
      });
      setActive(data.active);
    } catch (err) {
      if (err instanceof ApiRequestError) {
        if (err.status === 401) {
          router.push("/login");
          return;
        }

        if (err.status === 404) {
          setNotFound(true);
          setLoadError("Motorista nao encontrado.");
          return;
        }
      }

      setLoadError(err instanceof Error ? err.message : "Erro ao carregar dados.");
    } finally {
      setIsLoading(false);
    }
  }, [driverId, router]);

  useEffect(() => {
    loadDriver();
  }, [loadDriver]);

  const handleFieldChange = (
    field: keyof DriverFormValues,
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleVehicleType = (type: string) => {
    setForm((prev) => ({
      ...prev,
      vehicleTypes: prev.vehicleTypes.includes(type)
        ? prev.vehicleTypes.filter((item) => item !== type)
        : [...prev.vehicleTypes, type],
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    if (!driverId) {
      return;
    }

    if (form.vehicleTypes.length === 0) {
      setFormError("Selecione ao menos um tipo de veiculo.");
      return;
    }

    const payload: DriverPayload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone?.trim() ? form.phone.trim() : null,
      city: form.city.trim(),
      state: form.state.trim(),
      vehicleTypes: form.vehicleTypes,
    };

    setIsSaving(true);

    try {
      await updateDriver(driverId, payload);
      router.push("/drivers?success=updated");
    } catch (err) {
      if (err instanceof ApiRequestError) {
        if (err.status === 401) {
          router.push("/login");
          return;
        }

        if (err.fields) {
          setFormError(Object.values(err.fields).join(" "));
          return;
        }
      }

      setFormError(
        err instanceof Error ? err.message : "Erro ao salvar motorista."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!driverId) {
      return;
    }

    const confirmed = window.confirm("Deseja excluir este motorista?");
    if (!confirmed) {
      return;
    }

    try {
      await deleteDriver(driverId);
      router.push("/drivers?success=deleted");
    } catch (err) {
      if (err instanceof ApiRequestError && err.status === 401) {
        router.push("/login");
        return;
      }

      setFormError(
        err instanceof Error ? err.message : "Erro ao excluir motorista."
      );
    }
  };

  return (
    <main className="min-h-screen bg-[var(--bg)] px-6 py-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <PageHeader
          title="Detalhes do motorista"
          subtitle="Atualize informacoes e mantenha o cadastro sempre atualizado."
          actions={
            <>
              <Link href="/drivers" className="text-sm font-semibold text-[var(--brand)]">
                Voltar para lista
              </Link>
              <button
                type="button"
                className="rounded-xl border border-[var(--border)] px-3 py-2 text-xs font-semibold text-[var(--ink)]"
                onClick={logout}
              >
                Sair
              </button>
            </>
          }
        />

        <Card className="p-8">
          {isLoading ? (
            <div className="text-sm text-[var(--muted)]">Carregando...</div>
          ) : notFound ? (
            <div className="flex flex-col gap-4">
              {loadError ? <Alert variant="error">{loadError}</Alert> : null}
              <p className="text-sm text-[var(--muted)]">
                O motorista informado nao existe ou foi removido.
              </p>
              <div>
                <Link
                  href="/drivers"
                  className="text-sm font-semibold text-[var(--brand)]"
                >
                  Voltar para a lista
                </Link>
              </div>
            </div>
          ) : loadError ? (
            <div className="flex flex-col gap-4">
              <Alert variant="error">{loadError}</Alert>
              <button
                type="button"
                className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--ink)]"
                onClick={loadDriver}
              >
                Tentar novamente
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-[var(--ink)]">
                    {form.name || "Motorista"}
                  </h2>
                  <p className="text-sm text-[var(--muted)]">{form.email}</p>
                </div>
                <StatusBadge active={active} />
              </div>

              <DriverForm
                values={form}
                onChange={handleFieldChange}
                onToggleVehicleType={toggleVehicleType}
                onSubmit={handleSubmit}
                onCancel={() => router.push("/drivers")}
                onDelete={handleDelete}
                submitLabel="Salvar alteracoes"
                isSubmitting={isSaving}
                error={formError}
              />
            </div>
          )}
        </Card>
      </div>
    </main>
  );
}
