// Format Rupiah: pemisah ribuan titik (§14). Input boleh bertitik.

export function formatRp(n: number): string {
  const neg = n < 0;
  const s = Math.abs(Math.trunc(n))
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return (neg ? '-Rp' : 'Rp') + s;
}

// "5.000.000" / "5000000" -> 5000000. Non-digit dibuang.
export function parseRp(input: string): number | null {
  const digits = input.replace(/[^\d-]/g, '');
  if (digits === '' || digits === '-') return null;
  const n = Number(digits.replace(/-/g, ''));
  if (!Number.isFinite(n)) return null;
  return digits.startsWith('-') ? -n : n;
}

// "25 ribu" -> 25000, "1,5 jt" -> 1500000 (§11.5, parsing terbatas)
export function parseRpUcapan(input: string): number | null {
  const t = input.toLowerCase().replace(/\s+/g, '');
  const m = t.match(/(\d+(?:[.,]\d+)?)(ribu|rb|jt|juta|k)?/);
  if (!m) return null;
  let val = Number(m[1].replace(',', '.'));
  if (!Number.isFinite(val)) return null;
  const unit = m[2];
  if (unit === 'ribu' || unit === 'rb' || unit === 'k') val *= 1000;
  else if (unit === 'jt' || unit === 'juta') val *= 1_000_000;
  return Math.round(val);
}
