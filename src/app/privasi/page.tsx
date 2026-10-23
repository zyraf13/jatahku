import { KerangkaPublik } from '../_components/kerangka-publik';

export const metadata = { title: 'Kebijakan Privasi — Jatahku' };

export default function Privasi() {
  return (
    <KerangkaPublik>
      <article className="space-y-6">
        <h1 className="text-2xl font-semibold">Kebijakan Privasi</h1>
        <p className="text-sm text-muted">
          Berlaku berdasarkan UU No. 27 Tahun 2022 tentang Perlindungan Data
          Pribadi (UU PDP).
        </p>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Data yang dikumpulkan</h2>
          <ul className="list-disc space-y-1 pl-5 text-muted">
            <li>Identitas akun: nama, email, dan foto profil dari Google.</li>
            <li>Catatan keuangan yang kamu masukkan: jatah, pengeluaran rutin, pembayaran, pengeluaran tambahan, dan waktu pembuatan/pembaruannya.</li>
            <li>Data perangkat untuk pengingat (kalau kamu mengaktifkannya).</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Yang TIDAK kami lakukan</h2>
          <ul className="list-disc space-y-1 pl-5 text-muted">
            <li>Tidak terhubung ke rekening bank, e-wallet, atau kartu.</li>
            <li>Tidak memindahkan uang atau menjadi dompet digital.</li>
            <li>Tidak menyimpan access token Google atau password.</li>
            <li>Tidak menyimpan foto struk (kalau fitur OCR aktif, gambar hanya dibaca lalu dibuang).</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Untuk apa datanya</h2>
          <p className="text-muted">
            Hanya untuk menjalankan aplikasi: menghitung saldo dan jatah aman per
            hari, menampilkan riwayat, dan mengirim pengingat bila diaktifkan.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Pihak ketiga</h2>
          <ul className="list-disc space-y-1 pl-5 text-muted">
            <li>Google — untuk masuk (OAuth). Kami tidak menyimpan token akses.</li>
            <li>Penyedia hosting dan database — untuk menjalankan layanan.</li>
            <li>Penyedia push — untuk pengingat (bila diaktifkan).</li>
            <li>Penyedia vision — hanya bila fitur foto struk (OCR) aktif; gambar tidak disimpan.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Hak kamu</h2>
          <p className="text-muted">
            Kamu berhak mengakses, mengoreksi, dan menghapus data. Penghapusan
            akun mandiri tersedia di Pengaturan dan akan menghapus seluruh catatan
            kamu secara permanen. Untuk permintaan lain, hubungi
            &nbsp;dukungan@jatahku.example dengan verifikasi kepemilikan akun.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Keamanan &amp; isolasi data</h2>
          <p className="text-muted">
            Koneksi memakai HTTPS. Setiap permintaan diverifikasi kepemilikannya
            terhadap akunmu — catatan tidak bisa dibaca atau diubah pengguna lain.
            Rahasia disimpan sebagai environment variable, bukan di dalam kode.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Berapa lama disimpan</h2>
          <p className="text-muted">
            Selama akunmu aktif. Setelah kamu menghapus akun, seluruh data
            terhapus. Riwayat teknis pengiriman pengingat lebih dari 7 hari
            dibersihkan otomatis.
          </p>
        </section>
      </article>
    </KerangkaPublik>
  );
}
