import 'server-only';
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db/client';

const COOKIE = 'jatahku_sesi';
const MAX_AGE = 60 * 60 * 24 * 30; // 30 hari

const secret = () =>
  process.env.AUTH_SECRET || 'dev-secret-ganti-di-produksi';

// cookie = "<userId>.<sig>" — sig HMAC supaya user_id tidak bisa dipalsukan
function sign(userId: string): string {
  const sig = createHmac('sha256', secret()).update(userId).digest('base64url');
  return `${userId}.${sig}`;
}

function verify(value: string): string | null {
  const idx = value.lastIndexOf('.');
  if (idx < 1) return null;
  const userId = value.slice(0, idx);
  const sig = value.slice(idx + 1);
  const expected = createHmac('sha256', secret())
    .update(userId)
    .digest('base64url');
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  return userId;
}

export async function buatSesi(userId: string): Promise<void> {
  const c = await cookies();
  c.set(COOKIE, sign(userId), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE,
  });
}

export async function hapusSesi(): Promise<void> {
  const c = await cookies();
  c.delete(COOKIE);
}

export interface Pengguna {
  id: string;
  email: string;
  nama: string | null;
  fotoUrl: string | null;
}

// Baca sesi dari cookie lalu ambil user. Null kalau belum login / cookie invalid.
export async function penggunaSaatIni(): Promise<Pengguna | null> {
  const c = await cookies();
  const raw = c.get(COOKIE)?.value;
  if (!raw) return null;
  const userId = verify(raw);
  if (!userId) return null;
  const u = await prisma.user.findUnique({ where: { id: userId } });
  if (!u) return null;
  return { id: u.id, email: u.email, nama: u.nama, fotoUrl: u.fotoUrl };
}

// Versi tegas untuk halaman di dalam (app)/: layout dan page render bersamaan,
// jadi tanpa ini page bisa jalan dengan user null dan melempar TypeError
// sebelum redirect layout sempat terjadi.
export async function penggunaWajib(): Promise<Pengguna> {
  const u = await penggunaSaatIni();
  if (!u) redirect('/masuk');
  return u;
}

// Buat sesi + user sekaligus untuk login Google.
export async function masukDenganGoogle(profile: {
  sub: string;
  email: string;
  nama?: string;
  fotoUrl?: string;
}): Promise<Pengguna> {
  const u = await prisma.user.upsert({
    where: { googleSub: profile.sub },
    update: {
      email: profile.email,
      nama: profile.nama ?? null,
      fotoUrl: profile.fotoUrl ?? null,
    },
    create: {
      googleSub: profile.sub,
      email: profile.email,
      nama: profile.nama ?? null,
      fotoUrl: profile.fotoUrl ?? null,
    },
  });
  await buatSesi(u.id);
  return { id: u.id, email: u.email, nama: u.nama, fotoUrl: u.fotoUrl };
}

export function randomState(): string {
  return randomBytes(16).toString('base64url');
}
