'use client';
import { createContext, useContext, useState } from 'react';

export const ModelViewerContext = createContext(null);

export const ModelViewerProvider = ({ children }) => {
  const [modelUrl, setModelUrl] = useState<string | null>(null);

  return <ModelViewerContext.Provider value={{ modelUrl, setModelUrl }}>{children}</ModelViewerContext.Provider>;
};

export const useModel = () => useContext(ModelViewerContext);
