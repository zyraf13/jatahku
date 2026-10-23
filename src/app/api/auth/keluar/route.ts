import { NextResponse } from 'next/server';
import { hapusSesi } from '@/lib/auth/sesi';

export async function POST(request: Request) {
  await hapusSesi();
  const authUrl = process.env.AUTH_URL || new URL(request.url).origin;
  return NextResponse.redirect(new URL('/masuk', authUrl));
}
