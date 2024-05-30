export default function Search({ isOpen }) {
  if (isOpen)
    return (
      <div className=" absolute top-0 left-0 w-screen h-screen">
        <div className="fixed top-2/4 left-2/4 -translate-y-1/2 max-w-96 -translate-x-1/2 w-1/2  h-14 bg-black bg-opacity-70 z-40">
          hello
        </div>
      </div>
    );
}
