'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { CART_STORAGE_KEY, DELIVERY_FEE_ILS, FREE_DELIVERY_THRESHOLD_ILS } from '@/lib/constants';
import type { CartLine, Product } from '@/lib/types';

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotalIls: number;
  subtotalUsd: number;
  deliveryFeeIls: number;
  totalIls: number;
  isOpen: boolean;
  add: (product: Product, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function toLine(product: Product, quantity: number): CartLine {
  return {
    productId: product.id,
    slug: product.slug,
    nameEn: product.name_en,
    nameHe: product.name_he,
    tier: product.tier,
    priceIls: Number(product.price_ils),
    priceUsd: Number(product.price_usd),
    imageUrl: product.image_url,
    quantity,
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Restore after mount so server and client markup match on first paint.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(CART_STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
    } catch {
      /* corrupt or unavailable storage — start empty */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* quota or private mode — the cart just will not persist */
    }
  }, [lines, hydrated]);

  const add = useCallback((product: Product, quantity = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.productId === product.id);
      const capped = (current: number) => Math.min(current + quantity, product.stock);
      if (existing) {
        return prev.map((l) =>
          l.productId === product.id ? { ...l, quantity: capped(l.quantity) } : l,
        );
      }
      return [...prev, toLine(product, Math.min(quantity, product.stock))];
    });
    setIsOpen(true);
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    setLines((prev) =>
      quantity <= 0
        ? prev.filter((l) => l.productId !== productId)
        : prev.map((l) => (l.productId === productId ? { ...l, quantity } : l)),
    );
  }, []);

  const remove = useCallback((productId: string) => {
    setLines((prev) => prev.filter((l) => l.productId !== productId));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(() => {
    const subtotalIls = lines.reduce((s, l) => s + l.priceIls * l.quantity, 0);
    const subtotalUsd = lines.reduce((s, l) => s + l.priceUsd * l.quantity, 0);
    const deliveryFeeIls =
      lines.length === 0 || subtotalIls >= FREE_DELIVERY_THRESHOLD_ILS ? 0 : DELIVERY_FEE_ILS;

    return {
      lines,
      count: lines.reduce((s, l) => s + l.quantity, 0),
      subtotalIls,
      subtotalUsd,
      deliveryFeeIls,
      totalIls: subtotalIls + deliveryFeeIls,
      isOpen,
      add,
      setQuantity,
      remove,
      clear,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    };
  }, [lines, isOpen, add, setQuantity, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
