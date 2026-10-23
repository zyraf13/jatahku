import { penggunaWajib } from '@/lib/auth/sesi';
import { prisma } from '@/lib/db/client';
import { periodeBerjalan } from '@/lib/queries';
import { MenuBawah } from '../../_components/menu-bawah';
import { FormRutin } from './_form-rutin';
import { ItemRutin } from './_item-rutin';

export const metadata = { title: 'Pengeluaran rutin — Jatahku' };

export default async function Rutin() {
  const u = await penggunaWajib();
  const rutins = await prisma.routineExpense.findMany({
    where: { userId: u.id, aktif: true },
    include: { hari: { orderBy: { hariKe: 'asc' } } },
    orderBy: { urutan: 'asc' },
  });
  const periode = await periodeBerjalan(u.id);
  const periodeKosong = periode
    ? (await prisma.dailyTarget.count({ where: { jatahPeriodId: periode.id } })) === 0
    : false;

  return (
    <>
      <section className="space-y-6">
        <h1 className="text-2xl font-semibold">Pengeluaran rutin</h1>

        <FormRutin
          tawarkanTerapkan={periodeKosong}
          adaPeriode={periode !== null}
        />

        {rutins.length === 0 ? (
          <p className="text-sm text-muted">Belum ada pengeluaran rutin.</p>
        ) : (
          <ul className="space-y-2">
            {rutins.map((r, i) => (
              <ItemRutin
                key={r.id}
                id={r.id}
                nama={r.nama}
                anggaran={r.anggaranPerHari}
                hari={r.hari.map((d) => d.hariKe)}
                pertama={i === 0}
                terakhir={i === rutins.length - 1}
              />
            ))}
          </ul>
        )}
      </section>
      <MenuBawah aktif="/rutin" />
    </>
  );
}
