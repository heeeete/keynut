import { Fragment } from 'react';
import Skeleton from '../../_components/Skeleton';

export default function Skeletons() {
  return (
    <div className="relative grid grid-cols-4 min-[960px]:gap-3 max-[960px]:gap-2 pb-2 w-full overflow-auto scrollbar-hide max-[960px]:px-3 max-md:grid-cols-2">
      {Array.from({ length: 48 }).map((_, index) => (
        <Fragment key={index}>
          <Skeleton />
        </Fragment>
      ))}
      <div className="absolute top-0 left-0 h-full w-full animate-loading">
        <div className="w-20 h-full bg-white bg-gradient-to-r from-white blur-xl"></div>
      </div>
    </div>
  );
}
