'use client';

import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  type CSSProperties,
  type ReactNode,
  type MouseEvent
} from 'react';
import Link from 'next/link';

export interface SpecularPillProps {
  children?: ReactNode;
  label?: string;
  href?: string;
  isSocial?: boolean;
  rotation?: number;
  lineColor?: string;
  hoverBg?: string;
  hoverColor?: string;
  pillBg?: string;
  pillColor?: string;
  pillBorder?: string;
  ariaLabel?: string;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  labelRef?: (el: HTMLSpanElement | null) => void;
}

const VERTEX = `#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const FRAGMENT = `#version 300 es
precision highp float;
uniform vec2 uCenter;
uniform vec2 uHalf;
uniform float uRadius;
uniform float uPx;
uniform float uSpot;
uniform vec2 uEntry;
uniform vec3 uLineColor;
uniform vec3 uBaseColor;
uniform float uIntensity;
uniform vec2 uWindow;
uniform float uThickness;
uniform float uGlow;
out vec4 outColor;

float roundedBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

float loopPosition(vec2 p, vec2 b, float r) {
  vec2 inner = max(b - r, vec2(0.0));
  float arc = 1.5707963 * r;
  float quarter = inner.x + inner.y + arc;
  vec2 a = abs(p);
  vec2 q = a - inner;
  float s = (q.x > 0.0 && q.y > 0.0)
    ? inner.y + atan(max(q.y, 0.0001), max(q.x, 0.0001)) * r
    : (q.x > q.y ? min(a.y, inner.y) : inner.y + arc + inner.x - min(a.x, inner.x));
  if (p.x < 0.0) s = p.y >= 0.0 ? 2.0 * quarter - s : 2.0 * quarter + s;
  else if (p.y < 0.0) s = 4.0 * quarter - s;
  return s / max(4.0 * quarter, 0.0001);
}

float lobe(float position, float center) {
  float gap = abs(fract(position - center + 0.5) - 0.5);
  return 1.0 - smoothstep(uWindow.x, uWindow.x + uWindow.y, gap);
}

void main() {
  vec2 p = gl_FragCoord.xy - uCenter;
  float d = roundedBox(p, uHalf, uRadius);
  float position = loopPosition(p, uHalf, uRadius);
  float key = lobe(position, uSpot);
  float back = lobe(position, uSpot + 0.5);
  float streak = key + back * 0.45;
  float width = max(uThickness * uPx * mix(1.0, max(key, back), 0.6), 0.35);
  float band = smoothstep(-width - 0.8, -width + 0.8, d) * (1.0 - smoothstep(-0.8, 0.8, d));
  float hair = smoothstep(-uPx - 0.8, -uPx + 0.8, d) * (1.0 - smoothstep(-0.8, 0.8, d));
  float inside = 1.0 - smoothstep(-0.8, 0.8, d);
  vec2 pool = (p - uEntry) / max(uHalf.y * vec2(1.6, 1.1), vec2(1.0));
  float glow = streak * 0.25 * exp(-abs(d + width * 0.5) / (5.0 * uPx)) + inside * 0.08 * exp(-dot(pool, pool));
  float light = clamp((band * streak + glow * uGlow) * uIntensity, 0.0, 1.0);
  vec4 base = vec4(uBaseColor, 1.0) * hair * 0.5;
  outColor = vec4(uLineColor, 1.0) * light + base * (1.0 - light);
}`;

const UNIFORMS = [
  'uCenter',
  'uHalf',
  'uRadius',
  'uPx',
  'uSpot',
  'uEntry',
  'uLineColor',
  'uBaseColor',
  'uIntensity',
  'uWindow',
  'uThickness',
  'uGlow'
];

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const wrap = (value: number) => value - Math.floor(value);

const compile = (gl: WebGL2RenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  gl.deleteShader(shader);
  return null;
};

const link = (gl: WebGL2RenderingContext) => {
  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
  const program = gl.createProgram();
  if (!vertex || !fragment || !program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.bindAttribLocation(program, 0, 'aPosition');
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (gl.getProgramParameter(program, gl.LINK_STATUS)) return program;
  gl.deleteProgram(program);
  return null;
};

export const SpecularPill = forwardRef<HTMLElement, SpecularPillProps>(function SpecularPill(
  {
    label = 'Menu Item',
    href,
    isSocial = false,
    rotation = 0,
    lineColor = '#4285F4',
    hoverBg = '#4285F4',
    hoverColor = '#ffffff',
    pillBg = '#ffffff',
    pillColor = '#202124',
    pillBorder = 'rgba(0, 0, 0, 0.08)',
    ariaLabel,
    onClick,
    labelRef
  },
  forwardedRef
) {
  const rootRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [webglSupported, setWebglSupported] = useState(false);
  const [angle, setAngle] = useState(0);
  const [isNear, setIsNear] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleRootRef = (el: HTMLElement | null) => {
    (rootRef as React.MutableRefObject<HTMLElement | null>).current = el;
    if (typeof forwardedRef === 'function') {
      forwardedRef(el);
    } else if (forwardedRef) {
      (forwardedRef as React.MutableRefObject<HTMLElement | null>).current = el;
    }
  };

  // Interactive mouse tracking & idle continuous specular orbit
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let rafId = 0;
    let currentAngle = 0;
    let targetAngle = 0;
    let isTracking = false;
    let lastTime = performance.now();

    const onPointerMove = (e: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      if (!rect || rect.width <= 10) return;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const dist = Math.hypot(dx, dy);

      // Proximity range for specular spotlight
      if (dist < 340) {
        // Adjust for button rotation
        const rad = (-rotation * Math.PI) / 180;
        const rx = dx * Math.cos(rad) - dy * Math.sin(rad);
        const ry = dx * Math.sin(rad) + dy * Math.cos(rad);

        // Angle in degrees from top (0 to 360)
        let deg = (Math.atan2(ry, rx) * 180) / Math.PI + 90;
        if (deg < 0) deg += 360;
        targetAngle = deg;
        isTracking = true;
        setIsNear(true);

        const relX = clamp(((e.clientX - rect.left) / rect.width) * 100, 0, 100);
        const relY = clamp(((e.clientY - rect.top) / rect.height) * 100, 0, 100);
        setMousePos({ x: relX, y: relY });
      } else {
        isTracking = false;
        setIsNear(false);
      }
    };

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      if (isTracking) {
        // Smoothly interpolate towards mouse position
        let diff = targetAngle - currentAngle;
        while (diff > 180) diff -= 360;
        while (diff < -180) diff += 360;
        currentAngle += diff * Math.min(dt * 12, 1);
        if (currentAngle < 0) currentAngle += 360;
        if (currentAngle >= 360) currentAngle -= 360;
      } else {
        // Idle continuous gentle rotation around perimeter (~0.3 revs/sec)
        currentAngle = (currentAngle + 75 * dt) % 360;
      }

      setAngle(currentAngle);
      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      cancelAnimationFrame(rafId);
    };
  }, [rotation]);

  // Optional WebGL2 Specular rim renderer
  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    let gl: WebGL2RenderingContext | null = null;
    try {
      gl = canvas.getContext('webgl2', {
        alpha: true,
        antialias: false,
        depth: false,
        stencil: false
      });
    } catch {
      gl = null;
    }

    if (!gl) return;
    const program = link(gl);
    if (!program) return;

    setWebglSupported(true);

    const uniforms: Record<string, WebGLUniformLocation | null> = {};
    for (const name of UNIFORMS) uniforms[name] = gl.getUniformLocation(program, name);

    const buffer = gl.createBuffer();
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);

    // Convert hex color to rgb array
    const hexToRgb = (hex: string): [number, number, number] => {
      const clean = hex.replace('#', '');
      if (clean.length === 6) {
        return [
          parseInt(clean.substring(0, 2), 16) / 255,
          parseInt(clean.substring(2, 4), 16) / 255,
          parseInt(clean.substring(4, 6), 16) / 255
        ];
      }
      return [0.26, 0.52, 0.96]; // fallback Google Blue
    };

    const rgbColor = hexToRgb(lineColor);

    let raf = 0;
    const render = () => {
      if (!canvas || !gl || !program) return;
      const rect = root.getBoundingClientRect();
      if (rect.width < 10 || rect.height < 10) {
        raf = requestAnimationFrame(render);
        return;
      }

      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(rect.width * ratio);
      const h = Math.round(rect.height * ratio);

      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }

      gl.viewport(0, 0, w, h);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);
      gl.uniform2f(uniforms.uCenter, w / 2, h / 2);
      gl.uniform2f(uniforms.uHalf, w / 2, h / 2);
      gl.uniform1f(uniforms.uRadius, h / 2);
      gl.uniform1f(uniforms.uPx, ratio);
      gl.uniform1f(uniforms.uSpot, angle / 360);
      gl.uniform2f(uniforms.uEntry, 0, 0);
      gl.uniform3fv(uniforms.uLineColor, rgbColor);
      gl.uniform3fv(uniforms.uBaseColor, [0.5, 0.5, 0.5]);
      gl.uniform1f(uniforms.uIntensity, isNear ? 1.4 : 0.85);
      gl.uniform2f(uniforms.uWindow, 0.08, 0.12);
      gl.uniform1f(uniforms.uThickness, 2.0);
      gl.uniform1f(uniforms.uGlow, 1.2);

      gl.bindVertexArray(vao);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.bindVertexArray(null);

      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      if (gl) {
        gl.deleteBuffer(buffer);
        gl.deleteVertexArray(vao);
        gl.deleteProgram(program);
      }
    };
  }, [lineColor, angle, isNear]);

  const pillStyle: CSSProperties = {
    ['--item-rot' as any]: `${rotation}deg`,
    ['--hover-bg' as any]: hoverBg,
    ['--hover-color' as any]: hoverColor,
    background: pillBg,
    color: pillColor,
    border: `1px solid ${pillBorder}`,
    minHeight: '110px',
    padding: 'clamp(1.5rem, 2.5vw, 3.5rem) 0',
    fontSize: 'clamp(1.75rem, 3.5vw, 3.25rem)',
    willChange: 'transform'
  };

  const pillClass =
    'pill-link w-full rounded-[999px] no-underline shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex items-center justify-center relative transition-[background,color,border-color,transform] duration-300 ease-out box-border whitespace-nowrap overflow-hidden font-heading font-bold cursor-pointer select-none';

  const innerContent = (
    <>
      {/* Specular Ray Border Highlight (Pure Hardware CSS Conic Gradient) */}
      <div
        className="specular-ray pointer-events-none absolute inset-0 rounded-[999px] z-[1]"
        style={{
          padding: '2px',
          background: `conic-gradient(from ${angle}deg at 50% 50%, transparent 0deg, ${lineColor}60 30deg, #ffffff 45deg, ${lineColor} 60deg, transparent 95deg)`,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          opacity: isNear ? 1 : 0.75,
          transition: 'opacity 0.25s ease-out'
        }}
        aria-hidden="true"
      />

      {/* Interactive Cursor Light Pool on Pill Face */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[999px] z-[1] transition-opacity duration-300"
        style={{
          background: `radial-gradient(160px circle at ${mousePos.x}% ${mousePos.y}%, ${lineColor}26, transparent 70%)`,
          opacity: isNear ? 1 : 0
        }}
        aria-hidden="true"
      />

      {/* WebGL Specular Core Canvas (active when WebGL available, transparent backdrop) */}
      {webglSupported && (
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-0 w-full h-full rounded-[999px] z-[1]"
          style={{ mixBlendMode: 'screen', opacity: isNear ? 0.9 : 0.6 }}
          aria-hidden="true"
        />
      )}

      {/* GDG Pill Text Label */}
      <span
        ref={labelRef}
        className="pill-label inline-block relative z-[2]"
        style={{
          willChange: 'transform, opacity',
          height: '1.2em',
          lineHeight: 1.2
        }}
      >
        {label}
      </span>
    </>
  );

  if (href && !isSocial) {
    return (
      <Link
        ref={handleRootRef as any}
        role="menuitem"
        href={href}
        aria-label={ariaLabel || label}
        onClick={onClick}
        className={pillClass}
        style={pillStyle}
      >
        {innerContent}
      </Link>
    );
  }

  return (
    <button
      ref={handleRootRef as any}
      type="button"
      role="menuitem"
      aria-label={ariaLabel || label}
      onClick={onClick}
      className={pillClass}
      style={pillStyle}
    >
      {innerContent}
    </button>
  );
});

export default SpecularPill;
