import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';

function ParticleField() {
  const points = useMemo(() => {
    const values = new Float32Array(120 * 3);
    for (let index = 0; index < values.length; index += 3) {
      const radius = 3.5 + Math.random() * 3;
      const angle = Math.random() * Math.PI * 2;
      values[index] = Math.cos(angle) * radius;
      values[index + 1] = (Math.random() - 0.5) * 5;
      values[index + 2] = Math.sin(angle) * radius - 1;
    }
    return values;
  }, []);

  const pointsRef = useRef();
  useFrame((_, delta) => {
    if (pointsRef.current) pointsRef.current.rotation.y += delta * 0.018;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[points, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#67e8f9" size={0.025} transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

export function FloatingNodes() {
  const meshRef = useRef();
  const outerRef = useRef();
  const sceneRef = useRef();

  useFrame((state, delta) => {
    if (sceneRef.current) {
      sceneRef.current.rotation.x += (state.pointer.y * 0.08 - sceneRef.current.rotation.x) * delta;
      sceneRef.current.rotation.y += (state.pointer.x * 0.12 - sceneRef.current.rotation.y) * delta;
    }
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.16;
      meshRef.current.rotation.y += delta * 0.22;
    }
    if (outerRef.current) {
      outerRef.current.rotation.y -= delta * 0.1;
      outerRef.current.rotation.z += delta * 0.07;
    }
  });

  return (
    <group ref={sceneRef}>
      <ParticleField />

      <Float speed={1.4} rotationIntensity={0.35} floatIntensity={0.55}>
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

      <Float speed={1.1} rotationIntensity={0.55} floatIntensity={0.7}>
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

      <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.8} position={[-4, 2, -1]}>
        <mesh>
          <boxGeometry args={[0.65, 0.65, 0.65]} />
          <meshStandardMaterial color="#38bdf8" wireframe emissive="#38bdf8" emissiveIntensity={0.5} />
        </mesh>
      </Float>

      <Float speed={2.1} rotationIntensity={0.5} floatIntensity={0.9} position={[4.2, -1.5, -1]}>
        <mesh>
          <torusGeometry args={[0.45, 0.08, 8, 20]} />
          <meshStandardMaterial color="#34d399" wireframe emissive="#34d399" emissiveIntensity={0.5} />
        </mesh>
      </Float>
    </group>
  );
}

