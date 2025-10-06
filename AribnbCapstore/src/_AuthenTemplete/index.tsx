import React, { useRef, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import * as THREE from "three";
import { userAuthStore } from "../store";

const AuthLayout: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const { user } = userAuthStore();

  // ✅ Kiểm tra role trước khi render UI
  if (user?.role === "ADMIN") {
    return <Navigate to="/admin" replace />;
  }

  if (user?.role === "USER") {
    return <Navigate to="/" replace />;
  }

  // fallback: nếu có role lạ thì quay về home
  if (user) {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    if (!canvasRef.current) return;

    // --- Scene setup ---
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    // --- Particles setup ---
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 3000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(posArray, 3)
    );

    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, "rgba(99, 102, 241, 1)");
      gradient.addColorStop(0.5, "rgba(168, 85, 247, 0.5)");
      gradient.addColorStop(1, "rgba(236, 72, 153, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);
    }
    const texture = new THREE.CanvasTexture(canvas);

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      map: texture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    particlesRef.current = particlesMesh;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // --- Animation ---
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      requestAnimationFrame(animate);
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      if (particlesRef.current) {
        particlesRef.current.rotation.y = targetX * 0.5;
        particlesRef.current.rotation.x = targetY * 0.5;
        particlesRef.current.rotation.z += 0.0005;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Three.js Canvas Background */}
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full -z-10"
        style={{
          background: "linear-gradient(135deg, #000000 0%, #111827 50%, #1f2937 100%)",
        }}
      />

      {/* Gradient Overlay */}
      <div
        className="fixed top-0 left-0 w-full h-full -z-5 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)",
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div
            className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl p-8 border border-white/20"
            style={{
              boxShadow:
                "0 8px 32px 0 rgba(31, 38, 135, 0.37), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)",
            }}
          >
            <Outlet />
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="fixed top-10 left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl -z-5" />
      <div className="fixed bottom-10 right-10 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl -z-5" />
      <div className="fixed top-1/2 right-20 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl -z-5" />
    </div>
  );
};

export default AuthLayout;
