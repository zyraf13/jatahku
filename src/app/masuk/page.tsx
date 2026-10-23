import Link from 'next/link';
import { redirect } from 'next/navigation';
import { penggunaSaatIni } from '@/lib/auth/sesi';
import { KerangkaPublik } from '../_components/kerangka-publik';

export const metadata = { title: 'Masuk — Jatahku' };
export const instant = false;

export default async function Masuk() {
  const u = await penggunaSaatIni();
  if (u) redirect('/beranda');

  return (
    <KerangkaPublik>
      <div className="mx-auto max-w-md py-8 text-center">
        <h1 className="text-2xl font-semibold">Masuk ke Jatahku</h1>
        <p className="mt-3 text-muted">
          Masuk dengan Google. Tidak ada password, tidak ada verifikasi email
          manual.
        </p>
        <a
          href="/api/auth/google"
          className="mt-6 inline-flex items-center rounded-xl bg-primary px-6 py-3 font-medium text-primary-fg"
        >
          Masuk dengan Google
        </a>
        <p className="mt-4 text-sm text-muted">
          Kami hanya memakai identitas Google-mu. Tidak menyimpan access token,
          tidak terhubung ke rekening bank, tidak memindahkan uang.{' '}
          <Link href="/privasi" className="underline">
            Kebijakan Privasi
          </Link>
          .
        </p>
      </div>
    </KerangkaPublik>
  );
}
