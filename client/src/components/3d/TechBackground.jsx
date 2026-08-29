import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { FloatingNodes } from './FloatingNodes';
import { useSettings } from '../../context/SettingsContext';

export default function TechBackground() {
  const { effects3D } = useSettings();

  if (!effects3D) {
    return (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#090d16]">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#1f293d_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-20">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ pointerEvents: 'none' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />
        <pointLight position={[-10, -10, -5]} color="#06b6d4" intensity={2} />
        <pointLight position={[5, -5, 5]} color="#8b5cf6" intensity={1.5} />

        <Suspense fallback={null}>
          <FloatingNodes />
        </Suspense>
      </Canvas>

      {/* Radial overlay gradient for deep futuristic ambiance */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-transparent to-[#090d16]/70 pointer-events-none" />
    </div>
  );
}
