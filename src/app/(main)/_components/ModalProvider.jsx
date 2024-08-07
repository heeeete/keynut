'use client';

import { usePathname } from 'next/navigation';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalSubMessage, setModalSubMessage] = useState('');
  const [isSelect, setIsSelect] = useState(false);
  const [size, setSize] = useState('w-72');
  const [resolvePromise, setResolvePromise] = useState(null);
  const pathName = usePathname();

  const openModal = useCallback(({ message, subMessage = '', isSelect, size }) => {
    setModalMessage(message);
    setModalSubMessage(subMessage);
    setIsSelect(isSelect);
    setIsModalOpen(true);
    setSize(size);

    return new Promise(resolve => {
      setResolvePromise(() => resolve);
    });
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    if (resolvePromise) {
      resolvePromise(false);
      setResolvePromise(null);
      setModalMessage('');
      setModalSubMessage('');
      setIsSelect(false);
      setSize('w-72');
    }
  }, [resolvePromise]);

  const confirmModal = useCallback(() => {
    setIsModalOpen(false);
    if (resolvePromise) {
      resolvePromise(true);
      setResolvePromise(null);
      setModalMessage('');
      setModalSubMessage('');
      setIsSelect(false);
      setSize('w-72');
    }
  }, [resolvePromise]);

  useEffect(() => {
    if (isModalOpen) {
      closeModal();
    }
  }, [pathName]);

  return (
    <ModalContext.Provider
      value={{ isModalOpen, modalMessage, modalSubMessage, openModal, closeModal, confirmModal, isSelect, size }}
    >
      {children}
    </ModalContext.Provider>
  );
};
