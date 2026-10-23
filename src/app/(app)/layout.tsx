import Link from 'next/link';
import { redirect } from 'next/navigation';
import { penggunaSaatIni } from '@/lib/auth/sesi';
import { ToggleTema } from '../_components/toggle-tema';
import { SembunyiProvider, TombolMata } from '../_components/sembunyi';
import { Maskot } from '../_components/maskot';
import { Savana } from '../_components/savana';

// Cache Components: baca cookies() di layout, jadi opt-out dari static shell.
// ponytail: instant=false sampai halaman auth dipecah ke Suspense (upgrade path: ADR auth+cache).
export const instant = false;

// Kerangka halaman dalam aplikasi. Wajib login (§9.1).
export default async function LayoutApp({
  children,
}: {
  children: React.ReactNode;
}) {
  const u = await penggunaSaatIni();
  if (!u) redirect('/masuk');

  return (
    <SembunyiProvider>
      <Savana />
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-border/70 bg-surface/75 backdrop-blur">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-2 px-3 py-2">
            <Link
              href="/beranda"
              className="flex min-w-0 shrink items-center gap-2 font-heading text-lg font-semibold"
            >
              <Maskot className="h-7 w-7 shrink-0" />
              <span className="truncate">Jatahku</span>
            </Link>
            <div className="flex shrink-0 items-center gap-1.5">
              <TombolMata />
              <ToggleTema />
              <form action="/api/auth/keluar" method="post">
                <button
                  type="submit"
                  className="h-11 rounded-xl border border-border bg-surface px-3 text-xs text-muted"
                >
                  Keluar
                </button>
              </form>
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-5 pb-24">
          {children}
        </main>
      </div>
    </SembunyiProvider>
  );
}
