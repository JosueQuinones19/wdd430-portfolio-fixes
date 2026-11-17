import type { Metadata } from 'next';

// Allow blocking route for un-cached fetch
export const instant = false;

async function getProjectsData() {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';
    
  const res = await fetch(`${baseUrl}/api/projects`, { cache: 'no-store' });
  return res.json();
}

export default async function ProjectsOverview() {
  const projects = await getProjectsData();

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Projects Overview</h1>
      {/* Render your projects here */}
    </div>
  );
}