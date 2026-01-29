import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Environment } from "@react-three/drei";
import { useRef, useState, useMemo, useEffect, useCallback } from "react";
import * as THREE from "three";

// Floating particles matching NavEye theme
function Particles() {
  const particlesRef = useRef<THREE.Group>(null);
  const particleData = useMemo(() => {
    return Array.from({ length: 25 }).map(() => ({
      position: [
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 2 - 1
      ] as [number, number, number],
      speed: Math.random() * 0.003 + 0.001,
      color: Math.random() > 0.5 ? "#4A90E2" : "#9B59B6",
      size: Math.random() * 0.03 + 0.02
    }));
  }, []);

  useFrame(() => {
    if (!particlesRef.current) return;
    particlesRef.current.children.forEach((child, i) => {
      child.position.y += particleData[i].speed;
      if (child.position.y > 2) {
        child.position.y = -2;
        child.position.x = (Math.random() - 0.5) * 6;
      }
    });
  });

  return (
    <group ref={particlesRef}>
      {particleData.map((particle, i) => (
        <mesh key={i} position={particle.position}>
          <sphereGeometry args={[particle.size, 8, 8]} />
          <meshBasicMaterial
            color={particle.color}
            transparent
            opacity={0.35}
          />
        </mesh>
      ))}
    </group>
  );
}

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

// Realistic 3D Cat Face
function RealisticCatFace({ 
  leftEyeClosed, 
  rightEyeClosed 
}: { 
  leftEyeClosed: boolean; 
  rightEyeClosed: boolean;
}) {
  const headRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Group>(null);
  const rightEyeRef = useRef<THREE.Group>(null);
  const leftPupilRef = useRef<THREE.Group>(null);
  const rightPupilRef = useRef<THREE.Group>(null);
  const leftEarRef = useRef<THREE.Mesh>(null);
  const rightEarRef = useRef<THREE.Mesh>(null);
  const whiskersLeftRef = useRef<THREE.Group>(null);
  const whiskersRightRef = useRef<THREE.Group>(null);
  
  const leftEyeScaleRef = useRef(1);
  const rightEyeScaleRef = useRef(1);
  const blinkTimerRef = useRef(0);
  const earTwitchTimerRef = useRef(0);
  const isBlinkingRef = useRef(false);

  const { mouse, viewport } = useThree();

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    // Gentle head idle rotation
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(time * 0.5) * 0.08;
      headRef.current.rotation.x = Math.cos(time * 0.3) * 0.03;
      headRef.current.position.y = Math.sin(time * 0.8) * 0.02;
    }

    // Eye follow cursor (subtle)
    const targetX = (mouse.x * viewport.width) / 40;
    const targetY = (mouse.y * viewport.height) / 40;
    
    if (leftPupilRef.current) {
      leftPupilRef.current.position.x = THREE.MathUtils.lerp(leftPupilRef.current.position.x, targetX * 0.02, 0.05);
      leftPupilRef.current.position.y = THREE.MathUtils.lerp(leftPupilRef.current.position.y, targetY * 0.02, 0.05);
    }
    if (rightPupilRef.current) {
      rightPupilRef.current.position.x = THREE.MathUtils.lerp(rightPupilRef.current.position.x, targetX * 0.02, 0.05);
      rightPupilRef.current.position.y = THREE.MathUtils.lerp(rightPupilRef.current.position.y, targetY * 0.02, 0.05);
    }

    // Random blinking (when not controlled by scroll)
    if (!leftEyeClosed && !rightEyeClosed) {
      blinkTimerRef.current += 0.016;
      if (blinkTimerRef.current > 3 + Math.random() * 2 && !isBlinkingRef.current) {
        isBlinkingRef.current = true;
        blinkTimerRef.current = 0;
      }
    }

    // Eye animations
    if (leftEyeRef.current) {
      let targetScale = 1;
      if (leftEyeClosed) targetScale = 0.08;
      else if (isBlinkingRef.current) targetScale = 0.1;
      
      leftEyeScaleRef.current = THREE.MathUtils.lerp(leftEyeScaleRef.current, targetScale, 0.15);
      leftEyeRef.current.scale.y = leftEyeScaleRef.current;
      
      if (isBlinkingRef.current && leftEyeScaleRef.current < 0.15) {
        isBlinkingRef.current = false;
      }
    }
    
    if (rightEyeRef.current) {
      let targetScale = 1;
      if (rightEyeClosed) targetScale = 0.08;
      else if (isBlinkingRef.current) targetScale = 0.1;
      
      rightEyeScaleRef.current = THREE.MathUtils.lerp(rightEyeScaleRef.current, targetScale, 0.15);
      rightEyeRef.current.scale.y = rightEyeScaleRef.current;
    }

    // Ear twitch animation
    earTwitchTimerRef.current += 0.016;
    if (earTwitchTimerRef.current > 8 + Math.random() * 4) {
      earTwitchTimerRef.current = 0;
    }
    
    if (leftEarRef.current) {
      const twitchPhase = earTwitchTimerRef.current < 0.3 ? Math.sin(earTwitchTimerRef.current * 20) * 0.1 : 0;
      leftEarRef.current.rotation.z = 0.35 + twitchPhase;
    }
    
    if (rightEarRef.current) {
      const twitchPhase = earTwitchTimerRef.current > 4 && earTwitchTimerRef.current < 4.3 
        ? Math.sin((earTwitchTimerRef.current - 4) * 20) * 0.1 : 0;
      rightEarRef.current.rotation.z = -0.35 + twitchPhase;
    }

    // Whisker sway
    if (whiskersLeftRef.current) {
      whiskersLeftRef.current.rotation.z = Math.sin(time * 1.5) * 0.02;
    }
    if (whiskersRightRef.current) {
      whiskersRightRef.current.rotation.z = Math.sin(time * 1.5 + 0.5) * 0.02;
    }
  });

  // Fur material - soft gray
  const furMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#8B9098",
    roughness: 0.7,
    metalness: 0.1,
  }), []);

  // White fur for snout/chest
  const whiteFurMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#F5F5F5",
    roughness: 0.65,
    metalness: 0.05,
  }), []);

  // Eye material - emerald green with glow
  const eyeMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#2ECC71",
    roughness: 0.1,
    metalness: 0.3,
    emissive: "#2ECC71",
    emissiveIntensity: 0.35,
    envMapIntensity: 1.5,
  }), []);

  // Nose material - moist pink
  const noseMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#FFB6C1",
    roughness: 0.25,
    metalness: 0.15,
  }), []);

  // Inner ear pink
  const innerEarMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#E8B4B8",
    roughness: 0.6,
    metalness: 0.05,
  }), []);

  return (
    <group ref={headRef} position={[0, 0, 0]}>
      {/* Main lighting */}
      <pointLight position={[0, 0, 3]} intensity={1.5} color="#4A90E2" distance={8} />
      <pointLight position={[0, 2, -2]} intensity={0.8} color="#9B59B6" distance={6} />
      <spotLight 
        position={[0, 1, 4]} 
        angle={0.3} 
        penumbra={0.5} 
        intensity={1.2} 
        color="#ffffff"
        target-position={[0, 0, 0]}
      />

      {/* HEAD - main sphere */}
      <mesh scale={[1.0, 0.95, 0.85]}>
        <sphereGeometry args={[1, 64, 64]} />
        <primitive object={furMaterial} attach="material" />
      </mesh>

      {/* Forehead/top of head bulge */}
      <mesh position={[0, 0.3, 0.1]} scale={[0.9, 0.5, 0.7]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <primitive object={furMaterial} attach="material" />
      </mesh>

      {/* SNOUT - protruding white area */}
      <mesh position={[0, -0.25, 0.75]} scale={[0.55, 0.45, 0.4]}>
        <sphereGeometry args={[1, 32, 32]} />
        <primitive object={whiteFurMaterial} attach="material" />
      </mesh>

      {/* Cheeks */}
      <mesh position={[-0.45, -0.15, 0.4]} scale={[0.4, 0.35, 0.35]}>
        <sphereGeometry args={[1, 24, 24]} />
        <primitive object={furMaterial} attach="material" />
      </mesh>
      <mesh position={[0.45, -0.15, 0.4]} scale={[0.4, 0.35, 0.35]}>
        <sphereGeometry args={[1, 24, 24]} />
        <primitive object={furMaterial} attach="material" />
      </mesh>

      {/* LEFT EYE */}
      <group ref={leftEyeRef} position={[-0.32, 0.08, 0.7]}>
        {/* Eye socket shadow */}
        <mesh position={[0, 0, -0.02]} scale={[1.1, 1.15, 0.3]}>
          <sphereGeometry args={[0.22, 32, 32]} />
          <meshStandardMaterial color="#6B7280" roughness={0.8} />
        </mesh>
        {/* Eyeball - white sclera */}
        <mesh scale={[1, 1, 0.5]}>
          <sphereGeometry args={[0.2, 48, 48]} />
          <meshStandardMaterial color="#FAFAFA" roughness={0.2} metalness={0.05} />
        </mesh>
        {/* Iris - emerald green */}
        <mesh position={[0, 0, 0.08]} scale={[0.85, 0.85, 0.4]}>
          <sphereGeometry args={[0.16, 32, 32]} />
          <primitive object={eyeMaterial} attach="material" />
        </mesh>
        {/* Pupil - vertical slit */}
        <group ref={leftPupilRef} position={[0, 0, 0.12]}>
          <mesh scale={[0.25, 1, 0.3]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshBasicMaterial color="#0a0a0a" />
          </mesh>
        </group>
        {/* Eye highlight/catchlight */}
        <mesh position={[0.05, 0.06, 0.15]}>
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[-0.03, -0.04, 0.14]}>
          <sphereGeometry args={[0.02, 12, 12]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.7} />
        </mesh>
      </group>

      {/* RIGHT EYE */}
      <group ref={rightEyeRef} position={[0.32, 0.08, 0.7]}>
        <mesh position={[0, 0, -0.02]} scale={[1.1, 1.15, 0.3]}>
          <sphereGeometry args={[0.22, 32, 32]} />
          <meshStandardMaterial color="#6B7280" roughness={0.8} />
        </mesh>
        <mesh scale={[1, 1, 0.5]}>
          <sphereGeometry args={[0.2, 48, 48]} />
          <meshStandardMaterial color="#FAFAFA" roughness={0.2} metalness={0.05} />
        </mesh>
        <mesh position={[0, 0, 0.08]} scale={[0.85, 0.85, 0.4]}>
          <sphereGeometry args={[0.16, 32, 32]} />
          <primitive object={eyeMaterial} attach="material" />
        </mesh>
        <group ref={rightPupilRef} position={[0, 0, 0.12]}>
          <mesh scale={[0.25, 1, 0.3]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshBasicMaterial color="#0a0a0a" />
          </mesh>
        </group>
        <mesh position={[0.05, 0.06, 0.15]}>
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[-0.03, -0.04, 0.14]}>
          <sphereGeometry args={[0.02, 12, 12]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.7} />
        </mesh>
      </group>

      {/* NOSE */}
      <group position={[0, -0.28, 0.95]}>
        {/* Nose base */}
        <mesh rotation={[0.3, 0, 0]} scale={[1, 0.7, 0.5]}>
          <sphereGeometry args={[0.08, 24, 24]} />
          <primitive object={noseMaterial} attach="material" />
        </mesh>
        {/* Nose highlight */}
        <mesh position={[0.015, 0.02, 0.04]}>
          <sphereGeometry args={[0.018, 12, 12]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
        </mesh>
        {/* Nostrils */}
        <mesh position={[-0.025, -0.01, 0.05]} scale={[0.6, 0.4, 0.3]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshBasicMaterial color="#8B4557" />
        </mesh>
        <mesh position={[0.025, -0.01, 0.05]} scale={[0.6, 0.4, 0.3]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshBasicMaterial color="#8B4557" />
        </mesh>
      </group>

      {/* MOUTH - subtle smile curves */}
      <group position={[0, -0.38, 0.85]}>
        {/* Center line down from nose */}
        <mesh position={[0, 0.05, 0]} rotation={[0.1, 0, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.08, 8]} />
          <meshStandardMaterial color="#7B6B6B" roughness={0.5} />
        </mesh>
        {/* Left smile curve */}
        <mesh position={[-0.06, -0.01, 0]} rotation={[0.1, 0.2, 0.3]}>
          <torusGeometry args={[0.06, 0.008, 8, 16, Math.PI * 0.6]} />
          <meshStandardMaterial color="#7B6B6B" roughness={0.5} />
        </mesh>
        {/* Right smile curve */}
        <mesh position={[0.06, -0.01, 0]} rotation={[0.1, -0.2, -0.3]}>
          <torusGeometry args={[0.06, 0.008, 8, 16, Math.PI * 0.6]} />
          <meshStandardMaterial color="#7B6B6B" roughness={0.5} />
        </mesh>
      </group>

      {/* LEFT EAR */}
      <group position={[-0.55, 0.7, -0.1]}>
        <mesh ref={leftEarRef} rotation={[0.2, 0.15, 0.35]}>
          <coneGeometry args={[0.25, 0.55, 32]} />
          <primitive object={furMaterial} attach="material" />
        </mesh>
        {/* Inner ear */}
        <mesh position={[0.03, -0.02, 0.08]} rotation={[0.25, 0.15, 0.35]} scale={[0.6, 0.7, 1]}>
          <coneGeometry args={[0.18, 0.4, 24]} />
          <primitive object={innerEarMaterial} attach="material" />
        </mesh>
      </group>

      {/* RIGHT EAR */}
      <group position={[0.55, 0.7, -0.1]}>
        <mesh ref={rightEarRef} rotation={[0.2, -0.15, -0.35]}>
          <coneGeometry args={[0.25, 0.55, 32]} />
          <primitive object={furMaterial} attach="material" />
        </mesh>
        <mesh position={[-0.03, -0.02, 0.08]} rotation={[0.25, -0.15, -0.35]} scale={[0.6, 0.7, 1]}>
          <coneGeometry args={[0.18, 0.4, 24]} />
          <primitive object={innerEarMaterial} attach="material" />
        </mesh>
      </group>

      {/* LEFT WHISKERS */}
      <group ref={whiskersLeftRef} position={[-0.42, -0.22, 0.65]}>
        {[0.12, 0, -0.1].map((yOffset, i) => (
          <mesh 
            key={`left-whisker-${i}`} 
            position={[-0.3, yOffset, 0.05]} 
            rotation={[0, 0.4, 0.15 - i * 0.15]}
          >
            <cylinderGeometry args={[0.008, 0.003, 0.6, 8]} />
            <meshStandardMaterial 
              color="#FFFFFF" 
              roughness={0.3} 
              transparent 
              opacity={0.9} 
            />
          </mesh>
        ))}
      </group>

      {/* RIGHT WHISKERS */}
      <group ref={whiskersRightRef} position={[0.42, -0.22, 0.65]}>
        {[0.12, 0, -0.1].map((yOffset, i) => (
          <mesh 
            key={`right-whisker-${i}`} 
            position={[0.3, yOffset, 0.05]} 
            rotation={[0, -0.4, -0.15 + i * 0.15]}
          >
            <cylinderGeometry args={[0.008, 0.003, 0.6, 8]} />
            <meshStandardMaterial 
              color="#FFFFFF" 
              roughness={0.3} 
              transparent 
              opacity={0.9} 
            />
          </mesh>
        ))}
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
    <group ref={docRef} position={[2.2, 0.3, -0.5]} rotation={[0, -0.3, 0]}>
      <mesh>
        <boxGeometry args={[1.2, 1.6, 0.05]} />
        <meshStandardMaterial color="#1a1f3f" roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={[1.1, 1.5]} />
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
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  const scrollDirection = leftEyeClosed ? "down" : rightEyeClosed ? "up" : "none";

  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.4} color="#ffffff" />
      
      {/* Key light */}
      <directionalLight 
        position={[3, 4, 5]} 
        intensity={1.0} 
        color="#ffffff"
        castShadow
      />
      
      {/* Fill light */}
      <directionalLight 
        position={[-3, 2, 3]} 
        intensity={0.5} 
        color="#e8e8ff" 
      />
      
      {/* Accent lights */}
      <pointLight position={[-2, 1, 3]} intensity={0.6} color="#4A90E2" distance={8} />
      <pointLight position={[2, 1, 3]} intensity={0.6} color="#9B59B6" distance={8} />

      <Float speed={1.0} rotationIntensity={0.05} floatIntensity={0.2}>
        <RealisticCatFace leftEyeClosed={leftEyeClosed} rightEyeClosed={rightEyeClosed} />
      </Float>

      <FloatingDocument scrollDirection={scrollDirection} />

      {/* Background particles */}
      <Particles />

      {/* Scroll indicator particles */}
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
      <div className="w-full h-full flex items-center justify-center" role="img" aria-label="3D cat face illustration representing eye-tracking technology">
        <div className="text-center text-muted-foreground">
          <p>3D animation paused for reduced motion</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full" role="img" aria-label="Interactive 3D cat face with emerald green eyes demonstrating eye-tracking scroll functionality">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        gl={{ 
          antialias: true, 
          alpha: true, 
          powerPreference: "high-performance",
          stencil: false,
          depth: true
        }}
        style={{ background: "transparent" }}
        dpr={[1, 2]}
        shadows
      >
        <Scene />
      </Canvas>
    </div>
  );
};
