import Image from 'next/image';

export default function Product(props) {
  return (
    <div className="grid grid-cols-5 gap-5 max-md:flex overflow-auto scrollbar-hide">
      {props.images.map((img, idx) => (
        <div className="flex flex-col" key={idx}>
          <div className="w-full aspect-square relative min-h-32 min-w-32">
            <div className="absolute top-1 right-1 z-10">
              <svg
                className="w-7 h-7  max-md:w-5 max-md:h-5"
                xmlns="http://www.w3.org/2000/svg"
                width="2em"
                height="2em"
                viewBox="0 0 32 32"
              >
                <path
                  stroke="black"
                  fill={img.bookMarked ? 'black' : 'white'}
                  d="M24 2H8a2 2 0 0 0-2 2v26l10-5.054L26 30V4a2 2 0 0 0-2-2"
                />
              </svg>
            </div>
            <Image src={img.path} alt={img.name} fill className="rounded-md" />
          </div>
          <div className="mt-2">
            <div className="text-lg line-clamp-2">{img.name}</div>
            <div>{img.price}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
