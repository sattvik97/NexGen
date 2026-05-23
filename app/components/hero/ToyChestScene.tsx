import {Suspense, useRef} from 'react';
import {Canvas, useFrame, useThree} from '@react-three/fiber';
import {
  Float,
  Sparkles,
  Stars,
  RoundedBox,
  MeshDistortMaterial,
} from '@react-three/drei';
import * as THREE from 'three';

/**
 * NexGen 3D Toy Universe.
 * A magical floating toy chest at center with orbiting toys, sparkles, and
 * stars. Camera gently follows the mouse for a parallax tilt.
 */
export function ToyChestScene() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{position: [0, 0.4, 6.2], fov: 42}}
      gl={{antialias: true, alpha: true}}
      style={{width: '100%', height: '100%'}}
    >
      {/* transparent canvas — no background color; fog tints depth */}
      <fog attach="fog" args={['#fbe9d7', 9, 18]} />
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[5, 7, 6]}
        intensity={1.4}
        color="#FFE66D"
        castShadow
      />
      <directionalLight position={[-6, 2, -4]} intensity={0.6} color="#6C63FF" />
      <pointLight position={[0, 2, 3]} intensity={1.2} color="#FF6B35" />

      <Suspense fallback={null}>
        <CameraRig />
        <ToyChest />
        <OrbitingToys />
        <Sparkles
          count={90}
          scale={[7, 5, 4]}
          size={4}
          speed={0.45}
          color="#FFE66D"
        />
        <Stars
          radius={20}
          depth={30}
          count={1200}
          factor={3}
          saturation={0.6}
          fade
          speed={0.6}
        />
      </Suspense>
    </Canvas>
  );
}

/* ------------------------- Camera tilt to mouse ------------------------- */
function CameraRig() {
  const {camera, mouse} = useThree();
  const target = useRef(new THREE.Vector3(0, 0, 0));
  useFrame(() => {
    camera.position.x += (mouse.x * 1.1 - camera.position.x) * 0.04;
    camera.position.y += (0.4 + mouse.y * 0.6 - camera.position.y) * 0.04;
    camera.lookAt(target.current);
  });
  return null;
}

/* -------------------------------- Chest -------------------------------- */
function ToyChest() {
  const groupRef = useRef<THREE.Group>(null);
  const lidRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 0.9) * 0.18;
      groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.35;
    }
    if (lidRef.current) {
      // Lid gently breathes open
      lidRef.current.rotation.x = -0.35 - Math.sin(t * 1.1) * 0.18;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.2, 0]}>
      {/* Chest body */}
      <RoundedBox args={[2.4, 1.4, 1.6]} radius={0.18} smoothness={6} castShadow receiveShadow>
        <meshStandardMaterial color="#FF6B35" metalness={0.25} roughness={0.4} />
      </RoundedBox>
      {/* Gold band */}
      <mesh position={[0, 0.15, 0.81]}>
        <boxGeometry args={[2.42, 0.12, 0.02]} />
        <meshStandardMaterial color="#FFE66D" metalness={0.8} roughness={0.25} />
      </mesh>
      {/* Lock */}
      <mesh position={[0, 0.15, 0.84]}>
        <boxGeometry args={[0.32, 0.32, 0.04]} />
        <meshStandardMaterial color="#FFE66D" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Lid pivot */}
      <group ref={lidRef} position={[0, 0.7, -0.8]}>
        <RoundedBox
          args={[2.4, 0.5, 1.6]}
          radius={0.16}
          smoothness={6}
          position={[0, 0.25, 0.8]}
          castShadow
        >
          <meshStandardMaterial color="#FF6B35" metalness={0.3} roughness={0.4} />
        </RoundedBox>
      </group>

      {/* Glow under chest */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.85, 0]}>
        <circleGeometry args={[2, 48]} />
        <meshBasicMaterial color="#FFE66D" transparent opacity={0.22} />
      </mesh>

      {/* Toys bursting out */}
      <Float floatIntensity={1.2} rotationIntensity={1.4} speed={2}>
        <mesh position={[-0.5, 1.6, 0.2]} castShadow>
          <sphereGeometry args={[0.28, 32, 32]} />
          <MeshDistortMaterial color="#4ECDC4" distort={0.3} speed={2} />
        </mesh>
      </Float>
      <Float floatIntensity={1.6} rotationIntensity={1.1} speed={1.5}>
        <mesh position={[0.45, 1.9, -0.1]} castShadow>
          <icosahedronGeometry args={[0.32, 0]} />
          <meshStandardMaterial color="#6C63FF" metalness={0.4} roughness={0.3} />
        </mesh>
      </Float>
      <Float floatIntensity={1.1} rotationIntensity={1.8} speed={1.8}>
        <mesh position={[0, 2.4, 0.3]} castShadow>
          <torusKnotGeometry args={[0.22, 0.08, 80, 16]} />
          <meshStandardMaterial color="#FFE66D" metalness={0.6} roughness={0.2} />
        </mesh>
      </Float>
      <Float floatIntensity={1.4} rotationIntensity={0.9} speed={1.2}>
        <Rocket position={[1.2, 1.4, 0.4]} />
      </Float>
      <Float floatIntensity={1} rotationIntensity={1.2} speed={1.6}>
        <Block position={[-1.1, 1.3, 0.3]} color="#FF6B35" label="A" />
      </Float>
    </group>
  );
}

/* ----------------------------- Orbiting toys ---------------------------- */
function OrbitingToys() {
  const ringRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ringRef.current) ringRef.current.rotation.y = t * 0.25;
  });
  const items: {pos: [number, number, number]; color: string; shape: 'box' | 'sphere' | 'cone'}[] =
    [
      {pos: [2.6, 0.4, 0], color: '#4ECDC4', shape: 'sphere'},
      {pos: [-2.6, 0.6, 0.2], color: '#FFE66D', shape: 'box'},
      {pos: [0, 0.5, 2.6], color: '#6C63FF', shape: 'cone'},
      {pos: [0, 0.6, -2.6], color: '#FF6B35', shape: 'box'},
      {pos: [1.8, -0.1, 1.8], color: '#FFE66D', shape: 'sphere'},
      {pos: [-1.8, 0.2, -1.8], color: '#4ECDC4', shape: 'cone'},
    ];
  return (
    <group ref={ringRef}>
      {items.map((it, i) => (
        <Float key={i} floatIntensity={0.8} rotationIntensity={0.6} speed={1.4}>
          <mesh position={it.pos} castShadow>
            {it.shape === 'box' && <boxGeometry args={[0.32, 0.32, 0.32]} />}
            {it.shape === 'sphere' && <sphereGeometry args={[0.22, 24, 24]} />}
            {it.shape === 'cone' && <coneGeometry args={[0.22, 0.5, 24]} />}
            <meshStandardMaterial color={it.color} metalness={0.35} roughness={0.4} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

/* -------------------------------- Rocket -------------------------------- */
function Rocket({position}: {position: [number, number, number]}) {
  return (
    <group position={position} rotation={[0, 0, -0.3]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.14, 0.14, 0.6, 24]} />
        <meshStandardMaterial color="#ffffff" metalness={0.3} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.4, 0]} castShadow>
        <coneGeometry args={[0.14, 0.3, 24]} />
        <meshStandardMaterial color="#FF6B35" />
      </mesh>
      <mesh position={[0, -0.32, 0]}>
        <coneGeometry args={[0.18, 0.22, 6]} />
        <meshStandardMaterial color="#FFE66D" emissive="#FF6B35" emissiveIntensity={0.4} />
      </mesh>
    </group>
  );
}

/* -------------------------------- Block --------------------------------- */
function Block({
  position,
  color,
}: {
  position: [number, number, number];
  color: string;
  label?: string;
}) {
  return (
    <group position={position}>
      <RoundedBox args={[0.45, 0.45, 0.45]} radius={0.06} smoothness={4} castShadow>
        <meshStandardMaterial color={color} metalness={0.2} roughness={0.6} />
      </RoundedBox>
    </group>
  );
}
