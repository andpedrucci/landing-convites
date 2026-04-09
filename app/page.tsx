'use client';

import { useEffect, useRef, useState } from 'react';

// ============================================================
// CARROSSEL — adicione quantas imagens quiser
// Você já tem essas imagens em /public/templates/
// ============================================================
const CAROUSEL_IMAGES = [
  '/templates/aniversario/INV-ANI-M-01.png',
  '/templates/aniversario/INV-ANI-M-03.png',
  '/templates/aniversario/INV-ANI-M-07.png',
  '/templates/aniversario/INV-ANI-M-08.png',
  '/templates/aniversario/INV-ANI-M-09.png',
  '/templates/batizado/INV-BAT-M-01.png',
  '/templates/revelacao/INV-REV-M-01.png',
  '/templates/cha-bebe/INV-CHA-M-01.png',
];

// ============================================================
// FOTO DA SELINA — salve em /public/selina-original.jpg e /public/selina-ia.jpg
// ============================================================
const FOTO_ORIGINAL = '/selina-original.jpg';
const FOTO_IA = '/selina-ia.jpg';

type AnimState = 'idle' | 'dragging' | 'fadeout' | 'loading' | 'particles' | 'result';

export default function HomeInstitucional() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);
  const [animState, setAnimState] = useState<AnimState>('idle');
  const [labelText, setLabelText] = useState('foto original');
  const [showReplay, setShowReplay] = useState(false);
  const hasRun = useRef(false);

  // ── PARTÍCULAS ──────────────────────────────────────────
  function createParticles(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d')!;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const colors = ['#D4A574', '#E8DCC8', '#ffffff', '#F9E8EA', '#C09464'];
    const particles = Array.from({ length: 120 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 3.5;
      return {
        x: cx, y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1.5 + Math.random() * 3,
        alpha: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        decay: 0.015 + Math.random() * 0.02,
      };
    });

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      particles.forEach(p => {
        if (p.alpha <= 0) return;
        alive = true;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.06;
        p.alpha -= p.decay;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(p.alpha * 255).toString(16).padStart(2, '0');
        ctx.fill();
      });
      if (alive) animFrameRef.current = requestAnimationFrame(draw);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    animFrameRef.current = requestAnimationFrame(draw);
  }

  // ── ANIMAÇÃO PRINCIPAL ───────────────────────────────────
  function runAnimation() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    cancelAnimationFrame(animFrameRef.current);
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const stage = stageRef.current;
    if (stage) {
      canvas.width = stage.offsetWidth;
      canvas.height = stage.offsetHeight;
    }

    setAnimState('idle');
    setLabelText('foto original');
    setShowReplay(false);

    setTimeout(() => { setAnimState('dragging'); setLabelText('foto original'); }, 400);
    setTimeout(() => { setAnimState('fadeout'); setLabelText(''); }, 1800);
    setTimeout(() => { setAnimState('loading'); setLabelText('gerando IA...'); }, 2400);
    setTimeout(() => {
      setAnimState('particles');
      setLabelText('');
      if (canvas) createParticles(canvas);
    }, 4200);
    setTimeout(() => {
      setAnimState('result');
      setLabelText('ensaio com IA ✨');
      setShowReplay(true);
    }, 4800);
  }

  // ── INTERSECTION OBSERVER ────────────────────────────────
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && !hasRun.current) {
          hasRun.current = true;
          setTimeout(runAnimation, 800);
        }
      });
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function handleReplay(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    hasRun.current = false;
    runAnimation();
    hasRun.current = true;
  }

  // ── ESTILOS DINÂMICOS DA ANIMAÇÃO ────────────────────────
  const originalStyle: React.CSSProperties = {
    position: 'absolute', inset: 0,
    borderRadius: '12px', overflow: 'hidden',
    transition: 'all 0.5s ease',
    ...(animState === 'idle' && { opacity: 0, transform: 'translateY(30px)' }),
    ...(animState === 'dragging' && { opacity: 1, transform: 'translateY(0)' }),
    ...(animState === 'fadeout' && { opacity: 0, transform: 'scale(0.9)' }),
    ...(['loading', 'particles', 'result'].includes(animState) && { opacity: 0 }),
  };

  const resultStyle: React.CSSProperties = {
    position: 'absolute', inset: 0,
    borderRadius: '12px', overflow: 'hidden',
    transition: 'opacity 0.8s ease, transform 0.8s ease',
    opacity: animState === 'result' ? 1 : 0,
    transform: animState === 'result' ? 'scale(1)' : 'scale(0.95)',
  };

  const loaderStyle: React.CSSProperties = {
    position: 'absolute', inset: 0,
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', gap: '6px',
    transition: 'opacity 0.3s',
    opacity: animState === 'loading' ? 1 : 0,
    pointerEvents: 'none',
  };

  const canvasStyle: React.CSSProperties = {
    position: 'absolute', inset: 0,
    pointerEvents: 'none',
    opacity: animState === 'particles' ? 1 : 0,
    transition: 'opacity 0.1s',
  };

  return (
    <main style={{ fontFamily: "'Raleway', sans-serif", background: '#FAF8F5', minHeight: '100svh', maxWidth: '430px', margin: '0 auto', overflowX: 'hidden' }}>

      {/* ── HERO ── */}
      <section style={{ minHeight: '100svh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>

        {/* blobs decorativos */}
        <div style={{ position: 'absolute', top: '-60px', right: '-80px', width: '280px', height: '280px', background: '#E8B4BC', opacity: 0.22, borderRadius: '50%', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: '-40px', left: '-60px', width: '220px', height: '220px', background: '#D4A574', opacity: 0.18, borderRadius: '50%', filter: 'blur(70px)' }} />

        {/* badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(8px)', border: '1px solid rgba(212,165,116,0.3)', borderRadius: '100px', padding: '6px 16px', fontSize: '11px', fontWeight: 500, color: '#8B7355', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
          ✦ Studio Invitare
        </div>

        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.8rem', lineHeight: 1.1, color: '#5C4A3F', marginBottom: '0.75rem' }}>
          Momentos que<br />
          <em style={{ color: '#D4A574', fontStyle: 'italic', fontWeight: 400 }}>ficam para sempre</em>
        </h1>

        <p style={{ fontSize: '0.95rem', color: '#8B7355', fontWeight: 300, lineHeight: 1.7, maxWidth: '300px', margin: '0 auto 2.5rem' }}>
          Escolha sua linha de produto e crie algo inesquecível para quem você ama.
        </p>

        {/* ── CARDS ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', position: 'relative', zIndex: 2 }}>

          {/* CARD CONVITES */}
          <a href="https://convites.studioinvitare.com.br" style={{ borderRadius: '20px', overflow: 'hidden', textDecoration: 'none', display: 'block', background: 'white', border: '1px solid #E8DCC8' }}>

            {/* carrossel automático */}
            <div style={{ width: '100%', height: '160px', overflow: 'hidden', position: 'relative' }}>
              <div style={{
                display: 'flex', gap: '10px', padding: '10px 16px', height: '160px', alignItems: 'center',
                animation: 'scrollLeft 22s linear infinite',
                width: 'max-content',
              }}>
                {/* duplicado duas vezes para loop infinito */}
                {[...CAROUSEL_IMAGES, ...CAROUSEL_IMAGES].map((src, i) => (
                  <div key={i} style={{ flexShrink: 0, width: '100px', height: '140px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}>
                    <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: '1.1rem 1.25rem 1.25rem' }}>
              <span style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8B7355', opacity: 0.6 }}>Linha 01</span>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 600, color: '#5C4A3F', margin: '4px 0' }}>Convites Digitais</p>
              <p style={{ fontSize: '0.8rem', fontWeight: 300, color: '#8B7355', lineHeight: 1.5, marginBottom: '10px' }}>Prontos ou personalizados do zero para a festa do seu filho</p>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#D4A574', color: 'white', padding: '8px 18px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 500 }}>
                Ver convites →
              </span>
            </div>
          </a>

          {/* CARD ENSAIO */}
          <a href="https://ensaios.studioinvitare.com.br" style={{ borderRadius: '20px', overflow: 'hidden', textDecoration: 'none', display: 'block', background: 'linear-gradient(135deg, #D4A574, #C09464)' }}>

            {/* animação IA */}
            <div style={{ width: '100%', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', background: 'rgba(0,0,0,0.08)' }}
              ref={stageRef}>

              <canvas ref={canvasRef} style={canvasStyle} />

              <div style={{ position: 'relative', width: '110px', height: '140px' }}>

                {/* FOTO ORIGINAL */}
                <div style={originalStyle}>
                  <img src={FOTO_ORIGINAL} alt="Foto original" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                  {/* fallback se imagem não existir ainda */}
                  <div style={{ width: '100%', height: '100%', background: '#E8DCC8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '4px' }}>
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <circle cx="16" cy="12" r="6" fill="rgba(212,165,116,0.5)" />
                      <path d="M4 28c0-6.6 5.4-12 12-12s12 5.4 12 12" fill="rgba(212,165,116,0.3)" />
                    </svg>
                    <span style={{ fontSize: '8px', color: '#8B7355', opacity: 0.6 }}>foto real</span>
                  </div>
                </div>

                {/* FOTO IA */}
                <div style={resultStyle}>
                  <img src={FOTO_IA} alt="Ensaio com IA" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                  <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#2d1a0e,#4a2c1a)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '4px' }}>
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <circle cx="16" cy="12" r="6" fill="rgba(255,255,255,0.4)" />
                      <path d="M4 28c0-6.6 5.4-12 12-12s12 5.4 12 12" fill="rgba(255,255,255,0.2)" />
                    </svg>
                    <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.8)' }}>ensaio IA</span>
                  </div>
                </div>

                {/* LOADER */}
                <div style={loaderStyle}>
                  <div style={{ width: '36px', height: '36px', border: '2px solid rgba(255,255,255,0.2)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.8)', letterSpacing: '0.1em' }}>gerando IA...</span>
                </div>

              </div>

              {/* label */}
              {labelText && (
                <span style={{ position: 'absolute', bottom: '8px', left: '50%', transform: 'translateX(-50%)', fontSize: '9px', color: 'rgba(255,255,255,0.75)', whiteSpace: 'nowrap', letterSpacing: '0.08em' }}>
                  {labelText}
                </span>
              )}

              {/* replay */}
              {showReplay && (
                <button onClick={handleReplay} style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '100px', padding: '4px 10px', fontSize: '9px', color: 'white', cursor: 'pointer', fontFamily: "'Raleway', sans-serif" }}>
                  ↺ repetir
                </button>
              )}
            </div>

            <div style={{ padding: '1.1rem 1.25rem 1.25rem' }}>
              <span style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>Linha 02 · Novo</span>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 600, color: 'white', margin: '4px 0' }}>Ensaios com IA</p>
              <p style={{ fontSize: '0.8rem', fontWeight: 300, color: 'rgba(255,255,255,0.85)', lineHeight: 1.5, marginBottom: '10px' }}>Transforme a foto do seu filho em um ensaio profissional temático</p>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'white', color: '#D4A574', padding: '8px 18px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 500 }}>
                Ver ensaios →
              </span>
            </div>
          </a>

        </div>
      </section>

      <div style={{ textAlign: 'center', padding: '1.5rem', fontSize: '11px', color: '#8B7355', opacity: 0.5 }}>
        Studio Invitare · Feito com amor 💕
      </div>

      {/* keyframes globais */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Raleway:wght@300;400;500&display=swap');
        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
}
