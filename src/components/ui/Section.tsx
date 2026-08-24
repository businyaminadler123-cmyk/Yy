import type { ReactNode } from 'react';

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'center' | 'start';
}) {
  const alignment = align === 'center' ? 'text-center items-center' : 'text-start items-start';
  return (
    <div className={`flex flex-col gap-3 ${alignment}`}>
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <h2 className="max-w-2xl text-3xl leading-tight text-bottle-900 sm:text-4xl">{title}</h2>
      {subtitle ? (
        <p className="max-w-2xl text-[15px] leading-relaxed text-ink/60">{subtitle}</p>
      ) : null}
      <span className="mt-2 block h-px w-16 bg-gold-500/70" />
    </div>
  );
}

export function Section({
  children,
  className = '',
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`py-16 sm:py-24 ${className}`}>
      <div className="container-luxe">{children}</div>
    </section>
  );
}
