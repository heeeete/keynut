import Image from 'next/image';

const images = [
  { path: '/키보드1.webp', name: 'orange keyboard', price: '12,5000원' },
  { path: '/키보드4.png', name: 'yellow keyboard', price: '60,5000원' },
  { path: '/키보드3.jpeg', name: 'purple keyboard', price: '20,5000원' },
  { path: '/키보드3.jpeg', name: 'purple keyboard', price: '15,5000원' },
  { path: '/키보드1.webp', name: 'orange keyboard', price: '35,5000원' },
];
export default function Home() {
  return (
    <main className="flex flex-col space-y-10">
      <section className="flex flex-col space-y-8">
        <div className="flex flex-col">
          <div className="font-medium text-2xl">cateory</div>
          <div className="text-gray-700 font-medium">카테고리</div>
        </div>
        <div className="flex space-x-5">
          <li className="flex w-36 h-36 bg-white border-solid border-black border rounded-full"></li>
          <li className="flex w-36 h-36 bg-white border-solid border-black border rounded-full"></li>
          <li className="flex w-36 h-36 bg-white border-solid border-black border rounded-full"></li>
          <li className="flex w-36 h-36 bg-white border-solid border-black border rounded-full"></li>
        </div>
      </section>
      <section className="flex flex-col space-y-8">
        <div className="flex flex-col">
          <div className="font-medium text-2xl">just in</div>
          <div className="text-gray-700 font-medium">신규 등록 상품</div>
        </div>
        <div className="grid grid-cols-5 gap-5">
          {images.map((img, idx) => (
            <div className="flex flex-col">
              <div className="w-full aspect-square relative">
                <Image
                  className="absolute top-1 right-1 z-10"
                  alt="bookmark"
                  src="/bookmark.svg"
                  width={35}
                  height={40}
                />
                <Image src={img.path} alt={img.name} fill className="rounded-md" />
              </div>
              <div className="mt-2">
                <div className="text-lg">{img.name}</div>
                <div>{img.price}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="flex flex-col space-y-8">
        <div className="flex flex-col">
          <div className="font-medium text-2xl">hot</div>
          <div className="text-gray-700 font-medium">인기 상품</div>
        </div>
        <div className="grid grid-cols-5 gap-5">
          {images.map((img, idx) => (
            <div className="flex flex-col">
              <div className="w-full aspect-square relative">
                <Image
                  className="absolute top-1 right-1 z-10"
                  alt="bookmark"
                  src="/bookmark.svg"
                  width={35}
                  height={40}
                />
                <Image src={img.path} alt={img.name} fill className="rounded-md" />
              </div>
              <div className="mt-2">
                <div className="text-lg">{img.name}</div>
                <div>{img.price}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="flex flex-col space-y-8">
        <div className="flex flex-col">
          <div className="font-medium text-2xl">top picks</div>
          <div className="text-gray-700 font-medium">인기 사진</div>
        </div>
        <div>
          <li></li>
        </div>
      </section>
    </main>
  );
}
