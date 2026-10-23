'use client';

import { useTransition } from 'react';
import { hapusEkstra } from '@/lib/actions';

export function HapusEkstra({ id }: { id: string }) {
  const [pending, mulai] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => mulai(() => hapusEkstra(id))}
      aria-label="Hapus"
      className="rounded-lg border border-border px-2 py-1 text-sm text-danger"
    >
      Hapus
    </button>
  );
}
