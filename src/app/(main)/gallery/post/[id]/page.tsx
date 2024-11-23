// 'use client';

// import ImageSlider from '@/app/(main)/_components/ImageSlider';
// import timeAgo from '@/utils/timeAgo';
// import Image from 'next/image';
// import Link from 'next/link';
// import { useState } from 'react';

// function RenderHeart() {
//   return (
//     <div className="flex items-center space-x-1 cursor-pointer">
//       <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 256 256">
//         <path
//           fill="currentColor"
//           d="M178 42c-21 0-39.26 9.47-50 25.34C117.26 51.47 99 42 78 42a60.07 60.07 0 0 0-60 60c0 29.2 18.2 59.59 54.1 90.31a334.7 334.7 0 0 0 53.06 37a6 6 0 0 0 5.68 0a334.7 334.7 0 0 0 53.06-37C219.8 161.59 238 131.2 238 102a60.07 60.07 0 0 0-60-60m-50 175.11c-16.41-9.47-98-59.39-98-115.11a48.05 48.05 0 0 1 48-48c20.28 0 37.31 10.83 44.45 28.27a6 6 0 0 0 11.1 0C140.69 64.83 157.72 54 178 54a48.05 48.05 0 0 1 48 48c0 55.72-81.59 105.64-98 115.11"
//         />
//       </svg>
//       <p>{info.heart}</p>
//     </div>
//   );
// }

// function RenderCommentCnt() {
//   return (
//     <div className="flex items-center space-x-1 cursor-pointer">
//       <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
//         <path
//           fill="black"
//           fillRule="evenodd"
//           d="M4.592 15.304C2.344 9.787 6.403 3.75 12.36 3.75h.321a8.068 8.068 0 0 1 8.068 8.068a8.982 8.982 0 0 1-8.982 8.982h-7.82a.75.75 0 0 1-.47-1.335l1.971-1.583a.25.25 0 0 0 .075-.29zM12.36 5.25c-4.893 0-8.226 4.957-6.38 9.488l.932 2.289a1.75 1.75 0 0 1-.525 2.024l-.309.249h5.689a7.482 7.482 0 0 0 7.482-7.482a6.568 6.568 0 0 0-6.568-6.568z"
//           clipRule="evenodd"
//         />
//       </svg>
//       <p>{info.comment_cnt ? info.comment_cnt : '댓글'}</p>
//     </div>
//   );
// }

// function RenderTimeAgo() {
//   return <p className="text-gray-500">{timeAgo(info.date)}</p>;
// }

// function RenderComments() {
//   return (
//     <div className="max-md:px-2 rounded mt-3">
//       <div>
//         {info.comment_cnt
//           ? info.comments.map((c, idx) => (
//               <div key={idx} className="flex items-start space-x-2 p-2 border-b">
//                 <Link href={'/shop/123'} className="flex relative rounded-full">
//                   <div className="flex justify-center items-center bg-white relative rounded-full">
//                     <Image
//                       src={c.profile}
//                       width={32}
//                       height={32}
//                       style={{ borderRadius: '50%', objectFit: 'cover' }}
//                       alt="comment-profile-img"
//                     />
//                   </div>
//                 </Link>
//                 <div className="flex w-full items-end justify-between">
//                   <div className="w-4/5">
//                     <p className="font-semibold">{c.nickname}</p>
//                     <p className="text-sm whitespace-pre-wrap">{c.text}</p>
//                   </div>
//                   <p className="text-xs text-gray-500">{timeAgo(c.date)}</p>
//                 </div>
//               </div>
//             ))
//           : '댓글이 없습니다...'}
//       </div>
//     </div>
//   );
// }

// function RenderHashtag() {
//   return (
//     <div className="max-md:px-2">
//       <div className="flex  justify-end mt-6 space-x-4">
//         <RenderHeart />
//         <RenderCommentCnt />
//       </div>
//       <p className="font-semibold text-lg">{info.title}</p>
//       <div className="flex flex-wrap text-gray-400 text-sm font-medium">
//         {info.tags.map((e, idx) => (
//           <p key={idx} className="mr-2 border-b">
//             #{e}
//           </p>
//         ))}
//       </div>
//     </div>
//   );
// }

// function CommentInput() {
//   const [text, setText] = useState('');

//   const autoResize = e => {
//     setText(e.target.value);
//     e.target.style.height = 'auto'; //height 초기화
//     e.target.style.height = e.target.scrollHeight + 'px';
//   };

//   const onClickSubmit = () => {};

//   return (
//     <div className="max-md:px-2">
//       <div className="flex justify-between items-end w-full rounded border mt-3 p-3 bg-gray-50 ">
//         <textarea
//           className="w-11/12 outline-none no-underline scrollbar-hide resize-none bg-gray-50 "
//           id="comment"
//           rows={1}
//           onChange={autoResize}
//           placeholder="댓글을 남기세요..."
//           maxLength={300}
//           value={text}
//         ></textarea>
//         {text.length ? (
//           <button className="font-semibold" onClick={onClickSubmit}>
//             등록
//           </button>
//         ) : (
//           ''
//         )}
//       </div>
//     </div>
//   );
// }

// export default function Page() {
//   return (
//     <div className="max-w-lg mx-auto max-md:main-768">
//       <div className="flex items-center relative space-x-4 my-5 max-md:my-2">
//         <Link href={'/shop/123'} className="flex relative justify-center items-center bg-white  rounded-full">
//           <Image
//             src={info.profile}
//             width={40}
//             height={40}
//             style={{ borderRadius: '50%', objectFit: 'cover' }}
//             alt="profile-img"
//           />
//         </Link>
//         <Link href={'/shop/123'}>
//           <p className="font-semibold">{info.nickname}</p>
//         </Link>
//         <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
//         <RenderTimeAgo />
//       </div>
//       <ImageSlider images={info.images} />
//       <RenderHashtag />
//       <RenderComments />
//       <CommentInput />
//     </div>
//   );
// }
