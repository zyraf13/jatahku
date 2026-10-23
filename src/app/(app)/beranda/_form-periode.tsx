'use client';

import { useState } from 'react';
import { buatPeriode } from '@/lib/actions';
import { formatRp, parseRp } from '@/lib/format';

// §7.1: layar konfirmasi eksplisit sebelum simpan. Setelah itu read-only.
export function FormPeriode() {
  const [jatah, setJatah] = useState('');
  const [mulai, setMulai] = useState('');
  const [akhir, setAkhir] = useState('');
  const [konfirmasi, setKonfirmasi] = useState(false);

  const jatahAngka = parseRp(jatah);

  if (konfirmasi) {
    return (
      <div className="space-y-4 rounded-2xl border border-border bg-surface p-5">
        <h2 className="font-medium">Periksa dulu — ini tidak bisa diubah</h2>
        <ul className="space-y-1 text-sm">
          <li>
            Jatah: <strong>{jatahAngka !== null ? formatRp(jatahAngka) : '-'}</strong>
          </li>
          <li>
            Mulai: <strong>{mulai || '-'}</strong>
          </li>
          <li>
            Sampai sehari sebelum: <strong>{akhir || '-'}</strong>
          </li>
        </ul>
        <p className="text-sm text-danger">
          Jatah awal dan kedua tanggal tidak bisa diedit setelah disimpan. Yang
          boleh dikoreksi nanti hanya nominal pembayaran dan pengeluaran
          tambahan.
        </p>
        <form action={buatPeriode} className="flex flex-wrap gap-2">
          <input type="hidden" name="jatah_awal" value={String(jatahAngka ?? '')} />
          <input type="hidden" name="tanggal_mulai" value={mulai} />
          <input type="hidden" name="tanggal_akhir" value={akhir} />
          <button
            type="submit"
            className="rounded-lg bg-primary px-4 py-2 font-medium text-primary-fg"
          >
            Ya, simpan
          </button>
          <button
            type="button"
            onClick={() => setKonfirmasi(false)}
            className="rounded-lg border border-border px-4 py-2"
          >
            Ubah
          </button>
        </form>
      </div>
    );
  }

  const lengkap =
    jatahAngka !== null && jatahAngka > 0 && mulai !== '' && akhir !== '' && akhir > mulai;

  return (
    <form
      className="space-y-4 rounded-2xl border border-border bg-surface p-5"
      onSubmit={(e) => {
        e.preventDefault();
        if (lengkap) setKonfirmasi(true);
      }}
    >
      <label className="block">
        <span className="text-sm">Jatah periode ini</span>
        <input
          inputMode="numeric"
          placeholder="4.000.000"
          value={jatah}
          onChange={(e) => setJatah(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
        />
        {jatahAngka !== null && jatahAngka > 0 && (
          <span className="mt-1 block text-xs text-muted">{formatRp(jatahAngka)}</span>
        )}
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm">Tanggal mulai</span>
          <input
            type="date"
            value={mulai}
            onChange={(e) => setMulai(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
          />
        </label>
        <label className="block">
          <span className="text-sm">Tanggal akhir</span>
          <input
            type="date"
            value={akhir}
            onChange={(e) => setAkhir(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
          />
        </label>
      </div>
      <p className="text-xs text-muted">
        Periode berlaku sampai sehari sebelum tanggal akhir.
      </p>
      <button
        type="submit"
        disabled={!lengkap}
        className="rounded-lg bg-primary px-4 py-2 font-medium text-primary-fg disabled:opacity-50"
      >
        Lanjut
      </button>
    </form>
  );
}
