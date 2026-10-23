'use client';

import { useTransition, useState } from 'react';
import { hapusRutin } from '@/lib/actions';
import { Nominal } from '../../_components/sembunyi';

const HARI = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

export function ItemRutin({
  id,
  nama,
  anggaran,
  hari,
  pertama,
  terakhir,
}: {
  id: string;
  nama: string;
  anggaran: number;
  hari: number[];
  pertama: boolean;
  terakhir: boolean;
}) {
  const [pending, mulai] = useTransition();
  const [urutan, setUrutan] = useState<number[]>(hari);

  function geser(i: number, arah: -1 | 1) {
    const j = i + arah;
    if (j < 0 || j >= urutan.length) return;
    const baru = [...urutan];
    [baru[i], baru[j]] = [baru[j], baru[i]];
    setUrutan(baru);
  }

  return (
    <li className="rounded-xl border border-border bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium">{nama}</p>
          <p className="text-xs text-muted">
            Setiap: {urutan.sort().map((h) => HARI[h]).join(', ')}
          </p>
        </div>
        <Nominal nilai={anggaran} className="font-mono" />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {/* §10.5: tombol naik/turun — drag saja tidak aksesibel */}
        <button
          type="button"
          disabled={pertama}
          onClick={() => geser(0, -1)}
          aria-label={`Naikkan ${nama}`}
          className="rounded-lg border border-border px-3 py-2 text-sm disabled:opacity-40"
        >
          Naik
        </button>
        <button
          type="button"
          disabled={terakhir}
          onClick={() => geser(urutan.length - 1, 1)}
          aria-label={`Turunkan ${nama}`}
          className="rounded-lg border border-border px-3 py-2 text-sm disabled:opacity-40"
        >
          Turun
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => mulai(() => hapusRutin(id))}
          aria-label={`Hapus ${nama}`}
          className="rounded-lg border border-border px-3 py-2 text-sm text-danger"
        >
          Hapus
        </button>
      </div>
    </li>
  );
}
