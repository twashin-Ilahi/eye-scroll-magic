import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment } from "@react-three/drei";
import { useRef, useState, useMemo, useEffect } from "react";
import * as THREE from "three";

// Particle system for eye-triggered flows
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
  const particleCount = 100;
  
  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 2;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1 - 0.5;
      velocities[i] = Math.random() * 0.02 + 0.01;
    }
    
    return { positions, velocities };
  }, []);

  useFrame(() => {
    if (!particlesRef.current || !active) return;
    
    const posArray = particlesRef.current.geometry.attributes.position.array as Float32Array;
    const speed = direction === "down" ? -1 : 1;
    
    for (let i = 0; i < particleCount; i++) {
      posArray[i * 3 + 1] += velocities[i] * speed;
      
      // Reset particles that go out of bounds
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
        size={0.05}
        color={color}
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Hello Kitty style face - exact match to reference
function AnimatedKitty({ 
  leftEyeClosed, 
  rightEyeClosed 
}: { 
  leftEyeClosed: boolean; 
  rightEyeClosed: boolean;
}) {
  const faceRef = useRef<THREE.Group>(null);
  const leftEyeScaleRef = useRef(1);
  const rightEyeScaleRef = useRef(1);
  const leftEyeGroupRef = useRef<THREE.Group>(null);
  const rightEyeGroupRef = useRef<THREE.Group>(null);

  useFrame(({ clock, mouse }) => {
    if (faceRef.current) {
      faceRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.3) * 0.08 + mouse.x * 0.08;
      faceRef.current.rotation.x = Math.cos(clock.getElapsedTime() * 0.2) * 0.04 + mouse.y * 0.04;
    }

    // Animate left eye closing/opening
    if (leftEyeGroupRef.current) {
      const targetScale = leftEyeClosed ? 0.1 : 1;
      leftEyeScaleRef.current = THREE.MathUtils.lerp(leftEyeScaleRef.current, targetScale, 0.12);
      leftEyeGroupRef.current.scale.y = leftEyeScaleRef.current;
    }
    
    // Animate right eye closing/opening
    if (rightEyeGroupRef.current) {
      const targetScale = rightEyeClosed ? 0.1 : 1;
      rightEyeScaleRef.current = THREE.MathUtils.lerp(rightEyeScaleRef.current, targetScale, 0.12);
      rightEyeGroupRef.current.scale.y = rightEyeScaleRef.current;
    }
  });

  return (
    <group ref={faceRef} position={[0, 0, 0]}>
      {/* Outer glow - blue/purple themed */}
      <mesh scale={[1.35, 1.15, 1]}>
        <sphereGeometry args={[1.08, 64, 64]} />
        <meshBasicMaterial color="#4A90E2" transparent opacity={0.12} side={THREE.BackSide} />
      </mesh>
      <mesh scale={[1.35, 1.15, 1]}>
        <sphereGeometry args={[1.05, 64, 64]} />
        <meshBasicMaterial color="#9B59B6" transparent opacity={0.08} side={THREE.BackSide} />
      </mesh>

      {/* Backlighting for glow effect */}
      <pointLight position={[0, 0, -1]} intensity={0.8} color="#4A90E2" distance={3} />
      <pointLight position={[-1.5, 0, 0]} intensity={0.4} color="#9B59B6" distance={2} />
      <pointLight position={[1.5, 0, 0]} intensity={0.4} color="#4A90E2" distance={2} />

      {/* HEAD - wider oval shape (Hello Kitty proportions) */}
      <mesh scale={[1.3, 1.1, 1]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.25}
          metalness={0.05}
          emissive="#ffffff"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* LEFT EAR - small pointed */}
      <group position={[-0.75, 0.85, 0]}>
        <mesh rotation={[0, 0, 0.2]}>
          <coneGeometry args={[0.28, 0.45, 32]} />
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.25}
            metalness={0.05}
            emissive="#ffffff"
            emissiveIntensity={0.15}
          />
        </mesh>
      </group>

      {/* RIGHT EAR - small pointed */}
      <group position={[0.75, 0.85, 0]}>
        <mesh rotation={[0, 0, -0.2]}>
          <coneGeometry args={[0.28, 0.45, 32]} />
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.25}
            metalness={0.05}
            emissive="#ffffff"
            emissiveIntensity={0.15}
          />
        </mesh>
      </group>

      {/* PINK BOW - on right ear */}
      <group position={[0.95, 0.75, 0.25]} rotation={[0, 0, -0.3]}>
        {/* Bow center */}
        <mesh>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial 
            color="#E91E8C" 
            roughness={0.3}
            emissive="#E91E8C"
            emissiveIntensity={0.4}
          />
        </mesh>
        {/* Left loop */}
        <mesh position={[-0.18, 0.05, 0]} rotation={[0, 0, 0.4]} scale={[1, 0.7, 0.5]}>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial 
            color="#E91E8C" 
            roughness={0.3}
            emissive="#E91E8C"
            emissiveIntensity={0.4}
          />
        </mesh>
        {/* Right loop */}
        <mesh position={[0.18, 0.05, 0]} rotation={[0, 0, -0.4]} scale={[1, 0.7, 0.5]}>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial 
            color="#E91E8C" 
            roughness={0.3}
            emissive="#E91E8C"
            emissiveIntensity={0.4}
          />
        </mesh>
      </group>

      {/* LEFT EYE - simple black oval */}
      <group ref={leftEyeGroupRef} position={[-0.38, 0.05, 0.95]}>
        <mesh scale={[0.8, 1.1, 0.5]}>
          <sphereGeometry args={[0.14, 32, 32]} />
          <meshStandardMaterial 
            color="#1a1a1a" 
            roughness={0.2}
            metalness={0.1}
          />
        </mesh>
      </group>

      {/* RIGHT EYE - simple black oval */}
      <group ref={rightEyeGroupRef} position={[0.38, 0.05, 0.95]}>
        <mesh scale={[0.8, 1.1, 0.5]}>
          <sphereGeometry args={[0.14, 32, 32]} />
          <meshStandardMaterial 
            color="#1a1a1a" 
            roughness={0.2}
            metalness={0.1}
          />
        </mesh>
      </group>

      {/* NOSE - yellow oval */}
      <mesh position={[0, -0.18, 1.02]} scale={[1, 0.8, 0.5]}>
        <sphereGeometry args={[0.09, 32, 32]} />
        <meshStandardMaterial 
          color="#FFD700" 
          roughness={0.3}
          emissive="#FFD700"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* LEFT WHISKERS - 3 lines angled outward */}
      <group position={[-0.65, -0.05, 0.75]}>
        {/* Top whisker */}
        <mesh position={[0, 0.12, 0]} rotation={[0, 0.3, 0.25]}>
          <cylinderGeometry args={[0.012, 0.008, 0.55, 8]} />
          <meshStandardMaterial color="#4a5568" roughness={0.4} />
        </mesh>
        {/* Middle whisker */}
        <mesh rotation={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.012, 0.008, 0.6, 8]} />
          <meshStandardMaterial color="#4a5568" roughness={0.4} />
        </mesh>
        {/* Bottom whisker */}
        <mesh position={[0, -0.12, 0]} rotation={[0, 0.3, -0.25]}>
          <cylinderGeometry args={[0.012, 0.008, 0.55, 8]} />
          <meshStandardMaterial color="#4a5568" roughness={0.4} />
        </mesh>
      </group>

      {/* RIGHT WHISKERS - 3 lines angled outward */}
      <group position={[0.65, -0.05, 0.75]}>
        {/* Top whisker */}
        <mesh position={[0, 0.12, 0]} rotation={[0, -0.3, -0.25]}>
          <cylinderGeometry args={[0.012, 0.008, 0.55, 8]} />
          <meshStandardMaterial color="#4a5568" roughness={0.4} />
        </mesh>
        {/* Middle whisker */}
        <mesh rotation={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.012, 0.008, 0.6, 8]} />
          <meshStandardMaterial color="#4a5568" roughness={0.4} />
        </mesh>
        {/* Bottom whisker */}
        <mesh position={[0, -0.12, 0]} rotation={[0, -0.3, 0.25]}>
          <cylinderGeometry args={[0.012, 0.008, 0.55, 8]} />
          <meshStandardMaterial color="#4a5568" roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
}

// Floating document that scrolls
function FloatingDocument({ scrollDirection }: { scrollDirection: "up" | "down" | "none" }) {
  const docRef = useRef<THREE.Group>(null);
  const contentRef = useRef<THREE.Mesh>(null);
  const scrollOffset = useRef(0);

  // Create scrolling content texture
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

    // Scroll content based on direction
    if (canvasTexture && scrollDirection !== "none") {
      const speed = scrollDirection === "down" ? 0.003 : -0.003;
      scrollOffset.current += speed;
      canvasTexture.offset.y = scrollOffset.current;
    }
  });

  return (
    <group ref={docRef} position={[2, 0.3, -0.5]} rotation={[0, -0.3, 0]}>
      {/* Document frame */}
      <mesh>
        <boxGeometry args={[1.2, 1.6, 0.05]} />
        <meshStandardMaterial 
          color="#1a1f3f" 
          roughness={0.3}
          metalness={0.5}
        />
      </mesh>
      
      {/* Screen content */}
      <mesh ref={contentRef} position={[0, 0, 0.03]}>
        <planeGeometry args={[1.1, 1.5]} />
        <meshBasicMaterial map={canvasTexture} />
      </mesh>

      {/* Glow effect */}
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

  // Auto-animate eye states for demo
  useEffect(() => {
    const interval = setInterval(() => {
      cycleRef.current = (cycleRef.current + 1) % 6;
      
      switch (cycleRef.current) {
        case 0: // Both open
          setLeftEyeClosed(false);
          setRightEyeClosed(false);
          break;
        case 1: // Left closed - scroll down
          setLeftEyeClosed(true);
          setRightEyeClosed(false);
          break;
        case 2: // Both open
          setLeftEyeClosed(false);
          setRightEyeClosed(false);
          break;
        case 3: // Right closed - scroll up
          setLeftEyeClosed(false);
          setRightEyeClosed(true);
          break;
        case 4: // Both open
          setLeftEyeClosed(false);
          setRightEyeClosed(false);
          break;
        case 5: // Both open (longer pause)
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
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.6} color="#ffffff" />
      <pointLight position={[-3, 2, 3]} intensity={0.8} color="#4A90E2" />
      <pointLight position={[3, 2, 3]} intensity={0.8} color="#9B59B6" />

      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
        <AnimatedKitty leftEyeClosed={leftEyeClosed} rightEyeClosed={rightEyeClosed} />
      </Float>

      <FloatingDocument scrollDirection={scrollDirection} />

      {/* Particle flows */}
      <group position={[0, 0, 0.5]}>
        <ParticleFlow active={leftEyeClosed} direction="down" color="#4A90E2" />
        <ParticleFlow active={rightEyeClosed} direction="up" color="#9B59B6" />
      </group>

      <Environment preset="night" />
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
