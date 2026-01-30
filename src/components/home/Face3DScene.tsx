import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment } from "@react-three/drei";
import { useRef, useState, useMemo, useEffect } from "react";
import * as THREE from "three";

// Particle flow for scroll indication
function ParticleFlow({ 
  active, 
  direction, 
  color 
}: { 
  active: boolean; 
  direction: "up" | "down"; 
  color: string;
}) {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 80;
  
  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 2;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1 - 0.5;
      velocities[i] = Math.random() * 0.025 + 0.01;
    }
    
    return { positions, velocities };
  }, []);

  useFrame(() => {
    if (!particlesRef.current || !active) return;
    
    const posArray = particlesRef.current.geometry.attributes.position.array as Float32Array;
    const speed = direction === "down" ? -1 : 1;
    
    for (let i = 0; i < particleCount; i++) {
      posArray[i * 3 + 1] += velocities[i] * speed;
      
      if (direction === "down" && posArray[i * 3 + 1] < -2) {
        posArray[i * 3 + 1] = 2;
        posArray[i * 3] = (Math.random() - 0.5) * 2;
      } else if (direction === "up" && posArray[i * 3 + 1] > 2) {
        posArray[i * 3 + 1] = -2;
        posArray[i * 3] = (Math.random() - 0.5) * 2;
      }
    }
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef} visible={active}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color={color}
        transparent
        opacity={0.75}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// 3D Emoji Face with animated glow
function SimpleEmojiFace({ 
  leftEyeClosed, 
  rightEyeClosed 
}: { 
  leftEyeClosed: boolean; 
  rightEyeClosed: boolean;
}) {
  const faceRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Group>(null);
  const rightEyeRef = useRef<THREE.Group>(null);
  const smileRef = useRef<THREE.Group>(null);
  const glowRef1 = useRef<THREE.Mesh>(null);
  const glowRef2 = useRef<THREE.Mesh>(null);
  const glowRef3 = useRef<THREE.Mesh>(null);
  
  const leftEyeScaleRef = useRef(1);
  const rightEyeScaleRef = useRef(1);

  useFrame(({ clock, mouse }) => {
    const time = clock.getElapsedTime();
    
    // Gentle idle animation
    if (faceRef.current) {
      faceRef.current.rotation.y = Math.sin(time * 0.4) * 0.1 + mouse.x * 0.1;
      faceRef.current.rotation.x = Math.cos(time * 0.3) * 0.05 + mouse.y * 0.05;
    }

    // Animated tide-like glow effect
    if (glowRef1.current) {
      const scale1 = 1.1 + Math.sin(time * 1.2) * 0.08;
      glowRef1.current.scale.setScalar(scale1);
      (glowRef1.current.material as THREE.MeshBasicMaterial).opacity = 0.15 + Math.sin(time * 1.2) * 0.1;
    }
    if (glowRef2.current) {
      const scale2 = 1.18 + Math.sin(time * 1.2 + 0.5) * 0.1;
      glowRef2.current.scale.setScalar(scale2);
      (glowRef2.current.material as THREE.MeshBasicMaterial).opacity = 0.12 + Math.sin(time * 1.2 + 0.5) * 0.08;
    }
    if (glowRef3.current) {
      const scale3 = 1.28 + Math.sin(time * 1.2 + 1) * 0.12;
      glowRef3.current.scale.setScalar(scale3);
      (glowRef3.current.material as THREE.MeshBasicMaterial).opacity = 0.08 + Math.sin(time * 1.2 + 1) * 0.06;
    }

    // Animate left eye
    if (leftEyeRef.current) {
      const targetScale = leftEyeClosed ? 0.1 : 1;
      leftEyeScaleRef.current = THREE.MathUtils.lerp(leftEyeScaleRef.current, targetScale, 0.12);
      leftEyeRef.current.scale.y = leftEyeScaleRef.current;
    }
    
    // Animate right eye
    if (rightEyeRef.current) {
      const targetScale = rightEyeClosed ? 0.1 : 1;
      rightEyeScaleRef.current = THREE.MathUtils.lerp(rightEyeScaleRef.current, targetScale, 0.12);
      rightEyeRef.current.scale.y = rightEyeScaleRef.current;
    }

    // Animate smile - subtle breathing/smiling motion
    if (smileRef.current) {
      const smileScale = 1 + Math.sin(time * 0.8) * 0.08;
      const smileY = -0.28 + Math.sin(time * 1.2) * 0.015;
      smileRef.current.scale.set(smileScale, 1 + Math.sin(time * 0.6) * 0.1, 1);
      smileRef.current.position.y = smileY;
    }
  });

  return (
    <group ref={faceRef}>
      {/* Subtle animated glow layers - reduced */}
      <mesh ref={glowRef1}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial color="#4A90E2" transparent opacity={0.06} side={THREE.BackSide} />
      </mesh>
      <mesh ref={glowRef2}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial color="#9B59B6" transparent opacity={0.04} side={THREE.BackSide} />
      </mesh>
      <mesh ref={glowRef3}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial color="#4A90E2" transparent opacity={0.03} side={THREE.BackSide} />
      </mesh>

      {/* Main face sphere - reflective but softer front */}
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial 
          color="#0a0e1a"
          roughness={0.55}
          metalness={0.35}
          envMapIntensity={0.5}
        />
      </mesh>
      
      {/* Rim light effect - stronger back/side glow */}
      <mesh>
        <sphereGeometry args={[1.03, 64, 64]} />
        <meshBasicMaterial 
          color="#4A90E2" 
          transparent 
          opacity={0.2} 
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Secondary rim - purple accent */}
      <mesh>
        <sphereGeometry args={[1.06, 64, 64]} />
        <meshBasicMaterial 
          color="#9B59B6" 
          transparent 
          opacity={0.1} 
          side={THREE.BackSide}
        />
      </mesh>

      {/* Left Eye - clean white oval */}
      <group ref={leftEyeRef} position={[-0.32, 0.15, 0.88]}>
        {/* Eye main */}
        <mesh scale={[1, 1, 0.45]}>
          <sphereGeometry args={[0.14, 32, 32]} />
          <meshStandardMaterial 
            color="#ffffff" 
            roughness={0.1}
            emissive="#ffffff"
            emissiveIntensity={0.2}
          />
        </mesh>
      </group>

      {/* Right Eye - clean white oval */}
      <group ref={rightEyeRef} position={[0.32, 0.15, 0.88]}>
        {/* Eye main */}
        <mesh scale={[1, 1, 0.45]}>
          <sphereGeometry args={[0.14, 32, 32]} />
          <meshStandardMaterial 
            color="#ffffff" 
            roughness={0.1}
            emissive="#ffffff"
            emissiveIntensity={0.2}
          />
        </mesh>
      </group>

      {/* SMILE - Animated natural curve */}
      <group ref={smileRef} position={[0, -0.28, 0.92]}>
        {/* Main smile curve */}
        <mesh rotation={[0.15, 0, Math.PI]}>
          <torusGeometry args={[0.18, 0.035, 16, 32, Math.PI]} />
          <meshStandardMaterial 
            color="#ffffff" 
            roughness={0.1}
          />
        </mesh>
      </group>
    </group>
  );
}


// Floating document for scroll demo
function FloatingDocument({ scrollDirection }: { scrollDirection: "up" | "down" | "none" }) {
  const docRef = useRef<THREE.Group>(null);
  const scrollOffset = useRef(0);

  const canvasTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;
    
    ctx.fillStyle = "#0f1429";
    ctx.fillRect(0, 0, 256, 512);
    
    for (let i = 0; i < 25; i++) {
      const y = i * 22 + 15;
      ctx.fillStyle = i % 4 === 0 ? "#4A90E2" : "#3a4060";
      ctx.fillRect(20, y, Math.random() * 120 + 80, 6);
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }, []);

  useFrame(({ clock }) => {
    if (docRef.current) {
      docRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.1;
      docRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.8) * 0.1 + 0.3;
    }

    if (canvasTexture && scrollDirection !== "none") {
      const speed = scrollDirection === "down" ? 0.003 : -0.003;
      scrollOffset.current += speed;
      canvasTexture.offset.y = scrollOffset.current;
    }
  });

  return (
    <group ref={docRef} position={[2.2, -0.1, -0.5]} rotation={[0, -0.3, 0]}>
      <mesh>
        <boxGeometry args={[1.2, 2.2, 0.05]} />
        <meshStandardMaterial color="#1a1f3f" roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={[1.1, 2.1]} />
        <meshBasicMaterial map={canvasTexture} />
      </mesh>
      <pointLight 
        position={[0, 0, 0.5]} 
        intensity={scrollDirection !== "none" ? 0.5 : 0.2} 
        color={scrollDirection === "down" ? "#4A90E2" : "#9B59B6"} 
        distance={2} 
      />
    </group>
  );
}

function Scene() {
  const [leftEyeClosed, setLeftEyeClosed] = useState(false);
  const [rightEyeClosed, setRightEyeClosed] = useState(false);
  const cycleRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      cycleRef.current = (cycleRef.current + 1) % 6;
      
      switch (cycleRef.current) {
        case 0:
          setLeftEyeClosed(false);
          setRightEyeClosed(false);
          break;
        case 1:
          setLeftEyeClosed(true);
          setRightEyeClosed(false);
          break;
        case 2:
          setLeftEyeClosed(false);
          setRightEyeClosed(false);
          break;
        case 3:
          setLeftEyeClosed(false);
          setRightEyeClosed(true);
          break;
        case 4:
        case 5:
          setLeftEyeClosed(false);
          setRightEyeClosed(false);
          break;
      }
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const scrollDirection = leftEyeClosed ? "down" : rightEyeClosed ? "up" : "none";

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 3, 5]} intensity={0.8} />

      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
        <SimpleEmojiFace leftEyeClosed={leftEyeClosed} rightEyeClosed={rightEyeClosed} />
      </Float>

      <FloatingDocument scrollDirection={scrollDirection} />

      <group position={[0, 0, 0.5]}>
        <ParticleFlow active={leftEyeClosed} direction="down" color="#4A90E2" />
        <ParticleFlow active={rightEyeClosed} direction="up" color="#9B59B6" />
      </group>

      <Environment preset="studio" />
    </>
  );
}

export const Face3DScene = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  if (prefersReducedMotion) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <p>3D animation paused for reduced motion</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
        dpr={[1, 2]}
      >
        <Scene />
      </Canvas>
    </div>
  );
};
