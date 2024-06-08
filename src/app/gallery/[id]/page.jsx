import ImageSlider from '@/app/_components/ImageSlider';
import timeAgo from '@/app/utils/timeAgo';

const info = {
  images: ['/img-1.jpeg', '/img-2.jpeg', '/키보드1.webp', '/키보드3.jpeg', '/키보드4.png'],
  title: '갤러리 들어오면 이렇게 뜸',
  tags: ['해시태그', '최대 10개', '어떰', '괜찮??'],
  date: 1717564205998,
  heart: 14,
  comment: 0,
};

function RenderHeart() {
  return (
    <div className="flex items-center space-x-1 cursor-pointer">
      <svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 256 256">
        <path
          fill="currentColor"
          d="M178 42c-21 0-39.26 9.47-50 25.34C117.26 51.47 99 42 78 42a60.07 60.07 0 0 0-60 60c0 29.2 18.2 59.59 54.1 90.31a334.7 334.7 0 0 0 53.06 37a6 6 0 0 0 5.68 0a334.7 334.7 0 0 0 53.06-37C219.8 161.59 238 131.2 238 102a60.07 60.07 0 0 0-60-60m-50 175.11c-16.41-9.47-98-59.39-98-115.11a48.05 48.05 0 0 1 48-48c20.28 0 37.31 10.83 44.45 28.27a6 6 0 0 0 11.1 0C140.69 64.83 157.72 54 178 54a48.05 48.05 0 0 1 48 48c0 55.72-81.59 105.64-98 115.11"
        />
      </svg>
      <p>{info.heart}</p>
    </div>
  );
}

function RenderComment() {
  return (
    <div className="flex items-center space-x-1 cursor-pointer">
      <svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 24 24">
        <path
          fill="black"
          fillRule="evenodd"
          d="M4.592 15.304C2.344 9.787 6.403 3.75 12.36 3.75h.321a8.068 8.068 0 0 1 8.068 8.068a8.982 8.982 0 0 1-8.982 8.982h-7.82a.75.75 0 0 1-.47-1.335l1.971-1.583a.25.25 0 0 0 .075-.29zM12.36 5.25c-4.893 0-8.226 4.957-6.38 9.488l.932 2.289a1.75 1.75 0 0 1-.525 2.024l-.309.249h5.689a7.482 7.482 0 0 0 7.482-7.482a6.568 6.568 0 0 0-6.568-6.568z"
          clip-rule="evenodd"
        />
      </svg>
      <p>{info.comment ? info.comment : '댓글'}</p>
    </div>
  );
}

function RenderTimeAgo() {
  return <p>{timeAgo(info.date)}</p>;
}

export default function Page() {
  return (
    <div className="max-w-lg mx-auto">
      <ImageSlider images={info.images} />
      <div className="max-md:px-2">
        <div className="flex  justify-end mt-6 space-x-4">
          <RenderHeart />
          <RenderComment />
          <RenderTimeAgo />
        </div>
        <p className="font-semibold text-lg">{info.title}</p>
        <div className="flex flex-wrap text-gray-400 text-sm font-medium">
          {info.tags.map((e, idx) => (
            <p key={idx} className="mr-2 border-b">
              #{e}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
