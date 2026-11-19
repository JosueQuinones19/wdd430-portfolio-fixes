'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface ProjectSearchProps {
  placeholder?: string;
}

export default function ProjectSearch({
  placeholder = 'Search projects...',
}: ProjectSearchProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const initialQuery = searchParams.get('query') ?? '';
  const [term, setTerm] = useState(initialQuery);

  // Keep input in sync if the user navigates with browser Back/Forward buttons
  useEffect(() => {
    setTerm(searchParams.get('query') ?? '');
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      const trimmed = term.trim();

      if (trimmed) {
        params.set('query', trimmed);
      } else {
        params.delete('query');
      }

      // Always reset to page 1 on a new search
      params.set('page', '1');

      const nextUrl = `${pathname}?${params.toString()}`;
      const currentUrl = searchParams.toString()
        ? `${pathname}?${searchParams.toString()}`
        : `${pathname}?page=1`;

      if (nextUrl !== currentUrl) {
        replace(nextUrl, { scroll: false });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [term, pathname, replace, searchParams]);

  return (
    <div className="w-full max-w-md">
      <label htmlFor="project-search" className="sr-only">
        Search projects
      </label>
      <input
        id="project-search"
        type="search"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded border border-white/20 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/50 focus:border-white/50 focus:outline-none"
      />
    </div>
  );
}