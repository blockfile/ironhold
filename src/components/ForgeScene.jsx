import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ForgeScene() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.075);

    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setClearColor(0x050505, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.45);
    keyLight.position.set(2.5, 3, 5);
    scene.add(keyLight);

    const warmLight = new THREE.PointLight(0xff9a2f, 0.58, 10, 2);
    warmLight.position.set(-3.6, 1.8, 4.4);
    scene.add(warmLight);

    const coolLight = new THREE.PointLight(0xffffff, 0.95, 18, 2);
    coolLight.position.set(4.8, 0.8, 3.4);
    scene.add(coolLight);

    const cubeGeometry = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const materials = [];

    const createGlassCube = (scale, position, rotation, opacity) => {
      const material = new THREE.MeshPhysicalMaterial({
        color: 0xc0c0c0,
        metalness: 0.95,
        roughness: 0.12,
        transmission: 0.02,
        transparent: true,
        opacity,
        reflectivity: 1,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
        emissive: 0x111111,
        emissiveIntensity: 0.35
      });

      const mesh = new THREE.Mesh(cubeGeometry, material);
      mesh.scale.setScalar(scale);
      mesh.position.copy(position);
      mesh.rotation.set(rotation.x, rotation.y, rotation.z);

      materials.push(material);
      scene.add(mesh);
      return mesh;
    };

    const cubes = [
      createGlassCube(
        1.4,
        new THREE.Vector3(2.95, 2.45, -0.05),
        new THREE.Euler(0.8, 0.8, 0.3),
        0.46
      ),
      createGlassCube(
        2.9,
        new THREE.Vector3(5.95, -2.35, -1.05),
        new THREE.Euler(0.55, 0.6, 0.22),
        0.3
      ),
      createGlassCube(
        2.2,
        new THREE.Vector3(-5.9, -1.05, -1.7),
        new THREE.Euler(0.72, 0.4, 0.24),
        0.22
      ),
      createGlassCube(
        1.05,
        new THREE.Vector3(-2.8, 2.2, -3.2),
        new THREE.Euler(0.45, 0.7, 0.35),
        0.12
      )
    ];

    let pointerTargetX = 0;
    let pointerTargetY = 0;
    let pointerX = 0;
    let pointerY = 0;
    let frameId = 0;

    const onPointerMove = (event) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      pointerTargetX = x;
      pointerTargetY = y;
    };

    const onPointerLeave = () => {
      pointerTargetX = 0;
      pointerTargetY = 0;
    };

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      pointerX += (pointerTargetX - pointerX) * 0.085;
      pointerY += (pointerTargetY - pointerY) * 0.085;

      const cameraTargetX = pointerX * 0.95;
      const cameraTargetY = pointerY * 0.58;

      cubes[0].rotation.x += 0.0022;
      cubes[0].rotation.y += 0.0032 + pointerX * 0.0007;
      cubes[0].rotation.z += pointerY * 0.00018;
      cubes[0].position.y = 2.45 + Math.sin(elapsedTime * 0.8) * 0.12 + pointerY * 0.22;
      cubes[0].position.x = 2.95 + Math.cos(elapsedTime * 0.55) * 0.08 + pointerX * 0.34;

      cubes[1].rotation.x += 0.0011;
      cubes[1].rotation.y -= 0.0016 - pointerX * 0.00035;
      cubes[1].rotation.z += 0.0008 + pointerY * 0.00022;
      cubes[1].position.y = -2.35 + Math.sin(elapsedTime * 0.45) * 0.1 + pointerY * 0.16;
      cubes[1].position.x = 5.95 + Math.cos(elapsedTime * 0.28) * 0.06 + pointerX * 0.42;

      cubes[2].rotation.x -= pointerY * 0.00028;
      cubes[2].rotation.y += 0.0012 + pointerX * 0.00045;
      cubes[2].rotation.z -= 0.0006 - pointerX * 0.00012;
      cubes[2].position.x = -5.9 + Math.sin(elapsedTime * 0.35) * 0.08 + pointerX * 0.52;
      cubes[2].position.y = -1.05 + Math.cos(elapsedTime * 0.4) * 0.06 + pointerY * 0.14;

      cubes[3].rotation.x += 0.0007 + pointerY * 0.0002;
      cubes[3].rotation.y += 0.0011 + pointerX * 0.0004;
      cubes[3].position.x = -2.8 + Math.cos(elapsedTime * 0.38) * 0.05 + pointerX * 0.28;
      cubes[3].position.y = 2.2 + Math.sin(elapsedTime * 0.48) * 0.05 + pointerY * 0.19;

      camera.position.x += (cameraTargetX - camera.position.x) * 0.045;
      camera.position.y += (cameraTargetY - camera.position.y) * 0.045;
      camera.lookAt(0.8 + pointerX * 0.34, pointerY * 0.16, 0);

      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", onResize);
      window.cancelAnimationFrame(frameId);

      cubeGeometry.dispose();
      materials.forEach((material) => material.dispose());
      renderer.dispose();
    };
  }, []);

  return (
    <div className="ih-forgeScene" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
