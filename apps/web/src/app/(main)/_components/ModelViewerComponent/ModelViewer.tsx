'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Center, Environment, OrbitControls, useGLTF } from '@react-three/drei';

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url) as any;

  return <primitive object={scene} />;
}

export default function ModelViewer() {
  return (
    <div className="w-full h-full relative flex justify-center items-center">
      <Canvas camera={{ position: [0, 10, 10], fov: 25 }} shadows>
        <Suspense>
          <Environment files="/textures/shanghai_bund_1k.hdr" />
        </Suspense>
        <Center>
          <Model url={'/models/keyboard.glb'} />
        </Center>
        <OrbitControls autoRotate={true} enableZoom={true} target={[0, 0, 0]} />
      </Canvas>
    </div>
  );
}
