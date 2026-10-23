import Link from 'next/link';

const NAav = [
  { href: '/tentang', label: 'Tentang' },
  { href: '/cara-pakai', label: 'Cara pakai' },
  { href: '/changelog', label: 'Changelog' },
  { href: '/privasi', label: 'Privasi' },
];

// Kerangka halaman publik (§10.1).
export function KerangkaPublik({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-border">
        <nav className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="text-lg font-semibold">
            Jatahku
          </Link>
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            {NAav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="text-muted hover:text-foreground">
                  {n.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/masuk"
                className="rounded-lg bg-primary px-3 py-2 font-medium text-primary-fg"
              >
                Masuk
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        {children}
      </main>
      <footer className="border-t border-border">
        <div className="mx-auto max-w-3xl px-4 py-6 text-sm text-muted">
          <p>
            Jatahku mencatat manual. Tidak terhubung ke rekening bank, tidak
            memindahkan uang.
          </p>
          <p className="mt-2">
            <Link href="/privasi" className="underline">
              Kebijakan Privasi
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
