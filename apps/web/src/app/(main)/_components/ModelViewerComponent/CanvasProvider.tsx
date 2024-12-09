import React, { createContext, ReactNode, useContext } from 'react';
import { Canvas } from '@react-three/fiber';

const CanvasContext = createContext<React.ReactNode | null>(null);

export const CanvasProvider = ({ children }: { children: ReactNode }) => {
  return (
    <CanvasContext.Provider
      value={
        <Canvas camera={{ position: [-40, 25, 50], fov: 7 }} shadows>
          {children}
        </Canvas>
      }
    >
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = () => useContext(CanvasContext);
