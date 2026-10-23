'use client';

import {
  createContext,
  useContext,
  useCallback,
  useSyncExternalStore,
} from 'react';
import { formatRp } from '@/lib/format';

const Kunci = 'jatahku-sembunyi';
const EVEN = 'jatahku-sembunyi-berubah';

// Baca localStorage lewat useSyncExternalStore — hindari setState di effect.
function langganan(cb: () => void) {
  window.addEventListener(EVEN, cb);
  window.addEventListener('storage', cb);
  return () => {
    window.removeEventListener(EVEN, cb);
    window.removeEventListener('storage', cb);
  };
}
function snapshot() {
  return localStorage.getItem(Kunci) === '1';
}
function serverSnapshot() {
  return false;
}

const Ctx = createContext<{ sembunyi: boolean; balik: () => void }>({
  sembunyi: false,
  balik: () => {},
});

export function SembunyiProvider({ children }: { children: React.ReactNode }) {
  const sembunyi = useSyncExternalStore(langganan, snapshot, serverSnapshot);

  const balik = useCallback(() => {
    localStorage.setItem(Kunci, snapshot() ? '0' : '1');
    window.dispatchEvent(new Event(EVEN));
  }, []);

  return <Ctx.Provider value={{ sembunyi, balik }}>{children}</Ctx.Provider>;
}

export function useSembunyi() {
  return useContext(Ctx);
}

// Tombol mata (§11.3). Menyembunyikan SEMUA nominal.
export function TombolMata() {
  const { sembunyi, balik } = useSembunyi();
  return (
    <button
      type="button"
      onClick={balik}
      aria-pressed={sembunyi}
      aria-label={sembunyi ? 'Tampilkan nominal' : 'Sembunyikan nominal'}
      title={sembunyi ? 'Tampilkan nominal' : 'Sembunyikan nominal'}
      className="grid h-11 w-11 place-items-center rounded-xl border border-border bg-surface text-base"
    >
      <span aria-hidden>{sembunyi ? '🙈' : '👁️'}</span>
    </button>
  );
}

// Angka tunggal. Server kirim nilai asli, client ganti jadi titik-titik kalau disembunyikan.
export function Nominal({
  nilai,
  className,
}: {
  nilai: number;
  className?: string;
}) {
  const { sembunyi } = useSembunyi();
  return (
    <span className={className}>{sembunyi ? '••••••' : formatRp(nilai)}</span>
  );
}
