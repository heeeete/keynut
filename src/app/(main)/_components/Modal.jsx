export default function Modal({ message, yesCallback, modalSet }) {
  return (
    <div
      className="fixed top-0 left-0 w-d-screen h-d-screen flex justify-center items-center z-50"
      onClick={e => {
        if (e.currentTarget === e.target) modalSet(false);
      }}
    >
      <div className="w-72 h-32 bg-white rounded-sm space-y-6 flex flex-col justify-center items-center border-solid border-2">
        <p className="font-semibold text-lg">{message}</p>
        <div className="flex justify-center space-x-2 h-10 font-semibold">
          <button className="flex justify-center items-center w-32 bg-slate-200" onClick={() => modalSet(false)}>
            취소
          </button>
          <button className="flex justify-center items-center w-32 bg-red-500 text-white" onClick={yesCallback}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
