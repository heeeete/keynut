import Image from 'next/image';

export default function MyPost(props) {
  return (
    <>
      {props.posts.map((post, idx) => (
        <div className="flex flex-col w-full" key={idx}>
          <div className="w-full aspect-4/5 relative min-h-32 min-w-32">
            <Image
              className="rounded object-cover"
              src={post.path}
              alt={'mypost'}
              fill
              sizes="(max-width:560px) 50vw,(max-width:768px) 25vw ,(max-width:1280px) 20vw,237px"
            />
          </div>
        </div>
      ))}
    </>
  );
}
