import Link from 'next/link';

const MENU = [
  { href: '/beranda', label: 'Beranda' },
  { href: '/hari-ini', label: 'Hari Ini' },
  { href: '/riwayat', label: 'Riwayat' },
  { href: '/rutin', label: 'Rutin' },
  { href: '/pengaturan', label: 'Atur' },
];

// Menu bawah model kaca, aman dari gesture bar (§11.4).
export function MenuBawah({ aktif }: { aktif: string }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 rounded-t-3xl border-t border-border bg-surface/85 backdrop-blur pb-[env(safe-area-inset-bottom)]">
      <ul className="mx-auto flex max-w-3xl gap-1 px-2 pt-1.5">
        {MENU.map((m) => {
          const on = m.href === aktif;
          return (
            <li key={m.href} className="flex-1">
              <Link
                href={m.href}
                aria-current={on ? 'page' : undefined}
                className={`flex flex-col items-center justify-center rounded-2xl py-2 text-xs transition-colors ${
                  on ? 'bg-halus font-semibold text-primary' : 'text-muted'
                }`}
              >
                {m.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
