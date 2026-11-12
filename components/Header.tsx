import Link from 'next/link';
import NavLinks from './NavLinks';

export default function Header() {
  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Peter Msamba</h1>
        <NavLinks />
      </div>
    </header>
  );
}