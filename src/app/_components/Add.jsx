import Link from 'next/link';

export default function Add() {
  return (
    <div className="relative group cursor-pointer">
      <div className="cursor-default">ADD</div>
      <div className="hidden absolute -left-1/2 border-l border-r border-b bg-white group-hover:flex flex-col text-center">
        <Link href={'/sell'}>
          <p className="py-2 hover:bg-slate-200 border-b">SHOP</p>
        </Link>
        <Link href={'post'}>
          <p className="py-2 hover:bg-slate-200">GALLERY</p>
        </Link>
      </div>
    </div>
  );
}
