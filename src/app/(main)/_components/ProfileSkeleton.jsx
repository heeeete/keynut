export default function ProfileSkeleton() {
  return (
    <div className="p-2 items-center border cursor-pointer border-gray-300 justify-between rounded-sm relative max-md:border-0 max-md:border-b max-md:p-3 max-md:border-gray-100 max-md:max-h-56">
      <div className="flex">
        <div className="w-56 aspect-square relative mr-4 bg-gray-100"></div>
        <div className="flex flex-col justify-center w-full space-y-1">
          <div className="flex w-20 h-5 bg-gray-100 "></div>
          <div className="flex w-24 h-5 items-center bg-gray-100"></div>
        </div>
      </div>
      <div className="flex absolute bottom-2 right-3 w-14 h-4 bg-gray-100"></div>
    </div>
  );
}
