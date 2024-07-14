import Link from 'next/link';

export default function Footer() {
  return (
    <div id="footer" className="flex flex-col w-full border-t px-10 pt-6 mt-6 items-center  max-md:px-5">
      <p className="font-bold">KEYNUT</p>
      <p className="text-sm text-gray-400 py-6">KEYNUT은 keyboard와 nut의 합성어로 키보드에 대한 열정을 의미합니다.</p>
      {/* <div className="text-gray-400">
        <p className="space-x-2">
          <span>Github :</span>
          <span>
            <Link href={'https://github.com/heeeete'}>huipark</Link>
          </span>
          <span>
            <Link href={'https://github.com/licakim'}>hyunjki</Link>
          </span>
        </p>
        <p>Email : keynut65@gmail.com</p>
      </div> */}
    </div>
  );
}
