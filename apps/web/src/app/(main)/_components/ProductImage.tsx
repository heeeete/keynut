import Image from 'next/image';
import conditions from '../_constants/conditions';
import ProductData from '@keynut/type/productData';

const ProductState = ({ state }: { state: number }) => {
  return (
    <>
      {state === 2 ? (
        <div className="absolute left-1 top-1 z-10 rounded px-2 py-1  bg-gray-500 bg-opacity-55 flex items-center justify-center">
          <p className="font-semibold text-white text-sm max-[1024px]:text-xs max-md:text-xxs">
            예약중
          </p>
        </div>
      ) : (
        ''
      )}
    </>
  );
};


const ProductCondition = ({ condition }: { condition: 1 | 2 | 3 | 4 | 5 }) => {
  return (
    <div className="absolute bottom-1 right-1 text-xs break-all line-clamp-1 bg-gray-500 bg-opacity-55 p-1 rounded-sm font-semibold text-white max-md:text-xxs">
      {conditions[condition].option}
    </div>
  );
};

const ProductImageListOrSingle = () => {
  return (
    <svg
      className="absolute right-1 top-1 opacity-90 max-md:w-7"
      xmlns="http://www.w3.org/2000/svg"
      width="2em"
      height="2em"
      viewBox="0 0 20 20"
    >
      <path
        fill="white"
        d="M6.085 4H5.05A2.5 2.5 0 0 1 7.5 2H14a4 4 0 0 1 4 4v6.5a2.5 2.5 0 0 1-2 2.45v-1.035a1.5 1.5 0 0 0 1-1.415V6a3 3 0 0 0-3-3H7.5a1.5 1.5 0 0 0-1.415 1M2 7.5A2.5 2.5 0 0 1 4.5 5h8A2.5 2.5 0 0 1 15 7.5v8a2.5 2.5 0 0 1-2.5 2.5h-8A2.5 2.5 0 0 1 2 15.5z"
      />
    </svg>
  );
};

const ProductImage = ({ product }: { product: ProductData }) => {
  return (
    <div className="w-full relative aspect-square min-h-32 min-w-32 bg-gray-50">
      <Image
        className="rounded object-cover"
        src={
          product.images.length
            ? `${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${product.images[0]!.name}`
            : '/noImage.svg'
        }
        alt={product.title}
        fill
        sizes="(max-width:768px) 60vw, (max-width:1300px) 30vw , 500px"
      />
      <ProductState state={product.state} />
      <ProductCondition condition={product.condition} />
      {product.images.length > 1 && <ProductImageListOrSingle />}
    </div>
  );
};

export default ProductImage;
