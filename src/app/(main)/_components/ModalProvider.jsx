'use client';

import { usePathname, useRouter } from 'next/navigation';
import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useState } from 'react';

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalSubMessage, setModalSubMessage] = useState('');
  const [isSelect, setIsSelect] = useState(false);
  const [resolvePromise, setResolvePromise] = useState(null);
  const pathName = usePathname();

  const openModal = useCallback(({ message, subMessage = '', isSelect }) => {
    setModalMessage(message);
    setModalSubMessage(subMessage);
    setIsSelect(isSelect);
    setIsModalOpen(true);

    return new Promise(resolve => {
      setResolvePromise(() => resolve);
    });
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    if (resolvePromise) {
      resolvePromise(false);
      setResolvePromise(null);
    }
  }, [resolvePromise]);

  const confirmModal = useCallback(() => {
    setIsModalOpen(false);
    if (resolvePromise) {
      resolvePromise(true);
      setResolvePromise(null);
    }
  }, [resolvePromise]);

  useEffect(() => {
    if (isModalOpen) {
      closeModal();
    }
  }, [pathName]);

  return (
    <ModalContext.Provider
      value={{ isModalOpen, modalMessage, modalSubMessage, openModal, closeModal, confirmModal, isSelect }}
    >
      {children}
    </ModalContext.Provider>
  );
};
