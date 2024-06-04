import Image from 'next/image';

export default function SellCompleted(props) {
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
                <p>{item.name}</p>
                <p>{item.price}</p>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
