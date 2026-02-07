"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";

import Alert from "@/components/Alert";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

type LoginResponse = {
  token: string;
  expiresAt: string;
};

type ApiError = {
  message?: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
      setError("Informe email e senha para continuar.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        let message = "Nao foi possivel autenticar. Verifique seus dados.";

        try {
          const payload = (await response.json()) as ApiError;
          if (payload?.message) {
            message = payload.message;
          }
        } catch {
          // ignore
        }

        setError(message);
        return;
      }

      const data = (await response.json()) as LoginResponse;

      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("auth_expires_at", data.expiresAt);
      localStorage.setItem("auth_email", email);

      router.push("/drivers");
    } catch (err) {
      setError("Nao foi possivel conectar ao servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--bg)]">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[rgba(15,118,110,0.18)] blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 translate-x-1/3 translate-y-1/3 rounded-full bg-[rgba(245,158,11,0.18)] blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-lg items-center px-6 py-14">
        <div className="w-full rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[var(--shadow)]">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--brand)]">
              FreteMais
            </p>
            <h1 className="mt-3 text-3xl font-[var(--font-display)] text-[var(--ink)]">
              Acesso interno
            </h1>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Entre para gerenciar o cadastro e a busca de motoristas parceiros.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <div>
              <label
                className="text-sm font-medium text-[var(--ink)]"
                htmlFor="email"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="nome@fretemais.com"
                className="mt-2 w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 text-sm text-[var(--ink)] shadow-sm outline-none transition focus:border-[var(--brand)] focus:ring-2 focus:ring-[rgba(15,118,110,0.25)]"
                required
              />
            </div>

            <div>
              <label
                className="text-sm font-medium text-[var(--ink)]"
                htmlFor="password"
              >
                Senha
              </label>
              <div className="relative mt-2">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Sua senha"
                  className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 pr-20 text-sm text-[var(--ink)] shadow-sm outline-none transition focus:border-[var(--brand)] focus:ring-2 focus:ring-[rgba(15,118,110,0.25)]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[var(--muted)] transition hover:text-[var(--ink)]"
                  aria-pressed={showPassword}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-[var(--muted)]">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="remember"
                  className="h-4 w-4 rounded border-[var(--border)] accent-[var(--brand)]"
                />
                Manter conectado
              </label>
            </div>

            {error ? <Alert variant="error">{error}</Alert> : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full rounded-xl bg-[var(--brand)] px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[var(--brand-dark)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand)] ${
                isSubmitting ? "cursor-not-allowed opacity-70" : "cursor-pointer"
              }`}
            >
              {isSubmitting ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-4 text-xs text-[var(--muted)]">
            Credenciais de teste: admin@fretemais.com / fretemais@2026
          </div>
        </div>
      </div>
    </main>
  );
}
