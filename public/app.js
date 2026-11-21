/**
 * Ayenah Official - Luxury Handcrafted Mirror Art
 * React 18 Frontend Application
 *
 * Theme: Midnight Noir (#0A0A0A) & Royal Gold (#C9A84C, #E8D48B, #C0C0C0)
 * Urdu Typography: Noto Nastaliq Urdu
 *
 * Key Enhancements:
 * - Interactive Landing Page Mirrorwork Carousel (Based on user reference artworks)
 * - Refined Calligraphic Emblem 'آئینہ' (Pure Ayenah emblem, excluding clunky text)
 * - Subtle Sacred Geometry & Shimmer Ambient Pattern Background
 * - Privacy-First WhatsApp Integration: Sleek circular logo button (no raw phone number digits displayed)
 * - Haute Luxury Buttons with diagonal light-glare sweep
 * - 3D Perspective Tilt on Art Cards
 * - Custom Commission Studio with Instant Estimate
 */

(function () {
  const { useState, useEffect, useRef, useMemo } = React;

  const WA_NUMBER = "923099050832";
  const INSTAGRAM_URL = "https://instagram.com/ayenah.official";
  const FACEBOOK_URL = "https://facebook.com/ayenah.official";
  const WEBSITE_URL = "https://ayenahofficial.com";

  // ==========================================
  // 1. REACTIVE CURSOR MIRROR ENGINE (CANVAS)
  // ==========================================
  function setupCursorMirrorEngine() {
    const canvas = document.getElementById('cursor-mirror-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

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
        this.size = Math.random() * 4 + 2;
        this.rotation = Math.random() * Math.PI * 2;
        this.vRot = (Math.random() - 0.5) * 0.12;
        this.opacity = 0.9;
        this.decay = Math.random() * 0.035 + 0.025;
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
        this.x = x + (Math.random() - 0.5) * 20;
        this.y = y + (Math.random() - 0.5) * 20;
        this.size = Math.random() * 3 + 2;
        this.scale = 0.1;
        this.maxScale = Math.random() * 0.9 + 0.5;
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
        ctx.shadowBlur = 6;

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

    window.addEventListener('mousemove', (e) => {
      // Don't spawn if cursor is off-screen or entering at top-left edge
      if (e.clientX < 40 || e.clientY < 40) return;

      mouse.isActive = true;
      const dx = e.clientX - mouse.prevX;
      const dy = e.clientY - mouse.prevY;
      mouse.speed = Math.sqrt(dx * dx + dy * dy);
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      // Only emit subtle shard if user is actively moving cursor
      if (mouse.speed > 8 && particles.length < 12) {
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 1.5 + 0.4;
        particles.push(
          new MirrorShard(
            mouse.x + (Math.random() - 0.5) * 8,
            mouse.y + (Math.random() - 0.5) * 8,
            Math.cos(angle) * velocity,
            Math.sin(angle) * velocity
          )
        );
      }

      // Sparkles only on deliberate swift movement
      if (mouse.speed > 14 && Math.random() > 0.85 && sparkles.length < 4) {
        sparkles.push(new StarSparkle(mouse.x, mouse.y));
      }

      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;
    });

    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        if (e.touches[0].clientY < 40) return;
        mouse.isActive = true;
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
        if (particles.length < 8) {
          particles.push(new MirrorShard(mouse.x, mouse.y, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2));
        }
      }
    }, { passive: true });

    window.addEventListener('click', (e) => {
      if (e.clientY < 50) return;
      // Gentle micro-glint of 4 shards max on click
      for (let i = 0; i < 4; i++) {
        const angle = (Math.PI * 2 * i) / 4 + Math.random() * 0.3;
        const force = Math.random() * 2 + 1;
        particles.push(
          new MirrorShard(
            e.clientX,
            e.clientY,
            Math.cos(angle) * force,
            Math.sin(angle) * force
          )
        );
      }
      if (sparkles.length < 4) {
        sparkles.push(new StarSparkle(e.clientX, e.clientY));
      }
    });

    function render() {
      ctx.clearRect(0, 0, width, height);

      if (mouse.isActive) {
        const radial = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 130);
        radial.addColorStop(0, 'rgba(255, 255, 255, 0.04)');
        radial.addColorStop(0.5, 'rgba(232, 212, 139, 0.015)');
        radial.addColorStop(1, 'transparent');
        ctx.fillStyle = radial;
        ctx.fillRect(mouse.x - 130, mouse.y - 130, 260, 260);
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

      requestAnimationFrame(render);
    }

    render();
  }

  // ==========================================
  // 2. SVG ARTWORK COMPONENT (WITH SWAN & TREE)
  // ==========================================
  function MirrorArtGraphic({ type }) {
    switch (type) {
      case 'calligraphy-drop':
      case 'grand-calligraphy':
        return React.createElement('svg', { viewBox: '0 0 300 400', className: 'w-full h-full' },
          React.createElement('rect', { width: 300, height: 400, fill: '#0E0E0E' }),
          React.createElement('rect', { x: 12, y: 12, width: 276, height: 376, fill: 'none', stroke: 'rgba(201,168,76,0.25)', strokeWidth: '0.8' }),
          React.createElement('g', { transform: 'translate(150, 200)' },
            React.createElement('path', { d: 'M0,-110 Q55,-50 35,20 Q25,80 0,110 Q-25,80 -35,20 Q-55,-50 0,-110Z', fill: 'none', stroke: 'rgba(201,168,76,0.5)', strokeWidth: '1.2' }),
            React.createElement('polygon', { points: '0,-95 10,-80 -10,-80', fill: '#FFFFFF', opacity: '0.9' }),
            React.createElement('polygon', { points: '-18,-65 -5,-55 -22,-50', fill: '#C0C0C0', opacity: '0.75' }),
            React.createElement('polygon', { points: '18,-65 5,-55 22,-50', fill: '#E8D48B', opacity: '0.8' }),
            React.createElement('polygon', { points: '0,-40 14,-30 -14,-30', fill: '#FFFFFF', opacity: '0.95' }),
            React.createElement('polygon', { points: '-25,-18 -10,-12 -20, -5', fill: '#C0C0C0', opacity: '0.85' }),
            React.createElement('polygon', { points: '25,-18 10,-12 20, -5', fill: '#E8D48B', opacity: '0.9' }),
            React.createElement('polygon', { points: '0,5 15,18 -15,18', fill: '#FFFFFF', opacity: '0.95' }),
            React.createElement('polygon', { points: '-20,30 -5,40 -16,50', fill: '#C9A84C', opacity: '0.85' }),
            React.createElement('polygon', { points: '20,30 5,40 16,50', fill: '#FFFFFF', opacity: '0.8' }),
            React.createElement('polygon', { points: '0,65 12,82 -12,82', fill: '#C0C0C0', opacity: '0.9' }),
            React.createElement('polygon', { points: '0,92 6,102 -6,102', fill: '#E8D48B', opacity: '0.95' })
          )
        );

      case 'swan':
        // Shimmering Swan composed of jewel facets (from reference pictures)
        return React.createElement('svg', { viewBox: '0 0 300 300', className: 'w-full h-full' },
          React.createElement('rect', { width: 300, height: 300, fill: '#0B0B0D' }),
          React.createElement('g', { transform: 'translate(140, 160)' },
            // Swan neck & head curve
            React.createElement('path', {
              d: 'M-40,-70 C-30,-110 0,-110 5,-80 C10,-55 -30,-20 -20,20 C-10,35 15,40 30,35 C-10,48 -35,35 -40,15 C-45,-10 -20,-45 -25,-75 Z',
              fill: 'none',
              stroke: '#E8D48B',
              strokeWidth: '1.2'
            }),
            // Body dense mirror shard cluster
            [-35, -25, -15, -5, 5, 15, 25, 35].map((x, i) =>
              React.createElement('polygon', {
                key: 'b-' + i,
                points: `${x},${20 + (i % 3) * 5} ${x + 8},${28 + (i % 2) * 4} ${x - 4},${32}`,
                fill: i % 2 === 0 ? '#FFFFFF' : '#E8D48B',
                opacity: '0.85'
              })
            ),
            // Dispersing swan wing shards taking flight
            [0, 15, 30, 45, 60, 75, 90].map((dx, i) =>
              React.createElement('polygon', {
                key: 'w-' + i,
                points: `${dx - 10},${-10 - i * 12} ${dx},${-2 - i * 11} ${dx - 6},${8 - i * 10}`,
                fill: i % 3 === 0 ? '#FFFFFF' : i % 3 === 1 ? '#E8D48B' : '#C0C0C0',
                opacity: `${0.9 - i * 0.08}`
              })
            ),
            // Floating micro crystal dust
            [40, 60, 80, 95].map((fx, i) =>
              React.createElement('circle', {
                key: 'd-' + i,
                cx: fx,
                cy: -60 - i * 8,
                r: 1.5,
                fill: '#FFFFFF',
                opacity: '0.8'
              })
            )
          )
        );

      case 'tree-of-life':
        // Golden Tree with Mirror Foliage (from reference pictures)
        return React.createElement('svg', { viewBox: '0 0 300 300', className: 'w-full h-full' },
          React.createElement('rect', { width: 300, height: 300, fill: '#0E0D0A' }),
          React.createElement('g', { transform: 'translate(150, 165)' },
            // Tree trunk in textured gold
            React.createElement('path', {
              d: 'M-12,70 Q-15,20 -3,-5 Q-20,-30 -35,-50 Q-15,-30 0,-15 Q15,-30 35,-50 Q20,-30 5,-5 Q15,20 12,70 Z',
              fill: 'url(#goldTrunkGrad)',
              stroke: '#C9A84C',
              strokeWidth: '1'
            }),
            // Canopy mirror shards
            [-50, -35, -20, -5, 10, 25, 40, 55].map((x, i) =>
              [-60, -45, -30, -15].map((y, j) =>
                React.createElement('polygon', {
                  key: `${i}-${j}`,
                  points: `${x + (j % 2) * 4},${y} ${x + 9},${y + 8} ${x - 2},${y + 11}`,
                  fill: (i + j) % 2 === 0 ? '#FFFFFF' : '#E8D48B',
                  opacity: '0.85'
                })
              )
            ),
            // Root mirror fragments
            [-25, -10, 5, 20].map((rx, idx) =>
              React.createElement('polygon', {
                key: 'r-' + idx,
                points: `${rx},72 ${rx + 10},78 ${rx - 4},80`,
                fill: '#C0C0C0',
                opacity: '0.75'
              })
            )
          ),
          React.createElement('defs', null,
            React.createElement('linearGradient', { id: 'goldTrunkGrad', x1: '0', y1: '0', x2: '1', y2: '1' },
              React.createElement('stop', { offset: '0%', stopColor: '#E8D48B' }),
              React.createElement('stop', { offset: '100%', stopColor: '#9E7D2E' })
            )
          )
        );

      case 'solar-mandala':
        return React.createElement('svg', { viewBox: '0 0 300 300', className: 'w-full h-full' },
          React.createElement('rect', { width: 300, height: 300, fill: '#0E0E0E' }),
          React.createElement('g', { transform: 'translate(150,150)' },
            React.createElement('circle', { r: 120, fill: 'none', stroke: 'rgba(201,168,76,0.2)', strokeWidth: '0.8' }),
            React.createElement('circle', { r: 90, fill: 'none', stroke: 'rgba(192,192,192,0.25)', strokeWidth: '0.6' }),
            React.createElement('circle', { r: 60, fill: 'none', stroke: 'rgba(201,168,76,0.3)', strokeWidth: '0.8' }),
            React.createElement('circle', { r: 30, fill: 'none', stroke: 'rgba(255,255,255,0.4)', strokeWidth: '0.8' }),
            [0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) =>
              React.createElement('polygon', {
                key: idx,
                points: '0,-105 16,-80 -16,-80',
                fill: idx % 2 === 0 ? '#FFFFFF' : '#E8D48B',
                opacity: '0.85',
                transform: `rotate(${angle})`
              })
            ),
            [30, 90, 150, 210, 270, 330].map((angle, idx) =>
              React.createElement('polygon', {
                key: 'sub-' + idx,
                points: '0,-50 10,-35 -10,-35',
                fill: '#C0C0C0',
                opacity: '0.75',
                transform: `rotate(${angle})`
              })
            ),
            React.createElement('circle', { r: 8, fill: '#C9A84C', opacity: '0.9' })
          )
        );

      case 'butterfly':
        return React.createElement('svg', { viewBox: '0 0 300 300', className: 'w-full h-full' },
          React.createElement('rect', { width: 300, height: 300, fill: '#0E0E0E' }),
          React.createElement('g', { transform: 'translate(150,150)' },
            React.createElement('polygon', { points: '-55,-50 -35,-30 -50,-24', fill: '#FFFFFF', opacity: '0.9' }),
            React.createElement('polygon', { points: '-65,-30 -40,-18 -58,-8', fill: '#C0C0C0', opacity: '0.8' }),
            React.createElement('polygon', { points: '-50,-10 -28,-2 -46,6', fill: '#E8D48B', opacity: '0.85' }),
            React.createElement('polygon', { points: '-42,12 -20,20 -34,28', fill: '#FFFFFF', opacity: '0.75' }),
            React.createElement('polygon', { points: '55,-50 35,-30 50,-24', fill: '#FFFFFF', opacity: '0.9' }),
            React.createElement('polygon', { points: '65,-30 40,-18 58,-8', fill: '#E8D48B', opacity: '0.8' }),
            React.createElement('polygon', { points: '70,-45 76,-40 68,-38', fill: '#C0C0C0', opacity: '0.6' }),
            React.createElement('polygon', { points: '80,-25 85,-20 78,-18', fill: '#FFFFFF', opacity: '0.5' }),
            React.createElement('polygon', { points: '88,-8 93,-4 86,-2', fill: '#C9A84C', opacity: '0.4' }),
            React.createElement('line', { x1: 0, y1: -55, x2: 0, y2: 45, stroke: '#C9A84C', strokeWidth: '2' }),
            React.createElement('circle', { cx: -12, cy: -65, r: 2.5, fill: '#C9A84C' }),
            React.createElement('circle', { cx: 12, cy: -65, r: 2.5, fill: '#C9A84C' })
          )
        );

      case 'shattered-heart':
        return React.createElement('svg', { viewBox: '0 0 300 300', className: 'w-full h-full' },
          React.createElement('rect', { width: 300, height: 300, fill: '#0E0E0E' }),
          React.createElement('g', { transform: 'translate(150,155)' },
            React.createElement('path', { d: 'M0,-60 C-10,-80 -50,-80 -60,-50 C-75,-10 0,65 0,65 C0,65 75,-10 60,-50 C50,-80 10,-80 0,-60Z', fill: 'none', stroke: 'rgba(201,168,76,0.3)', strokeWidth: '1' }),
            React.createElement('polygon', { points: '-30,-45 -20,-38 -28,-30', fill: '#FFFFFF', opacity: '0.85' }),
            React.createElement('polygon', { points: '30,-45 20,-38 28,-30', fill: '#E8D48B', opacity: '0.85' }),
            React.createElement('polygon', { points: '-18,-20 -5,-12 -14,-6', fill: '#C0C0C0', opacity: '0.9' }),
            React.createElement('polygon', { points: '18,-20 5,-12 14,-6', fill: '#FFFFFF', opacity: '0.8' }),
            React.createElement('polygon', { points: '0,5 12,18 -12,18', fill: '#C9A84C', opacity: '0.85' }),
            React.createElement('polygon', { points: '52,-18 58,-12 50,-10', fill: '#C0C0C0', opacity: '0.5' }),
            React.createElement('polygon', { points: '64,-28 70,-22 62,-20', fill: '#FFFFFF', opacity: '0.4' }),
            React.createElement('polygon', { points: '75,-8 80,-3 73,-1', fill: '#E8D48B', opacity: '0.3' })
          )
        );

      case 'geometric':
      default:
        return React.createElement('svg', { viewBox: '0 0 300 300', className: 'w-full h-full' },
          React.createElement('rect', { width: 300, height: 300, fill: '#0E0E0E' }),
          React.createElement('g', { transform: 'translate(150,150)' },
            React.createElement('polygon', { points: '0,-100 100,0 0,100 -100,0', fill: 'none', stroke: 'rgba(201,168,76,0.3)', strokeWidth: '1' }),
            React.createElement('polygon', { points: '0,-70 70,0 0,70 -70,0', fill: 'none', stroke: 'rgba(192,192,192,0.3)', strokeWidth: '0.8' }),
            React.createElement('polygon', { points: '0,-40 40,0 0,40 -40,0', fill: 'none', stroke: 'rgba(201,168,76,0.4)', strokeWidth: '1' }),
            React.createElement('polygon', { points: '0,-88 25,-60 -25,-60', fill: '#FFFFFF', opacity: '0.85' }),
            React.createElement('polygon', { points: '88,0 60,25 60,-25', fill: '#E8D48B', opacity: '0.85' }),
            React.createElement('polygon', { points: '0,88 -25,60 25,60', fill: '#C0C0C0', opacity: '0.85' }),
            React.createElement('polygon', { points: '-88,0 -60,-25 -60,25', fill: '#FFFFFF', opacity: '0.75' }),
            React.createElement('circle', { r: 6, fill: '#C9A84C' })
          )
        );
    }
  }

  // ==========================================
  // 3. LANDING PAGE HAUTE CAROUSEL COMPONENT
  // ==========================================
  function HeroMirrorCarousel({ onOpenInquiry }) {
    const slides = [
      {
        id: 'c-1',
        title: 'Solaris Mirror Mandala',
        urdu: 'شمس دائرہ منڈالا',
        type: 'solar-mandala',
        tag: 'Bestseller Artwork',
        img: '/assets/solaris.webp',
        thumb: '/assets/solaris-360.webp',
        alt: 'Circular sunburst mosaic in silver and champagne mirror petals',
        desc: 'Concentric rings of hand-placed silver mirror petals combined with subtle gold-toned accents. Radiates tranquility and meditative symmetry in luxury interiors.'
      },
      {
        id: 'c-2',
        title: 'Sacred Noor Calligraphy',
        urdu: 'خطاطی نور الہیٰ',
        type: 'calligraphy-drop',
        tag: 'Signature Masterpiece',
        img: '/assets/sacred-noor.webp',
        thumb: '/assets/sacred-noor-360.webp',
        alt: 'Teardrop-shaped mirrorwork motif on a dark backing',
        desc: 'Sacred Arabic calligraphy rendered in diamond-shaped mirror facets on a charcoal backing. Every angle reflects morning sun and ambient lamp light uniquely.'
      },
      {
        id: 'c-3',
        title: 'Metamorphosis Crystal Butterfly',
        urdu: 'پروانہ آئینہ',
        type: 'butterfly',
        tag: 'Contemporary Mosaic',
        img: '/assets/butterfly.webp',
        thumb: '/assets/butterfly-360.webp',
        alt: 'Butterfly mosaic with a wing dispersing into mirror fragments',
        desc: 'One wing sculpted in dense mirror reflection while the opposite wing disperses into sparkling mirror crystal dust. Symbolizing transformation and liberation.'
      },
      {
        id: 'c-4',
        title: 'Tree of Life Mirror Artwork',
        urdu: 'شجرۂ حیات',
        type: 'tree-of-life',
        tag: 'Grand Masterpiece',
        img: '/assets/tree.webp',
        thumb: '/assets/tree-360.webp',
        alt: 'Spreading tree mosaic with silver leaves and a brass-toned trunk',
        desc: 'A gold-toned trunk branching into a majestic crown of individually placed mirror leaves, scattering light throughout the room with every subtle movement.'
      },
      {
        id: 'c-5',
        title: 'Celestial Swan in Jewels',
        urdu: 'قازِ ضیاء',
        type: 'swan',
        tag: 'Rare Collector Edition',
        img: '/assets/swan.webp',
        thumb: '/assets/swan-360.webp',
        alt: 'Swan motif with a raised wing made of silver mirror facets',
        desc: 'Small mirror facets trace the poetic shape of a swan, with a raised wing that catches the ambient light like stars in evening twilight.'
      },
      {
        id: 'c-6',
        title: 'Ayat-ul-Kursi Divine Arc',
        urdu: 'آیت الکرسی مبارک',
        type: 'grand-calligraphy',
        tag: 'Exclusive Commission',
        img: '/assets/divine-arc.webp',
        thumb: '/assets/divine-arc-360.webp',
        alt: 'Sweeping arched mirrorwork motif on a dark backing',
        desc: 'A large-format interpretation of the Throne Verse in flowing thuluth script, hand-sculpted with mirrored crystal shards and antique-gold detailing.'
      }
    ];

    const [current, setCurrent] = useState(0);
    const [paused, setPaused] = useState(false);

    useEffect(() => {
      if (paused) return;
      const timer = setInterval(() => {
        setCurrent(prev => (prev + 1) % slides.length);
      }, 4500);
      return () => clearInterval(timer);
    }, [paused, slides.length]);

    const activeSlide = slides[current];

    return React.createElement(
      'div',
      {
        className: 'relative max-w-4xl mx-auto mt-8 mb-12 p-[1px] rounded-2xl bg-gradient-to-b from-[#C9A84C]/60 via-[#C9A84C]/25 to-transparent shadow-[0_15px_50px_rgba(0,0,0,0.95)]',
        onMouseEnter: () => setPaused(true),
        onMouseLeave: () => setPaused(false)
      },
      React.createElement(
        'div',
        { className: 'bg-[#050505] border border-[#202024] rounded-xl overflow-hidden p-6 sm:p-8 backdrop-blur-xl relative' },
        
        React.createElement('div', { className: 'flex flex-col md:flex-row items-center gap-8' },
          
          // Art Artwork Visual with Frame & Authentic Live Site Photography
          React.createElement(
            'div',
            { className: 'w-full md:w-1/2 aspect-square max-w-[320px] bg-[#000000] border border-[#C9A84C]/40 rounded-xl relative overflow-hidden shadow-2xl group' },
            React.createElement('div', { className: 'absolute top-3 left-3 z-10 px-2.5 py-0.5 rounded bg-[#000000]/95 border border-[#C9A84C]/50 text-[10px] uppercase tracking-widest text-[#E8D48B]' }, activeSlide.tag),
            activeSlide.img
              ? React.createElement('img', {
                  key: activeSlide.id,
                  src: activeSlide.img,
                  srcSet: activeSlide.thumb ? `${activeSlide.thumb} 360w, ${activeSlide.img} 619w` : undefined,
                  sizes: '(max-width: 768px) 300px, 320px',
                  alt: activeSlide.alt || activeSlide.title,
                  className: 'w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ease-out'
                })
              : React.createElement(MirrorArtGraphic, { type: activeSlide.type })
          ),

          // Slide Text & Commission Action
          React.createElement(
            'div',
            { className: 'w-full md:w-1/2 text-left space-y-4' },
            React.createElement('div', { className: 'flex items-center justify-between' },
              React.createElement('span', { className: 'text-xs uppercase tracking-[0.25em] text-[#C9A84C]' }, `Exhibition 0${current + 1} / 0${slides.length}`),
              React.createElement('span', { className: 'font-nastaliq text-xl text-[#E8D48B]' }, activeSlide.urdu)
            ),
            React.createElement('h3', { className: 'font-[\'Cormorant_Garamond\'] text-2xl sm:text-3xl text-white font-light' }, activeSlide.title),
            React.createElement('p', { className: 'text-xs sm:text-sm text-gray-400 leading-relaxed' }, activeSlide.desc),
            
            React.createElement(
              'div',
              { className: 'pt-3 flex flex-wrap items-center gap-3' },
              React.createElement(
                'button',
                {
                  onClick: () => onOpenInquiry({ designType: activeSlide.title }),
                  className: 'btn-luxury-gold !py-2.5 !px-5 text-xs'
                },
                React.createElement('span', null, 'Inquire This Artwork'),
                React.createElement('span', { className: 'text-xs' }, '◆')
              ),
              React.createElement(
                'a',
                {
                  href: `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Assalam o Alaikum! I saw the ' + activeSlide.title + ' on your website and would love to inquire.')}`,
                  target: '_blank',
                  rel: 'noopener noreferrer',
                  className: 'btn-luxury-outline !py-2.5 !px-4 text-xs'
                },
                'WhatsApp Atelier 💬'
              )
            )
          )
        ),

        // Carousel Controls & Indicators
        React.createElement(
          'div',
          { className: 'flex justify-between items-center pt-6 mt-6 border-t border-white/5' },
          React.createElement(
            'div',
            { className: 'flex gap-2' },
            slides.map((_, idx) =>
              React.createElement('button', {
                key: idx,
                onClick: () => setCurrent(idx),
                className: `h-1.5 rounded-full transition-all ${idx === current ? 'w-8 bg-[#E8D48B] shadow-glow' : 'w-2 bg-gray-700 hover:bg-gray-500'}`
              })
            )
          ),
          React.createElement(
            'div',
            { className: 'flex items-center gap-2' },
            React.createElement(
              'button',
              {
                onClick: () => setCurrent(prev => (prev - 1 + slides.length) % slides.length),
                className: 'w-8 h-8 rounded-full border border-gray-700 hover:border-[#C9A84C] text-gray-300 hover:text-white flex items-center justify-center transition text-xs'
              },
              '←'
            ),
            React.createElement(
              'button',
              {
                onClick: () => setCurrent(prev => (prev + 1) % slides.length),
                className: 'w-8 h-8 rounded-full border border-gray-700 hover:border-[#C9A84C] text-gray-300 hover:text-white flex items-center justify-center transition text-xs'
              },
              '→'
            )
          )
        )
      )
    );
  }

  // ==========================================
  // 4. INTERACTIVE 3D ART CARD & AUTHENTIC PHOTOGRAPHY
  // ==========================================
  function ArtCard({ product, onSelect, onOpenDetails }) {
    const cardRef = useRef(null);
    const [style, setStyle] = useState({});

    function handleMouseMove(e) {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      cardRef.current.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
      cardRef.current.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);

      setStyle({
        transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px)`,
        boxShadow: '0 20px 35px -10px rgba(201, 168, 76, 0.25), 0 0 15px rgba(255,255,255,0.06)'
      });
    }

    function handleMouseLeave() {
      setStyle({
        transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        boxShadow: 'none'
      });
    }

    return React.createElement(
      'div',
      {
        className: 'mirror-card-container group cursor-pointer',
        onClick: () => onOpenDetails ? onOpenDetails(product) : onSelect(product)
      },
      React.createElement(
        'div',
        {
          ref: cardRef,
          style: style,
          onMouseMove: handleMouseMove,
          onMouseLeave: handleMouseLeave,
          className: 'mirror-card-3d bg-[#060606] border border-[#202024] group-hover:border-[#C9A84C]/70 rounded-xl overflow-hidden relative shadow-lg'
        },
        React.createElement('div', { className: 'mirror-card-glare' }),

        React.createElement(
          'div',
          { className: 'relative w-full aspect-square bg-[#020202] overflow-hidden' },
          product.image
            ? React.createElement(
                'picture',
                null,
                React.createElement('source', {
                  type: 'image/webp',
                  srcSet: product.imageThumb ? `${product.imageThumb} 360w, ${product.image} 1200w` : `${product.image} 1200w`,
                  sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
                }),
                React.createElement('img', {
                  src: product.imagePng || product.image,
                  alt: product.imageAlt || product.title,
                  loading: 'lazy',
                  className: 'w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out'
                })
              )
            : React.createElement(MirrorArtGraphic, { type: product.artSvgType }),
          React.createElement(
            'div',
            { className: 'absolute top-3 left-3 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md border border-[#C9A84C]/35 text-[9.5px] tracking-wider text-[#E8D48B] uppercase font-medium shadow-sm' },
            product.tag || product.kind
          )
        ),

        React.createElement(
          'div',
          { className: 'p-4 sm:p-5 bg-[#070707] border-t border-[#1C1C20] flex flex-col justify-between' },
          React.createElement(
            'div',
            { className: 'space-y-1.5 mb-3' },
            // Sub-eyebrow row: Category Tag on left, Urdu Calligraphic title on right
            React.createElement(
              'div',
              { className: 'flex justify-between items-center text-[10px] sm:text-[11px] tracking-wider uppercase font-medium text-[#C9A84C]' },
              React.createElement('span', { className: 'truncate pr-2 text-gray-400' }, product.kind || product.category || 'Luxury Mirrorwork'),
              React.createElement('span', { className: 'font-nastaliq text-xs sm:text-sm text-[#E8D48B] flex-shrink-0' }, product.urduTitle)
            ),
            // Full Width Title: English title gets 100% width, never squeezed by Urdu!
            React.createElement(
              'h3',
              { className: 'font-[\'Cormorant_Garamond\'] text-lg sm:text-xl font-medium text-white group-hover:text-[#E8D48B] transition-colors leading-snug min-h-[2.8rem] flex items-center' },
              product.title
            ),
            // Facet count with gold dot
            React.createElement(
              'p',
              { className: 'text-[11px] sm:text-xs text-gray-400 flex items-center gap-1.5 pt-0.5' },
              React.createElement('span', { className: 'inline-block w-1.5 h-1.5 rounded-full bg-[#C9A84C] flex-shrink-0' }),
              React.createElement('span', { className: 'truncate' }, product.mirrorPieces)
            )
          ),

          // Bottom Pricing & Action Bar with comfortable separation
          React.createElement(
            'div',
            { className: 'flex items-center justify-between pt-3 border-t border-[#202025] gap-3' },
            React.createElement(
              'div',
              { className: 'min-w-0 flex-1' },
              React.createElement('span', { className: 'text-[10px] text-gray-500 block uppercase tracking-widest leading-none mb-1' }, 'Investment'),
              React.createElement(
                'div',
                { className: 'flex items-baseline flex-wrap gap-x-1.5' },
                React.createElement('span', { className: 'text-sm font-semibold text-[#E8D48B] whitespace-nowrap' }, `PKR ${product.pricePKR.toLocaleString()}`),
                React.createElement('span', { className: 'text-[10px] text-gray-400 font-mono whitespace-nowrap' }, `($${product.priceUSD})`)
              )
            ),
            React.createElement(
              'button',
              { className: 'btn-luxury-sm !px-3 !py-1.5 whitespace-nowrap text-[10.5px] flex-shrink-0' },
              'View Details'
            )
          )
        )
      )
    );
  }

  // ==========================================
  // 5. CUSTOM COMMISSION STUDIO (CALCULATOR)
  // ==========================================
  function CustomCommissionStudio({ onOpenInquiry }) {
    const [shape, setShape] = useState('calligraphy');
    const [size, setSize] = useState('medium');
    const [frame, setFrame] = useState('gold');

    const shapes = [
      { id: 'calligraphy', label: 'Arabic Calligraphy', urdu: 'خطاطی', baseCost: 15000, mirrors: '1,000+' },
      { id: 'mandala', label: 'Sacred Mandala', urdu: 'منڈالا', baseCost: 12000, mirrors: '800+' },
      { id: 'butterfly', label: 'Butterfly Silhouette', urdu: 'پروانہ', baseCost: 10000, mirrors: '650+' },
      { id: 'heart', label: 'Shattered Heart', urdu: 'قلب', baseCost: 9500, mirrors: '550+' },
      { id: 'geometric', label: 'Prism Geometry', urdu: 'ہندسی منشور', baseCost: 11000, mirrors: '750+' }
    ];

    const sizes = [
      { id: 'small', label: '12" x 12" Intimate', multiplier: 0.8 },
      { id: 'medium', label: '18" x 24" Standard Gallery', multiplier: 1.0 },
      { id: 'large', label: '24" x 36" Statement Piece', multiplier: 1.5 },
      { id: 'grand', label: '30" x 40" Grand Focal Piece', multiplier: 2.2 }
    ];

    const frames = [
      { id: 'frameless', label: 'Deep Obsidian Base (Frameless)', cost: 0 },
      { id: 'gold', label: 'Antique Gold Bevel Edge Accent', cost: 2500 },
      { id: 'shadowbox', label: 'Floating Obsidian Shadow Box Frame', cost: 4000 }
    ];

    const motifImages = {
      calligraphy: { img: '/assets/sacred-noor.webp', alt: 'Arabic calligraphy mirror motif' },
      mandala: { img: '/assets/solaris.webp', alt: 'Sacred mandala mirror motif' },
      butterfly: { img: '/assets/butterfly.webp', alt: 'Butterfly silhouette mirror motif' },
      heart: { img: '/assets/heart.webp', alt: 'Shattered heart mirror motif' },
      geometric: { img: '/assets/prism.webp', alt: 'Prism geometry mirror motif' }
    };

    const selectedShapeObj = shapes.find(s => s.id === shape);
    const selectedSizeObj = sizes.find(s => s.id === size);
    const selectedFrameObj = frames.find(f => f.id === frame) || frames[1];

    const estimatedTotal = useMemo(() => {
      const base = selectedShapeObj.baseCost * selectedSizeObj.multiplier;
      return Math.round(base + selectedFrameObj.cost);
    }, [shape, size, frame]);

    return React.createElement(
      'section',
      { id: 'studio', className: 'py-20 px-4 sm:px-8 max-w-6xl mx-auto' },
      React.createElement(
        'div',
        { className: 'text-center mb-12' },
        React.createElement('span', { className: 'text-xs uppercase tracking-[0.3em] text-[#C9A84C] block mb-2 font-medium' }, 'Interactive Art Atelier'),
        React.createElement('h2', { className: 'text-3xl sm:text-4xl font-light font-[\'Cormorant_Garamond\'] text-white shimmer-gold' }, 'Custom Commission Studio'),
        React.createElement('div', { className: 'w-24 h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent mx-auto my-3' }),
        React.createElement('p', { className: 'text-xs sm:text-sm text-gray-400 max-w-xl mx-auto' }, 'Design your bespoke mirror art piece. Select your desired motif, dimensions, and framing to view an instant estimate.')
      ),

      React.createElement(
        'div',
        { className: 'grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[#060606] border border-[#202024] rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-md' },

        React.createElement(
          'div',
          { className: 'lg:col-span-7 space-y-6' },

          React.createElement(
            'div',
            null,
            React.createElement('label', { className: 'text-xs uppercase tracking-wider text-gray-300 block mb-2 font-semibold' }, '1. Choose Theme & Motif'),
            React.createElement(
              'div',
              { className: 'grid grid-cols-1 sm:grid-cols-2 gap-2.5' },
              shapes.map(s =>
                React.createElement(
                  'button',
                  {
                    key: s.id,
                    onClick: () => setShape(s.id),
                    className: `text-left p-3.5 rounded-lg border text-xs transition-all ${s.id === 'geometric' ? 'sm:col-span-2' : ''} ${shape === s.id ? 'border-[#C9A84C] bg-[#C9A84C]/20 text-white shadow-md' : 'border-[#1F1F24] bg-[#000000] text-gray-400 hover:border-gray-600'}`
                  },
                  React.createElement('div', { className: 'flex justify-between items-center gap-2' },
                    React.createElement('span', { className: 'font-medium text-white' }, s.label),
                    React.createElement('span', { className: 'font-nastaliq text-sm text-[#E8D48B]' }, s.urdu)
                  ),
                  React.createElement('div', { className: 'text-[11px] text-gray-500 mt-1' }, `Avg: ${s.mirrors} Hand-Cut Shards`)
                )
              )
            )
          ),

          React.createElement(
            'div',
            null,
            React.createElement('label', { className: 'text-xs uppercase tracking-wider text-gray-300 block mb-2 font-semibold' }, '2. Select Dimensions'),
            React.createElement(
              'div',
              { className: 'grid grid-cols-2 gap-2.5' },
              sizes.map(sz =>
                React.createElement(
                  'button',
                  {
                    key: sz.id,
                    onClick: () => setSize(sz.id),
                    className: `p-3 rounded-lg border text-xs text-center transition-all ${size === sz.id ? 'border-[#C9A84C] bg-[#C9A84C]/20 text-white shadow-md' : 'border-[#1F1F24] bg-[#000000] text-gray-400 hover:border-gray-600'}`
                  },
                  React.createElement('div', { className: 'font-medium' }, sz.label)
                )
              )
            )
          ),

          React.createElement(
            'div',
            null,
            React.createElement('label', { className: 'text-xs uppercase tracking-wider text-gray-300 block mb-2 font-semibold' }, '3. Select Framing & Edging'),
            React.createElement(
              'div',
              { className: 'space-y-2' },
              frames.map(fr =>
                React.createElement(
                  'button',
                  {
                    key: fr.id,
                    onClick: () => setFrame(fr.id),
                    className: `w-full text-left p-3 rounded-lg border text-xs flex justify-between items-center transition-all ${frame === fr.id ? 'border-[#C9A84C] bg-[#C9A84C]/20 text-white shadow-md' : 'border-[#1F1F24] bg-[#000000] text-gray-400 hover:border-gray-600'}`
                  },
                  React.createElement('span', null, fr.label),
                  React.createElement('span', { className: 'text-gray-400 text-[11px]' }, fr.cost === 0 ? 'Included' : `+PKR ${fr.cost.toLocaleString()}`)
                )
              )
            )
          )
        ),

        React.createElement(
          'div',
          { className: 'lg:col-span-5 bg-[#030303] border border-[#202024] rounded-xl p-6 flex flex-col justify-between' },
          React.createElement(
            'div',
            null,
            React.createElement(
              'div',
              { className: 'w-full aspect-square bg-[#000000] border border-[#1F1F24] rounded-lg mb-5 overflow-hidden relative group' },
              React.createElement('img', {
                src: motifImages[shape]?.img || '/assets/sacred-noor.webp',
                alt: motifImages[shape]?.alt || selectedShapeObj.label,
                className: 'w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out'
              }),
              React.createElement(
                'span',
                { className: 'absolute bottom-2 left-2 px-2.5 py-1 rounded bg-black/85 backdrop-blur-md text-[10px] uppercase tracking-wider text-[#E8D48B] border border-[#C9A84C]/30' },
                'Motif Preview'
              )
            ),
            React.createElement('div', { className: 'flex justify-between items-center' },
              React.createElement('h4', { className: 'font-[\'Cormorant_Garamond\'] text-xl text-white' }, selectedShapeObj.label),
              React.createElement('span', { className: 'font-nastaliq text-lg text-[#E8D48B]' }, selectedShapeObj.urdu)
            ),
            React.createElement('p', { className: 'text-xs text-gray-400 mt-1' }, `${selectedSizeObj.label} · Handcrafted mirror mosaic pieces on deep obsidian base.`)
          ),

          React.createElement(
            'div',
            { className: 'pt-6 border-t border-white/10 mt-6' },
            React.createElement('span', { className: 'text-xs uppercase tracking-wider text-gray-500 block' }, 'Estimated Investment'),
            React.createElement(
              'div',
              { className: 'flex items-baseline gap-2 mt-1 mb-4' },
              React.createElement('span', { className: 'text-2xl sm:text-3xl font-light font-[\'Cormorant_Garamond\'] text-[#E8D48B]' }, `PKR ${estimatedTotal.toLocaleString()}`),
              React.createElement('span', { className: 'text-xs text-gray-400 font-mono' }, `(~ $${Math.round(estimatedTotal / 278)} USD)`)
            ),
            React.createElement(
              'button',
              {
                onClick: () => onOpenInquiry({
                  designType: `${selectedShapeObj.label} (${selectedShapeObj.urdu})`,
                  customSize: selectedSizeObj.label,
                  budget: `PKR ${estimatedTotal.toLocaleString()}`
                }),
                className: 'w-full btn-luxury-gold'
              },
              React.createElement('span', null, 'Book This Custom Piece'),
              React.createElement('span', { className: 'text-xs opacity-75' }, '◆')
            )
          )
        )
      )
    );
  }

  // ==========================================
  // 6. ARTWORK DETAIL MODAL (AUTHENTIC HIGH-RES INSPECTION)
  // ==========================================
  function ArtworkDetailModal({ product, isOpen, onClose, onCommission }) {
    if (!isOpen || !product) return null;

    const waUrl = product.whatsappUrl || `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Assalam o Alaikum Ayenah! I'd like to ask about the ${product.title}. Could you share current photos and availability?`)}`;

    return React.createElement(
      'div',
      {
        className: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md',
        onClick: (e) => { if (e.target === e.currentTarget) onClose(); }
      },
      React.createElement(
        'div',
        {
          className: 'bg-[#080808] border border-[#C9A84C]/60 rounded-2xl max-w-3xl w-full p-6 sm:p-8 relative shadow-2xl overflow-y-auto max-h-[92vh]'
        },
        React.createElement(
          'button',
          {
            onClick: onClose,
            className: 'absolute top-4 right-4 text-gray-400 hover:text-white text-lg w-8 h-8 rounded-full bg-white/5 flex items-center justify-center transition'
          },
          '✕'
        ),
        React.createElement(
          'div',
          { className: 'grid grid-cols-1 md:grid-cols-12 gap-6 items-center' },
          
          // Large High-Res Artwork Image
          React.createElement(
            'div',
            { className: 'md:col-span-6 relative aspect-square bg-[#000000] rounded-xl overflow-hidden border border-[#202024] group' },
            product.image
              ? React.createElement(
                  'picture',
                  null,
                  React.createElement('source', {
                    type: 'image/webp',
                    srcSet: product.image
                  }),
                  React.createElement('img', {
                    src: product.imagePng || product.image,
                    alt: product.imageAlt || product.title,
                    className: 'w-full h-full object-cover group-hover:scale-105 transition-transform duration-700'
                  })
                )
              : React.createElement(MirrorArtGraphic, { type: product.artSvgType }),
            React.createElement(
              'div',
              { className: 'absolute bottom-2 left-2 px-2.5 py-1 rounded bg-black/80 text-[10px] uppercase tracking-widest text-[#E8D48B] border border-[#C9A84C]/30' },
              'Original Master HD Artwork'
            )
          ),

          // Artwork Specs & Actions
          React.createElement(
            'div',
            { className: 'md:col-span-6 space-y-4 text-left' },
            React.createElement('div', { className: 'flex justify-between items-start' },
              React.createElement('span', { className: 'text-xs uppercase tracking-widest text-[#C9A84C]' }, product.kind || product.category),
              React.createElement('span', { className: 'font-nastaliq text-xl text-[#E8D48B]' }, product.urduTitle)
            ),
            React.createElement('h3', { className: 'font-[\'Cormorant_Garamond\'] text-2xl sm:text-3xl text-white font-light' }, product.title),
            React.createElement('p', { className: 'text-xs sm:text-sm text-gray-300 leading-relaxed' }, product.description),

            // Technical Specs
            React.createElement(
              'div',
              { className: 'grid grid-cols-2 gap-3 py-3 border-y border-white/10' },
              React.createElement('div', null,
                React.createElement('span', { className: 'text-[11px] text-gray-500 uppercase block tracking-wider' }, 'Dimensions'),
                React.createElement('strong', { className: 'text-xs text-white' }, product.dimensions)
              ),
              React.createElement('div', null,
                React.createElement('span', { className: 'text-[11px] text-gray-500 uppercase block tracking-wider' }, 'Mirrorwork Facets'),
                React.createElement('strong', { className: 'text-xs text-white' }, product.mirrorPieces)
              )
            ),

            // Price Display
            React.createElement(
              'div',
              { className: 'flex items-baseline gap-2' },
              React.createElement('span', { className: 'text-xl sm:text-2xl font-semibold text-[#E8D48B]' }, `PKR ${product.pricePKR.toLocaleString()}`),
              React.createElement('span', { className: 'text-xs text-gray-400 font-mono' }, `($${product.priceUSD} USD)`)
            ),

            // Action Buttons
            React.createElement(
              'div',
              { className: 'space-y-2.5 pt-2' },
              React.createElement(
                'a',
                {
                  href: waUrl,
                  target: '_blank',
                  rel: 'noopener noreferrer',
                  className: 'w-full btn-luxury-gold justify-center'
                },
                React.createElement('span', null, 'Inquire on WhatsApp Directly'),
                React.createElement('span', { className: 'text-sm' }, '💬')
              ),
              React.createElement(
                'button',
                {
                  onClick: () => {
                    onClose();
                    onCommission({
                      designType: product.title,
                      customSize: product.dimensions,
                      budget: `PKR ${product.pricePKR.toLocaleString()}`
                    });
                  },
                  className: 'w-full btn-luxury-outline justify-center text-xs'
                },
                'Request Custom Size or Variation'
              )
            )
          )
        )
      )
    );
  }

  // ==========================================
  // 7. INQUIRY / COMMISSION MODAL
  // ==========================================
  function InquiryModal({ isOpen, onClose, initialData }) {
    if (!isOpen) return null;

    const [form, setForm] = useState({
      name: '',
      phone: '',
      email: '',
      designType: initialData?.designType || 'Arabic Calligraphy (خطاطی)',
      customSize: initialData?.customSize || '18" x 24" Standard Gallery',
      budget: initialData?.budget || 'Standard',
      message: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    async function handleSubmit(e) {
      e.preventDefault();
      setSubmitting(true);
      setErrorMessage('');
      setSuccessMessage('');

      try {
        const res = await fetch('/api/inquiries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
        const data = await res.json();
        if (data.success) {
          setSuccessMessage(data.message);
        } else {
          setErrorMessage(data.message || 'Something went wrong.');
        }
      } catch (err) {
        setSuccessMessage('Thank you! Your custom commission request has been received. We will reach out via WhatsApp shortly.');
      } finally {
        setSubmitting(false);
      }
    }

    const waText = encodeURIComponent(`Assalam o Alaikum Ayenah Official! I am interested in commissioning a custom mirror art piece:\n- Design: ${form.designType}\n- Size: ${form.customSize}\n- Name: ${form.name}\n- Notes: ${form.message || 'Standard Consultation'}`);
    const waUrl = `https://wa.me/${WA_NUMBER}?text=${waText}`;

    return React.createElement(
      'div',
      { className: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md' },
      React.createElement(
        'div',
        { className: 'bg-[#060606] border border-[#C9A84C]/50 rounded-2xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl overflow-y-auto max-h-[90vh]' },
        
        React.createElement(
          'button',
          { onClick: onClose, className: 'absolute top-4 right-4 text-gray-400 hover:text-white text-lg w-8 h-8 rounded-full bg-white/5 flex items-center justify-center' },
          '✕'
        ),

        React.createElement('span', { className: 'text-xs uppercase tracking-widest text-[#C9A84C] block mb-1 font-semibold' }, 'Commission Order'),
        React.createElement('h3', { className: 'text-2xl font-light font-[\'Cormorant_Garamond\'] text-white mb-4' }, 'Start Your Bespoke Mirror Piece'),

        successMessage ?
          React.createElement(
            'div',
            { className: 'text-center py-8 space-y-4' },
            React.createElement('div', { className: 'w-16 h-16 rounded-full bg-[#C9A84C]/20 text-[#E8D48B] flex items-center justify-center mx-auto text-2xl' }, '✨'),
            React.createElement('p', { className: 'text-sm text-gray-200' }, successMessage),
            React.createElement(
              'a',
              { href: waUrl, target: '_blank', rel: 'noopener noreferrer', className: 'btn-luxury-gold inline-flex' },
              React.createElement('span', null, 'Continue on WhatsApp Directly'),
              React.createElement('span', { className: 'text-xs' }, '💬')
            ),
            React.createElement('button', { onClick: onClose, className: 'block mx-auto text-xs text-gray-400 hover:underline pt-2' }, 'Close Window')
          ) :
          React.createElement(
            'form',
            { onSubmit: handleSubmit, className: 'space-y-4' },
            React.createElement(
              'div',
              null,
              React.createElement('label', { className: 'block text-xs uppercase text-gray-400 mb-1' }, 'Full Name *'),
              React.createElement('input', {
                type: 'text',
                required: true,
                value: form.name,
                onChange: e => setForm({ ...form, name: e.target.value }),
                placeholder: 'e.g. Sarah Khan',
                className: 'w-full bg-[#000000] border border-[#202024] focus:border-[#C9A84C] rounded-lg p-2.5 text-xs text-white outline-none'
              })
            ),
            React.createElement(
              'div',
              { className: 'grid grid-cols-1 sm:grid-cols-2 gap-3' },
              React.createElement(
                'div',
                null,
                React.createElement('label', { className: 'block text-xs uppercase text-gray-400 mb-1' }, 'WhatsApp Contact *'),
                React.createElement('input', {
                  type: 'tel',
                  required: true,
                  value: form.phone,
                  onChange: e => setForm({ ...form, phone: e.target.value }),
                  placeholder: 'Your WhatsApp Number',
                  className: 'w-full bg-[#000000] border border-[#202024] focus:border-[#C9A84C] rounded-lg p-2.5 text-xs text-white outline-none'
                })
              ),
              React.createElement(
                'div',
                null,
                React.createElement('label', { className: 'block text-xs uppercase text-gray-400 mb-1' }, 'Email Address'),
                React.createElement('input', {
                  type: 'email',
                  value: form.email,
                  onChange: e => setForm({ ...form, email: e.target.value }),
                  placeholder: 'name@example.com',
                  className: 'w-full bg-[#000000] border border-[#202024] focus:border-[#C9A84C] rounded-lg p-2.5 text-xs text-white outline-none'
                })
              )
            ),
            React.createElement(
              'div',
              { className: 'grid grid-cols-1 sm:grid-cols-2 gap-3' },
              React.createElement(
                'div',
                null,
                React.createElement('label', { className: 'block text-xs uppercase text-gray-400 mb-1' }, 'Design Preference'),
                React.createElement('input', {
                  type: 'text',
                  value: form.designType,
                  onChange: e => setForm({ ...form, designType: e.target.value }),
                  className: 'w-full bg-[#000000] border border-[#202024] rounded-lg p-2.5 text-xs text-white outline-none'
                })
              ),
              React.createElement(
                'div',
                null,
                React.createElement('label', { className: 'block text-xs uppercase text-gray-400 mb-1' }, 'Desired Dimensions'),
                React.createElement('input', {
                  type: 'text',
                  value: form.customSize,
                  onChange: e => setForm({ ...form, customSize: e.target.value }),
                  className: 'w-full bg-[#000000] border border-[#202024] rounded-lg p-2.5 text-xs text-white outline-none'
                })
              )
            ),
            React.createElement(
              'div',
              null,
              React.createElement('label', { className: 'block text-xs uppercase text-gray-400 mb-1' }, 'Special Vision / Requests'),
              React.createElement('textarea', {
                rows: 3,
                value: form.message,
                onChange: e => setForm({ ...form, message: e.target.value }),
                placeholder: 'Describe your wall color, preferred calligraphy verse, or mirror layout...',
                className: 'w-full bg-[#000000] border border-[#202024] focus:border-[#C9A84C] rounded-lg p-2.5 text-xs text-white outline-none resize-none'
              })
            ),
            errorMessage && React.createElement('p', { className: 'text-xs text-rose-400' }, errorMessage),
            React.createElement(
              'div',
              { className: 'space-y-2 pt-2' },
              React.createElement(
                'button',
                {
                  type: 'submit',
                  disabled: submitting,
                  className: 'w-full btn-luxury-gold'
                },
                submitting ? 'Transmitting to Atelier...' : 'Submit Custom Commission Inquiry'
              ),
              React.createElement(
                'a',
                {
                  href: waUrl,
                  target: '_blank',
                  rel: 'noopener noreferrer',
                  className: 'w-full btn-luxury-outline text-center text-xs'
                },
                React.createElement('span', null, 'Or Message Directly on WhatsApp'),
                React.createElement('span', { className: 'text-xs text-emerald-400' }, '💬')
              )
            )
          )
      )
    );
  }

  // Default fallback products with authentic live site images
  const INITIAL_PRODUCTS = [
        {
            "id": "ay-01",
            "title": "Sacred Noor Calligraphy",
            "urduTitle": "خطاطی نور الہیٰ",
            "category": "calligraphy",
            "kind": "Calligraphy",
            "tag": "Signature Masterpiece",
            "dimensions": "24 × 36 in",
            "mirrorPieces": "Over 1,200 hand-cut facets",
            "pricePKR": 18500,
            "priceUSD": 68,
            "description": "Sacred Arabic calligraphy rendered in diamond-shaped mirror facets on a charcoal backing.",
            "image": "/assets/sacred-noor.webp",
            "imagePng": "/assets/Sacred-Noor-Calligraphy.png",
            "imageThumb": "/assets/sacred-noor-360.webp",
            "imageAlt": "Teardrop-shaped mirrorwork motif on a dark backing",
            "featured": true,
            "artSvgType": "calligraphy-drop",
            "whatsappUrl": "https://wa.me/923099050832?text=Assalam%20o%20Alaikum%20Ayenah%21%20I%27d%20like%20to%20ask%20about%20the%20Sacred%20Noor%20Calligraphy.%20Could%20you%20share%20current%20photos%20and%20availability%3F"
        },
        {
            "id": "ay-02",
            "title": "Solaris Mirror Mandala",
            "urduTitle": "شمس دائرہ منڈالا",
            "category": "mandala",
            "kind": "Mandalas",
            "tag": "Bestseller",
            "dimensions": "20 × 20 in",
            "mirrorPieces": "Over 850 mirror petals",
            "pricePKR": 14000,
            "priceUSD": 52,
            "description": "Concentric rings of silver mirror petals, set by hand with gold-toned accents.",
            "image": "/assets/solaris.webp",
            "imagePng": "/assets/Solaris-Mirror-Mandala.png",
            "imageThumb": "/assets/solaris-360.webp",
            "imageAlt": "Circular sunburst mosaic in silver and champagne mirror petals",
            "featured": true,
            "artSvgType": "solar-mandala",
            "whatsappUrl": "https://wa.me/923099050832?text=Assalam%20o%20Alaikum%20Ayenah%21%20I%27d%20like%20to%20ask%20about%20the%20Solaris%20Mirror%20Mandala.%20Could%20you%20share%20current%20photos%20and%20availability%3F"
        },
        {
            "id": "ay-03",
            "title": "Metamorphosis Crystal Butterfly",
            "urduTitle": "پروانہ آئینہ",
            "category": "nature",
            "kind": "Nature & forms",
            "tag": "Trending",
            "dimensions": "16 × 16 in",
            "mirrorPieces": "640 mirror fragments",
            "pricePKR": 11500,
            "priceUSD": 42,
            "description": "One wing is densely paved in mirror pieces, while the other breaks into individual glass fragments.",
            "image": "/assets/butterfly.webp",
            "imagePng": "/assets/Metamorphosis-Crystal-Butterfly.png",
            "imageThumb": "/assets/butterfly-360.webp",
            "imageAlt": "Butterfly mosaic with a wing dispersing into mirror fragments",
            "featured": true,
            "artSvgType": "butterfly",
            "whatsappUrl": "https://wa.me/923099050832?text=Assalam%20o%20Alaikum%20Ayenah%21%20I%27d%20like%20to%20ask%20about%20the%20Metamorphosis%20Crystal%20Butterfly.%20Could%20you%20share%20current%20photos%20and%20availability%3F"
        },
        {
            "id": "ay-04",
            "title": "Prism Geometric Diamonds",
            "urduTitle": "ہندسی منشور",
            "category": "geometric",
            "kind": "Geometry",
            "tag": "Modern Art",
            "dimensions": "18 × 24 in",
            "mirrorPieces": "780 precision-cut facets",
            "pricePKR": 13200,
            "priceUSD": 48,
            "description": "Intersecting diamonds and chevrons are paved with reflective facets for a crisp, angular composition.",
            "image": "/assets/prism.webp",
            "imagePng": "/assets/Prism-Geometric-Diamonds.png",
            "imageThumb": "/assets/prism-360.webp",
            "imageAlt": "Interlocking diamond shapes made with triangular mirror glass",
            "featured": false,
            "artSvgType": "geometric",
            "whatsappUrl": "https://wa.me/923099050832?text=Assalam%20o%20Alaikum%20Ayenah%21%20I%27d%20like%20to%20ask%20about%20the%20Prism%20Geometric%20Diamonds.%20Could%20you%20share%20current%20photos%20and%20availability%3F"
        },
        {
            "id": "ay-05",
            "title": "Shattered Heart of Light",
            "urduTitle": "قلبِ ضیاء",
            "category": "nature",
            "kind": "Nature & forms",
            "tag": "Romantic Luxury",
            "dimensions": "16 × 16 in",
            "mirrorPieces": "580 mirror shards",
            "pricePKR": 10500,
            "priceUSD": 39,
            "description": "A heart silhouette built from hand-cut mirror pieces gradually disperses into loose facets.",
            "image": "/assets/heart.webp",
            "imagePng": "/assets/Shattered-Heart-of-Light.png",
            "imageThumb": "/assets/heart-360.webp",
            "imageAlt": "Heart-shaped mirror mosaic with small fragments trailing from one edge",
            "featured": true,
            "artSvgType": "shattered-heart",
            "whatsappUrl": "https://wa.me/923099050832?text=Assalam%20o%20Alaikum%20Ayenah%21%20I%27d%20like%20to%20ask%20about%20the%20Shattered%20Heart%20of%20Light.%20Could%20you%20share%20current%20photos%20and%20availability%3F"
        },
        {
            "id": "ay-06",
            "title": "Celestial Swan in Jewels",
            "urduTitle": "قازِ ضیاء",
            "category": "nature",
            "kind": "Nature & forms",
            "tag": "Collector Edition",
            "dimensions": "20 × 24 in",
            "mirrorPieces": "920 faceted mirror points",
            "pricePKR": 16500,
            "priceUSD": 60,
            "description": "Small mirror points trace the shape of a swan, with a raised wing that catches the light across the surface.",
            "image": "/assets/swan.webp",
            "imagePng": "/assets/Celestial-Swan-in-Jewels.png",
            "imageThumb": "/assets/swan-360.webp",
            "imageAlt": "Swan motif with a raised wing made of silver mirror facets",
            "featured": true,
            "artSvgType": "swan",
            "whatsappUrl": "https://wa.me/923099050832?text=Assalam%20o%20Alaikum%20Ayenah%21%20I%27d%20like%20to%20ask%20about%20the%20Celestial%20Swan%20in%20Jewels.%20Could%20you%20share%20current%20photos%20and%20availability%3F"
        },
        {
            "id": "ay-07",
            "title": "Ayat-ul-Kursi Divine Arc",
            "urduTitle": "آیت الکرسی مبارک",
            "category": "calligraphy",
            "kind": "Calligraphy",
            "tag": "Exclusive Commission",
            "dimensions": "30 × 40 in",
            "mirrorPieces": "Over 2,200 mirror facets",
            "pricePKR": 32000,
            "priceUSD": 115,
            "description": "A large-format interpretation of the Throne Verse in flowing thuluth script, with mirror facets and antique-gold detailing.",
            "image": "/assets/divine-arc.webp",
            "imagePng": "/assets/Ayat-ul-Kursi-Divine-Arc.png",
            "imageThumb": "/assets/divine-arc-360.webp",
            "imageAlt": "Sweeping arched mirrorwork motif on a dark backing",
            "featured": true,
            "artSvgType": "grand-calligraphy",
            "whatsappUrl": "https://wa.me/923099050832?text=Assalam%20o%20Alaikum%20Ayenah%21%20I%27d%20like%20to%20ask%20about%20the%20Ayat-ul-Kursi%20Divine%20Arc.%20Could%20you%20share%20current%20photos%20and%20availability%3F"
        },
        {
            "id": "ay-08",
            "title": "Tree of Life Mirror Artwork",
            "urduTitle": "شجرۂ حیات",
            "category": "nature",
            "kind": "Nature & forms",
            "tag": "Collector's Choice",
            "dimensions": "24 × 30 in",
            "mirrorPieces": "1,500 mirror foliage shards",
            "pricePKR": 22000,
            "priceUSD": 80,
            "description": "A gold-toned trunk branches into a crown of individually placed mirror leaves.",
            "image": "/assets/tree.webp",
            "imagePng": "/assets/Tree-of-Life.png",
            "imageThumb": "/assets/tree-360.webp",
            "imageAlt": "Spreading tree mosaic with silver leaves and a brass-toned trunk",
            "featured": false,
            "artSvgType": "tree-of-life",
            "whatsappUrl": "https://wa.me/923099050832?text=Assalam%20o%20Alaikum%20Ayenah%21%20I%27d%20like%20to%20ask%20about%20the%20Tree%20of%20Life%20Mirror%20Artwork.%20Could%20you%20share%20current%20photos%20and%20availability%3F"
        },
        {
            "id": "ay-09",
            "title": "Ism-e-Azam Allah Calligraphy",
            "urduTitle": "اسمِ اعظم اللہ",
            "category": "calligraphy",
            "kind": "Calligraphy",
            "tag": "Imperial Masterpiece",
            "dimensions": "26 × 34 in",
            "mirrorPieces": "Over 1,450 mirror rays & quartz",
            "pricePKR": 24500,
            "priceUSD": 88,
            "description": "Grand sacred Allah calligraphy rendered in gold relief with radial mirror bursts, raw quartz crystal clusters, and antique gold textures on textured stone backing.",
            "image": "/assets/ism-e-azam.webp",
            "imagePng": "/assets/Ism-e-Azam-Allah-Calligraphy.jpg",
            "imageThumb": "/assets/ism-e-azam-360.webp",
            "imageAlt": "Sacred Allah calligraphy with radial mirror bursts and crystals",
            "featured": true,
            "artSvgType": "grand-calligraphy",
            "whatsappUrl": "https://wa.me/923099050832?text=Assalam%20o%20Alaikum%20Ayenah%21%20I%27d%20like%20to%20ask%20about%20the%20Ism-e-Azam%20Allah%20Calligraphy.%20Could%20you%20share%20current%20photos%20and%20availability%3F"
        },
        {
            "id": "ay-10",
            "title": "Hilal-e-Noor Emerald Crescent",
            "urduTitle": "ہلالِ نور اللہ",
            "category": "calligraphy",
            "kind": "Calligraphy",
            "tag": "Emerald Royal Edition",
            "dimensions": "22 × 28 in",
            "mirrorPieces": "880 mother-of-pearl & mirror facets",
            "pricePKR": 19500,
            "priceUSD": 70,
            "description": "A sweeping crescent moon with sacred Allah calligraphy set against rich emerald green velvet, bounded by gold arabesque corner filigree and an authentic brass plaque.",
            "image": "/assets/hilal-emerald.webp",
            "imagePng": "/assets/Hilal-e-Noor-Emerald-Crescent.jpg",
            "imageThumb": "/assets/hilal-emerald-360.webp",
            "imageAlt": "Crescent moon with Allah calligraphy on emerald velvet",
            "featured": true,
            "artSvgType": "calligraphy-drop",
            "whatsappUrl": "https://wa.me/923099050832?text=Assalam%20o%20Alaikum%20Ayenah%21%20I%27d%20like%20to%20ask%20about%20the%20Hilal-e-Noor%20Emerald%20Crescent.%20Could%20you%20share%20current%20photos%20and%20availability%3F"
        },
        {
            "id": "ay-11",
            "title": "Sacred Allah Teardrop Calligraphy",
            "urduTitle": "خطاطی اسمِ جلالہ",
            "category": "calligraphy",
            "kind": "Calligraphy",
            "tag": "Signature Edition",
            "dimensions": "24 × 32 in",
            "mirrorPieces": "Over 1,100 hand-placed mirror petals",
            "pricePKR": 21000,
            "priceUSD": 75,
            "description": "Teardrop sacred medallion with floral mirror filigree borders surrounding the Ism-e-Jalalah Allah calligraphy on royal burgundy velvet.",
            "image": "/assets/allah-teardrop.webp",
            "imagePng": "/assets/Sacred-Allah-Teardrop.jpg",
            "imageThumb": "/assets/allah-teardrop-360.webp",
            "imageAlt": "Teardrop Allah calligraphy with floral filigree border on burgundy velvet",
            "featured": true,
            "artSvgType": "calligraphy-drop",
            "whatsappUrl": "https://wa.me/923099050832?text=Assalam%20o%20Alaikum%20Ayenah%21%20I%27d%20like%20to%20ask%20about%20the%20Sacred%20Allah%20Teardrop%20Calligraphy.%20Could%20you%20share%20current%20photos%20and%20availability%3F"
        },
        {
            "id": "ay-12",
            "title": "Sultani Noor Arched Calligraphy",
            "urduTitle": "سلطانی نور خطاطی",
            "category": "calligraphy",
            "kind": "Calligraphy",
            "tag": "Sultani Masterpiece",
            "dimensions": "28 × 38 in",
            "mirrorPieces": "Over 1,800 micro-cut mirror facets",
            "pricePKR": 28000,
            "priceUSD": 100,
            "description": "Imperial Ottoman-inspired arch featuring multi-tiered mirror cresting, botanical scrollwork, and gold relief Allah calligraphy on deep burgundy velvet.",
            "image": "/assets/sultani-arched.webp",
            "imagePng": "/assets/Sultani-Noor-Arched-Calligraphy.jpg",
            "imageThumb": "/assets/sultani-arched-360.webp",
            "imageAlt": "Grand arched Allah calligraphy with elaborate crest and mirror scrollwork",
            "featured": true,
            "artSvgType": "grand-calligraphy",
            "whatsappUrl": "https://wa.me/923099050832?text=Assalam%20o%20Alaikum%20Ayenah%21%20I%27d%20like%20to%20ask%20about%20the%20Sultani%20Noor%20Grand%20Arched%20Calligraphy.%20Could%20you%20share%20current%20photos%20and%20availability%3F"
        },
        {
            "id": "ay-13",
            "title": "Taj-e-Noor Golden Calligraphy",
            "urduTitle": "تاجِ نور خطاطی",
            "category": "calligraphy",
            "kind": "Calligraphy",
            "tag": "Royal Gold Edition",
            "dimensions": "28 × 38 in",
            "mirrorPieces": "Over 1,850 mirror & brass facets",
            "pricePKR": 29500,
            "priceUSD": 105,
            "description": "Warm champagne and antique gold mirror variation of the grand arched calligraphy, encased in a walnut and gilded shadowbox frame.",
            "image": "/assets/taj-golden.webp",
            "imagePng": "/assets/Taj-e-Noor-Golden-Calligraphy.jpg",
            "imageThumb": "/assets/taj-golden-360.webp",
            "imageAlt": "Warm gold arched Allah calligraphy in walnut gilded frame",
            "featured": false,
            "artSvgType": "grand-calligraphy",
            "whatsappUrl": "https://wa.me/923099050832?text=Assalam%20o%20Alaikum%20Ayenah%21%20I%27d%20like%20to%20ask%20about%20the%20Taj-e-Noor%20Golden%20Calligraphy.%20Could%20you%20share%20current%20photos%20and%20availability%3F"
        },
        {
            "id": "ay-14",
            "title": "Celestial Swan Atelier Frame",
            "urduTitle": "قازِ ضیاء شاہکار",
            "category": "nature",
            "kind": "Nature & forms",
            "tag": "Atelier Exhibition",
            "dimensions": "24 × 32 in",
            "mirrorPieces": "960 mother-of-pearl & mirror feathers",
            "pricePKR": 18500,
            "priceUSD": 67,
            "description": "Full gallery perspective of the celestial swan framed with navy velvet backing, beaded gold inner moulding, and an authentic engraved brass plaque.",
            "image": "/assets/swan-velvet.webp",
            "imagePng": "/assets/Celestial-Swan-Velvet-Frame.jpg",
            "imageThumb": "/assets/swan-velvet-360.webp",
            "imageAlt": "Celestial swan artwork in navy velvet with brass plaque and beaded frame",
            "featured": false,
            "artSvgType": "swan",
            "whatsappUrl": "https://wa.me/923099050832?text=Assalam%20o%20Alaikum%20Ayenah%21%20I%27d%20like%20to%20ask%20about%20the%20Celestial%20Swan%20Atelier%20Velvet%20Frame.%20Could%20you%20share%20current%20photos%20and%20availability%3F"
        },
        {
            "id": "ay-15",
            "title": "Shattered Heart Atelier Frame",
            "urduTitle": "قلبِ ضیاء شاہکار",
            "category": "nature",
            "kind": "Nature & forms",
            "tag": "Atelier Exhibition",
            "dimensions": "22 × 28 in",
            "mirrorPieces": "620 hand-cut mirror shards",
            "pricePKR": 14500,
            "priceUSD": 52,
            "description": "Complete framed vertical perspective of the shattered heart of light, set upon charcoal smoke velvet with hand-stained walnut framing.",
            "image": "/assets/heart-velvet.webp",
            "imagePng": "/assets/Shattered-Heart-Velvet-Frame.jpg",
            "imageThumb": "/assets/heart-velvet-360.webp",
            "imageAlt": "Shattered heart artwork mounted on charcoal smoke velvet with walnut frame",
            "featured": false,
            "artSvgType": "shattered-heart",
            "whatsappUrl": "https://wa.me/923099050832?text=Assalam%20o%20Alaikum%20Ayenah%21%20I%27d%20like%20to%20ask%20about%20the%20Shattered%20Heart%20Atelier%20Velvet%20Frame.%20Could%20you%20share%20current%20photos%20and%20availability%3F"
        },
        {
            "id": "ay-16",
            "title": "Crystal Butterfly Atelier Frame",
            "urduTitle": "پروانہ آئینہ شاہکار",
            "category": "nature",
            "kind": "Nature & forms",
            "tag": "Atelier Exhibition",
            "dimensions": "22 × 28 in",
            "mirrorPieces": "680 mirror crystals",
            "pricePKR": 15500,
            "priceUSD": 56,
            "description": "Complete exhibition frame of the metamorphosis crystal butterfly with trailing glass shards, mounted on deep velvet with museum brass nameplate.",
            "image": "/assets/butterfly-velvet.webp",
            "imagePng": "/assets/Crystal-Butterfly-Velvet-Frame.jpg",
            "imageThumb": "/assets/butterfly-velvet-360.webp",
            "imageAlt": "Crystal butterfly mounted in museum frame with velvet backing and brass plaque",
            "featured": false,
            "artSvgType": "butterfly",
            "whatsappUrl": "https://wa.me/923099050832?text=Assalam%20o%20Alaikum%20Ayenah%21%20I%27d%20like%20to%20ask%20about%20the%20Crystal%20Butterfly%20Atelier%20Velvet%20Frame.%20Could%20you%20share%20current%20photos%20and%20availability%3F"
        },
        {
            "id": "ay-17",
            "title": "Tree of Life Royal Frame",
            "urduTitle": "شجرۂ حیات شاہکار",
            "category": "nature",
            "kind": "Nature & forms",
            "tag": "Atelier Exhibition",
            "dimensions": "26 × 36 in",
            "mirrorPieces": "1,550 shimmering foliage leaves",
            "pricePKR": 25000,
            "priceUSD": 90,
            "description": "Full vertical framed showcase of the Tree of Life with sculptural golden roots, twisting trunk, and thousands of mirror leaves on obsidian velvet.",
            "image": "/assets/tree-velvet.webp",
            "imagePng": "/assets/Tree-of-Life-Velvet-Frame.jpg",
            "imageThumb": "/assets/tree-velvet-360.webp",
            "imageAlt": "Tree of life mirror artwork in royal obsidian frame with brass plaque",
            "featured": false,
            "artSvgType": "tree-of-life",
            "whatsappUrl": "https://wa.me/923099050832?text=Assalam%20o%20Alaikum%20Ayenah%21%20I%27d%20like%20to%20ask%20about%20the%20Tree%20of%20Life%20Royal%20Obsidian%20Frame.%20Could%20you%20share%20current%20photos%20and%20availability%3F"
        }
  ];

  // ==========================================
  // 7. MAIN APPLICATION COMPONENT
  // ==========================================
  function App() {
    const [products, setProducts] = useState(INITIAL_PRODUCTS);
    const [filter, setFilter] = useState('all');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
    const [modalPreFill, setModalPreFill] = useState(null);
    const [navScrolled, setNavScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
      fetch('/api/products')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data) {
            setProducts(data.data);
          }
        })
        .catch(err => console.log('Loaded static products cache'));

      const handleScroll = () => {
        setNavScrolled(window.scrollY > 60);
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const filteredProducts = useMemo(() => {
      if (filter === 'all') return products;
      return products.filter(p => p.category === filter);
    }, [products, filter]);

    function handleStartCommission(data) {
      setModalPreFill(data);
      setInquiryModalOpen(true);
    }

    const directWhatsAppGreeting = encodeURIComponent('Assalam o Alaikum Ayenah Official! I would like to inquire about commissioning a handcrafted mirror art piece.');

    return React.createElement(
      'div',
      { className: 'min-h-screen text-[#E8E8E8] relative selection:bg-[#C9A84C] selection:text-black' },

      // Pure Circular WhatsApp Logo Button (No explicit phone number digits displayed)
      React.createElement(
        'a',
        {
          href: `https://wa.me/${WA_NUMBER}?text=${directWhatsAppGreeting}`,
          target: '_blank',
          rel: 'noopener noreferrer',
          title: 'Direct WhatsApp Chat',
          className: 'floating-wa-circle'
        },
        // Official WhatsApp SVG icon
        React.createElement('svg', {
          viewBox: '0 0 32 32',
          className: 'w-7 h-7 fill-white'
        },
          React.createElement('path', {
            d: 'M16.002 2C8.28 2 2 8.28 2 16.002c0 2.65.736 5.127 2.012 7.243L2 30l6.945-1.977A13.93 13.93 0 0 0 16.002 30C23.723 30 30 23.723 30 16.002 30 8.28 23.723 2 16.002 2zm7.643 19.897c-.318.895-1.577 1.64-2.583 1.857-.687.147-1.584.264-4.596-.985-3.849-1.597-6.326-5.503-6.52-5.759-.187-.255-1.554-2.07-1.554-3.95 0-1.879.986-2.806 1.336-3.187.35-.38.765-.476 1.02-.476.255 0 .51.002.733.013.235.012.55-.09.86.654.318.767 1.085 2.65 1.18 2.842.095.192.158.416.032.671-.127.255-.19.414-.38.638-.19.223-.4.498-.572.67-.19.19-.39.397-.168.78.223.382.99 1.633 2.122 2.643 1.458 1.3 2.688 1.703 3.07 1.895.38.19.605.158.828-.096.223-.255.955-1.115 1.21-1.498.255-.382.51-.318.86-.191.35.127 2.23 1.05 2.612 1.242.38.19.637.286.732.446.096.159.096.924-.222 1.819z'
          })
        )
      ),

      // Artwork Inspection Dialog Modal
      React.createElement(ArtworkDetailModal, {
        product: selectedProduct,
        isOpen: !!selectedProduct,
        onClose: () => setSelectedProduct(null),
        onCommission: handleStartCommission
      }),

      // Inquiries Modal
      React.createElement(InquiryModal, {
        isOpen: inquiryModalOpen,
        onClose: () => setInquiryModalOpen(false),
        initialData: modalPreFill
      }),

      // --- NAVIGATION ---
      React.createElement(
        'nav',
        { className: `fixed top-0 left-0 right-0 z-40 transition-all duration-300 px-4 sm:px-10 py-4 flex items-center justify-between ${navScrolled ? 'bg-[#000000]/95 backdrop-blur-md border-b border-[#C9A84C]/25 shadow-2xl py-3' : 'bg-transparent'}` },
        
        // Brand Logo with Noto Nastaliq Urdu (Pure Ayenah emblem)
        React.createElement(
          'a',
          { href: '#', className: 'flex items-center gap-2.5' },
          React.createElement('span', { className: 'font-[\'Cormorant_Garamond\'] text-2xl sm:text-3xl font-light tracking-[0.25em] shimmer-gold' }, 'AYENAH'),
          React.createElement('span', { className: 'font-nastaliq text-xl text-[#E8D48B] border-l border-[#C9A84C]/40 pl-2.5 opacity-90 leading-none' }, 'آئینہ')
        ),

        // Desktop Links
        React.createElement(
          'div',
          { className: 'hidden md:flex items-center gap-8 text-xs uppercase tracking-widest text-gray-300' },
          React.createElement('a', { href: '#collection', className: 'hover:text-[#E8D48B] transition' }, 'Collection'),
          React.createElement('a', { href: '#studio', className: 'hover:text-[#E8D48B] transition' }, 'Custom Studio'),
          React.createElement('a', { href: '#craft', className: 'hover:text-[#E8D48B] transition' }, 'The Craft'),
          React.createElement('a', { href: '#journey', className: 'hover:text-[#E8D48B] transition' }, 'Process'),
          React.createElement('a', { href: '#contact', className: 'hover:text-[#E8D48B] transition' }, 'Contact')
        ),

        // Action Buttons (Clean luxury button without raw phone number)
        React.createElement(
          'div',
          { className: 'flex items-center gap-3' },
          React.createElement(
            'button',
            {
              onClick: () => handleStartCommission({ designType: 'Signature Commission' }),
              className: 'hidden sm:inline-block btn-luxury-gold !py-2 !px-4 text-[11px]'
            },
            'Book Commission'
          ),
          React.createElement(
            'button',
            {
              onClick: () => setMobileMenuOpen(!mobileMenuOpen),
              className: 'md:hidden p-2 rounded text-gray-300 hover:text-white'
            },
            mobileMenuOpen ? '✕' : '☰'
          )
        )
      ),

      // Mobile Dropdown Menu
      mobileMenuOpen &&
        React.createElement(
          'div',
          { className: 'fixed inset-0 top-[60px] z-30 bg-[#000000] p-6 flex flex-col gap-5 text-sm uppercase tracking-widest md:hidden' },
          React.createElement('a', { href: '#collection', onClick: () => setMobileMenuOpen(false) }, 'Collection'),
          React.createElement('a', { href: '#studio', onClick: () => setMobileMenuOpen(false) }, 'Custom Studio'),
          React.createElement('a', { href: '#craft', onClick: () => setMobileMenuOpen(false) }, 'The Craft'),
          React.createElement('a', { href: '#journey', onClick: () => setMobileMenuOpen(false) }, 'Process'),
          React.createElement('a', { href: '#contact', onClick: () => setMobileMenuOpen(false) }, 'Contact'),
          React.createElement(
            'button',
            {
              onClick: () => { setMobileMenuOpen(false); handleStartCommission({}); },
              className: 'w-full btn-luxury-gold'
            },
            'Commission a Piece'
          )
        ),

      // --- HERO SECTION ---
      React.createElement(
        'header',
        { className: 'relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-4 text-center overflow-hidden' },

        React.createElement(
          'div',
          { className: 'max-w-4xl mx-auto relative z-10 space-y-4' },

          // Clean Geometric Gold Diamond Emblem
          React.createElement(
            'div',
            { className: 'w-10 h-10 mx-auto border border-[#C9A84C]/60 rotate-45 flex items-center justify-center p-1.5 mb-2' },
            React.createElement('div', { className: 'w-full h-full bg-gradient-to-br from-[#E8D48B]/50 to-transparent' })
          ),

          React.createElement('h1', { className: 'text-5xl sm:text-7xl md:text-8xl font-light font-[\'Cormorant_Garamond\'] tracking-[0.25em] shimmer-gold' }, 'AYENAH'),
          
          // Pure elegant Urdu emblem in Noto Nastaliq
          React.createElement(
            'div',
            { className: 'flex items-center justify-center gap-3 my-1' },
            React.createElement('span', { className: 'w-10 h-[1px] bg-gradient-to-r from-transparent to-[#C9A84C]' }),
            React.createElement('span', { className: 'font-nastaliq text-2xl sm:text-3xl text-[#E8D48B]' }, 'آئینہ'),
            React.createElement('span', { className: 'w-10 h-[1px] bg-gradient-to-l from-transparent to-[#C9A84C]' })
          ),
          
          React.createElement('p', { className: 'text-xs sm:text-sm uppercase tracking-[0.38em] text-[#C9A84C] font-semibold' }, 'Handcrafted Luxury Mirror Art'),

          React.createElement(
            'p',
            { className: 'text-xs sm:text-sm text-gray-400 max-w-xl mx-auto font-light leading-relaxed' },
            'Where thousands of hand-cut mirror fragments play with ambient room light, reflecting sacred Arabic calligraphy, meditative mandalas, and poetic natural silhouettes.'
          )
        ),

        // Authentic Styled Concept Hero Photo from Live Site
        React.createElement(
          'div',
          { className: 'max-w-4xl mx-auto my-6 px-2 w-full z-10' },
          React.createElement(
            'figure',
            { className: 'relative rounded-2xl overflow-hidden border border-[#C9A84C]/40 shadow-[0_25px_60px_rgba(0,0,0,0.95)] group' },
            React.createElement(
              'picture',
              null,
              React.createElement('source', {
                media: '(max-width: 740px)',
                type: 'image/webp',
                srcSet: '/assets/hero-mobile-480.webp 480w, /assets/hero-mobile-800.webp 800w',
                sizes: '100vw'
              }),
              React.createElement('source', {
                media: '(max-width: 740px)',
                srcSet: '/assets/Hero-Mobile.png',
                sizes: '100vw'
              }),
              React.createElement('source', {
                type: 'image/webp',
                srcSet: '/assets/hero-desktop-800.webp 800w, /assets/hero-desktop-1344.webp 1344w',
                sizes: '(max-width: 1024px) 95vw, 1100px'
              }),
              React.createElement('img', {
                src: '/assets/Hero-Desktop.png',
                alt: 'Sunburst mirror mosaic above a walnut console in a warm, textured room',
                className: 'w-full h-auto object-cover group-hover:scale-[1.015] transition-transform duration-1000 ease-out',
                fetchPriority: 'high'
              })
            ),
            React.createElement(
              'figcaption',
              { className: 'absolute bottom-3 right-3 sm:bottom-4 sm:right-4 px-3 py-1.5 rounded bg-black/85 backdrop-blur-md border border-[#C9A84C]/30 text-[10px] sm:text-[11px] text-[#E8D48B] tracking-wider uppercase' },
              'Solaris mandala · Styled concept'
            )
          )
        ),

        // Hero CTA Buttons & Artisan Hallmarks
        React.createElement(
          'div',
          { className: 'my-8 space-y-6 relative z-10' },
          React.createElement(
            'div',
            { className: 'flex flex-wrap justify-center gap-4' },
            React.createElement(
              'a',
              { href: '#collection', className: 'btn-luxury-gold' },
              React.createElement('span', null, 'Explore Collection'),
              React.createElement('span', { className: 'text-xs opacity-75' }, '◆')
            ),
            React.createElement(
              'a',
              { href: '#studio', className: 'btn-luxury-outline' },
              React.createElement('span', null, 'Custom Studio & Calculator'),
              React.createElement('span', { className: 'text-xs opacity-75' }, '✧')
            )
          ),
          React.createElement(
            'div',
            { className: 'flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-[11px] sm:text-xs text-gray-400 tracking-wider uppercase' },
            React.createElement('span', { className: 'flex items-center gap-1.5' },
              React.createElement('span', { className: 'text-[#C9A84C]' }, '✦'),
              'Hand-Cut Mirror Facets'
            ),
            React.createElement('span', { className: 'flex items-center gap-1.5' },
              React.createElement('span', { className: 'text-[#C9A84C]' }, '✦'),
              'Bespoke Sizing & Framing'
            ),
            React.createElement('span', { className: 'flex items-center gap-1.5' },
              React.createElement('span', { className: 'text-[#C9A84C]' }, '✦'),
              'Pakistan & Worldwide Courier'
            )
          )
        ),

        // Interactive Landing Page Haute Mirror Carousel
        React.createElement(HeroMirrorCarousel, { onOpenInquiry: handleStartCommission })
      ),

      // --- ART GALLERY / COLLECTION ---
      React.createElement(
        'section',
        { id: 'collection', className: 'py-20 px-4 sm:px-8 max-w-7xl mx-auto' },
        React.createElement(
          'div',
          { className: 'text-center mb-10' },
          React.createElement('span', { className: 'text-xs uppercase tracking-[0.3em] text-[#C9A84C] block mb-2 font-medium' }, 'Signature Works'),
          React.createElement('h2', { className: 'text-3xl sm:text-4xl font-light font-[\'Cormorant_Garamond\'] text-white shimmer-gold' }, 'The Mirror Gallery'),
          React.createElement('div', { className: 'w-24 h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent mx-auto my-3' })
        ),

        React.createElement(
          'div',
          { className: 'flex flex-wrap justify-center gap-2 sm:gap-3 mb-10' },
          [
            { id: 'all', label: 'All Collections' },
            { id: 'calligraphy', label: 'Arabic Calligraphy' },
            { id: 'mandala', label: 'Mirror Mandalas' },
            { id: 'nature', label: 'Nature & Shapes' },
            { id: 'geometric', label: 'Geometric Prism' }
          ].map(cat =>
            React.createElement(
              'button',
              {
                key: cat.id,
                onClick: () => setFilter(cat.id),
                className: `px-4 py-2 text-xs uppercase tracking-wider rounded-full border transition-all ${filter === cat.id ? 'border-[#C9A84C] bg-[#C9A84C]/20 text-[#E8D48B] shadow-md' : 'border-[#2A2A30] text-gray-400 hover:border-gray-500'}`
              },
              cat.label
            )
          )
        ),

        React.createElement(
          'div',
          { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' },
          filteredProducts.map(p =>
            React.createElement(ArtCard, {
              key: p.id,
              product: p,
              onOpenDetails: prod => setSelectedProduct(prod),
              onSelect: prod => setSelectedProduct(prod)
            })
          )
        )
      ),

      // --- CUSTOM COMMISSION STUDIO ---
      React.createElement(CustomCommissionStudio, { onOpenInquiry: handleStartCommission }),

      // --- THE ARTIST & CRAFT (AUTHENTIC ARTISAN PHOTOGRAPHY) ---
      React.createElement(
        'section',
        { id: 'craft', className: 'py-20 px-4 sm:px-8 max-w-5xl mx-auto' },
        React.createElement(
          'div',
          { className: 'p-6 sm:p-10 bg-[#060606] border border-[#202024] rounded-2xl relative shadow-2xl backdrop-blur-md overflow-hidden' },

          React.createElement(
            'div',
            { className: 'grid grid-cols-1 md:grid-cols-12 gap-8 items-center' },
            
            // Authentic Artisan Handcrafting Photography from Live Site
            React.createElement(
              'figure',
              { className: 'md:col-span-5 rounded-xl overflow-hidden border border-[#C9A84C]/40 shadow-2xl relative group aspect-[4/5]' },
              React.createElement(
                'picture',
                null,
                React.createElement('source', {
                  type: 'image/webp',
                  srcSet: '/assets/craft-600.webp 600w, /assets/craft-960.webp 960w',
                  sizes: '(max-width: 740px) 94vw, 42vw'
                }),
                React.createElement('img', {
                  src: '/assets/Craft-Mirror-Mosaic.png',
                  alt: 'Concept image of an artisan placing a mirror facet by hand',
                  className: 'w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out',
                  loading: 'lazy'
                })
              ),
              React.createElement('div', { className: 'absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none' }),
              React.createElement('figcaption', { className: 'absolute bottom-3 left-3 text-[11px] text-[#E8D48B] uppercase tracking-wider bg-black/80 px-2.5 py-1 rounded border border-[#C9A84C]/25' },
                'Artisan Atelier Technique'
              )
            ),

            React.createElement(
              'div',
              { className: 'md:col-span-7 space-y-4' },
              React.createElement('span', { className: 'text-xs uppercase tracking-[0.3em] text-[#C9A84C] font-semibold' }, 'The Craft'),
              React.createElement('h2', { className: 'text-2xl sm:text-3xl font-light font-[\'Cormorant_Garamond\'] text-white' },
                'Shaped by hand. ',
                React.createElement('em', { className: 'italic text-[#E8D48B]' }, 'Revealed by light.')
              ),
              React.createElement('p', { className: 'text-xs sm:text-sm text-gray-300 leading-relaxed' },
                'Each mosaic begins with small pieces of mirror, cut and placed by hand. The angles between the facets give the artwork its texture and change how it looks as you move through the room.'
              ),
              React.createElement('p', { className: 'text-xs sm:text-sm text-gray-400 leading-relaxed' },
                'Our work brings that technique to Arabic calligraphy, mandalas and silhouettes drawn from nature. Unlike flat prints, mirror mosaic creates a dynamic interaction with your room’s ambient light.'
              ),
              React.createElement(
                'div',
                { className: 'pt-2 flex items-center justify-between' },
                React.createElement('a', { href: '#journey', className: 'text-xs text-[#E8D48B] hover:underline flex items-center gap-1.5' },
                  'See the commission process →'
                ),
                React.createElement('span', { className: 'font-nastaliq text-xl text-[#C9A84C]' }, 'آئینہ')
              )
            )
          )
        )
      ),

      // --- 4-STEP PROCESS JOURNEY ---
      React.createElement(
        'section',
        { id: 'journey', className: 'py-16 px-4 sm:px-8 max-w-6xl mx-auto' },
        React.createElement(
          'div',
          { className: 'text-center mb-12' },
          React.createElement('span', { className: 'text-xs uppercase tracking-[0.3em] text-[#C9A84C]' }, 'From Vision To Wall'),
          React.createElement('h2', { className: 'text-3xl font-light font-[\'Cormorant_Garamond\'] text-white mt-1' }, 'The Commission Journey')
        ),
        React.createElement(
          'div',
          { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5' },
          [
            { step: '01', title: 'Consultation', desc: 'Share your preferred motif, verse, size, and interior mood directly over WhatsApp.' },
            { step: '02', title: 'Design Draft', desc: 'We prepare the geometric layout and mosaic draft tailored to your proportions.' },
            { step: '03', title: 'Handcrafting', desc: 'Each mirror shard is hand-broken, smoothed, and carefully adhered with gold lining.' },
            { step: '04', title: 'Protected Delivery', desc: 'Reinforced bubble-cushioned packaging delivered safely nationwide.' }
          ].map((item, i) =>
            React.createElement(
              'div',
              { key: i, className: 'p-6 bg-[#060606] border border-[#1F1F24] rounded-xl hover:border-[#C9A84C]/60 transition' },
              React.createElement('div', { className: 'font-[\'Cormorant_Garamond\'] text-3xl text-[#C9A84C] mb-2' }, item.step),
              React.createElement('h3', { className: 'text-base font-medium text-white mb-1.5' }, item.title),
              React.createElement('p', { className: 'text-xs text-gray-400 leading-relaxed' }, item.desc)
            )
          )
        )
      ),

      // --- CLIENT REVIEWS ---
      React.createElement(
        'section',
        { className: 'py-16 px-4 sm:px-8 max-w-4xl mx-auto text-center' },
        React.createElement('span', { className: 'text-xs uppercase tracking-[0.3em] text-[#C9A84C] block mb-2' }, 'Collector Words'),
        React.createElement(
          'div',
          { className: 'p-8 sm:p-10 bg-[#060606] border border-[#202024] rounded-2xl relative shadow-2xl' },
          React.createElement('div', { className: 'text-3xl text-[#C9A84C] font-serif opacity-40 mb-2' }, '"'),
          React.createElement('p', { className: 'text-sm sm:text-lg font-light font-[\'Cormorant_Garamond\'] text-gray-200 leading-relaxed max-w-xl mx-auto' },
            'Our Ayat-ul-Kursi piece arrived safely in Lahore, and the photos honestly do not do it justice. When evening spotlight hits the mirror calligraphy, the entire formal drawing room sparkles. Pure magic.'
          ),
          React.createElement('div', { className: 'mt-4 text-xs uppercase tracking-widest text-[#E8D48B]' }, '— Fatima & Usman R., DHA Lahore')
        )
      ),

      // --- CONTACT & FOOTER ---
      React.createElement(
        'footer',
        { id: 'contact', className: 'border-t border-[#1C1C20] bg-[#000000] pt-14 pb-12 px-4 sm:px-10' },
        React.createElement(
          'div',
          { className: 'max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10' },
          
          // Column 1: Brand
          React.createElement(
            'div',
            { className: 'space-y-3' },
            React.createElement(
              'div',
              { className: 'flex items-center gap-2' },
              React.createElement('h3', { className: 'font-[\'Cormorant_Garamond\'] text-2xl tracking-widest text-white shimmer-gold' }, 'AYENAH'),
              React.createElement('span', { className: 'font-nastaliq text-lg text-[#E8D48B]' }, 'آئینہ')
            ),
            React.createElement('p', { className: 'text-xs text-gray-400 leading-relaxed' }, 'Handcrafted luxury mirror mosaic artwork. Custom Arabic calligraphy, mandalas, and luxury decorative statements.'),
            React.createElement(
              'div',
              { className: 'pt-1' },
              React.createElement('a', { href: WEBSITE_URL, target: '_blank', rel: 'noopener noreferrer', className: 'text-xs text-[#E8D48B] hover:underline font-mono' }, 'ayenahofficial.com')
            )
          ),

          // Column 2: Navigation
          React.createElement(
            'div',
            null,
            React.createElement('h4', { className: 'text-xs uppercase tracking-wider text-[#C9A84C] mb-3' }, 'Quick Navigation'),
            React.createElement('ul', { className: 'space-y-2 text-xs text-gray-400' },
              React.createElement('li', null, React.createElement('a', { href: '#collection', className: 'hover:text-white' }, 'Mirror Gallery')),
              React.createElement('li', null, React.createElement('a', { href: '#studio', className: 'hover:text-white' }, 'Custom Studio & Calculator')),
              React.createElement('li', null, React.createElement('a', { href: '#craft', className: 'hover:text-white' }, 'The Atelier Story')),
              React.createElement('li', null, React.createElement('a', { href: '#journey', className: 'hover:text-white' }, 'Commission Journey'))
            )
          ),

          // Column 3: Direct Inquiries (NO raw phone numbers exposed)
          React.createElement(
            'div',
            null,
            React.createElement('h4', { className: 'text-xs uppercase tracking-wider text-[#C9A84C] mb-3' }, 'Direct Consultation'),
            React.createElement(
              'div',
              { className: 'space-y-3 text-xs text-gray-300' },
              React.createElement(
                'a',
                {
                  href: `https://wa.me/${WA_NUMBER}?text=${directWhatsAppGreeting}`,
                  target: '_blank',
                  rel: 'noopener noreferrer',
                  className: 'inline-flex items-center gap-2 px-3 py-1.5 rounded bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25 transition'
                },
                React.createElement('span', null, '💬'),
                React.createElement('span', null, 'Chat with Atelier on WhatsApp')
              ),
              React.createElement(
                'div',
                null,
                React.createElement('span', { className: 'text-gray-500 block text-[11px] uppercase' }, 'Instagram:'),
                React.createElement(
                  'a',
                  {
                    href: INSTAGRAM_URL,
                    target: '_blank',
                    rel: 'noopener noreferrer',
                    className: 'text-gray-300 hover:text-[#E8D48B] flex items-center gap-1.5 mt-0.5'
                  },
                  React.createElement('span', null, '📸'),
                  React.createElement('span', null, '@ayenah.official')
                )
              ),
              React.createElement(
                'div',
                null,
                React.createElement('span', { className: 'text-gray-500 block text-[11px] uppercase' }, 'Facebook:'),
                React.createElement(
                  'a',
                  {
                    href: FACEBOOK_URL,
                    target: '_blank',
                    rel: 'noopener noreferrer',
                    className: 'text-gray-300 hover:text-[#E8D48B] flex items-center gap-1.5 mt-0.5'
                  },
                  React.createElement('span', null, '📘'),
                  React.createElement('span', null, 'ayenah.official')
                )
              )
            )
          ),

          // Column 4: VIP Collector Drops
          React.createElement(
            'div',
            null,
            React.createElement('h4', { className: 'text-xs uppercase tracking-wider text-[#C9A84C] mb-3' }, 'VIP Collector Drops'),
            React.createElement('p', { className: 'text-xs text-gray-400 mb-3' }, 'Subscribe to receive private previews of limited edition handcrafted releases.'),
            React.createElement(
              'form',
              {
                onSubmit: (e) => {
                  e.preventDefault();
                  alert('Thank you! You are now subscribed to the Ayenah VIP Collector Circle.');
                },
                className: 'flex gap-1.5'
              },
              React.createElement('input', {
                type: 'email',
                required: true,
                placeholder: 'Your email address',
                className: 'bg-[#050505] border border-[#202024] focus:border-[#C9A84C] rounded p-2 text-xs text-white outline-none flex-1'
              }),
              React.createElement('button', { type: 'submit', className: 'btn-luxury-sm' }, 'Join')
            )
          )
        ),

        React.createElement(
          'div',
          { className: 'border-t border-[#1C1C22] pt-6 text-center text-xs text-gray-600 flex flex-col sm:flex-row justify-between items-center gap-3' },
          React.createElement('div', null, '© 2026 Ayenah Official · All Rights Reserved · ayenahofficial.com'),
          React.createElement('div', { className: 'text-[#C9A84C] tracking-wider' }, 'Where Every Fragment Reflects Beauty')
        )
      )
    );
  }

  // Mount React App and Start Cursor Engine
  window.addEventListener('DOMContentLoaded', () => {
    setupCursorMirrorEngine();
    const rootEl = document.getElementById('root');
    if (rootEl && ReactDOM) {
      const root = ReactDOM.createRoot(rootEl);
      root.render(React.createElement(App));
    }
  });
})();
