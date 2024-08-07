import { Fragment } from 'react';

const ProductSkeleton = () => {
  return (
    <div className="flex space-x-3 border p-3 rounded relative mb-3 max-md:border-0   max-md:border-gray-100  max-md:border-b max-md:mb-0 max-md:py-4">
      <div className="w-28 aspect-square relative bg-gray-100 rounded max-md:w-24"></div>
      <div className="flex flex-col justify-center flex-1 space-y-1">
        <div className="flex justify-between gap-4">
          <p className="h-5 w-32 bg-gray-100"></p>
          <svg
            className="md:hidden"
            xmlns="http://www.w3.org/2000/svg"
            width="1.2em"
            height="1.2em"
            viewBox="0 0 1024 1024"
          >
            <path
              fill="#f3f4f6"
              d="M176 416a112 112 0 1 1 0 224a112 112 0 0 1 0-224m336 0a112 112 0 1 1 0 224a112 112 0 0 1 0-224m336 0a112 112 0 1 1 0 224a112 112 0 0 1 0-224"
            />
          </svg>
        </div>
        <div className="h-5 w-24 mb-2 bg-gray-100"></div>
        <div className="flex justify-between items-end">
          <div className="flex w-48 bg-gray-100 h-6 max-md:w-32"></div>
          <div className="flex w-20 h-4 bg-gray-100"></div>
        </div>
      </div>
    </div>
  );
};

export default function ProductEditSkeleton() {
  return (
    <div className="flex flex-col relative overflow-x-hidden">
      {Array.from({ length: 10 }).map((_, idx) => (
        <Fragment key={idx}>
          <ProductSkeleton />
        </Fragment>
      ))}
      <div className="absolute top-0 h-full left-0 w-full animate-loading">
        <div className="w-20 h-full bg-white bg-gradient-to-r from-white blur-xl"></div>
      </div>
    </div>
  );
}
