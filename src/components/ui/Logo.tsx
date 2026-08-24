export function Logo({ className = '', tone = 'dark' }: { className?: string; tone?: 'dark' | 'light' }) {
  const stroke = tone === 'light' ? '#F4EFE3' : '#0E3A2E';
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden="true">
      <path d="M16 3c0 8-4 12-4 18a4 4 0 0 0 8 0c0-6-4-10-4-18Z" stroke={stroke} strokeWidth="1.2" />
      <path d="M16 29V13" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M8 11c3 1 5 3 6 6M24 11c-3 1-5 3-6 6" stroke="#C9A227" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
