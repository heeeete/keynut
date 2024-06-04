import Image from 'next/image';

export default function LikedPost(props) {
  return (
    <>
      {props.posts.map((post, idx) => (
        <div className="flex flex-col w-full p-2" key={idx}>
          <div className="w-full aspect-4/5 relative min-h-32 min-w-32">
            <Image className="rounded-md" src={post.path} alt={post.name} fill />
            {/* <div className="absolute flex items-center space-x-1 bottom-1 right-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 256 256">
                <path
                  fill="red"
                  d="M178 42c-21 0-39.26 9.47-50 25.34C117.26 51.47 99 42 78 42a60.07 60.07 0 0 0-60 60c0 29.2 18.2 59.59 54.1 90.31a334.7 334.7 0 0 0 53.06 37a6 6 0 0 0 5.68 0a334.7 334.7 0 0 0 53.06-37C219.8 161.59 238 131.2 238 102a60.07 60.07 0 0 0-60-60m-50 175.11c-16.41-9.47-98-59.39-98-115.11a48.05 48.05 0 0 1 48-48c20.28 0 37.31 10.83 44.45 28.27a6 6 0 0 0 11.1 0C140.69 64.83 157.72 54 178 54a48.05 48.05 0 0 1 48 48c0 55.72-81.59 105.64-98 115.11"
                />
              </svg>
            </div> */}
          </div>
        </div>
      ))}
    </>
  );
}
