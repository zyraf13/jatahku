'use client';

import { useState, useTransition } from 'react';
import { hapusAkun } from '@/lib/actions';

// Konfirmasi keras: ketik email untuk mengaktifkan tombol. Aksi tak bisa dibatalkan.
export function HapusAkun({ email }: { email: string }) {
  const [buka, setBuka] = useState(false);
  const [ketik, setKetik] = useState('');
  const [pending, mulai] = useTransition();

  if (!buka) {
    return (
      <button
        type="button"
        onClick={() => setBuka(true)}
        className="rounded-lg bg-danger px-4 py-2 font-medium text-white"
      >
        Hapus akun saya
      </button>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm">
        Ketik <strong>{email}</strong> untuk mengonfirmasi. Seluruh catatan akan
        terhapus permanen.
      </p>
      <input
        value={ketik}
        onChange={(e) => setKetik(e.target.value)}
        className="w-full rounded-lg border border-border bg-background px-3 py-2"
      />
      <div className="flex gap-2">
        <button
          type="button"
          disabled={ketik !== email || pending}
          onClick={() => mulai(() => hapusAkun())}
          className="rounded-lg bg-danger px-4 py-2 font-medium text-white disabled:opacity-50"
        >
          Hapus permanen
        </button>
        <button
          type="button"
          onClick={() => {
            setBuka(false);
            setKetik('');
          }}
          className="rounded-lg border border-border px-4 py-2"
        >
          Batal
        </button>
      </div>
    </div>
  );
}
