'use client';
import React, { createContext, ReactNode, useContext, useState } from 'react';

interface ModelViewerContextType {
  modelUrl: string | null;
  setModelUrl: React.Dispatch<React.SetStateAction<string | null>>;
}

export const ModelViewerContext = createContext<ModelViewerContextType | null>(null);

export const ModelViewerProvider = ({ children }: { children: ReactNode }) => {
  const [modelUrl, setModelUrl] = useState<string | null>(null);

  return (
    <ModelViewerContext.Provider value={{ modelUrl, setModelUrl }}>
      {children}
    </ModelViewerContext.Provider>
  );
};

export const useModel = () => {
  const context = useContext(ModelViewerContext);
  if (!context) {
    throw new Error('Context가 없습니다.');
  }
  return context;
};
