'use client';

import { OpenModal } from '@/type/modal';
import { usePathname } from 'next/navigation';
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

interface ModalContextType {
  isModalOpen: boolean;
  modalMessage: string;
  modalSubMessage: string;
  isSelect: boolean;
  size: string;
  openModal: OpenModal;
  closeModal: () => void;
  confirmModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => useContext(ModalContext);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalSubMessage, setModalSubMessage] = useState('');
  const [isSelect, setIsSelect] = useState(false);
  const [size, setSize] = useState('w-72');
  const [resolvePromise, setResolvePromise] = useState(null);
  const pathName = usePathname();

  const openModal = useCallback(({ message, subMessage = '', isSelect = false, size }) => {
    setModalMessage(message);
    setModalSubMessage(subMessage);
    setIsSelect(isSelect);
    setIsModalOpen(true);
    if (size) setSize(size);

    return new Promise<boolean>(resolve => {
      setResolvePromise(() => resolve);
    });
  }, []);

  const resetModalState = useCallback(() => {
    setModalMessage('');
    setModalSubMessage('');
    setIsSelect(false);
    setSize('w-72');
  }, []);

  const closeModal = useCallback(() => {
    if (resolvePromise) {
      resolvePromise(false);
      setResolvePromise(null);
    }
    setIsModalOpen(false);
    resetModalState();
  }, [resolvePromise]);

  const confirmModal = useCallback(() => {
    if (resolvePromise) {
      resolvePromise(true);
      setResolvePromise(null);
    }
    setIsModalOpen(false);
    resetModalState();
  }, [resolvePromise]);

  useEffect(() => closeModal(), [pathName]);

  return (
    <ModalContext.Provider
      value={{ isModalOpen, modalMessage, modalSubMessage, openModal, closeModal, confirmModal, isSelect, size }}
    >
      {children}
    </ModalContext.Provider>
  );
};
