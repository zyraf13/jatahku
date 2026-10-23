'use client';

import { useState } from 'react';
import { simpanFeedback } from '@/lib/actions';

export function FormFeedback() {
  const [isi, setIsi] = useState('');
  const [kategori, setKategori] = useState('umum');
  const [terkirim, setTerkirim] = useState(false);

  if (terkirim) {
    return (
      <div className="rounded-xl border border-border bg-surface p-4">
        <p className="text-primary">Terima kasih. Masukanmu sudah tersimpan.</p>
        <button
          type="button"
          onClick={() => {
            setTerkirim(false);
            setIsi('');
          }}
          className="mt-2 text-sm underline"
        >
          Kirim lagi
        </button>
      </div>
    );
  }

  return (
    <form
      action={async (fd) => {
        await simpanFeedback(fd);
        setTerkirim(true);
      }}
      className="space-y-3 rounded-xl border border-border bg-surface p-4"
    >
      <label className="block">
        <span className="text-sm">Kategori</span>
        <select
          name="kategori"
          value={kategori}
          onChange={(e) => setKategori(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
        >
          <option value="umum">Umum</option>
          <option value="masalah">Ada masalah</option>
          <option value="ide">Usulan fitur</option>
        </select>
      </label>
      <label className="block">
        <span className="text-sm">Masukan</span>
        <textarea
          name="isi"
          required
          maxLength={2000}
          rows={4}
          value={isi}
          onChange={(e) => setIsi(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
        />
      </label>
      <button
        type="submit"
        disabled={isi.trim() === ''}
        className="rounded-lg bg-primary px-4 py-2 font-medium text-primary-fg disabled:opacity-50"
      >
        Kirim
      </button>
    </form>
  );
}
