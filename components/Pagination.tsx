'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

interface PaginationProps {
  totalPages: number;
}

export default function Pagination({ totalPages }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const rawPage = Number(searchParams.get('page') ?? '1');
  const currentPage =
    Number.isInteger(rawPage) && rawPage >= 1 ? rawPage : 1;

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(pageNumber));
    return `${pathname}?${params.toString()}`;
  };

  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, idx) => idx + 1);

  return (
    <nav
      aria-label="Projects pagination"
      className="mt-8 flex items-center justify-between gap-4"
    >
      {currentPage > 1 ? (
        <Link
          href={createPageURL(currentPage - 1)}
          className="rounded border border-white/20 px-4 py-2 text-sm text-white hover:bg-white/10"
        >
          Previous
        </Link>
      ) : (
        <span className="cursor-not-allowed rounded border border-white/10 px-4 py-2 text-sm text-white/40">
          Previous
        </span>
      )}

      <div className="flex items-center gap-2">
        {pages.map((page) => {
          const isActive = page === currentPage;
          return (
            <Link
              key={page}
              href={createPageURL(page)}
              aria-current={isActive ? 'page' : undefined}
              className={`rounded border px-3 py-1.5 text-sm ${
                isActive
                  ? 'border-white bg-white text-black font-semibold'
                  : 'border-white/20 text-white hover:bg-white/10'
              }`}
            >
              {page}
            </Link>
          );
        })}
      </div>

      {currentPage < totalPages ? (
        <Link
          href={createPageURL(currentPage + 1)}
          className="rounded border border-white/20 px-4 py-2 text-sm text-white hover:bg-white/10"
        >
          Next
        </Link>
      ) : (
        <span className="cursor-not-allowed rounded border border-white/10 px-4 py-2 text-sm text-white/40">
          Next
        </span>
      )}
    </nav>
  );
}