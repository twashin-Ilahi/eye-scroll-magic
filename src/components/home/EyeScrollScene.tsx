import { Canvas, useFrame, extend } from "@react-three/fiber";
import { Float, Environment, MeshTransmissionMaterial, RoundedBox } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function Eye({ position }: { position: [number, number, number] }) {
  const eyeRef = useRef<THREE.Group>(null);
  const irisRef = useRef<THREE.Mesh>(null);
  const pupilRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (irisRef.current && pupilRef.current) {
      // Smooth scrolling animation - eye looks up and down
      const scrollY = Math.sin(clock.getElapsedTime() * 0.8) * 0.15;
      irisRef.current.position.y = scrollY;
      pupilRef.current.position.y = scrollY;
    }
  });

  return (
    <group ref={eyeRef} position={position}>
      {/* Eyeball - white sclera with glass effect */}
      <mesh>
        <sphereGeometry args={[0.5, 64, 64]} />
        <MeshTransmissionMaterial
          backside
          samples={16}
          resolution={512}
          transmission={0.95}
          roughness={0.05}
          thickness={0.5}
          ior={1.5}
          chromaticAberration={0.06}
          anisotropy={0.1}
          distortion={0.1}
          distortionScale={0.2}
          color="#f0f8ff"
        />
      </mesh>

      {/* Iris - electric cyan */}
      <mesh ref={irisRef} position={[0, 0, 0.35]}>
        <circleGeometry args={[0.22, 64]} />
        <meshStandardMaterial
          color="#22d3ee"
          emissive="#0891b2"
          emissiveIntensity={0.5}
          metalness={0.3}
          roughness={0.2}
        />
      </mesh>

      {/* Pupil - dark center */}
      <mesh ref={pupilRef} position={[0, 0, 0.36]}>
        <circleGeometry args={[0.1, 64]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.8} roughness={0.1} />
      </mesh>

      {/* Highlight reflection */}
      <mesh position={[0.1, 0.12, 0.45]}>
        <circleGeometry args={[0.05, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

function Laptop() {
  const laptopRef = useRef<THREE.Group>(null);
  const screenContentRef = useRef<THREE.Mesh>(null);

  // Create scrolling content texture
  const canvasTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;
    
    // Dark background
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, 512, 512);
    
    // Draw content lines
    for (let i = 0; i < 20; i++) {
      const y = i * 30 + 20;
      ctx.fillStyle = i % 3 === 0 ? "#22d3ee" : "#475569";
      ctx.fillRect(30, y, Math.random() * 200 + 100, 8);
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }, []);

  useFrame(({ clock }) => {
    // Scroll the content
    if (canvasTexture) {
      canvasTexture.offset.y = (clock.getElapsedTime() * 0.1) % 1;
    }
    
    // Subtle laptop float
    if (laptopRef.current) {
      laptopRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.3) * 0.05;
    }
  });

  return (
    <group ref={laptopRef} position={[0, -0.8, 0]} rotation={[0.1, 0, 0]}>
      {/* Laptop base */}
      <RoundedBox args={[2, 0.08, 1.2]} radius={0.02} smoothness={4} position={[0, -0.05, 0.4]}>
        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
      </RoundedBox>

      {/* Keyboard area */}
      <mesh position={[0, 0, 0.4]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.8, 1]} />
        <meshStandardMaterial color="#0f172a" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Screen frame */}
      <group position={[0, 0.65, -0.15]} rotation={[-0.2, 0, 0]}>
        <RoundedBox args={[2, 1.4, 0.05]} radius={0.02} smoothness={4}>
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
        </RoundedBox>

        {/* Screen display */}
        <mesh ref={screenContentRef} position={[0, 0, 0.03]}>
          <planeGeometry args={[1.85, 1.25]} />
          <meshBasicMaterial map={canvasTexture} />
        </mesh>

        {/* Screen glow */}
        <pointLight position={[0, 0, 0.5]} intensity={0.3} color="#22d3ee" distance={2} />
      </group>
    </group>
  );
}

function GlowRing() {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <mesh ref={ringRef} position={[0, 0.3, -1]} rotation={[0, 0, 0]}>
      <torusGeometry args={[1.8, 0.02, 16, 100]} />
      <meshBasicMaterial color="#22d3ee" transparent opacity={0.3} />
    </mesh>
  );
}

function Particles() {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(50 * 3);
    for (let i = 0; i < 50; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3 - 1;
    }
    return positions;
  }, []);

  useFrame(({ clock }) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={50}
          array={particlePositions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#22d3ee" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
      <pointLight position={[-3, 2, 2]} intensity={0.5} color="#a855f7" />
      <pointLight position={[3, 2, 2]} intensity={0.5} color="#22d3ee" />

      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <Eye position={[0, 0.8, 0.5]} />
      </Float>

      <Laptop />
      <GlowRing />
      <Particles />

      <Environment preset="night" />
    </>
  );
}

export const EyeScrollScene = () => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0.5, 4], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
};
