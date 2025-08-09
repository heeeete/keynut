export default function Skeleton() {
  return (
    <div className="flex flex-col rounded">
      <div className="w-full aspect-square min-h-32 min-w-32 bg-gray-100"></div>
      <div className="flex flex-col py-1 justify-center h-14 space-y-1">
        <div className="w-3/4  bg-gray-100 h-5 min-h-3"></div>
        <div className="w-2/3 bg-gray-100 h-5 min-h-3"></div>
      </div>
    </div>
  );
}
