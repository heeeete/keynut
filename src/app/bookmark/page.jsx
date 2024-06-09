import Image from 'next/image';

const bookmarked = [
  { path: '/키보드1.webp', name: 'orange keyboard', price: '12,5000원' },
  { path: '/키보드4.png', name: 'yellow keyboard', price: '60,5000원' },
  { path: '/키보드3.jpeg', name: 'purple keyboard sjdhfkajshd', price: '20,5000원' },
  { path: '/키보드3.jpeg', name: 'purple keyboard', price: '15,5000원' },
  { path: '/키보드1.webp', name: 'orange keyboard', price: '35,5000원' },
];
export default function Bookmark() {
  return (
    <div className="grid grid-cols-2 gap-2 max-w-screen-xl mx-auto px-10 max-md:px-2 max-md:grid-cols-1 max-md:main-768">
      {bookmarked.map((item, index) => {
        return (
          <div className="flex p-2 items-center border border-gray-300 rounded-sm justify-between" key={index}>
            <div className="flex bg-red-600">
              <div className="flex w-28 aspect-square relative mr-4">
                <Image src={item.path} alt={index} fill />
              </div>
              <div className="flex flex-col justify-center">
                <p className="break-all line-clamp-2">{item.name}</p>
                <p>{item.price}</p>
              </div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="1.8em" height="1.8em" viewBox="0 0 32 32">
              <path stroke="black" fill="black" d="M24 2H8a2 2 0 0 0-2 2v26l10-5.054L26 30V4a2 2 0 0 0-2-2" />
            </svg>
          </div>
        );
      })}
    </div>
  );
}
