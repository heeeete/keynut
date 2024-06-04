import Image from 'next/image';

export default function BookMarked(props) {
  return (
    <>
      {props.items.map((item, index) => {
        return (
          <div className="flex p-2 items-center border border-gray-400 rounded-md m-2 justify-between" key={index}>
            <div className="flex">
              <div className="flex w-28 aspect-square relative mr-4">
                <Image src={item.path} alt={index} fill></Image>
              </div>
              <div className="flex flex-col justify-center">
                <p className="line-clamp-2">{item.name}</p>
                <p>{item.price}</p>
              </div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="1.8em" height="1.8em" viewBox="0 0 32 32">
              <path stroke="black" fill="black" d="M24 2H8a2 2 0 0 0-2 2v26l10-5.054L26 30V4a2 2 0 0 0-2-2" />
            </svg>
          </div>
        );
      })}
    </>
  );
}
