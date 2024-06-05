import Image from 'next/image';

export default function MyPost(props) {
  return (
    <>
      {props.posts.map((post, idx) => (
        <div className="flex flex-col w-full" key={idx}>
          <div className="w-full aspect-4/5 relative min-h-32 min-w-32">
            <Image className="rounded-sm" src={post.path} alt={post.name} fill />
          </div>
          {/* <div className="flex items-center space-x-2 w-full py-2">
            <div className="flex-1 line-clamp-1">{pick.title}</div>
          </div> */}
        </div>
      ))}
    </>
  );
}
