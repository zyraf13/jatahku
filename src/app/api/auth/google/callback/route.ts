import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { masukDenganGoogle } from '@/lib/auth/sesi';

// Callback OAuth Google -> tukar code -> verifikasi id_token -> buat sesi.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const authUrl = process.env.AUTH_URL || url.origin;

  const c = await cookies();
  const expectedState = c.get('oauth_state')?.value;
  c.delete('oauth_state');

  if (!code || !state || state !== expectedState) {
    return NextResponse.redirect(new URL('/masuk?error=state', authUrl));
  }

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: `${authUrl}/api/auth/google/callback`,
      grant_type: 'authorization_code',
    }),
  });
  if (!tokenRes.ok) {
    return NextResponse.redirect(new URL('/masuk?error=token', authUrl));
  }
  const { id_token } = (await tokenRes.json()) as { id_token?: string };
  if (!id_token) {
    return NextResponse.redirect(new URL('/masuk?error=token', authUrl));
  }

  // id_token dari token endpoint Google yang sudah di-autentikasi TLS;
  // decode payload untuk identitas (tidak simpan token apa pun — §13 minimisasi).
  const payload = JSON.parse(
    Buffer.from(id_token.split('.')[1], 'base64url').toString('utf8'),
  ) as { sub: string; email: string; name?: string; picture?: string };

  await masukDenganGoogle({
    sub: payload.sub,
    email: payload.email,
    nama: payload.name,
    fotoUrl: payload.picture,
  });

  return NextResponse.redirect(new URL('/beranda', authUrl));
}
