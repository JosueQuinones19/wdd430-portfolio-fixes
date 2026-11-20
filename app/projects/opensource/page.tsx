import { connection } from 'next/server';
import { getProjects } from '@/lib/projects-db';
import ProjectList from '@/components/ProjectList';

export default async function OpenSourceProjects() {
  await connection();

  const projects = await getProjects('opensource');

  return (
    <div>
      <h3 className="text-2xl font-bold text-white mb-4">Open Source Projects</h3>
      <ProjectList projects={projects} />
    </div>
  );
}