'use client';

import { ProductCard } from '@/components/store/ProductCard';
import type { Product } from '@/lib/types';

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} featured={product.tier === 'premium'} />
      ))}
    </div>
  );
}
