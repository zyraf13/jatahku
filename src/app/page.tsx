import Link from 'next/link';
import { KerangkaPublik } from './_components/kerangka-publik';

export default function Landing() {
  return (
    <KerangkaPublik>
      <section className="py-8">
        <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
          Hari ini saya boleh belanja berapa di luar kebutuhan rutin?
        </h1>
        <p className="mt-4 text-lg text-muted">
          Jatahku mengubah satu jatah uang menjadi angka harian yang jelas sampai
          gajian berikutnya. Atur jatah, centang yang sudah dibayar, lihat jatah
          aman per hari.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/masuk"
            className="inline-flex items-center rounded-xl bg-primary px-5 py-3 font-medium text-primary-fg"
          >
            Masuk dengan Google
          </Link>
          <Link
            href="/cara-pakai"
            className="inline-flex items-center rounded-xl border border-border bg-surface px-5 py-3 font-medium"
          >
            Cara pakai
          </Link>
        </div>
        <p className="mt-3 text-sm text-muted">
          Masuk dengan Google. Tidak terhubung ke rekening bank.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          {
            judul: 'Saldo',
            isi: 'Sisa uang jatah setelah semua catatan. Bukan saldo rekening asli.',
            angka: 'Rp1.240.000',
          },
          {
            judul: 'Rencana',
            isi: 'Biaya rutin dengan anggaran per hari dan pilihan hari.',
            angka: 'Sarapan Rp15.000',
          },
          {
            judul: 'Centang',
            isi: 'Tandai yang sudah dibayar. Nominal aktual boleh berbeda.',
            angka: '5 dari 7 hari',
          },
        ].map((k) => (
          <div key={k.judul} className="rounded-2xl border border-border bg-surface p-5">
            <p className="text-sm font-medium text-primary">{k.judul}</p>
            <p className="mt-2 font-mono text-lg">{k.angka}</p>
            <p className="mt-2 text-sm text-muted">{k.isi}</p>
          </div>
        ))}
      </section>
    </KerangkaPublik>
  );
}
