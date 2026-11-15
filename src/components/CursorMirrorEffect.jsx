import React, { useEffect, useRef } from 'react';

/**
 * Interactive Cursor Mirror Shard Engine
 * Tracks mouse position and emits glittering mirror shards,
 * caustic light rays, and star sparkles across the canvas background.
 */
export default function CursorMirrorEffect() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const mouse = {
      x: width / 2,
      y: height / 2,
      prevX: width / 2,
      prevY: height / 2,
      speed: 0,
      isActive: false
    };

    const particles = [];
    const sparkles = [];

    class MirrorShard {
      constructor(x, y, vx, vy) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.size = Math.random() * 9 + 4;
        this.rotation = Math.random() * Math.PI * 2;
        this.vRot = (Math.random() - 0.5) * 0.12;
        this.opacity = 1;
        this.decay = Math.random() * 0.02 + 0.015;
        this.aspect = Math.random() * 0.6 + 0.3;

        const rand = Math.random();
        if (rand > 0.6) {
          this.color1 = 'rgba(232, 212, 139, ';
          this.color2 = 'rgba(201, 168, 76, ';
        } else if (rand > 0.25) {
          this.color1 = 'rgba(255, 255, 255, ';
          this.color2 = 'rgba(192, 192, 192, ';
        } else {
          this.color1 = 'rgba(200, 200, 200, ';
          this.color2 = 'rgba(120, 120, 120, ';
        }
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.95;
        this.vy *= 0.95;
        this.rotation += this.vRot;
        this.opacity -= this.decay;
      }

      draw() {
        if (this.opacity <= 0) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        ctx.beginPath();
        ctx.moveTo(0, -this.size);
        ctx.lineTo(this.size * this.aspect, 0);
        ctx.lineTo(0, this.size);
        ctx.lineTo(-this.size * this.aspect, 0);
        ctx.closePath();

        const grad = ctx.createLinearGradient(-this.size, -this.size, this.size, this.size);
        grad.addColorStop(0, this.color1 + this.opacity + ')');
        grad.addColorStop(0.5, 'rgba(255,255,255,' + (this.opacity * 0.9) + ')');
        grad.addColorStop(1, this.color2 + (this.opacity * 0.6) + ')');

        ctx.fillStyle = grad;
        ctx.shadowColor = 'rgba(201, 168, 76, ' + (this.opacity * 0.4) + ')';
        ctx.shadowBlur = 6;
        ctx.fill();

        ctx.strokeStyle = 'rgba(255,255,255,' + (this.opacity * 0.7) + ')';
        ctx.lineWidth = 0.5;
        ctx.stroke();

        ctx.restore();
      }
    }

    class StarSparkle {
      constructor(x, y) {
        this.x = x + (Math.random() - 0.5) * 35;
        this.y = y + (Math.random() - 0.5) * 35;
        this.size = Math.random() * 5 + 3;
        this.scale = 0.1;
        this.maxScale = Math.random() * 1.4 + 0.8;
        this.phase = 'in';
        this.color = Math.random() > 0.5 ? '#E8D48B' : '#FFFFFF';
      }

      update() {
        if (this.phase === 'in') {
          this.scale += 0.08;
          if (this.scale >= this.maxScale) this.phase = 'out';
        } else {
          this.scale -= 0.05;
        }
      }

      draw() {
        if (this.scale <= 0) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 8;

        const s = this.size * this.scale;
        ctx.beginPath();
        ctx.moveTo(0, -s);
        ctx.quadraticCurveTo(0, 0, s, 0);
        ctx.quadraticCurveTo(0, 0, 0, s);
        ctx.quadraticCurveTo(0, 0, -s, 0);
        ctx.quadraticCurveTo(0, 0, 0, -s);
        ctx.fill();

        ctx.restore();
      }
    }

    const handleMouseMove = (e) => {
      mouse.isActive = true;
      const dx = e.clientX - mouse.prevX;
      const dy = e.clientY - mouse.prevY;
      mouse.speed = Math.sqrt(dx * dx + dy * dy);
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      const count = Math.min(Math.floor(mouse.speed / 4) + 1, 4);
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 2.5 + 0.5;
        particles.push(
          new MirrorShard(
            mouse.x + (Math.random() - 0.5) * 10,
            mouse.y + (Math.random() - 0.5) * 10,
            Math.cos(angle) * velocity,
            Math.sin(angle) * velocity
          )
        );
      }

      if (Math.random() > 0.4) {
        sparkles.push(new StarSparkle(mouse.x, mouse.y));
      }

      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;
    };

    const handleClick = (e) => {
      for (let i = 0; i < 18; i++) {
        const angle = (Math.PI * 2 * i) / 18 + Math.random() * 0.3;
        const force = Math.random() * 4.5 + 1.5;
        particles.push(new MirrorShard(e.clientX, e.clientY, Math.cos(angle) * force, Math.sin(angle) * force));
      }
      for (let j = 0; j < 5; j++) {
        sparkles.push(new StarSparkle(e.clientX, e.clientY));
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    let animId;
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (mouse.isActive) {
        const radial = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 140);
        radial.addColorStop(0, 'rgba(201, 168, 76, 0.08)');
        radial.addColorStop(0.5, 'rgba(232, 212, 139, 0.03)');
        radial.addColorStop(1, 'transparent');
        ctx.fillStyle = radial;
        ctx.fillRect(mouse.x - 140, mouse.y - 140, 280, 280);
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw();
        if (p.opacity <= 0) particles.splice(i, 1);
      }

      for (let j = sparkles.length - 1; j >= 0; j--) {
        const s = sparkles[j];
        s.update();
        s.draw();
        if (s.scale <= 0 && s.phase === 'out') sparkles.splice(j, 1);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" />;
}
