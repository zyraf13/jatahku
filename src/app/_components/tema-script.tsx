// Terapkan tema sebelum paint biar tidak flash (§11.4). Inline, no deps.
export function TemaScript() {
  const kode = `
try {
  var t = localStorage.getItem('jatahku-tema');
  if (t === 'gelap' || (!t && matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  }
} catch (e) {}
`;
  return <script dangerouslySetInnerHTML={{ __html: kode }} />;
}
