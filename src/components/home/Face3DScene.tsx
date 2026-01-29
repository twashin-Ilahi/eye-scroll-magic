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

// Hello Kitty style face - realistic 3D render
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
      faceRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.25) * 0.06 + mouse.x * 0.06;
      faceRef.current.rotation.x = Math.cos(clock.getElapsedTime() * 0.18) * 0.03 + mouse.y * 0.03;
    }

    if (leftEyeGroupRef.current) {
      const targetScale = leftEyeClosed ? 0.08 : 1;
      leftEyeScaleRef.current = THREE.MathUtils.lerp(leftEyeScaleRef.current, targetScale, 0.1);
      leftEyeGroupRef.current.scale.y = leftEyeScaleRef.current;
    }
    
    if (rightEyeGroupRef.current) {
      const targetScale = rightEyeClosed ? 0.08 : 1;
      rightEyeScaleRef.current = THREE.MathUtils.lerp(rightEyeScaleRef.current, targetScale, 0.1);
      rightEyeGroupRef.current.scale.y = rightEyeScaleRef.current;
    }
  });

  return (
    <group ref={faceRef} position={[0, 0, 0]}>
      {/* Soft ambient glow */}
      <mesh scale={[1.38, 1.18, 1.05]}>
        <sphereGeometry args={[1.06, 64, 64]} />
        <meshBasicMaterial color="#4A90E2" transparent opacity={0.06} side={THREE.BackSide} />
      </mesh>
      <mesh scale={[1.36, 1.16, 1.03]}>
        <sphereGeometry args={[1.04, 64, 64]} />
        <meshBasicMaterial color="#9B59B6" transparent opacity={0.04} side={THREE.BackSide} />
      </mesh>

      {/* Realistic lighting setup */}
      <pointLight position={[2, 2, 3]} intensity={1.2} color="#ffffff" distance={8} />
      <pointLight position={[-2, 1, 2]} intensity={0.6} color="#e8e8ff" distance={6} />
      <pointLight position={[0, -1, 2]} intensity={0.3} color="#fff5f0" distance={4} />
      <pointLight position={[0, 0, -2]} intensity={0.4} color="#4A90E2" distance={5} />

      {/* HEAD - smooth matte ceramic finish */}
      <mesh scale={[1.32, 1.12, 0.95]}>
        <sphereGeometry args={[1, 128, 128]} />
        <meshStandardMaterial
          color="#fafafa"
          roughness={0.35}
          metalness={0.0}
          envMapIntensity={0.3}
        />
      </mesh>
      
      {/* Subtle subsurface scattering simulation layer */}
      <mesh scale={[1.31, 1.11, 0.94]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          color="#fff8f5"
          roughness={0.5}
          metalness={0.0}
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* LEFT EAR - organic rounded cone */}
      <group position={[-0.78, 0.88, -0.05]}>
        <mesh rotation={[0.15, 0.1, 0.25]}>
          <coneGeometry args={[0.26, 0.5, 32]} />
          <meshStandardMaterial
            color="#fafafa"
            roughness={0.35}
            metalness={0.0}
          />
        </mesh>
        {/* Ear highlight */}
        <mesh rotation={[0.15, 0.1, 0.25]} position={[0.03, 0.08, 0.08]}>
          <coneGeometry args={[0.12, 0.25, 16]} />
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.4}
            metalness={0.0}
            transparent
            opacity={0.3}
          />
        </mesh>
      </group>

      {/* RIGHT EAR */}
      <group position={[0.78, 0.88, -0.05]}>
        <mesh rotation={[0.15, -0.1, -0.25]}>
          <coneGeometry args={[0.26, 0.5, 32]} />
          <meshStandardMaterial
            color="#fafafa"
            roughness={0.35}
            metalness={0.0}
          />
        </mesh>
        <mesh rotation={[0.15, -0.1, -0.25]} position={[-0.03, 0.08, 0.08]}>
          <coneGeometry args={[0.12, 0.25, 16]} />
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.4}
            metalness={0.0}
            transparent
            opacity={0.3}
          />
        </mesh>
      </group>

      {/* PINK BOW - glossy plastic finish */}
      <group position={[1.0, 0.78, 0.2]} rotation={[0.1, -0.2, -0.35]}>
        {/* Bow center knot */}
        <mesh>
          <sphereGeometry args={[0.11, 32, 32]} />
          <meshStandardMaterial 
            color="#E91E8C" 
            roughness={0.15}
            metalness={0.1}
            envMapIntensity={0.8}
          />
        </mesh>
        {/* Left bow loop */}
        <mesh position={[-0.2, 0.04, 0]} rotation={[0.1, 0.2, 0.5]} scale={[1.1, 0.65, 0.45]}>
          <sphereGeometry args={[0.19, 32, 32]} />
          <meshStandardMaterial 
            color="#E91E8C" 
            roughness={0.15}
            metalness={0.1}
            envMapIntensity={0.8}
          />
        </mesh>
        {/* Right bow loop */}
        <mesh position={[0.2, 0.04, 0]} rotation={[0.1, -0.2, -0.5]} scale={[1.1, 0.65, 0.45]}>
          <sphereGeometry args={[0.19, 32, 32]} />
          <meshStandardMaterial 
            color="#E91E8C" 
            roughness={0.15}
            metalness={0.1}
            envMapIntensity={0.8}
          />
        </mesh>
        {/* Bow highlight */}
        <mesh position={[-0.12, 0.1, 0.1]} scale={[0.5, 0.3, 0.3]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color="#ff69b4" transparent opacity={0.4} />
        </mesh>
      </group>

      {/* LEFT EYE - deep black with subtle reflection */}
      <group ref={leftEyeGroupRef} position={[-0.36, 0.02, 0.88]}>
        {/* Eye socket shadow */}
        <mesh position={[0, 0, -0.02]} scale={[0.95, 1.2, 0.3]}>
          <sphereGeometry args={[0.16, 32, 32]} />
          <meshStandardMaterial 
            color="#e8e8e8" 
            roughness={0.5}
            transparent
            opacity={0.3}
          />
        </mesh>
        {/* Main eye */}
        <mesh scale={[0.85, 1.15, 0.4]}>
          <sphereGeometry args={[0.13, 48, 48]} />
          <meshStandardMaterial 
            color="#0a0a0a" 
            roughness={0.1}
            metalness={0.2}
            envMapIntensity={1.2}
          />
        </mesh>
        {/* Eye highlight - top */}
        <mesh position={[0.02, 0.06, 0.06]} scale={[0.7, 0.5, 0.3]}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
        </mesh>
      </group>

      {/* RIGHT EYE */}
      <group ref={rightEyeGroupRef} position={[0.36, 0.02, 0.88]}>
        <mesh position={[0, 0, -0.02]} scale={[0.95, 1.2, 0.3]}>
          <sphereGeometry args={[0.16, 32, 32]} />
          <meshStandardMaterial 
            color="#e8e8e8" 
            roughness={0.5}
            transparent
            opacity={0.3}
          />
        </mesh>
        <mesh scale={[0.85, 1.15, 0.4]}>
          <sphereGeometry args={[0.13, 48, 48]} />
          <meshStandardMaterial 
            color="#0a0a0a" 
            roughness={0.1}
            metalness={0.2}
            envMapIntensity={1.2}
          />
        </mesh>
        <mesh position={[0.02, 0.06, 0.06]} scale={[0.7, 0.5, 0.3]}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
        </mesh>
      </group>

      {/* NOSE - warm yellow/gold with glossy finish */}
      <group position={[0, -0.16, 0.92]}>
        {/* Nose shadow */}
        <mesh position={[0, -0.01, -0.02]} scale={[1.2, 1, 0.4]}>
          <sphereGeometry args={[0.1, 32, 32]} />
          <meshStandardMaterial 
            color="#e8e0d0" 
            roughness={0.5}
            transparent
            opacity={0.2}
          />
        </mesh>
        {/* Main nose */}
        <mesh scale={[1.05, 0.85, 0.45]}>
          <sphereGeometry args={[0.085, 48, 48]} />
          <meshStandardMaterial 
            color="#F5C518" 
            roughness={0.2}
            metalness={0.15}
            envMapIntensity={0.6}
          />
        </mesh>
        {/* Nose highlight */}
        <mesh position={[0.02, 0.02, 0.04]}>
          <sphereGeometry args={[0.025, 16, 16]} />
          <meshBasicMaterial color="#fffde0" transparent opacity={0.7} />
        </mesh>
      </group>

      {/* LEFT WHISKERS - organic tapered strands */}
      <group position={[-0.58, -0.08, 0.7]}>
        <mesh position={[-0.15, 0.1, 0.05]} rotation={[0, 0.5, 0.2]}>
          <cylinderGeometry args={[0.014, 0.006, 0.52, 12]} />
          <meshStandardMaterial color="#5a6270" roughness={0.6} metalness={0.1} />
        </mesh>
        <mesh position={[-0.18, 0, 0.03]} rotation={[0, 0.4, 0.05]}>
          <cylinderGeometry args={[0.014, 0.006, 0.58, 12]} />
          <meshStandardMaterial color="#5a6270" roughness={0.6} metalness={0.1} />
        </mesh>
        <mesh position={[-0.15, -0.1, 0.05]} rotation={[0, 0.5, -0.15]}>
          <cylinderGeometry args={[0.014, 0.006, 0.52, 12]} />
          <meshStandardMaterial color="#5a6270" roughness={0.6} metalness={0.1} />
        </mesh>
      </group>

      {/* RIGHT WHISKERS */}
      <group position={[0.58, -0.08, 0.7]}>
        <mesh position={[0.15, 0.1, 0.05]} rotation={[0, -0.5, -0.2]}>
          <cylinderGeometry args={[0.014, 0.006, 0.52, 12]} />
          <meshStandardMaterial color="#5a6270" roughness={0.6} metalness={0.1} />
        </mesh>
        <mesh position={[0.18, 0, 0.03]} rotation={[0, -0.4, -0.05]}>
          <cylinderGeometry args={[0.014, 0.006, 0.58, 12]} />
          <meshStandardMaterial color="#5a6270" roughness={0.6} metalness={0.1} />
        </mesh>
        <mesh position={[0.15, -0.1, 0.05]} rotation={[0, -0.5, 0.15]}>
          <cylinderGeometry args={[0.014, 0.006, 0.52, 12]} />
          <meshStandardMaterial color="#5a6270" roughness={0.6} metalness={0.1} />
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
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" castShadow />
      <directionalLight position={[-3, 2, 4]} intensity={0.4} color="#e8e8ff" />
      <pointLight position={[-3, 2, 3]} intensity={0.5} color="#4A90E2" />
      <pointLight position={[3, 2, 3]} intensity={0.5} color="#9B59B6" />

      <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.25}>
        <AnimatedKitty leftEyeClosed={leftEyeClosed} rightEyeClosed={rightEyeClosed} />
      </Float>

      <FloatingDocument scrollDirection={scrollDirection} />

      {/* Particle flows */}
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
