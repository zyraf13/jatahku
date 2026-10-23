import { penggunaWajib } from '@/lib/auth/sesi';
import { prisma } from '@/lib/db/client';
import { periodeBerjalan, hariIni } from '@/lib/queries';
import { MenuBawah } from '../../_components/menu-bawah';
import { FormEkstra } from './_form-ekstra';
import { TargetLampau } from './_target-lampau';
import { HapusEkstra } from './_hapus-ekstra';

export const metadata = { title: 'Riwayat — Jatahku' };

export default async function Riwayat() {
  const u = await penggunaWajib();
  const periode = await periodeBerjalan(u.id);
  const tgl = hariIni();

  // target lampau belum dicentang (§10.4)
  const lampau = periode
    ? await prisma.dailyTarget.findMany({
        where: {
          jatahPeriodId: periode.id,
          tanggal: { lt: tgl },
          dibayar: false,
        },
        include: { routine: true },
        orderBy: { tanggal: 'asc' },
      })
    : [];

  const ekstra = await prisma.extraExpense.findMany({
    where: { userId: u.id },
    orderBy: [{ tanggal: 'desc' }, { createdAt: 'desc' }],
    take: 50,
  });

  return (
    <>
      <section className="space-y-6">
        <h1 className="text-2xl font-semibold">Riwayat</h1>

        {lampau.length > 0 && (
          <div className="space-y-3">
            <h2 className="font-medium">Belum dicatat dari hari lampau</h2>
            <ul className="space-y-2">
              {lampau.map((t) => (
                <TargetLampau
                  key={t.id}
                  id={t.id}
                  nama={t.routine.nama}
                  tanggal={t.tanggal}
                  rencana={t.nominalRencana}
                />
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-3">
          <h2 className="font-medium">Pengeluaran tambahan</h2>
          <FormEkstra hariIni={tgl} />
          {ekstra.length === 0 ? (
            <p className="text-sm text-muted">Belum ada pengeluaran tambahan.</p>
          ) : (
            <ul className="space-y-2">
              {ekstra.map((e) => (
                <li
                  key={e.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface p-4"
                >
                  <div>
                    <p>{e.nama}</p>
                    <p className="text-xs text-muted">
                      {e.tanggal}
                      {e.catatan ? ` · ${e.catatan}` : ''}
                      {e.jatahPeriodId ? '' : ' · di luar periode'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono">{formatRingkas(e.nominal)}</span>
                    <HapusEkstra id={e.id} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
      <MenuBawah aktif="/riwayat" />
    </>
  );
}

function formatRingkas(n: number): string {
  return 'Rp' + Math.abs(Math.trunc(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
