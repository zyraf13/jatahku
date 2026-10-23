import Link from 'next/link';
import { penggunaWajib } from '@/lib/auth/sesi';
import { periodeBerjalan, ringkasanBerjalan, targetHariIni, hariIni } from '@/lib/queries';
import { Nominal } from '../../_components/sembunyi';
import { MenuBawah } from '../../_components/menu-bawah';
import { FormPeriode } from './_form-periode';

export const metadata = { title: 'Beranda — Jatahku' };

export default async function Beranda() {
  const u = await penggunaWajib();
  const periode = await periodeBerjalan(u.id);

  if (!periode) {
    return (
      <>
        <section className="space-y-4">
          <h1 className="text-2xl font-semibold">Mulai periode jatah</h1>
          <p className="text-muted">
            Isi jatah, tanggal mulai, dan tanggal akhir. Periode berlaku sampai
            sehari sebelum tanggal akhir.
          </p>
          <FormPeriode />
        </section>
        <MenuBawah aktif="/beranda" />
      </>
    );
  }

  const hasil = await ringkasanBerjalan(u.id);
  const r = hasil!.ringkasan;
  const hariIniTargets = (await targetHariIni(u.id)) ?? [];
  const belum = hariIniTargets.filter((t) => !t.dibayar).length;

  return (
    <>
      <section className="space-y-4">
        <div className="rounded-2xl border border-border bg-surface p-6">
          <p className="text-sm text-muted">Jatah aman per hari</p>
          {r.selesai ? (
            <p className="mt-1 text-3xl font-semibold">Periode selesai</p>
          ) : (
            <Nominal
              nilai={r.jatah_aman_per_hari ?? 0}
              className={`mt-1 block font-mono text-4xl font-semibold ${
                (r.jatah_aman_per_hari ?? 0) < 0 ? 'text-danger' : 'text-primary'
              }`}
            />
          )}
          {(r.jatah_aman_per_hari ?? 0) < 0 && !r.selesai && (
            <p className="mt-2 text-sm text-danger">
              Saldo tersisa belum menutup seluruh anggaran rutin yang belum
              dicatat. Ini peringatan, bukan tagihan dan bukan utang.
            </p>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-surface p-4">
            <p className="text-sm text-muted">Saldo tersisa</p>
            <Nominal nilai={r.saldo_tersisa} className="mt-1 block font-mono text-xl" />
            <p className="mt-1 text-xs text-muted">
              Catatan manual, bisa berbeda dari rekening asli.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-4">
            <p className="text-sm text-muted">Sisa anggaran rutin</p>
            <Nominal
              nilai={r.sisa_anggaran_rutin}
              className="mt-1 block font-mono text-xl"
            />
            <p className="mt-1 text-xs text-muted">
              Rencana yang belum dicentang, termasuk dari hari sebelumnya.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-4">
          <div className="flex items-center justify-between">
            <p className="font-medium">Hari ini ({hariIni()})</p>
            <span className="text-sm text-muted">
              {hariIniTargets.length === 0
                ? 'Tanpa jadwal'
                : `${belum} belum dicentang`}
            </span>
          </div>
          {hariIniTargets.length === 0 ? (
            <p className="mt-2 text-sm text-muted">
              Tidak ada pengeluaran rutin hari ini. Kamu bisa tetap mencatat
              pengeluaran tambahan.
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-border">
              {hariIniTargets.map((t) => (
                <li key={t.id} className="flex items-center justify-between py-2">
                  <span>{t.routine.nama}</span>
                  <Nominal nilai={t.nominalRencana} className="font-mono text-sm" />
                </li>
              ))}
            </ul>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href="/hari-ini"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-fg"
            >
              Centang hari ini
            </Link>
            <Link
              href="/rutin"
              className="rounded-lg border border-border px-4 py-2 text-sm"
            >
              Tambah pengeluaran rutin
            </Link>
            <Link
              href="/riwayat"
              className="rounded-lg border border-border px-4 py-2 text-sm"
            >
              Tambah pengeluaran
            </Link>
          </div>
        </div>

        <p className="text-xs text-muted">
          Periode {periode.tanggalMulai} sampai {periode.tanggalAkhir} ·{' '}
          {r.selesai ? 'selesai' : `${r.hari_tersisa} hari tersisa`}
        </p>
      </section>
      <MenuBawah aktif="/beranda" />
    </>
  );
}
