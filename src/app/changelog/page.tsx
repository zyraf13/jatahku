import { KerangkaPublik } from '../_components/kerangka-publik';

export const metadata = { title: 'Changelog — Jatahku' };

const RILIS = [
  {
    versi: 'v1.0 (MVP)',
    tanggal: 'Segera',
    isi: [
      'Masuk dengan Google',
      'Periode jatah dengan konfirmasi & penguncian',
      'Pengeluaran rutin + pilihan hari + urutan',
      'Target harian otomatis + terapkan ke periode berjalan',
      'Centang pembayaran + nominal aktual',
      'Pengeluaran tambahan',
      'Beranda: saldo tersisa & jatah aman per hari',
      'Riwayat + catat pembayaran lampau',
      'Sembunyikan nominal, tema terang/gelap',
      'Hapus akun mandiri',
    ],
  },
];

export default function Changelog() {
  return (
    <KerangkaPublik>
      <article className="space-y-6">
        <h1 className="text-2xl font-semibold">Changelog</h1>
        {RILIS.map((r) => (
          <section key={r.versi} className="rounded-xl border border-border bg-surface p-5">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-lg font-semibold">{r.versi}</h2>
              <span className="text-sm text-muted">{r.tanggal}</span>
            </div>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-muted">
              {r.isi.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </section>
        ))}
      </article>
    </KerangkaPublik>
  );
}
