'use client';

import { useState, useTransition } from 'react';
import { centangPembayaran } from '@/lib/actions';
import { parseRp } from '@/lib/format';

export function TargetLampau({
  id,
  nama,
  tanggal,
  rencana,
}: {
  id: string;
  nama: string;
  tanggal: string;
  rencana: number;
}) {
  const [pending, mulai] = useTransition();
  const [nominal, setNominal] = useState(String(rencana));

  return (
    <li className="rounded-xl border border-border bg-surface p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p>{nama}</p>
          <p className="text-xs text-muted">{tanggal}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <input
          inputMode="numeric"
          value={nominal}
          onChange={(e) => setNominal(e.target.value)}
          className="flex-1 rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm"
        />
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            const n = parseRp(nominal);
            mulai(() => centangPembayaran(id, n ?? rencana));
          }}
          className="rounded-lg bg-primary px-4 py-2 font-medium text-primary-fg"
        >
          Catat
        </button>
      </div>
    </li>
  );
}
