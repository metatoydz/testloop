import type { Product } from '@/lib/scoring/contract';
import Image from 'next/image';
import { CoupangDisclosure } from './CoupangDisclosure';

interface ProductListProps {
  products: Product[];
}

export function ProductList({ products }: ProductListProps) {
  if (products.length === 0) return null;

  return (
    <div className="w-full max-w-md mx-auto">
      <h3 className="text-lg font-bold text-gray-800 mb-4 px-4">🛍️ 추천 상품</h3>
      <div className="flex flex-col gap-3 px-4">
        {products.map((product, i) => (
          <a
            key={i}
            href={product.coupangUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-3 hover:shadow-md transition-shadow"
          >
            <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center text-2xl">
              🛒
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm truncate">
                {product.name}
              </p>
              <p className="text-xs text-gray-500 mt-1">{product.category}</p>
            </div>
            <div className="flex-shrink-0 text-indigo-600 text-sm font-medium">
              보러가기 →
            </div>
          </a>
        ))}
      </div>
      <CoupangDisclosure />
    </div>
  );
}
