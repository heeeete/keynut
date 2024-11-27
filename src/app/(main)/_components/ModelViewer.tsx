import React, { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, useGLTF } from '@react-three/drei';

// import * as THREE from 'three';

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url) as any;

  // useEffect(() => {
  //   // 모든 메쉬의 머티리얼 변경
  //   scene.traverse((node: THREE.Object3D) => {
  //     if (node.isMesh) {
  //       const mesh = node as THREE.Mesh;
  //       const material = mesh.material as THREE.MeshStandardMaterial;

  //       // 머티리얼 속성 변경
  //       material.metalness = 0.2; // 금속성 (0 ~ 1)
  //       material.roughness = 0; // 거칠기 (0 ~ 1)
  //     }
  //   });
  // }, [scene]);

  return <primitive object={scene} />;
}

export default function ModelViewer() {
  return (
    <Canvas camera={{ position: [-40, 25, 50], fov: 20 }} shadows>
      <Environment files="/textures/shanghai_bund_4k.hdr" /> {/* HDRI 로드 */}
      <Model url="/models/keyboard-pipeline-compress.glb" />
      <OrbitControls autoRotate enableZoom={false} />
    </Canvas>
  );
}
