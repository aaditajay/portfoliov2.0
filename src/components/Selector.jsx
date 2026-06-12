import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import './Selector.css';

// ── Spiral Background ──────────────────────────────────────────────────────────

class Vector2D {
  constructor(x, y) { this.x = x; this.y = y; }
  static random(min, max) { return min + Math.random() * (max - min); }
}
class Vector3D {
  constructor(x, y, z) { this.x = x; this.y = y; this.z = z; }
}

class Star {
  constructor(cameraZ, cameraTravelDistance) {
    this.angle = Math.random() * Math.PI * 2;
    this.distance = 30 * Math.random() + 15;
    this.rotationDirection = Math.random() > 0.5 ? 1 : -1;
    this.expansionRate = 1.2 + Math.random() * 0.8;
    this.finalScale = 0.7 + Math.random() * 0.6;
    this.dx = this.distance * Math.cos(this.angle);
    this.dy = this.distance * Math.sin(this.angle);
    this.spiralLocation = (1 - Math.pow(1 - Math.random(), 3.0)) / 1.3;
    this.z = Vector2D.random(0.5 * cameraZ, cameraTravelDistance + cameraZ);
    const lerp = (s, e, t) => s * (1 - t) + e * t;
    this.z = lerp(this.z, cameraTravelDistance / 2, 0.3 * this.spiralLocation);
    this.strokeWeightFactor = Math.pow(Math.random(), 2.0);
  }

  render(p, ctrl) {
    const spiralPos = ctrl.spiralPath(this.spiralLocation);
    const q = p - this.spiralLocation;
    if (q <= 0) return;

    const dp = ctrl.constrain(4 * q, 0, 1);
    const linear = dp, elastic = ctrl.easeOutElastic(dp), power = Math.pow(dp, 2);
    let easing;
    if (dp < 0.3) easing = ctrl.lerp(linear, power, dp / 0.3);
    else if (dp < 0.7) easing = ctrl.lerp(power, elastic, (dp - 0.3) / 0.4);
    else easing = elastic;

    let screenX, screenY;
    if (dp < 0.3) {
      screenX = ctrl.lerp(spiralPos.x, spiralPos.x + this.dx * 0.3, easing / 0.3);
      screenY = ctrl.lerp(spiralPos.y, spiralPos.y + this.dy * 0.3, easing / 0.3);
    } else if (dp < 0.7) {
      const mp = (dp - 0.3) / 0.4;
      const cs = Math.sin(mp * Math.PI) * this.rotationDirection * 1.5;
      const bx = spiralPos.x + this.dx * 0.3, by = spiralPos.y + this.dy * 0.3;
      const tx = spiralPos.x + this.dx * 0.7, ty = spiralPos.y + this.dy * 0.7;
      screenX = ctrl.lerp(bx, tx, mp) + (-this.dy * 0.4 * cs) * mp;
      screenY = ctrl.lerp(by, ty, mp) + (this.dx * 0.4 * cs) * mp;
    } else {
      const fp = (dp - 0.7) / 0.3;
      const bx = spiralPos.x + this.dx * 0.7, by = spiralPos.y + this.dy * 0.7;
      const td = this.distance * this.expansionRate * 1.5;
      const sa = this.angle + 1.2 * this.rotationDirection * fp * Math.PI;
      screenX = ctrl.lerp(bx, spiralPos.x + td * Math.cos(sa), fp);
      screenY = ctrl.lerp(by, spiralPos.y + td * Math.sin(sa), fp);
    }

    const cameraZ = -400;
    const viewZoom = 100;
    const vx = (this.z - cameraZ) * screenX / viewZoom;
    const vy = (this.z - cameraZ) * screenY / viewZoom;

    let sm = dp < 0.6 ? 1.0 + dp * 0.2 : ctrl.lerp(1.2, this.finalScale, (dp - 0.6) / 0.4);
    ctrl.showProjectedDot(new Vector3D(vx, vy, this.z), 8.5 * this.strokeWeightFactor * sm);
  }
}

class SpiralController {
  constructor(canvas, ctx, size) {
    this.canvas = canvas; this.ctx = ctx; this.size = size;
    this.time = 0;
    this.cameraZ = -400; this.cameraTravelDistance = 3400;
    this.startDotYOffset = 28; this.viewZoom = 100;
    this.trailLength = 80; this.changeEventTime = 0.32;
    this.stars = [];

    const orig = Math.random;
    let seed = 1234;
    Math.random = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    for (let i = 0; i < 5000; i++) this.stars.push(new Star(this.cameraZ, this.cameraTravelDistance));
    Math.random = orig;

    this.tl = gsap.timeline({ repeat: -1 });
    this.tl.to(this, { time: 1, duration: 15, ease: 'none', onUpdate: () => this.render() });
  }

  ease(p, g) { return p < 0.5 ? 0.5 * Math.pow(2 * p, g) : 1 - 0.5 * Math.pow(2 * (1 - p), g); }
  easeOutElastic(x) {
    if (x <= 0) return 0; if (x >= 1) return 1;
    return Math.pow(2, -8 * x) * Math.sin((x * 8 - 0.75) * (2 * Math.PI) / 4.5) + 1;
  }
  map(v, s1, e1, s2, e2) { return s2 + (e2 - s2) * ((v - s1) / (e1 - s1)); }
  constrain(v, mn, mx) { return Math.min(Math.max(v, mn), mx); }
  lerp(s, e, t) { return s * (1 - t) + e * t; }

  spiralPath(p) {
    p = this.constrain(1.2 * p, 0, 1);
    p = this.ease(p, 1.8);
    const theta = 2 * Math.PI * 6 * Math.sqrt(p);
    const r = 170 * Math.sqrt(p);
    return new Vector2D(r * Math.cos(theta), r * Math.sin(theta) + this.startDotYOffset);
  }

  showProjectedDot(pos, sizeFactor) {
    const t2 = this.constrain(this.map(this.time, this.changeEventTime, 1, 0, 1), 0, 1);
    const newCameraZ = this.cameraZ + this.ease(Math.pow(t2, 1.2), 1.8) * this.cameraTravelDistance;
    if (pos.z > newCameraZ) {
      const depth = pos.z - newCameraZ;
      const x = this.viewZoom * pos.x / depth;
      const y = this.viewZoom * pos.y / depth;
      const sw = 400 * sizeFactor / depth;
      this.ctx.lineWidth = sw;
      this.ctx.beginPath();
      this.ctx.arc(x, y, 0.5, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  render() {
    const { ctx, size, time, changeEventTime } = this;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, size, size);
    ctx.save();
    ctx.translate(size / 2, size / 2);

    const t1 = this.constrain(this.map(time, 0, changeEventTime + 0.25, 0, 1), 0, 1);
    const t2 = this.constrain(this.map(time, changeEventTime, 1, 0, 1), 0, 1);
    ctx.rotate(-Math.PI * this.ease(t2, 2.7));

    // Trail
    for (let i = 0; i < this.trailLength; i++) {
      const f = this.map(i, 0, this.trailLength, 1.1, 0.1);
      const sw = (1.3 * (1 - t1) + 3.0 * Math.sin(Math.PI * t1)) * f;
      ctx.fillStyle = 'white';
      ctx.lineWidth = sw;
      const pathTime = t1 - 0.00015 * i;
      const pos = this.spiralPath(pathTime);
      const off = new Vector2D(pos.x + 5, pos.y + 5);
      const mid = new Vector2D((pos.x + off.x) / 2, (pos.y + off.y) / 2);
      const dx = pos.x - mid.x, dy = pos.y - mid.y;
      const ang = Math.atan2(dy, dx);
      const o = i % 2 === 0 ? -1 : 1;
      const r = Math.sqrt(dx * dx + dy * dy);
      const bounce = Math.sin(pathTime * Math.PI) * 0.05 * (1 - pathTime);
      const rx = mid.x + r * (1 + bounce) * Math.cos(ang + o * Math.PI * this.easeOutElastic(pathTime));
      const ry = mid.y + r * (1 + bounce) * Math.sin(ang + o * Math.PI * this.easeOutElastic(pathTime));
      ctx.beginPath(); ctx.arc(rx, ry, sw / 2, 0, Math.PI * 2); ctx.fill();
    }

    // Stars
    ctx.fillStyle = 'white';
    for (const star of this.stars) star.render(t1, this);

    // Start dot
    if (time > changeEventTime) {
      const dy = this.cameraZ * this.startDotYOffset / this.viewZoom;
      this.showProjectedDot(new Vector3D(0, dy, this.cameraTravelDistance), 2.5);
    }
    ctx.restore();
  }

  destroy() { this.tl.kill(); }
}

function SpiralBackground() {
  const canvasRef = useRef(null);
  const ctrlRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth, h = window.innerHeight;
    const size = Math.max(w, h);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.scale(dpr, dpr);
    ctrlRef.current = new SpiralController(canvas, ctx, size);
    return () => { ctrlRef.current?.destroy(); ctrlRef.current = null; };
  }, []);

  return <canvas ref={canvasRef} className="spiral-canvas" />;
}

// ── Liquid Glass Button ────────────────────────────────────────────────────────

function GlassFilter() {
  return (
    <svg className="glass-filter-svg">
      <defs>
        <filter id="liquid-glass" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.05 0.05" numOctaves="1" seed="1" result="turbulence" />
          <feGaussianBlur in="turbulence" stdDeviation="2" result="blurredNoise" />
          <feDisplacementMap in="SourceGraphic" in2="blurredNoise" scale="70" xChannelSelector="R" yChannelSelector="B" result="displaced" />
          <feGaussianBlur in="displaced" stdDeviation="4" result="finalBlur" />
          <feComposite in="finalBlur" in2="finalBlur" operator="over" />
        </filter>
      </defs>
    </svg>
  );
}

function LiquidGlassButton({ children, onClick, disabled }) {
  return (
    <button className={`liquid-btn${disabled ? ' liquid-btn--disabled' : ''}`} onClick={disabled ? undefined : onClick}>
      {/* Glass shadow shell */}
      <div className="liquid-btn__shell" />
      {/* Backdrop distortion layer */}
      <div className="liquid-btn__backdrop" style={{ backdropFilter: 'url("#liquid-glass")' }} />
      {/* Content */}
      <div className="liquid-btn__content">{children}</div>
    </button>
  );
}

// ── Selector ──────────────────────────────────────────────────────────────────

const INTERFACES = [
  {
    id: 'terminal',
    label: 'Terminal',
    labelClass: 'label--terminal',
    src: '/interface/logos/terminal.svg',
    alt: 'Terminal Interface',
    locked: false,
  },
  {
    id: 'macos',
    label: 'MacOS',
    labelClass: 'label--macos',
    src: '/interface/logos/apple.svg',
    alt: 'macOS Interface',
    locked: false,
  },
  {
    id: 'studio',
    label: 'Studio',
    labelClass: 'label--studio',
    src: '/interface/logos/studio.svg',
    alt: 'Studio Interface',
    locked: true,
  },
];

export default function Selector({ onSelectInterface }) {
  return (
    <div className="selector-root">
      <SpiralBackground />
      <GlassFilter />

      <div className="selector-ui">
        <motion.h1
          className="selector-heading"
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
        >
          Choose Your Interface
        </motion.h1>

        <motion.div
          className="selector-cards"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
        >
          {INTERFACES.map((iface) => (
            <div key={iface.id} className="selector-card">
              <LiquidGlassButton
                onClick={() => onSelectInterface(iface.id)}
                disabled={iface.locked}
              >
                <img src={iface.src} alt={iface.alt} className="interface-logo" />
                {iface.locked && <span className="lock-badge">Soon</span>}
              </LiquidGlassButton>
              <span className={`interface-label ${iface.labelClass}`}>
                {iface.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}