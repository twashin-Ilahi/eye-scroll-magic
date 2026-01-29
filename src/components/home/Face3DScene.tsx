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

// Animated kitty face - crystalline glowing cat
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
      faceRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.3) * 0.1 + mouse.x * 0.1;
      faceRef.current.rotation.x = Math.cos(clock.getElapsedTime() * 0.2) * 0.05 + mouse.y * 0.05;
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
      {/* Outer crystalline glow */}
      <mesh>
        <sphereGeometry args={[1.12, 64, 64]} />
        <meshBasicMaterial color="#4A90E2" transparent opacity={0.08} side={THREE.BackSide} />
      </mesh>
      
      {/* Purple accent rim */}
      <mesh>
        <sphereGeometry args={[1.06, 64, 64]} />
        <meshBasicMaterial color="#9B59B6" transparent opacity={0.15} side={THREE.BackSide} />
      </mesh>

      {/* Backlighting */}
      <pointLight position={[0, 0, -1.5]} intensity={1.2} color="#4A90E2" distance={3} />
      <pointLight position={[-1, 0.5, -0.5]} intensity={0.6} color="#9B59B6" distance={2.5} />
      <pointLight position={[1, 0.5, -0.5]} intensity={0.6} color="#4A90E2" distance={2.5} />

      {/* Head - crystalline dark sphere */}
      <mesh>
        <sphereGeometry args={[1, 128, 128]} />
        <meshStandardMaterial
          color="#0a0a12"
          roughness={0.12}
          metalness={0.5}
          envMapIntensity={1.8}
        />
      </mesh>
      
      {/* Inner glass layer */}
      <mesh>
        <sphereGeometry args={[0.97, 64, 64]} />
        <meshStandardMaterial
          color="#08080f"
          roughness={0.08}
          metalness={0.7}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Surface highlights */}
      <mesh position={[0.35, 0.5, 0.8]}>
        <circleGeometry args={[0.12, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
      </mesh>

      {/* LEFT EAR */}
      <group position={[-0.55, 0.85, 0.1]} rotation={[0, 0, 0.3]}>
        {/* Ear glow */}
        <mesh>
          <coneGeometry args={[0.32, 0.55, 32]} />
          <meshBasicMaterial color="#4A90E2" transparent opacity={0.15} />
        </mesh>
        {/* Main ear */}
        <mesh>
          <coneGeometry args={[0.28, 0.5, 32]} />
          <meshStandardMaterial
            color="#0a0a12"
            roughness={0.12}
            metalness={0.5}
          />
        </mesh>
        {/* Inner ear - pink glow */}
        <mesh position={[0, -0.08, 0.12]} scale={[0.6, 0.7, 1]}>
          <coneGeometry args={[0.18, 0.3, 32]} />
          <meshStandardMaterial
            color="#9B59B6"
            roughness={0.3}
            emissive="#9B59B6"
            emissiveIntensity={0.3}
          />
        </mesh>
      </group>

      {/* RIGHT EAR */}
      <group position={[0.55, 0.85, 0.1]} rotation={[0, 0, -0.3]}>
        {/* Ear glow */}
        <mesh>
          <coneGeometry args={[0.32, 0.55, 32]} />
          <meshBasicMaterial color="#4A90E2" transparent opacity={0.15} />
        </mesh>
        {/* Main ear */}
        <mesh>
          <coneGeometry args={[0.28, 0.5, 32]} />
          <meshStandardMaterial
            color="#0a0a12"
            roughness={0.12}
            metalness={0.5}
          />
        </mesh>
        {/* Inner ear */}
        <mesh position={[0, -0.08, 0.12]} scale={[0.6, 0.7, 1]}>
          <coneGeometry args={[0.18, 0.3, 32]} />
          <meshStandardMaterial
            color="#9B59B6"
            roughness={0.3}
            emissive="#9B59B6"
            emissiveIntensity={0.3}
          />
        </mesh>
      </group>

      {/* LEFT EYE - cat-style almond shape */}
      <group ref={leftEyeGroupRef} position={[-0.32, 0.15, 0.88]}>
        {/* Eye glow */}
        <mesh scale={[1.3, 1, 1]}>
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
        </mesh>
        {/* Main eye */}
        <mesh scale={[1.2, 0.9, 1]}>
          <sphereGeometry args={[0.16, 32, 32]} />
          <meshStandardMaterial 
            color="#ffffff" 
            roughness={0.03}
            metalness={0.1}
            emissive="#ffffff"
            emissiveIntensity={0.5}
          />
        </mesh>
        {/* Pupil - vertical cat slit */}
        <mesh position={[0, 0, 0.14]} scale={[0.3, 1, 1]}>
          <circleGeometry args={[0.08, 16]} />
          <meshBasicMaterial color="#0a0a12" />
        </mesh>
        {/* Eye highlight */}
        <mesh position={[0.04, 0.04, 0.15]}>
          <circleGeometry args={[0.04, 16]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.95} />
        </mesh>
      </group>

      {/* RIGHT EYE */}
      <group ref={rightEyeGroupRef} position={[0.32, 0.15, 0.88]}>
        {/* Eye glow */}
        <mesh scale={[1.3, 1, 1]}>
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
        </mesh>
        {/* Main eye */}
        <mesh scale={[1.2, 0.9, 1]}>
          <sphereGeometry args={[0.16, 32, 32]} />
          <meshStandardMaterial 
            color="#ffffff" 
            roughness={0.03}
            metalness={0.1}
            emissive="#ffffff"
            emissiveIntensity={0.5}
          />
        </mesh>
        {/* Pupil - vertical cat slit */}
        <mesh position={[0, 0, 0.14]} scale={[0.3, 1, 1]}>
          <circleGeometry args={[0.08, 16]} />
          <meshBasicMaterial color="#0a0a12" />
        </mesh>
        {/* Eye highlight */}
        <mesh position={[0.04, 0.04, 0.15]}>
          <circleGeometry args={[0.04, 16]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.95} />
        </mesh>
      </group>

      {/* NOSE - small triangle */}
      <group position={[0, -0.12, 0.98]}>
        {/* Nose glow */}
        <mesh rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.1, 0.12, 3]} />
          <meshBasicMaterial color="#9B59B6" transparent opacity={0.3} />
        </mesh>
        {/* Main nose */}
        <mesh rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.07, 0.09, 3]} />
          <meshStandardMaterial 
            color="#9B59B6"
            roughness={0.2}
            emissive="#9B59B6"
            emissiveIntensity={0.4}
          />
        </mesh>
      </group>

      {/* MOUTH - cat "w" shape using two curves */}
      <group position={[0, -0.28, 0.94]}>
        {/* Left curve */}
        <mesh position={[-0.08, 0, 0]} rotation={[0.2, 0.15, Math.PI * 0.95]}>
          <torusGeometry args={[0.1, 0.025, 16, 32, Math.PI * 0.6]} />
          <meshStandardMaterial 
            color="#ffffff" 
            roughness={0.05}
            emissive="#ffffff"
            emissiveIntensity={0.4}
          />
        </mesh>
        {/* Right curve */}
        <mesh position={[0.08, 0, 0]} rotation={[0.2, -0.15, Math.PI * 1.05]}>
          <torusGeometry args={[0.1, 0.025, 16, 32, Math.PI * 0.6]} />
          <meshStandardMaterial 
            color="#ffffff" 
            roughness={0.05}
            emissive="#ffffff"
            emissiveIntensity={0.4}
          />
        </mesh>
      </group>

      {/* WHISKERS - Left side */}
      <group position={[-0.45, -0.05, 0.85]}>
        <mesh rotation={[0, 0, 0.15]}>
          <cylinderGeometry args={[0.008, 0.004, 0.4, 8]} />
          <meshStandardMaterial color="#ffffff" emissive="#4A90E2" emissiveIntensity={0.3} />
        </mesh>
        <mesh rotation={[0, 0, 0]} position={[0, -0.08, 0]}>
          <cylinderGeometry args={[0.008, 0.004, 0.45, 8]} />
          <meshStandardMaterial color="#ffffff" emissive="#4A90E2" emissiveIntensity={0.3} />
        </mesh>
        <mesh rotation={[0, 0, -0.15]} position={[0, -0.16, 0]}>
          <cylinderGeometry args={[0.008, 0.004, 0.4, 8]} />
          <meshStandardMaterial color="#ffffff" emissive="#4A90E2" emissiveIntensity={0.3} />
        </mesh>
      </group>

      {/* WHISKERS - Right side */}
      <group position={[0.45, -0.05, 0.85]} rotation={[0, Math.PI, 0]}>
        <mesh rotation={[0, 0, 0.15]}>
          <cylinderGeometry args={[0.008, 0.004, 0.4, 8]} />
          <meshStandardMaterial color="#ffffff" emissive="#9B59B6" emissiveIntensity={0.3} />
        </mesh>
        <mesh rotation={[0, 0, 0]} position={[0, -0.08, 0]}>
          <cylinderGeometry args={[0.008, 0.004, 0.45, 8]} />
          <meshStandardMaterial color="#ffffff" emissive="#9B59B6" emissiveIntensity={0.3} />
        </mesh>
        <mesh rotation={[0, 0, -0.15]} position={[0, -0.16, 0]}>
          <cylinderGeometry args={[0.008, 0.004, 0.4, 8]} />
          <meshStandardMaterial color="#ffffff" emissive="#9B59B6" emissiveIntensity={0.3} />
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
