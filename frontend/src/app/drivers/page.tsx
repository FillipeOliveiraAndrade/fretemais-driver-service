import { Suspense } from "react";

import DriversPageClient from "./DriversPageClient";

export default function DriversPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--bg)] px-6 py-10 text-sm text-[var(--muted)]">
          Carregando...
        </div>
      }
    >
      <DriversPageClient />
    </Suspense>
  );
}
