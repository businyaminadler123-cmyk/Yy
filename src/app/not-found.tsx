import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-cream-100 px-5">
      <div className="text-center">
        <p className="eyebrow">404</p>
        <h1 className="mt-4 font-display text-3xl text-bottle-900">Page not found</h1>
        <Link href="/" className="btn-primary mt-8">
          Back to the collection
        </Link>
      </div>
    </main>
  );
}
