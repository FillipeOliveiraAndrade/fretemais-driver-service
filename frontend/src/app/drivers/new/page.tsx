"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { ApiRequestError } from "@/lib/api";
import { createDriver, type DriverPayload } from "@/lib/drivers";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import Card from "@/components/Card";
import PageHeader from "@/components/PageHeader";
import DriverForm, { type DriverFormValues } from "@/components/drivers/DriverForm";

const INITIAL_VALUES: DriverFormValues = {
  name: "",
  email: "",
  phone: "",
  city: "",
  state: "",
  vehicleTypes: [],
};

export default function NewDriverPage() {
  const router = useRouter();
  const { logout } = useRequireAuth();

  const [form, setForm] = useState<DriverFormValues>(INITIAL_VALUES);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setError(null);

    if (form.vehicleTypes.length === 0) {
      setError("Selecione ao menos um tipo de veiculo.");
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

    setIsSubmitting(true);

    try {
      await createDriver(payload);
      router.push("/drivers?success=created");
    } catch (err) {
      if (err instanceof ApiRequestError) {
        if (err.status === 401) {
          router.push("/login");
          return;
        }

        if (err.fields) {
          setError(Object.values(err.fields).join(" "));
          return;
        }
      }

      setError(err instanceof Error ? err.message : "Erro ao salvar motorista.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--bg)] px-6 py-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <PageHeader
          title="Novo motorista"
          subtitle="Preencha os dados principais para cadastrar um motorista parceiro."
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
          <DriverForm
            values={form}
            onChange={handleFieldChange}
            onToggleVehicleType={toggleVehicleType}
            onSubmit={handleSubmit}
            onCancel={() => router.push("/drivers")}
            submitLabel="Salvar motorista"
            statusLabel="Ativo"
            isSubmitting={isSubmitting}
            error={error}
          />
        </Card>
      </div>
    </main>
  );
}
