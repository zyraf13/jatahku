// Rumus inti Jatahku — PRD §7 + Lampiran A.
// Murni: tanpa DB, tanpa framework. Semua tanggal 'YYYY-MM-DD'. Uang integer Rupiah.

export type Tanggal = string; // 'YYYY-MM-DD'
export type Rupiah = number; // integer

export interface TargetHarian {
  tanggal: Tanggal;
  nominal_rencana: Rupiah;
  nominal_aktual: Rupiah | null;
  dibayar: boolean;
}

export interface PengeluaranTambahan {
  tanggal: Tanggal;
  nominal: Rupiah;
}

export interface Periode {
  tanggal_mulai: Tanggal; // inklusif
  tanggal_akhir: Tanggal; // eksklusif — batas, bukan hari yang dihitung
  jatah_awal: Rupiah;
}

export interface Ringkasan {
  selesai: boolean;
  jatah_aman_per_hari: Rupiah | null; // null kalau periode selesai (§7.3)
  total_terpakai: Rupiah;
  saldo_tersisa: Rupiah;
  sisa_anggaran_rutin: Rupiah;
  hari_tersisa: number; // 0 kalau selesai
}

const HARI_MS = 86400000;

function toEpoch(t: Tanggal): number {
  const [y, m, d] = t.split('-').map(Number);
  return Date.UTC(y, m - 1, d);
}

export function selisihHari(a: Tanggal, b: Tanggal): number {
  return Math.round((toEpoch(b) - toEpoch(a)) / HARI_MS);
}

export function tambahHari(t: Tanggal, n: number): Tanggal {
  const d = new Date(toEpoch(t) + n * HARI_MS);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

// hari_ke: 0=Senin .. 6=Minggu (§12 routine_expense_day)
export function hariKe(t: Tanggal): number {
  return (new Date(toEpoch(t)).getUTCDay() + 6) % 7;
}

export function hitung(
  periode: Periode,
  targets: TargetHarian[],
  extras: PengeluaranTambahan[],
  hari_ini: Tanggal,
): Ringkasan {
  // total_terpakai = Σ aktual target DICENTANG (fallback rencana) + Σ ekstra
  const total_terpakai =
    targets
      .filter((t) => t.dibayar)
      .reduce((s, t) => s + (t.nominal_aktual ?? t.nominal_rencana), 0) +
    extras.reduce((s, e) => s + e.nominal, 0);

  const saldo_tersisa = periode.jatah_awal - total_terpakai;

  // sisa_anggaran_rutin = Σ rencana target BELUM dicentang (termasuk lampau) — §7.1
  const sisa_anggaran_rutin = targets
    .filter((t) => !t.dibayar)
    .reduce((s, t) => s + t.nominal_rencana, 0);

  const batas = tambahHari(periode.tanggal_akhir, -1); // hari terakhir dihitung
  const selesai = selisihHari(hari_ini, batas) < 0;
  if (selesai) {
    return {
      selesai: true,
      jatah_aman_per_hari: null,
      total_terpakai,
      saldo_tersisa,
      sisa_anggaran_rutin,
      hari_tersisa: 0,
    };
  }

  const hari_tersisa = selisihHari(hari_ini, batas) + 1; // inklusif hari ini
  // §7.2 floor selalu ke bawah. §7.5 bagi nol sudah dicegah oleh `selesai`.
  const jatah_aman_per_hari = Math.floor(
    (saldo_tersisa - sisa_anggaran_rutin) / hari_tersisa,
  );

  return {
    selesai: false,
    jatah_aman_per_hari,
    total_terpakai,
    saldo_tersisa,
    sisa_anggaran_rutin,
    hari_tersisa,
  };
}

export interface Rutin {
  anggaran_per_hari: Rupiah;
  hari: number[]; // 0=Senin .. 6=Minggu
}

// Bentuk target sejak tanggal_mulai s/d sehari sebelum tanggal_akhir (§6.3, §8).
// Semua belum dicentang, nominal_aktual kosong — termasuk tanggal lampau (§8 #3).
export function bentukTargets(
  periode: Periode,
  rutins: Rutin[],
): TargetHarian[] {
  const out: TargetHarian[] = [];
  const batas = tambahHari(periode.tanggal_akhir, -1);
  for (
    let t = periode.tanggal_mulai;
    selisihHari(t, batas) >= 0;
    t = tambahHari(t, 1)
  ) {
    const h = hariKe(t);
    for (const r of rutins) {
      if (r.hari.includes(h)) {
        out.push({
          tanggal: t,
          nominal_rencana: r.anggaran_per_hari,
          nominal_aktual: null,
          dibayar: false,
        });
      }
    }
  }
  return out;
}
