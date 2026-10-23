'use client';

import { useState } from 'react';
import { buatRutin } from '@/lib/actions';
import { parseRp, formatRp } from '@/lib/format';

const HARI = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

export function FormRutin({
  tawarkanTerapkan,
  adaPeriode,
}: {
  tawarkanTerapkan: boolean;
  adaPeriode: boolean;
}) {
  const [nama, setNama] = useState('');
  const [anggaran, setAnggaran] = useState('');
  const [hari, setHari] = useState<number[]>([]);

  const a = parseRp(anggaran);
  const sah = nama.trim() !== '' && a !== null && a > 0 && hari.length > 0;

  function toggle(h: number) {
    setHari((prev) =>
      prev.includes(h) ? prev.filter((x) => x !== h) : [...prev, h].sort(),
    );
  }

  return (
    <form
      action={buatRutin}
      onSubmit={() => {
        setNama('');
        setAnggaran('');
        setHari([]);
      }}
      className="space-y-4 rounded-3xl border border-border bg-surface p-5"
    >
      <h2 className="font-medium">Tambah pengeluaran rutin</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm">Nama</span>
          <input
            name="nama"
            required
            maxLength={100}
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Sarapan"
            className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2"
          />
        </label>
        <label className="block">
          <span className="text-sm">Anggaran per hari</span>
          <input
            name="anggaran_per_hari"
            inputMode="numeric"
            required
            value={anggaran}
            onChange={(e) => setAnggaran(e.target.value)}
            placeholder="15.000"
            className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 font-mono"
          />
          {a !== null && a > 0 && (
            <span className="mt-1 block text-xs text-muted">
              {formatRp(a)} setiap hari yang dipilih
            </span>
          )}
        </label>
      </div>

      <fieldset>
        <legend className="text-sm">Hari</legend>
        <div className="mt-2 grid grid-cols-7 gap-1.5">
          {HARI.map((label, h) => {
            const on = hari.includes(h);
            return (
              <label
                key={h}
                className={`flex cursor-pointer items-center justify-center rounded-xl border py-2 text-xs ${
                  on
                    ? 'border-primary bg-primary text-primary-fg'
                    : 'border-border bg-background'
                }`}
              >
                <input
                  type="checkbox"
                  name="hari"
                  value={h}
                  checked={on}
                  onChange={() => toggle(h)}
                  className="sr-only"
                />
                {label}
              </label>
            );
          })}
        </div>
      </fieldset>

      {tawarkanTerapkan && (
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="terapkan" value="1" defaultChecked />
          Terapkan ke periode jatah ini (membentuk target sejak tanggal mulai)
        </label>
      )}
      {adaPeriode && !tawarkanTerapkan && (
        <p className="text-xs text-muted">
          Periode berjalan sudah punya daftar harian. Perubahan rutin ini berlaku
          untuk periode berikutnya.
        </p>
      )}

      <button
        type="submit"
        disabled={!sah}
        className="rounded-xl bg-primary px-5 py-2.5 font-semibold text-primary-fg disabled:opacity-50"
      >
        Simpan
      </button>
    </form>
  );
}
