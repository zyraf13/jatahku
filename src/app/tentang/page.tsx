import { KerangkaPublik } from '../_components/kerangka-publik';

export const metadata = { title: 'Tentang — Jatahku' };

// §10.1: rumus dipublikasikan terbuka. Keputusan produk, bukan kotak hitam.
export default function Tentang() {
  return (
    <KerangkaPublik>
      <article className="max-w-none space-y-6">
        <h1 className="text-2xl font-semibold">Tentang Jatahku</h1>

        <p>
          Orang bergaji menerima uang sekaligus di awal periode, lalu
          menghabiskannya tanpa tahu &ldquo;sisa ini aman dipakai berapa per hari
          sampai gajian berikutnya&rdquo;. Kalkulator pengeluaran biasa cuma
          mencatat masa lalu — tidak memproyeksikan sisa hari.
        </p>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Periode jatah</h2>
          <p className="text-muted">
            Rentang waktu penggunaan uang. Kamu memilih tanggal mulai dan tanggal
            akhir bebas. Periode berlaku dari tanggal mulai sampai{' '}
            <strong>sehari sebelum</strong> tanggal akhir — tanggal akhir adalah
            batas, bukan hari yang dihitung.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Rumus saldo &amp; jatah aman</h2>
          <p className="text-muted">
            Kami tidak menyembunyikan cara hitungnya. Ini rumus lengkapnya:
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-surface p-4 text-sm">
{`Total terpakai       = Σ pembayaran rutin (pakai NOMINAL AKTUAL)
                     + Σ pengeluaran tambahan
Saldo tersisa        = jatah awal − total terpakai
Sisa anggaran rutin  = Σ rencana dari SEMUA target yang BELUM dicentang
                       (termasuk dari hari sebelumnya)
Hari tersisa         = hari ini sampai sehari sebelum tanggal akhir
                       (hari ini ikut dihitung)
Jatah aman per hari  = floor( (saldo tersisa − sisa anggaran rutin) ÷ hari tersisa )`}
          </pre>
          <ul className="list-disc space-y-1 pl-5 text-muted">
            <li>Pengeluaran yang belum dicentang tidak mengurangi saldo, tapi disisihkan.</li>
            <li>Pembagian selalu dibulatkan ke bawah. Angka ini janji — jangan dilebihkan.</li>
            <li>Hasil bisa negatif. Itu peringatan, bukan tagihan dan bukan utang.</li>
            <li>Setelah periode selesai, jatah aman per hari berhenti dihitung.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Maskot</h2>
          <p className="text-muted">
            Karakter pendamping yang jadi indikator status, bukan hiasan. Maskot
            tidak pernah menghakimi: kalau kamu boros, dia menunjukkan perhatian,
            bukan kekecewaan.
          </p>
        </section>
      </article>
    </KerangkaPublik>
  );
}
