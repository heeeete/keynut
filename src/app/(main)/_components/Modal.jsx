import { useModal } from './ModalProvider';

export default function Modal() {
  const { isModalOpen, modalMessage, modalSubMessage, closeModal, confirmModal, isSelect } = useModal();

  if (!isModalOpen) return null;

  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center bg-black bg-opacity-50 z-50"
      onClick={e => {
        if (e.currentTarget === e.target) closeModal();
      }}
    >
      <div className="w-72 rounded space-y-4 p-3 bg-white flex flex-col justify-center items-center border-solid border">
        <div>
          <p className="font-semibold text-lg text-center break-all">{modalMessage}</p>
          {modalSubMessage && <p className="text-center text-gray-400 text-sm">{modalSubMessage}</p>}
        </div>
        <div className="flex justify-center space-x-2 h-10 font-semibold">
          <button
            className={`flex rounded justify-center items-center w-32 ${
              isSelect ? 'bg-gray-200' : 'bg-black text-white'
            } `}
            onClick={closeModal}
          >
            {isSelect ? '취소' : '확인'}
          </button>
          {isSelect && (
            <button
              className="flex rounded justify-center items-center w-32 bg-black text-white"
              onClick={confirmModal}
            >
              확인
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
