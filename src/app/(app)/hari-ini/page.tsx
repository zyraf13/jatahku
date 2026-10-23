import { penggunaWajib } from '@/lib/auth/sesi';
import { targetHariIni, hariIni } from '@/lib/queries';
import { MenuBawah } from '../../_components/menu-bawah';
import { ItemHariIni } from './_item';

export const metadata = { title: 'Hari Ini — Jatahku' };

export default async function HariIniPage() {
  const u = await penggunaWajib();
  const targets = (await targetHariIni(u.id)) ?? [];
  const tgl = hariIni();

  return (
    <>
      <section className="space-y-4">
        <h1 className="text-2xl font-semibold">Hari ini</h1>
        <p className="text-sm text-muted">{tgl}</p>

        {targets.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface p-5 text-muted">
            Tidak ada pengeluaran rutin terjadwal hari ini. Hari kosong itu wajar —
            tidak perlu ada yang dicentang.
          </div>
        ) : (
          <ul className="space-y-2">
            {targets.map((t) => (
              <ItemHariIni
                key={t.id}
                id={t.id}
                nama={t.routine.nama}
                rencana={t.nominalRencana}
                aktual={t.nominalAktual}
                dibayar={t.dibayar}
              />
            ))}
          </ul>
        )}
      </section>
      <MenuBawah aktif="/hari-ini" />
    </>
  );
}
