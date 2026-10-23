'use client';

import { useCallback, useSyncExternalStore } from 'react';

type Tema = 'terang' | 'gelap';
const Kunci = 'jatahku-tema';
const EVEN = 'jatahku-tema-berubah';

function langganan(cb: () => void) {
  window.addEventListener(EVEN, cb);
  window.addEventListener('storage', cb);
  return () => {
    window.removeEventListener(EVEN, cb);
    window.removeEventListener('storage', cb);
  };
}
function snapshot(): Tema {
  const t = localStorage.getItem(Kunci) as Tema | null;
  if (t) return t;
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'gelap' : 'terang';
}
function serverSnapshot(): Tema {
  return 'terang';
}

export function ToggleTema() {
  const tema = useSyncExternalStore(langganan, snapshot, serverSnapshot);

  const ganti = useCallback(() => {
    const baru: Tema = snapshot() === 'gelap' ? 'terang' : 'gelap';
    localStorage.setItem(Kunci, baru);
    document.documentElement.classList.toggle('dark', baru === 'gelap');
    window.dispatchEvent(new Event(EVEN));
  }, []);

  return (
    <button
      type="button"
      onClick={ganti}
      aria-label={`Ganti ke tema ${tema === 'gelap' ? 'terang' : 'gelap'}`}
      title={tema === 'gelap' ? 'Tema terang' : 'Tema gelap'}
      className="grid h-11 w-11 place-items-center rounded-xl border border-border bg-surface text-base"
    >
      <span aria-hidden>{tema === 'gelap' ? '☀️' : '🌙'}</span>
    </button>
  );
}
