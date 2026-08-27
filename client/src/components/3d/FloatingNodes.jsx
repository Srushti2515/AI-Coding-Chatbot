import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text, Icosahedron, Octahedron } from '@react-three/drei';

export function FloatingNodes() {
  const meshRef = useRef();
  const outerRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
    if (outerRef.current) {
      outerRef.current.rotation.y -= delta * 0.15;
      outerRef.current.rotation.z += delta * 0.1;
    }
  });

  return (
    <group>
      {/* Central Rotating Glowing Dodecahedron Wireframe */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <mesh ref={meshRef} position={[0, 0, 0]}>
          <icosahedronGeometry args={[2.2, 1]} />
          <meshStandardMaterial
            color="#06b6d4"
            wireframe
            emissive="#06b6d4"
            emissiveIntensity={0.6}
            roughness={0.2}
          />
        </mesh>
      </Float>

      {/* Outer Wireframe Ring */}
      <Float speed={1.5} rotationIntensity={0.8} floatIntensity={1.2}>
        <mesh ref={outerRef} position={[0, 0, 0]}>
          <octahedronGeometry args={[3.8, 0]} />
          <meshStandardMaterial
            color="#8b5cf6"
            wireframe
            emissive="#8b5cf6"
            emissiveIntensity={0.4}
          />
        </mesh>
      </Float>

      {/* Floating 3D Text Symbols */}
      <Float speed={2.5} floatIntensity={1.5} position={[-4, 2, -1]}>
        <Text fontSize={0.7} color="#38bdf8" font="https://fonts.gstatic.com/s/firacode/v22/u-4x3FPGmc-Ecg6250sZ59rZwA.woff">
          {"</>"}
        </Text>
      </Float>

      <Float speed={2} floatIntensity={1.8} position={[4.2, -1.5, -1]}>
        <Text fontSize={0.8} color="#8b5cf6" font="https://fonts.gstatic.com/s/firacode/v22/u-4x3FPGmc-Ecg6250sZ59rZwA.woff">
          {"{ }"}
        </Text>
      </Float>

      <Float speed={3} floatIntensity={2} position={[-3.5, -2, 0]}>
        <Text fontSize={0.6} color="#34d399">
          AI
        </Text>
      </Float>

      <Float speed={2.2} floatIntensity={1.4} position={[3.5, 2.5, -0.5]}>
        <Text fontSize={0.5} color="#f59e0b">
          JS
        </Text>
      </Float>

      <Float speed={1.8} floatIntensity={1.6} position={[-1.5, 3.2, -2]}>
        <Text fontSize={0.5} color="#ec4899">
          PY
        </Text>
      </Float>
    </group>
  );
}
