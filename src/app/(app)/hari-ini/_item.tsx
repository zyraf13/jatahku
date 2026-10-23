'use client';

import { useState, useTransition } from 'react';
import { centangPembayaran, batalCentang } from '@/lib/actions';
import { Nominal } from '../../_components/sembunyi';
import { parseRp, formatRp } from '@/lib/format';

export function ItemHariIni({
  id,
  nama,
  rencana,
  aktual,
  dibayar,
}: {
  id: string;
  nama: string;
  rencana: number;
  aktual: number | null;
  dibayar: boolean;
}) {
  const [pending, mulai] = useTransition();
  const [nominal, setNominal] = useState(
    aktual !== null ? String(aktual) : String(rencana),
  );

  function centang() {
    const nilai = parseRp(nominal);
    mulai(() => centangPembayaran(id, nilai ?? rencana));
  }

  return (
    <li className="rounded-xl border border-border bg-surface p-4">
      <div className="flex items-center justify-between gap-3">
        <span className={dibayar ? 'text-muted line-through' : ''}>{nama}</span>
        <Nominal nilai={dibayar ? (aktual ?? rencana) : rencana} className="font-mono" />
      </div>

      {dibayar ? (
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm text-primary">Sudah dibayar</span>
          <button
            type="button"
            disabled={pending}
            onClick={() => mulai(() => batalCentang(id))}
            className="rounded-lg border border-border px-3 py-2 text-sm"
          >
            Batal centang
          </button>
        </div>
      ) : (
        <div className="mt-3 flex items-center gap-2">
          <label className="flex-1">
            <span className="text-xs text-muted">Nominal aktual (boleh beda)</span>
            <input
              inputMode="numeric"
              value={nominal}
              onChange={(e) => setNominal(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm"
            />
          </label>
          <button
            type="button"
            disabled={pending}
            onClick={centang}
            className="mt-5 rounded-lg bg-primary px-4 py-2 font-medium text-primary-fg"
          >
            Centang
          </button>
        </div>
      )}
      {!dibayar && parseRp(nominal) !== null && parseRp(nominal) !== rencana && (
        <p className="mt-1 text-xs text-muted">
          Rencana {formatRp(rencana)}, aktual {formatRp(parseRp(nominal)!)}.
        </p>
      )}
    </li>
  );
}
