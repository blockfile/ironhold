import React, { useEffect, useRef } from "react";

function randomBetween(min, max) {
  return min + (Math.random() * (max - min));
}

export default function AmbientHighlights() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const isMobileViewport = () => window.innerWidth < 768;
    const isChrome = document.documentElement.classList.contains("ih-browser-chrome");
    const glints = [];
    let frameId = 0;
    let lastTime = 0;
    let spawnTimer = 0;
    let viewportWidth = 0;
    let viewportHeight = 0;

    const getMaxGlints = () => {
      if (reducedMotion.matches) return 0;
      if (isMobileViewport()) return 3;
      if (isChrome) return 5;
      return 7;
    };

    const resizeCanvas = () => {
      viewportWidth = window.innerWidth;
      viewportHeight = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

      canvas.width = Math.max(1, Math.floor(viewportWidth * dpr));
      canvas.height = Math.max(1, Math.floor(viewportHeight * dpr));
      canvas.style.width = `${viewportWidth}px`;
      canvas.style.height = `${viewportHeight}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawnGlint = () => {
      const sizeBias = isMobileViewport() ? 0.8 : 1;

      glints.push({
        x: randomBetween(viewportWidth * 0.08, viewportWidth * 0.92),
        y: randomBetween(viewportHeight * 0.08, viewportHeight * 0.92),
        radius: randomBetween(90, 190) * sizeBias,
        coreRadius: randomBetween(12, 24) * sizeBias,
        life: randomBetween(9, 16),
        age: 0,
        driftX: randomBetween(-7, 7),
        driftY: randomBetween(-10, 10),
        rotation: randomBetween(0, Math.PI),
        streakLength: randomBetween(120, 260) * sizeBias,
        streakWidth: randomBetween(0.7, 1.4),
        brightness: isChrome ? randomBetween(0.12, 0.2) : randomBetween(0.16, 0.28)
      });
    };

    const drawGlint = (glint) => {
      const progress = glint.age / glint.life;
      const fade = Math.sin(progress * Math.PI);
      const alpha = fade * glint.brightness;
      const driftX = glint.x + (glint.driftX * progress);
      const driftY = glint.y + (glint.driftY * progress);

      context.save();
      context.translate(driftX, driftY);
      context.rotate(glint.rotation);

      const aura = context.createRadialGradient(0, 0, 0, 0, 0, glint.radius);
      aura.addColorStop(0, `rgba(255, 223, 164, ${alpha * 0.7})`);
      aura.addColorStop(0.18, `rgba(214, 178, 102, ${alpha * 0.34})`);
      aura.addColorStop(0.5, `rgba(184, 150, 84, ${alpha * 0.12})`);
      aura.addColorStop(1, "rgba(184, 150, 84, 0)");
      context.fillStyle = aura;
      context.beginPath();
      context.arc(0, 0, glint.radius, 0, Math.PI * 2);
      context.fill();

      const streak = context.createLinearGradient(-glint.streakLength / 2, 0, glint.streakLength / 2, 0);
      streak.addColorStop(0, "rgba(255, 213, 138, 0)");
      streak.addColorStop(0.5, `rgba(255, 223, 164, ${alpha * 0.9})`);
      streak.addColorStop(1, "rgba(255, 213, 138, 0)");
      context.strokeStyle = streak;
      context.lineWidth = glint.streakWidth;
      context.beginPath();
      context.moveTo(-glint.streakLength / 2, 0);
      context.lineTo(glint.streakLength / 2, 0);
      context.stroke();

      const core = context.createRadialGradient(0, 0, 0, 0, 0, glint.coreRadius);
      core.addColorStop(0, `rgba(255, 240, 204, ${alpha})`);
      core.addColorStop(0.4, `rgba(255, 212, 132, ${alpha * 0.72})`);
      core.addColorStop(1, "rgba(255, 212, 132, 0)");
      context.fillStyle = core;
      context.beginPath();
      context.arc(0, 0, glint.coreRadius, 0, Math.PI * 2);
      context.fill();

      context.restore();
    };

    const render = (time) => {
      if (document.visibilityState === "hidden") {
        frameId = window.requestAnimationFrame(render);
        return;
      }

      if (!lastTime) lastTime = time;
      const deltaSeconds = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;
      spawnTimer += deltaSeconds;

      context.clearRect(0, 0, viewportWidth, viewportHeight);

      for (let index = glints.length - 1; index >= 0; index -= 1) {
        const glint = glints[index];
        glint.age += deltaSeconds;

        if (glint.age >= glint.life) {
          glints.splice(index, 1);
          continue;
        }

        drawGlint(glint);
      }

      const spawnInterval = isMobileViewport() ? 2.8 : 1.8;
      if (spawnTimer >= spawnInterval && glints.length < getMaxGlints()) {
        spawnTimer = 0;
        spawnGlint();
      }

      frameId = window.requestAnimationFrame(render);
    };

    resizeCanvas();
    for (let index = 0; index < Math.max(2, getMaxGlints() - 2); index += 1) {
      spawnGlint();
      glints[index].age = randomBetween(0, glints[index].life * 0.8);
    }

    frameId = window.requestAnimationFrame(render);
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="ih-ambientCanvas" aria-hidden="true" />;
}
