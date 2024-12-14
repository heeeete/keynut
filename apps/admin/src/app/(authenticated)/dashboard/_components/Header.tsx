import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed w-d-screen h-10 bg-slate-500 text-white flex items-center space-x-4 px-2">
      <Link href={'/'}>keynut</Link>
      <h1 className="text-2xl">Admin Page</h1>
    </header>
  );
}
