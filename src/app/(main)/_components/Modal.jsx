export default function Modal({ message, subMessage = '', yesCallback, modalSet }) {
  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center bg-black bg-opacity-50 z-50"
      onClick={e => {
        if (e.currentTarget === e.target) modalSet(false);
      }}
    >
      <div className="w-72 rounded space-y-4 py-3 bg-white flex flex-col  justify-center items-center border-solid border">
        <div>
          <p className=" font-semibold text-lg text-center break-all">{message}</p>
          {subMessage && <p className="text-center text-gray-400 text-sm">{subMessage}</p>}
        </div>
        <div className="flex justify-center space-x-2 h-10 font-semibold">
          <button
            className="flex rounded justify-center items-center w-32 bg-slate-200"
            onClick={() => modalSet(false)}
          >
            {yesCallback ? '취소' : '확인'}
          </button>
          {yesCallback && (
            <button
              className="flex rounded justify-center items-center w-32 bg-red-500 text-white"
              onClick={() => {
                yesCallback();
                modalSet(false);
              }}
            >
              확인
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
