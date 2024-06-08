import Image from 'next/image';

export default function Selling(props) {
  return (
    <>
      {props.items.map((item, index) => {
        return (
          <div
            className="p-2 items-center border border-gray-300 justify-between max-md:border-0 max-md:border-b rounded-sm max-md:border-gray-200"
            key={index}
          >
            <div className="flex">
              <div className="w-48 aspect-square relative mr-4">
                <Image src={item.path} alt={index} fill className="rounded-sm"></Image>
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
