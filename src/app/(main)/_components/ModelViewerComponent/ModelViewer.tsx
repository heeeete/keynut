'use client';
import React, { useState, useEffect, Suspense, Fragment } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, useGLTF } from '@react-three/drei';
import { useModel } from './ModelViewerContext';

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url) as any;

  return <primitive object={scene} />;
}

export default function ModelViewer() {
  const { modelUrl, setModelUrl } = useModel();
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const downloadModel = async () => {
      if (modelUrl) return;

      try {
        const response = await fetch('https://image.keynut.co.kr/case_cherry.glb');
        const reader = response.body?.getReader();
        const contentLength = response.headers.get('Content-Length');
        const total = contentLength ? Number(contentLength) : null;

        if (!reader || !total) {
          console.error('ReadableStream not supported or Content-Length unavailable.');
          return;
        }

        let received = 0;
        const chunks: Uint8Array[] = [];

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value) {
            chunks.push(value);
            received += value.length;
            setProgress(Math.round((received / total) * 100));
          }
        }

        const blob = new Blob(chunks, { type: 'application/octet-stream' });
        const blobUrl = URL.createObjectURL(blob);
        setModelUrl(blobUrl);
      } catch (error) {
        console.error('Failed to download model:', error);
      }
    };

    downloadModel();
  }, []);

  return (
    <div className="w-full h-full relative flex justify-center items-center">
      <Canvas camera={{ position: [-40, 25, 50], fov: 7 }} shadows>
        <Suspense>
          <Environment files="/textures/shanghai_bund_1k.hdr" />
        </Suspense>
        {modelUrl && <Model url={modelUrl} />}
        {modelUrl && <OrbitControls autoRotate enableZoom={false} />}
      </Canvas>
      <div className={`absolute transition-opacity ${modelUrl ? 'opacity-0' : 'opacity-100'}`}>
        <progress value={progress} max="100" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}></progress>
        <p>Download : {progress}%</p>
      </div>
    </div>
  );
}
