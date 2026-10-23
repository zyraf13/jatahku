import 'server-only';
import { prisma } from '@/lib/db/client';
import { hitung, type Ringkasan, type TargetHarian } from '@/lib/calc/jatah';

export function hariIni(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
}

// Periode berjalan (tanggal_akhir > hari ini). §6.1 satu periode saja.
export async function periodeBerjalan(userId: string) {
  return prisma.jatahPeriod.findFirst({
    where: { userId, tanggalAkhir: { gt: hariIni() } },
    include: {
      targets: { orderBy: [{ tanggal: 'asc' }] },
      extras: true,
    },
  });
}

// Ringkasan jatah aman untuk periode berjalan.
export async function ringkasanBerjalan(
  userId: string,
  hariIniStr = hariIni(),
): Promise<{ ringkasan: Ringkasan; periodeId: string } | null> {
  const periode = await periodeBerjalan(userId);
  if (!periode) return null;

  const targets: TargetHarian[] = periode.targets.map((t) => ({
    tanggal: t.tanggal,
    nominal_rencana: t.nominalRencana,
    nominal_aktual: t.nominalAktual,
    dibayar: t.dibayar,
  }));
  const extras = periode.extras.map((e) => ({
    tanggal: e.tanggal,
    nominal: e.nominal,
  }));

  const ringkasan = hitung(
    {
      tanggal_mulai: periode.tanggalMulai,
      tanggal_akhir: periode.tanggalAkhir,
      jatah_awal: periode.jatahAwal,
    },
    targets,
    extras,
    hariIniStr,
  );
  return { ringkasan, periodeId: periode.id };
}

// Target hari ini (§10.3) dengan nama rutin.
export async function targetHariIni(userId: string, hariIniStr = hariIni()) {
  const periode = await periodeBerjalan(userId);
  if (!periode) return null;
  return prisma.dailyTarget.findMany({
    where: { jatahPeriodId: periode.id, tanggal: hariIniStr },
    include: { routine: true },
    orderBy: { routine: { urutan: 'asc' } },
  });
}
