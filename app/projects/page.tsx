import { Suspense } from 'react';
import type { Metadata } from 'next';
import { connection } from 'next/server';
import {
  fetchFilteredProjects,
  fetchProjectsPages,
  sanitizePageNumber,
  sanitizeSearchQuery,
} from '@/lib/projects-db';
import ProjectSearch from '@/components/ProjectSearch';
import Pagination from '@/components/Pagination';

export const metadata: Metadata = {
  title: 'Projects Overview',
};

interface ProjectsPageProps {
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
}

async function ProjectsDynamicSection({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; page?: string }>;
}) {
  await connection();
  const resolvedParams = await searchParams;
  const query = sanitizeSearchQuery(resolvedParams.query);
  const currentPage = sanitizePageNumber(resolvedParams.page);

  const [projects, totalPages] = await Promise.all([
    fetchFilteredProjects(query, String(currentPage)),
    fetchProjectsPages(query),
  ]);

  return (
    <>
      <ProjectSearch />

      {projects.length === 0 ? (
        <p className="mt-6 text-sm opacity-75">
          No projects match &ldquo;{query}&rdquo;.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="rounded border border-white/15 p-4">
              <h2 className="text-xl font-semibold">{project.title}</h2>
              <p className="mt-1 text-sm opacity-80">{project.description}</p>
            </div>
          ))}
        </div>
      )}

      <Pagination totalPages={totalPages} />
    </>
  );
}

function ProjectsFallback() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-10 w-full max-w-md rounded bg-white/10" />
      <div className="h-24 w-full rounded border border-white/15 bg-white/5" />
      <div className="h-24 w-full rounded border border-white/15 bg-white/5" />
    </div>
  );
}

export default function ProjectsPage({ searchParams }: ProjectsPageProps) {
  return (
    <div className="p-8 text-white">
      <h1 className="mb-6 text-3xl font-bold">Projects Overview</h1>

      <Suspense fallback={<ProjectsFallback />}>
        <ProjectsDynamicSection searchParams={searchParams} />
      </Suspense>
    </div>
  );
}