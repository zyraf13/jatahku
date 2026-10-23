// Self-check rumus inti. Jalankan: node --test --experimental-strip-types src/lib/calc/jatah.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  hitung,
  bentukTargets,
  hariKe,
  tambahHari,
  selisihHari,
  type Periode,
  type TargetHarian,
} from './jatah.ts';

test('dasar: 1jt / 10 hari = 100rb', () => {
  const p: Periode = { tanggal_mulai: '2026-10-01', tanggal_akhir: '2026-10-11', jatah_awal: 1_000_000 };
  const r = hitung(p, [], [], '2026-10-01');
  assert.equal(r.hari_tersisa, 10);
  assert.equal(r.jatah_aman_per_hari, 100_000);
});

test('tanggal_akhir eksklusif', () => {
  const p: Periode = { tanggal_mulai: '2026-10-01', tanggal_akhir: '2026-10-11', jatah_awal: 1_000_000 };
  assert.equal(hitung(p, [], [], '2026-10-10').hari_tersisa, 1);
  const r = hitung(p, [], [], '2026-10-11');
  assert.equal(r.selesai, true);
  assert.equal(r.jatah_aman_per_hari, null);
});

test('floor selalu ke bawah', () => {
  const p: Periode = { tanggal_mulai: '2026-10-01', tanggal_akhir: '2026-10-04', jatah_awal: 10_000 };
  assert.equal(hitung(p, [], [], '2026-10-01').jatah_aman_per_hari, 3333);
});

test('target belum dicentang disisihkan, tidak kurangi saldo', () => {
  const p: Periode = { tanggal_mulai: '2026-10-01', tanggal_akhir: '2026-10-06', jatah_awal: 100_000 };
  const t: TargetHarian[] = [{ tanggal: '2026-10-01', nominal_rencana: 20_000, nominal_aktual: null, dibayar: false }];
  const r = hitung(p, t, [], '2026-10-01');
  assert.equal(r.saldo_tersisa, 100_000);
  assert.equal(r.sisa_anggaran_rutin, 20_000);
  assert.equal(r.jatah_aman_per_hari, 16_000);
});

test('bayar pakai AKTUAL, fallback ke rencana kalau kosong', () => {
  const p: Periode = { tanggal_mulai: '2026-10-01', tanggal_akhir: '2026-10-06', jatah_awal: 100_000 };
  const t: TargetHarian[] = [{ tanggal: '2026-10-01', nominal_rencana: 20_000, nominal_aktual: 25_000, dibayar: true }];
  const r = hitung(p, t, [], '2026-10-02');
  assert.equal(r.total_terpakai, 25_000);
  assert.equal(r.jatah_aman_per_hari, 18_750);

  const t2: TargetHarian[] = [{ tanggal: '2026-10-01', nominal_rencana: 15_000, nominal_aktual: null, dibayar: true }];
  assert.equal(hitung(p, t2, [], '2026-10-02').total_terpakai, 15_000);
});

test('negatif = peringatan, bukan utang (§7.4)', () => {
  const p: Periode = { tanggal_mulai: '2026-10-01', tanggal_akhir: '2026-10-04', jatah_awal: 50_000 };
  const t: TargetHarian[] = [
    { tanggal: '2026-10-01', nominal_rencana: 30_000, nominal_aktual: null, dibayar: false },
    { tanggal: '2026-10-02', nominal_rencana: 30_000, nominal_aktual: null, dibayar: false },
  ];
  const r = hitung(p, t, [{ tanggal: '2026-10-02', nominal: 10_000 }], '2026-10-02');
  assert.equal(r.jatah_aman_per_hari, -10_000);
});

test('tanggal mulai lampau: target lampau menggerus -> negatif', () => {
  const p: Periode = { tanggal_mulai: '2026-10-01', tanggal_akhir: '2026-10-11', jatah_awal: 50_000 };
  const built = bentukTargets(p, [{ anggaran_per_hari: 10_000, hari: [0, 1, 2, 3, 4] }]);
  const r = hitung(p, built, [], '2026-10-08');
  assert.equal(r.saldo_tersisa, 50_000);
  assert.ok(r.sisa_anggaran_rutin > 50_000);
  assert.ok((r.jatah_aman_per_hari ?? 0) < 0);
});

test('bentukTargets: Sarapan Senin-Jumat', () => {
  const p: Periode = { tanggal_mulai: '2026-10-01', tanggal_akhir: '2026-11-01', jatah_awal: 5_000_000 };
  const built = bentukTargets(p, [{ anggaran_per_hari: 15_000, hari: [0, 1, 2, 3, 4] }]);
  const nama = built.map((x) => x.tanggal);
  assert.ok(!nama.includes('2026-10-03'), '3 Okt = Sabtu, tidak ada');
  assert.ok(nama.includes('2026-10-02'), '2 Okt = Jumat, ada');
  assert.ok(built.every((x) => !x.dibayar && x.nominal_aktual === null));
});

test('hariKe remap: Kamis = 3', () => {
  assert.equal(hariKe('2026-10-01'), 3);
});

test('util tanggal', () => {
  assert.equal(tambahHari('2026-10-31', 1), '2026-11-01');
  assert.equal(selisihHari('2026-10-01', '2026-10-11'), 10);
});

