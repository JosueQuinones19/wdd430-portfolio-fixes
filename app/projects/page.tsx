import { Suspense } from 'react';
import type { Metadata } from 'next';
import { connection } from 'next/server';
import { getProjects } from '@/lib/projects-db';

export const metadata: Metadata = {
  title: 'Projects Overview',
};

async function ProjectsContent() {
  await connection();

  const projects = await getProjects();

  if (projects.length === 0) {
    return <p className="text-sm opacity-75">No projects found in the database.</p>;
  }

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <div key={project.id} className="rounded border p-4">
          <h2 className="text-xl font-semibold">{project.title}</h2>
          <p className="text-sm opacity-80">{project.description}</p>
        </div>
      ))}
    </div>
  );
}

export default function ProjectsOverview() {
  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Projects Overview</h1>
      <Suspense fallback={<p>Loading projects...</p>}>
        <ProjectsContent />
      </Suspense>
    </div>
  );
}