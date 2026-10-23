import { NextResponse } from 'next/server';
import { masukDenganGoogle } from '@/lib/auth/sesi';

// Dev-only: login instan sebagai user mock, tanpa Google. Blok di produksi.
export async function GET(request: Request) {
  const authUrl = process.env.AUTH_URL || new URL(request.url).origin;
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.redirect(new URL('/masuk?error=lindungi', authUrl));
  }
  const u = new URL(request.url).searchParams.get('u') || 'dev';
  await masukDenganGoogle({
    sub: `mock-${u}`,
    email: `${u}@contoh.test`,
    nama: u === 'dev' ? 'Pengguna Dev' : u,
  });
  return NextResponse.redirect(new URL('/beranda', authUrl));
}
