import ProjectList from '@/components/ProjectList';

async function getProjectsData() {
  const res = await fetch('http://localhost:3001/api/projects', { cache: 'no-store' });
  return res.json();
}

export default async function ProjectsOverview() {
  const projects = await getProjectsData();

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-white mb-4">Projects Overview</h2>
      <ProjectList projects={projects} />
    </main>
  );
}