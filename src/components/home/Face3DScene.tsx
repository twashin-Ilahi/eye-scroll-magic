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

// Animated emoji face - matching reference: simple white oval eyes, white smile
function AnimatedFace({ 
  leftEyeClosed, 
  rightEyeClosed 
}: { 
  leftEyeClosed: boolean; 
  rightEyeClosed: boolean;
}) {
  const faceRef = useRef<THREE.Group>(null);
  const leftEyeScaleRef = useRef(1);
  const rightEyeScaleRef = useRef(1);
  const smileScaleRef = useRef(1);
  const leftEyeGroupRef = useRef<THREE.Group>(null);
  const rightEyeGroupRef = useRef<THREE.Group>(null);
  const smileGroupRef = useRef<THREE.Group>(null);

  useFrame(({ clock, mouse }) => {
    if (faceRef.current) {
      // Subtle rotation based on time and mouse
      faceRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.3) * 0.1 + mouse.x * 0.1;
      faceRef.current.rotation.x = Math.cos(clock.getElapsedTime() * 0.2) * 0.05 + mouse.y * 0.05;
    }

    // Animate left eye closing/opening by scaling Y
    if (leftEyeGroupRef.current) {
      const targetScale = leftEyeClosed ? 0.15 : 1;
      leftEyeScaleRef.current = THREE.MathUtils.lerp(leftEyeScaleRef.current, targetScale, 0.12);
      leftEyeGroupRef.current.scale.y = leftEyeScaleRef.current;
    }
    
    // Animate right eye closing/opening by scaling Y
    if (rightEyeGroupRef.current) {
      const targetScale = rightEyeClosed ? 0.15 : 1;
      rightEyeScaleRef.current = THREE.MathUtils.lerp(rightEyeScaleRef.current, targetScale, 0.12);
      rightEyeGroupRef.current.scale.y = rightEyeScaleRef.current;
    }

    // Animate smile - wider when both eyes open (happy), subtle pulse
    if (smileGroupRef.current) {
      const isHappy = !leftEyeClosed && !rightEyeClosed;
      const baseScale = isHappy ? 1.15 : 0.95;
      const pulse = Math.sin(clock.getElapsedTime() * 2) * 0.05;
      const targetSmileScale = baseScale + (isHappy ? pulse : 0);
      
      smileScaleRef.current = THREE.MathUtils.lerp(smileScaleRef.current, targetSmileScale, 0.1);
      smileGroupRef.current.scale.x = smileScaleRef.current;
      smileGroupRef.current.scale.y = THREE.MathUtils.lerp(
        smileGroupRef.current.scale.y,
        isHappy ? 1.1 : 0.9,
        0.1
      );
    }
  });

  return (
    <group ref={faceRef} position={[0, 0, 0]}>
      {/* Rim glow - outer sphere with subtle blue/purple gradient glow */}
      <mesh>
        <sphereGeometry args={[1.08, 64, 64]} />
        <meshBasicMaterial
          color="#4A90E2"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Secondary rim glow - purple accent */}
      <mesh>
        <sphereGeometry args={[1.12, 64, 64]} />
        <meshBasicMaterial
          color="#9B59B6"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Backlight for rim lighting effect */}
      <pointLight position={[0, 0, -1.5]} intensity={0.6} color="#4A90E2" distance={3} />
      <pointLight position={[-1, 0.5, -1]} intensity={0.3} color="#9B59B6" distance={2.5} />
      <pointLight position={[1, 0.5, -1]} intensity={0.3} color="#4A90E2" distance={2.5} />

      {/* Head - dark black emoji sphere */}
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          color="#0d0d0d"
          roughness={0.4}
          metalness={0.05}
        />
      </mesh>

      {/* Left Eye - round white circle */}
      <group ref={leftEyeGroupRef} position={[-0.32, 0.12, 0.88]}>
        <mesh>
          <sphereGeometry args={[0.18, 32, 32]} />
          <meshStandardMaterial 
            color="#ffffff" 
            roughness={0.1}
            emissive="#ffffff"
            emissiveIntensity={0.2}
          />
        </mesh>
        {/* Subtle highlight */}
        <mesh position={[0.05, 0.05, 0.15]}>
          <circleGeometry args={[0.04, 16]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
        </mesh>
      </group>

      {/* Right Eye - round white circle */}
      <group ref={rightEyeGroupRef} position={[0.32, 0.12, 0.88]}>
        <mesh>
          <sphereGeometry args={[0.18, 32, 32]} />
          <meshStandardMaterial 
            color="#ffffff" 
            roughness={0.1}
            emissive="#ffffff"
            emissiveIntensity={0.2}
          />
        </mesh>
        {/* Subtle highlight */}
        <mesh position={[0.05, 0.05, 0.15]}>
          <circleGeometry args={[0.04, 16]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
        </mesh>
      </group>

      {/* Smile - white U-shaped smile */}
      <group ref={smileGroupRef} position={[0, -0.32, 0.88]}>
        {/* Main smile curve - clear white U shape */}
        <mesh rotation={[0.15, 0, 0]}>
          <torusGeometry args={[0.2, 0.04, 16, 32, Math.PI]} />
          <meshStandardMaterial 
            color="#ffffff" 
            roughness={0.1}
            emissive="#ffffff"
            emissiveIntensity={0.2}
          />
        </mesh>
        {/* Smile highlight */}
        <mesh position={[0, -0.06, 0.03]} rotation={[0.2, 0, 0]}>
          <torusGeometry args={[0.15, 0.015, 8, 24, Math.PI * 0.7]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
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
        <AnimatedFace leftEyeClosed={leftEyeClosed} rightEyeClosed={rightEyeClosed} />
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
