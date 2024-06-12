import Image from 'next/image';

export default function Selling(props) {
  return (
    <>
      {props.items.map((item, index) => {
        return (
          <div
            className="p-2 items-center border border-gray-300 justify-between rounded-sm max-md:border-0 max-md:border-b max-md:border-gray-200"
            key={index}
          >
            <div className="flex">
              <div className="w-48 aspect-square relative mr-4 max-md:w-34 max-md:min-w-34">
                <Image
                  className="rounded object-cover"
                  src={item.path}
                  alt={index}
                  fill
                  sizes="(max-width:768px) 136px,(max-width:1280px) 13vw, (max-width: 1500px) 20vw, 123px"
                ></Image>
              </div>
              <div className="flex flex-col justify-center w-full">
                <div className="break-all line-clamp-2">{item.name}</div>
                <div>{item.price}</div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
