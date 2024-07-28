export default function ProfileSkeleton() {
  return (
    <div className="p-2 relative items-center border border-gray-300 justify-between max-md:border-0 max-md:border-b  max-md:border-gray-100 max-md:p-3">
      <div className="flex">
        <div className="w-48 aspect-square relative mr-4 bg-gray-100"></div>
        <div className="flex flex-col justify-center w-full space-y-1">
          <div className="flex w-36 h-5 bg-gray-100"></div>
          <div className="flex w-32 h-5 items-center bg-gray-100"></div>
        </div>
      </div>
      <div className="flex absolute bottom-2 right-3 w-20 h-4 bg-gray-100"></div>
    </div>
  );
}
