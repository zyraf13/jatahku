import { KerangkaPublik } from '../_components/kerangka-publik';

export const metadata = { title: 'Cara pakai — Jatahku' };

const FASE = [
  { n: 1, judul: 'Isi jatah periode', isi: 'Masukkan jatah, tanggal mulai, dan tanggal akhir. Ada layar konfirmasi: jatah & tanggal tidak bisa diubah setelah disimpan.' },
  { n: 2, judul: 'Tambah pengeluaran rutin', isi: 'Nama, anggaran per hari, pilih hari. Lalu terapkan ke periode jatah ini.' },
  { n: 3, judul: 'Centang hari ini', isi: 'Tandai pembayaran yang sudah dilakukan. Ubah nominal aktual bila berbeda.' },
  { n: 4, judul: 'Catat yang lampau', isi: 'Di Riwayat, catat pembayaran tanggal lampau dan pengeluaran tambahan.' },
  { n: 5, judul: 'Lihat jatah aman', isi: 'Beranda menghitung ulang jatah aman per hari setiap kali ada catatan baru.' },
];

const FAQ = [
  ['Jatah aman per hari itu apa?', 'Ruang belanja di luar kebutuhan rutin, per hari, sampai akhir periode.'],
  ['Kenapa jatah aman bisa negatif?', 'Saldo tersisa belum menutup seluruh anggaran rutin yang belum dicatat. Ini peringatan, bukan utang.'],
  ['Apakah tersambung ke rekening bank?', 'Tidak. Semua catatan manual. Aplikasi tidak memindahkan uang.'],
  ['Kenapa jatah awal tidak bisa diubah?', 'Itu kontrak awal periode. Kalau bisa diedit, angka jatah aman kehilangan makna sebagai alat disiplin.'],
  ['Kalau salah input nominal?', 'Nominal aktual pembayaran dan pengeluaran tambahan boleh dikoreksi. Yang dikunci hanya jatah awal dan tanggal.'],
  ['Bedanya pengeluaran rutin dan tambahan?', 'Rutin berulang dengan jadwal hari. Tambahan belanja di luar rencana.'],
  ['Kalau saya skip mencentang beberapa hari?', 'Target lampau yang belum dicentang tetap disisihkan, dan bisa dicatat lewat Riwayat.'],
  ['Apakah data hilang kalau logout?', 'Tidak. Data tetap tersimpan dan bisa dilihat lagi saat masuk.'],
];

export default function CaraPakai() {
  return (
    <KerangkaPublik>
      <article className="space-y-8">
        <h1 className="text-2xl font-semibold">Cara pakai</h1>

        <ol className="space-y-4">
          {FASE.map((f) => (
            <li key={f.n} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary font-medium text-primary-fg">
                {f.n}
              </span>
              <div>
                <p className="font-medium">{f.judul}</p>
                <p className="text-muted">{f.isi}</p>
              </div>
            </li>
          ))}
        </ol>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Pertanyaan umum</h2>
          <dl className="space-y-3">
            {FAQ.map(([q, a]) => (
              <div key={q} className="rounded-xl border border-border bg-surface p-4">
                <dt className="font-medium">{q}</dt>
                <dd className="mt-1 text-muted">{a}</dd>
              </div>
            ))}
          </dl>
        </section>
      </article>
    </KerangkaPublik>
  );
}
