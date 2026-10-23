import { penggunaWajib } from '@/lib/auth/sesi';
import { MenuBawah } from '../../_components/menu-bawah';
import { FormFeedback } from './_form-feedback';
import { HapusAkun } from './_hapus-akun';
import { ToggleTema } from '../../_components/toggle-tema';

export const metadata = { title: 'Pengaturan — Jatahku' };

export default async function Pengaturan() {
  const u = await penggunaWajib();

  return (
    <>
      <section className="space-y-6">
        <h1 className="text-2xl font-semibold">Pengaturan</h1>

        <div className="rounded-2xl border border-border bg-surface p-4">
          <p className="font-medium">{u.nama ?? 'Pengguna'}</p>
          <p className="text-sm text-muted">{u.email}</p>
        </div>

        {/* §10.6: menu berkelompok */}
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          <Row label="Pengingat harian" nilai="Nonaktif" />
          <Row label="Tema" nilai={<ToggleTema />} />
          <Row label="Panduan interaktif" nilai="Segera" />
          <Row label="Akses API" nilai="Menyusul" />
        </div>

        <div className="space-y-3">
          <h2 className="font-medium">Kirim masukan</h2>
          <FormFeedback />
        </div>

        <div className="space-y-3 rounded-2xl border border-danger/40 bg-surface p-5">
          <h2 className="font-medium text-danger">Hapus akun</h2>
          <p className="text-sm text-muted">
            Menghapus akun akan menghapus seluruh catatanmu secara permanen. Tidak
            bisa dibatalkan.
          </p>
          <HapusAkun email={u.email} />
        </div>
      </section>
      <MenuBawah aktif="/pengaturan" />
    </>
  );
}

function Row({ label, nilai }: { label: string; nilai: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 last:border-b-0">
      <span>{label}</span>
      <span className="text-sm text-muted">{nilai}</span>
    </div>
  );
}
