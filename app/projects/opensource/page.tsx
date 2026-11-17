import ProjectList from '@/components/ProjectList';

export const instant = false;

async function getSchoolProjects() {
  const res = await fetch('http://localhost:3000/api/projects?type=school', { cache: 'no-store' });
  return res.json();
}

export default async function SchoolProjects() {
  const projects = await getSchoolProjects();

  return (
    <div>
      <h3 className="text-2xl font-bold text-white mb-4">Open Source Projects</h3>
      <ProjectList projects={projects} />
    </div>
  );
}