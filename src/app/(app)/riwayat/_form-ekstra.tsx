'use client';

import { useState } from 'react';
import { tambahEkstra } from '@/lib/actions';
import { parseRp, formatRp } from '@/lib/format';

export function FormEkstra({ hariIni }: { hariIni: string }) {
  const [nama, setNama] = useState('');
  const [nominal, setNominal] = useState('');
  const [tanggal, setTanggal] = useState(hariIni);
  const [catatan, setCatatan] = useState('');

  const n = parseRp(nominal);
  const sah = nama.trim() !== '' && n !== null && n > 0;

  return (
    <form
      action={tambahEkstra}
      onSubmit={() => {
        setNama('');
        setNominal('');
        setCatatan('');
      }}
      className="space-y-3 rounded-xl border border-border bg-surface p-4"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm">Nama</span>
          <input
            name="nama"
            required
            maxLength={100}
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Beli kopi"
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
          />
        </label>
        <label className="block">
          <span className="text-sm">Nominal</span>
          <input
            name="nominal"
            inputMode="numeric"
            required
            value={nominal}
            onChange={(e) => setNominal(e.target.value)}
            placeholder="25.000"
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 font-mono"
          />
        </label>
        <label className="block">
          <span className="text-sm">Tanggal</span>
          <input
            name="tanggal"
            type="date"
            required
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
          />
        </label>
        <label className="block">
          <span className="text-sm">Catatan (opsional)</span>
          <input
            name="catatan"
            maxLength={500}
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
          />
        </label>
      </div>
      {n !== null && n > 0 && (
        <p className="text-xs text-muted">Tersimpan sebagai {formatRp(n)}</p>
      )}
      <button
        type="submit"
        disabled={!sah}
        className="rounded-lg bg-primary px-4 py-2 font-medium text-primary-fg disabled:opacity-50"
      >
        Tambah
      </button>
    </form>
  );
}
