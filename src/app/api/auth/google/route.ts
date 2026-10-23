import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { randomState } from '@/lib/auth/sesi';

// Mulai alur OAuth Google (§9.1). Kalau kredensial kosong -> mode dev mock.
export async function GET(request: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const authUrl = process.env.AUTH_URL || new URL(request.url).origin;

  if (!clientId) {
    // Dev mock: login instan tanpa Google. JANGAN aktif di produksi.
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'OAuth Google belum dikonfigurasi.' },
        { status: 503 },
      );
    }
    const url = new URL('/masuk/mock', authUrl);
    return NextResponse.redirect(url);
  }

  const state = randomState();
  const c = await cookies();
  c.set('oauth_state', state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 600,
  });

  const redirectUri = `${authUrl}/api/auth/google/callback`;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    prompt: 'select_account',
  });
  return NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params}`,
  );
}
