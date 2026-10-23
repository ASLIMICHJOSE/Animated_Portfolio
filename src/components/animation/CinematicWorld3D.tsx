"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { initGSAP } from "@/lib/animations";

export default function CinematicWorld3D() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // If mobile viewport or user prefers reduced motion, skip heavy 3D WebGL camera flight
    // Mobile devices already render high-fidelity anime backdrops natively via Next.js Image with CSS parallax
    if (
      window.innerWidth < 768 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const { ScrollTrigger } = initGSAP();

    // Scene & Camera setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x201c19, 0.0035);

    let width = window.innerWidth;
    let height = window.innerHeight;

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1500);

    const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    const isConstrainedDevice =
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
      (deviceMemory && deviceMemory <= 4);
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false, // Antialias off at native resolution saves ~30% GPU shader cost
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    const pixelRatio = Math.min(window.devicePixelRatio, isConstrainedDevice ? 0.9 : 1.2);
    renderer.setPixelRatio(pixelRatio); // Cap fill-rate, especially on high-DPI mobile screens.
    renderer.toneMapping = THREE.LinearToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);

    // Continuous 3D Camera Flight Path (Curved Spline)
    const cameraWaypoints = [
      new THREE.Vector3(0, 14, 70),       // 0.00: Hero (Approaching golden city)
      new THREE.Vector3(18, 10, 20),      // 0.15: Transition 1 (Passing autumn trees)
      new THREE.Vector3(-12, 4, -45),     // 0.28: About (Garden Veranda)
      new THREE.Vector3(8, 18, -110),     // 0.42: Transition 2 (Soaring over hillside)
      new THREE.Vector3(22, 12, -180),    // 0.55: Skills (Hillside Observatory)
      new THREE.Vector3(-6, 6, -260),     // 0.70: Transition 3 (Descending to water)
      new THREE.Vector3(-18, 5, -340),    // 0.82: Projects (Sunset Riverfront)
      new THREE.Vector3(14, 8, -430),     // 0.92: Journey (Railway tracks)
      new THREE.Vector3(0, 4, -530),      // 1.00: Contact (Twilight Sanctuary)
    ];

    const lookWaypoints = [
      new THREE.Vector3(0, 8, -20),
      new THREE.Vector3(5, 6, -40),
      new THREE.Vector3(-15, 3, -100),
      new THREE.Vector3(15, 12, -160),
      new THREE.Vector3(30, 10, -240),
      new THREE.Vector3(-12, 5, -320),
      new THREE.Vector3(-10, 8, -400),
      new THREE.Vector3(18, 7, -490),
      new THREE.Vector3(0, 4, -600),
    ];

    const cameraCurve = new THREE.CatmullRomCurve3(cameraWaypoints, false, "catmullrom", 0.3);
    const lookCurve = new THREE.CatmullRomCurve3(lookWaypoints, false, "catmullrom", 0.3);

    // Environmental Lights
    const ambientLight = new THREE.AmbientLight(0xf5efe5, 0.75);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xf0a352, 2.2);
    sunLight.position.set(40, 60, 40);
    scene.add(sunLight);

    // Warm atmospheric rim light
    const rimLight = new THREE.DirectionalLight(0xc96f3b, 1.4);
    rimLight.position.set(-50, 30, -50);
    scene.add(rimLight);

    // Texture Loader
    const textureLoader = new THREE.TextureLoader();

    // Environment Destinations (3D Backdrops at each waypoint)
    const zones = [
      { img: "/images/hero-autumn-city.jpg", pos: new THREE.Vector3(0, 10, -15), scale: [120, 70, 1] },
      { img: "/images/about-autumn-garden.jpg", pos: new THREE.Vector3(-15, 4, -85), scale: [110, 65, 1] },
      { img: "/images/skills-autumn-pavilion.jpg", pos: new THREE.Vector3(26, 12, -220), scale: [125, 75, 1] },
      { img: "/images/projects-autumn-waterfront.jpg", pos: new THREE.Vector3(-12, 8, -380), scale: [130, 75, 1] },
      { img: "/images/journey-autumn-train.jpg", pos: new THREE.Vector3(18, 8, -480), scale: [120, 70, 1] },
      { img: "/images/contact-autumn-twilight.jpg", pos: new THREE.Vector3(0, 5, -590), scale: [125, 75, 1] },
    ];

    const zoneMaterials: THREE.MeshBasicMaterial[] = [];

    zones.forEach((zone) => {
      textureLoader.load(zone.img, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        const geom = new THREE.PlaneGeometry(zone.scale[0], zone.scale[1]);
        const mat = new THREE.MeshBasicMaterial({
          map: tex,
          transparent: true,
          opacity: 0.9,
          fog: true,
        });
        zoneMaterials.push(mat);
        const mesh = new THREE.Mesh(geom, mat);
        mesh.position.copy(zone.pos);
        scene.add(mesh);
      });
    });

    // Layered Foreground Portal Beams / Arches that pass close to camera
    const beamGeo = new THREE.BoxGeometry(2.5, 30, 2.5);
    const beamMat = new THREE.MeshStandardMaterial({
      color: 0x392820,
      roughness: 0.7,
      metalness: 0.2,
    });

    const crossGeo = new THREE.BoxGeometry(32, 2.5, 2.5);
    const beamPositions = [
      new THREE.Vector3(12, 10, 15),
      new THREE.Vector3(-8, 6, -30),
      new THREE.Vector3(16, 14, -135),
      new THREE.Vector3(-10, 7, -290),
      new THREE.Vector3(12, 8, -420),
    ];

    beamPositions.forEach((pos) => {
      const group = new THREE.Group();
      const p1 = new THREE.Mesh(beamGeo, beamMat);
      p1.position.set(-14, 0, 0);
      const p2 = new THREE.Mesh(beamGeo, beamMat);
      p2.position.set(14, 0, 0);
      const top = new THREE.Mesh(crossGeo, beamMat);
      top.position.set(0, 14, 0);
      group.add(p1, p2, top);
      group.position.copy(pos);
      scene.add(group);
    });

    // 3D Swirling Autumn Leaf / Ember Particles along camera spline (Optimized for low-end GPU)
    const particleCount = isConstrainedDevice ? 48 : 75;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const particleVels: THREE.Vector3[] = [];

    const pColor1 = new THREE.Color("#F0A352");
    const pColor2 = new THREE.Color("#C96F3B");
    const pColor3 = new THREE.Color("#9E472D");

    for (let i = 0; i < particleCount; i++) {
      // Distribute along the flight path
      const t = Math.random();
      const point = cameraCurve.getPoint(t);

      positions[i * 3] = point.x + (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = point.y + (Math.random() - 0.5) * 40;
      positions[i * 3 + 2] = point.z + (Math.random() - 0.5) * 60;

      const cChoice = Math.random();
      const c = cChoice > 0.6 ? pColor1 : cChoice > 0.3 ? pColor2 : pColor3;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      particleVels.push(
        new THREE.Vector3((Math.random() - 0.5) * 0.08, -Math.random() * 0.12 - 0.04, (Math.random() - 0.5) * 0.08)
      );
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Particle texture
    const pCanvas = document.createElement("canvas");
    pCanvas.width = 32;
    pCanvas.height = 32;
    const pCtx = pCanvas.getContext("2d");
    if (pCtx) {
      const grad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, "rgba(255,255,255,1)");
      grad.addColorStop(0.4, "rgba(240,163,82,0.8)");
      grad.addColorStop(1, "rgba(201,111,59,0)");
      pCtx.fillStyle = grad;
      pCtx.beginPath();
      pCtx.arc(16, 16, 16, 0, Math.PI * 2);
      pCtx.fill();
    }
    const particleTex = new THREE.CanvasTexture(pCanvas);

    const particleMat = new THREE.PointsMaterial({
      size: 2.2,
      map: particleTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Scroll Progress State
    const scrollObj = { progress: 0 };

    ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: 1.2,
      onUpdate: (self) => {
        scrollObj.progress = self.progress;
      },
    });

    // Resize Handler
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(pixelRatio);
    };
    window.addEventListener("resize", handleResize);

    // Smooth Interpolated Camera State
    let currentT = 0;
    const currentCamPos = new THREE.Vector3();
    const currentLookPos = new THREE.Vector3();

    let animationId: number;
    const clock = new THREE.Clock();
    let pageVisible = !document.hidden;
    let lastFrame = 0;
    const targetFrameInterval = isConstrainedDevice ? 1000 / 45 : 0;
    const handleVisibilityChange = () => {
      pageVisible = !document.hidden;
      if (pageVisible) clock.start();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const animate = (now: number) => {
      if (!pageVisible) {
        animationId = requestAnimationFrame(animate);
        return;
      }
      if (targetFrameInterval && now - lastFrame < targetFrameInterval) {
        animationId = requestAnimationFrame(animate);
        return;
      }
      lastFrame = now;
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera interpolation towards scroll progress
      currentT += (scrollObj.progress - currentT) * 0.08;
      const clampedT = Math.max(0, Math.min(0.999, currentT));

      // Get Point on 3D Path
      const targetCamPos = cameraCurve.getPointAt(clampedT);
      const targetLookPos = lookCurve.getPointAt(clampedT);

      // Subtle atmospheric breathing sway
      const swayX = Math.sin(elapsedTime * 0.8) * 0.4;
      const swayY = Math.cos(elapsedTime * 0.6) * 0.3;

      currentCamPos.lerp(targetCamPos, 0.12);
      currentLookPos.lerp(targetLookPos, 0.12);

      camera.position.set(
        currentCamPos.x + swayX,
        currentCamPos.y + swayY,
        currentCamPos.z
      );
      camera.lookAt(currentLookPos);

      // Lighting & Fog color transition along flight
      // 0.0: Golden Hour -> 0.3: Afternoon -> 0.6: Sunset -> 1.0: Twilight
      const fogColor = new THREE.Color();
      if (clampedT < 0.35) {
        fogColor.setHSL(0.08, 0.4, 0.12); // Warm dark golden
        sunLight.color.setHSL(0.1, 0.8, 0.6);
      } else if (clampedT < 0.75) {
        fogColor.setHSL(0.05, 0.5, 0.1); // Autumn rust / fiery sunset
        sunLight.color.setHSL(0.06, 0.9, 0.55);
      } else {
        fogColor.setHSL(0.72, 0.25, 0.1); // Twilight purple dusk
        sunLight.color.setHSL(0.7, 0.6, 0.5);
      }
      if (scene.fog) {
        scene.fog.color.lerp(fogColor, 0.05);
      }

      // Ambient Leaf Particle Drift (Zero WebGL buffer re-upload, 100% GPU transform)
      if (particles) {
        particles.position.y -= 0.035;
        if (particles.position.y < -40) {
          particles.position.y = 15;
        }
        particles.rotation.y += 0.0006;
      }

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      particleTex.dispose();
      beamGeo.dispose();
      beamMat.dispose();
      crossGeo.dispose();
      zoneMaterials.forEach((material) => {
        material.map?.dispose();
        material.dispose();
      });
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden w-full h-full"
      aria-hidden="true"
    />
  );
}
