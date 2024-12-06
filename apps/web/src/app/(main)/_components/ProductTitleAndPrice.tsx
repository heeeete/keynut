const ProductTitleAndPrice = ({ product }) => {
  return (
    <div className=" flex flex-col py-1 max-md:text-sm justify-center h-14">
      <div className="break-all overflow-hidden line-clamp-1">{product.title}</div>
      <div className="space-x-1 font-semibold break-all line-clamp-1">
        <span className="">{product.price.toLocaleString()}</span>
        <span className="text-sm">원</span>
      </div>
    </div>
  );
};

export default ProductTitleAndPrice;
