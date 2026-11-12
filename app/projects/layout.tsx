import Link from 'next/link';

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="max-w-4xl mx-auto px-4 py-8">
      <nav className="mb-6 flex gap-4 text-blue-400 font-medium">
        <Link href="/projects" className="hover:underline">Overview</Link> | 
        <Link href="/projects/opensource" className="hover:underline">Open Source</Link> | 
        <Link href="/projects/school" className="hover:underline">School</Link>
      </nav>
      {children}
    </section>
  );
}