import ProjectList from '@/components/ProjectList';

async function getOpenSourceProjects() {
  const res = await fetch('http://localhost:3001/api/projects?type=opensource', { cache: 'no-store' });
  return res.json();
}

export default async function OpenSourceProjects() {
  const projects = await getOpenSourceProjects();

  return (
    <div>
      <h3 className="text-2xl font-bold text-white mb-4">Open Source Projects</h3>
      <ProjectList projects={projects} />
    </div>
  );
}