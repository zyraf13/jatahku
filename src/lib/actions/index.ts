'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db/client';
import { scopedDb } from '@/lib/db/scopedDb';
import { penggunaSaatIni, hapusSesi } from '@/lib/auth/sesi';
import { bentukTargets, type Rutin } from '@/lib/calc/jatah';
import { parseRp } from '@/lib/format';

// Semua action: wajib login (§13.5). Setiap query ter-scope userId.
async function wajibLogin() {
  const u = await penggunaSaatIni();
  if (!u) redirect('/masuk');
  return u;
}

const TANGGAL_RE = /^\d{4}-\d{2}-\d{2}$/;

// --- Periode jatah (§6.1, §7.1, §9.2 langkah 1) ---

export async function buatPeriode(formData: FormData) {
  const u = await wajibLogin();
  const db = scopedDb(u.id);

  const jatahAwal = parseRp(String(formData.get('jatah_awal') ?? ''));
  const mulai = String(formData.get('tanggal_mulai') ?? '');
  const akhir = String(formData.get('tanggal_akhir') ?? '');

  if (jatahAwal === null || jatahAwal <= 0) throw new Error('Jatah awal tidak valid');
  if (!TANGGAL_RE.test(mulai) || !TANGGAL_RE.test(akhir)) throw new Error('Tanggal tidak valid');
  if (akhir <= mulai) throw new Error('Tanggal akhir harus setelah tanggal mulai');

  // §6.1: hanya satu periode berjalan.
  const berjalan = await db.period.first({
    where: { tanggalAkhir: { gt: hariIni() } },
  });
  if (berjalan) throw new Error('Masih ada periode berjalan');

  await db.period.create({
    data: {
      jatahAwal,
      tanggalMulai: mulai,
      tanggalAkhir: akhir,
      terkunci: true,
    },
  });

  revalidatePath('/beranda');
  redirect('/beranda');
}

// --- Pengeluaran rutin (§6.2, §8) ---

export async function buatRutin(formData: FormData) {
  const u = await wajibLogin();
  const db = scopedDb(u.id);

  const nama = String(formData.get('nama') ?? '').trim().slice(0, 100);
  const anggaran = parseRp(String(formData.get('anggaran_per_hari') ?? ''));
  const hari = formData.getAll('hari').map((h) => Number(h)).filter((n) => n >= 0 && n <= 6);

  if (!nama) throw new Error('Nama wajib diisi');
  if (anggaran === null || anggaran <= 0) throw new Error('Anggaran tidak valid');
  if (hari.length === 0) throw new Error('Pilih minimal satu hari');

  const maxUrutan = await prisma.routineExpense.aggregate({
    where: { userId: u.id },
    _max: { urutan: true },
  });

  const rutin = await db.routine.create({
    data: {
      nama,
      anggaranPerHari: anggaran,
      urutan: (maxUrutan._max.urutan ?? 0) + 1,
      hari: { create: hari.map((h) => ({ hariKe: h })) },
    },
  });

  // §8 #1: kalau periode berjalan belum punya daftar harian -> terapkan.
  const periode = await prisma.jatahPeriod.findFirst({
    where: { userId: u.id, tanggalAkhir: { gt: hariIni() } },
    include: { targets: { take: 1 } },
  });
  const terapkan = formData.get('terapkan') === '1';
  // §8 #1: hanya bentuk kalau periode berjalan masih kosong (belum punya daftar).
  // §8 #2: kalau sudah ada daftar, snapshot beku — jangan sentuh.
  if (periode && terapkan && periode.targets.length === 0) {
    await isiTargetsPeriode(u.id, periode.id);
  }

  void rutin;
  revalidatePath('/rutin');
  revalidatePath('/beranda');
}

export async function hapusRutin(id: string) {
  const u = await wajibLogin();
  // §8: hapus = nonaktifkan supaya target periode berjalan tetap valid.
  await scopedDb(u.id).routine.updateOwned(id, { aktif: false });
  revalidatePath('/rutin');
  revalidatePath('/beranda');
}

// --- Centang pembayaran (§6.4, §10.3) ---

export async function centangPembayaran(targetId: string, aktual: number | null) {
  const u = await wajibLogin();
  await scopedDb(u.id).targetUpdateOwned(targetId, {
    dibayar: true,
    nominalAktual: aktual,
    dibayarPada: new Date(),
  });
  revalidatePath('/hari-ini');
  revalidatePath('/riwayat');
  revalidatePath('/beranda');
}

export async function batalCentang(targetId: string) {
  const u = await wajibLogin();
  await scopedDb(u.id).targetUpdateOwned(targetId, {
    dibayar: false,
    nominalAktual: null,
    dibayarPada: null,
  });
  revalidatePath('/hari-ini');
  revalidatePath('/riwayat');
  revalidatePath('/beranda');
}

// --- Pengeluaran tambahan (§6.4) ---

export async function tambahEkstra(formData: FormData) {
  const u = await wajibLogin();
  const db = scopedDb(u.id);

  const nama = String(formData.get('nama') ?? '').trim().slice(0, 100);
  const nominal = parseRp(String(formData.get('nominal') ?? ''));
  const tanggal = String(formData.get('tanggal') ?? '');
  const catatan = String(formData.get('catatan') ?? '').slice(0, 500) || null;

  if (!nama) throw new Error('Nama wajib diisi');
  if (nominal === null || nominal <= 0) throw new Error('Nominal tidak valid');
  if (!TANGGAL_RE.test(tanggal)) throw new Error('Tanggal tidak valid');

  const periode = await db.period.first({
    where: {
      tanggalMulai: { lte: tanggal },
      tanggalAkhir: { gt: tanggal },
    },
  });

  await db.extra.create({
    data: {
      nama,
      nominal,
      tanggal,
      catatan,
      jatahPeriodId: periode?.id ?? null,
    },
  });

  revalidatePath('/riwayat');
  revalidatePath('/beranda');
}

export async function hapusEkstra(id: string) {
  const u = await wajibLogin();
  await scopedDb(u.id).extra.deleteOwned(id);
  revalidatePath('/riwayat');
  revalidatePath('/beranda');
}

// --- Pengaturan (§10.6, UU PDP) ---

export async function simpanFeedback(formData: FormData) {
  const u = await wajibLogin();
  const kategori = String(formData.get('kategori') ?? 'umum').slice(0, 50);
  const isi = String(formData.get('isi') ?? '').trim().slice(0, 2000);
  if (!isi) throw new Error('Isi masukan wajib diisi');
  await prisma.feedback.create({ data: { userId: u.id, kategori, isi } });
  revalidatePath('/pengaturan');
}

// Hapus akun mandiri — MVP, pemenuhan UU PDP (§13, §16).
export async function hapusAkun() {
  const u = await wajibLogin();
  await prisma.user.delete({ where: { id: u.id } }); // cascade hapus semua
  await hapusSesi();
  redirect('/');
}

// --- util ---

// Bentuk target harian untuk periode berjalan dari rutin aktif (§6.3).
// Dipanggil hanya saat periode masih kosong (§8 #1).
async function isiTargetsPeriode(userId: string, periodeId: string) {
  const periode = await prisma.jatahPeriod.findFirst({
    where: { id: periodeId, userId },
  });
  if (!periode) throw new Error('Tidak ditemukan');

  const semuaRutin = await prisma.routineExpense.findMany({
    where: { userId, aktif: true },
    include: { hari: true },
  });

  await prisma.dailyTarget.deleteMany({ where: { jatahPeriodId: periodeId } });

  const data: {
    jatahPeriodId: string;
    routineExpenseId: string;
    tanggal: string;
    nominalRencana: number;
  }[] = [];
  for (const r of semuaRutin) {
    const rutin: Rutin = {
      anggaran_per_hari: r.anggaranPerHari,
      hari: r.hari.map((d) => d.hariKe),
    };
    const targets = bentukTargets(
      {
        tanggal_mulai: periode.tanggalMulai,
        tanggal_akhir: periode.tanggalAkhir,
        jatah_awal: periode.jatahAwal,
      },
      [rutin],
    );
    for (const t of targets) {
      data.push({
        jatahPeriodId: periodeId,
        routineExpenseId: r.id,
        tanggal: t.tanggal,
        nominalRencana: t.nominal_rencana,
      });
    }
  }
  if (data.length > 0) await prisma.dailyTarget.createMany({ data });
}

function hariIni(): string {
  // ponytail: hari ini pakai UTC. §15 #4 belum diputus (WIB vs zona perangkat),
  // upgrade: baca offset dari periode lalu konversi.
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
}
