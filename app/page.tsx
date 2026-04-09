'use client';

import { useEffect, useRef, useState } from 'react';

const CAROUSEL_IMAGES = [
  '/templates/aniversario/INV-ANI-M-01.png',
  '/templates/aniversario/INV-ANI-M-03.png',
  '/templates/aniversario/INV-ANI-M-07.png',
  '/templates/aniversario/INV-ANI-M-08.png',
  '/templates/aniversario/INV-ANI-M-09.png',
  '/templates/aniversario/INV-ANI-M-10.png',
  '/templates/batizado/INV-BAT-M-01.png',
  '/templates/revelacao/INV-REV-M-01.png',
  '/templates/cha-bebe/INV-CHA-M-01.png',
  '/templates/princesa/INV-PRI-M-01.png',
  '/templates/fundomar/INV-FUN-M-01.png',
  '/templates/diversos/INV-DIV-M-01.png',
];

const FOTO_ORIGINAL = '/selina-original.jpg';
const FOTO_IA       = '/selina-ia.jpg';

type AnimState = 'idle' | 'dragging' | 'fadeout' | 'loading' | 'particles' | 'result';

// ── pré-carrega imagens e resolve quando todas estiverem prontas ──
function preloadImages(srcs: string[]): Promise<void> {
  return Promise.all(
    srcs.map(
      src =>
        new Promise<void>(resolve => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve(); // não bloqueia se falhar
          img.src = src;
        })
    )
  ).then(() => undefined);
}

export default function HomeInstitucional() {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const stageRef     = useRef<HTMLDivElement>(null);
  const trackRef     = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);
  const rafCarousel  = useRef<number>(0);

  const [animState, setAnimState]   = useState<AnimState>('idle');
  const [labelText, setLabelText]   = useState('foto original');
  const [showReplay, setShowReplay] = useState(false);
  const [carouselReady, setCarouselReady] = useState(false);
  const hasRun = useRef(false);

  // ── pré-carrega imagens do carrossel ──────────────────────
  useEffect(() => {
    preloadImages(CAROUSEL_IMAGES).then(() => setCarouselReady(true));
  }, []);

  // ── carrossel JS infinito sem break ───────────────────────
  useEffect(() => {
    if (!carouselReady) return;
    const track = trackRef.current;
    if (!track) return;

    // largura de um "set" completo de imagens (sem duplicatas)
    const ITEM_W  = 110; // 100px + 10px gap
    const SET_W   = CAROUSEL_IMAGES.length * ITEM_W;
    const SPEED   = 0.6; // px por frame

    let x = 0;

    function step() {
      x -= SPEED;
      if (Math.abs(x) >= SET_W) x = 0; // reset invisível
      track!.style.transform = `translateX(${x}px)`;
      rafCarousel.current = requestAnimationFrame(step);
    }

    rafCarousel.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafCarousel.current);
  }, [carouselReady]);

  // ── partículas ────────────────────────────────────────────
  function createParticles(canvas: HTMLCanvasElement) {
    const ctx    = canvas.getContext('2d')!;
    const cx     = canvas.width / 2;
    const cy     = canvas.height / 2;
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
        alive   = true;
        p.x    += p.vx;
        p.y    += p.vy;
        p.vy   += 0.06;
        p.alpha -= p.decay;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle =
          p.color + Math.floor(p.alpha * 255).toString(16).padStart(2, '0');
        ctx.fill();
      });
      if (alive) animFrameRef.current = requestAnimationFrame(draw);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    animFrameRef.current = requestAnimationFrame(draw);
  }

  // ── animação IA ───────────────────────────────────────────
  function runAnimation() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    cancelAnimationFrame(animFrameRef.current);
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const stage = stageRef.current;
    if (stage) {
      canvas.width  = stage.offsetWidth;
      canvas.height = stage.offsetHeight;
    }

    setAnimState('idle');
    setLabelText('foto original');
    setShowReplay(false);

    setTimeout(() => { setAnimState('dragging'); setLabelText('foto original'); }, 400);
    setTimeout(() => { setAnimState('fadeout');  setLabelText(''); }, 1800);
    setTimeout(() => { setAnimState('loading');  setLabelText('gerando IA...'); }, 2400);
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

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting && !hasRun.current) {
            hasRun.current = true;
            setTimeout(runAnimation, 800);
          }
        });
      },
      { threshold: 0.5 }
    );
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

  // ── estilos dinâmicos ──────────────────────────────────────
  const originalStyle: React.CSSProperties = {
    position: 'absolute', inset: 0,
    borderRadius: '12px', overflow: 'hidden',
    transition: 'all 0.5s ease',
    ...(animState === 'idle'                                      && { opacity: 0, transform: 'translateY(30px)' }),
    ...(animState === 'dragging'                                  && { opacity: 1, transform: 'translateY(0)' }),
    ...(animState === 'fadeout'                                   && { opacity: 0, transform: 'scale(0.9)' }),
    ...(['loading', 'particles', 'result'].includes(animState)   && { opacity: 0 }),
  };

  const resultStyle: React.CSSProperties = {
    position: 'absolute', inset: 0,
    borderRadius: '12px', overflow: 'hidden',
    transition: 'opacity 0.8s ease, transform 0.8s ease',
    opacity:   animState === 'result' ? 1 : 0,
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

  // triplicamos as imagens para o loop JS não ter break visível
  const loopImages = [...CAROUSEL_IMAGES, ...CAROUSEL_IMAGES, ...CAROUSEL_IMAGES];

  return (
    <main style={{ fontFamily: "'Raleway', sans-serif", background: '#FAF8F5', minHeight: '100svh', overflowX: 'hidden' }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Raleway:wght@300;400;500&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }

        .si-section {
          max-width: 900px;
          margin: 0 auto;
          padding: 4rem 1.5rem 2rem;
          text-align: center;
        }

        .si-cards {
          display: flex;
          flex-direction: column;
          gap: 16px;
          width: 100%;
        }

        /* desktop: cards lado a lado */
        @media (min-width: 768px) {
          .si-section {
            padding: 5rem 2rem 3rem;
          }
          .si-cards {
            flex-direction: row;
            align-items: stretch;
          }
          .si-card {
            flex: 1;
          }
          .si-h1 {
            font-size: 4rem !important;
          }
          .si-about {
            max-width: 600px !important;
          }
        }
      `}</style>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        {/* blobs */}
        <div style={{ position: 'absolute', top: '-60px', right: '-80px', width: '350px', height: '350px', background: '#E8B4BC', opacity: 0.2, borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-40px', left: '-60px', width: '280px', height: '280px', background: '#D4A574', opacity: 0.15, borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />

        <div className="si-section">
          {/* badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)', border: '1px solid rgba(212,165,116,0.3)', borderRadius: '100px', padding: '6px 18px', fontSize: '11px', fontWeight: 500, color: '#8B7355', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1.75rem' }}>
            ✦ Studio Invitare
          </div>

          <h1 className="si-h1" style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.8rem', lineHeight: 1.1, color: '#5C4A3F', marginBottom: '0.75rem' }}>
            Momentos que<br />
            <em style={{ color: '#D4A574', fontStyle: 'italic', fontWeight: 400 }}>ficam para sempre</em>
          </h1>

          <p style={{ fontSize: '1rem', color: '#8B7355', fontWeight: 300, lineHeight: 1.7, maxWidth: '320px', margin: '0 auto 2.5rem' }}>
            Escolha sua linha de produto e crie algo inesquecível para quem você ama.
          </p>

          {/* ── QUEM SOMOS ── */}
          <div className="si-about" style={{ maxWidth: '440px', margin: '0 auto 3rem', background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(6px)', borderRadius: '16px', padding: '1.5rem 1.75rem', border: '1px solid rgba(212,165,116,0.2)', textAlign: 'left' }}>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', color: '#5C4A3F', fontWeight: 600, marginBottom: '0.5rem' }}>
              Quem somos
            </p>
            <p style={{ fontSize: '0.875rem', color: '#8B7355', fontWeight: 300, lineHeight: 1.8, margin: 0 }}>
              Somos um estúdio digital especializado em criar memórias afetivas para famílias brasileiras. Desde convites personalizados para festas até ensaios fotográficos gerados com inteligência artificial — tudo feito com cuidado, agilidade e sem você sair de casa.
            </p>
          </div>

          {/* ── CARDS ── */}
          <div className="si-cards">

            {/* CARD CONVITES */}
            <a className="si-card" href="https://convites.studioinvitare.com.br" style={{ borderRadius: '20px', overflow: 'hidden', textDecoration: 'none', display: 'block', background: 'white', border: '1px solid #E8DCC8' }}>

              {/* carrossel */}
              <div style={{ width: '100%', height: '160px', overflow: 'hidden', position: 'relative' }}>
                {!carouselReady && (
                  <div style={{ width: '100%', height: '100%', background: '#F5EDE3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '24px', height: '24px', border: '2px solid #E8DCC8', borderTop: '2px solid #D4A574', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  </div>
                )}
                {carouselReady && (
                  <div ref={trackRef} style={{ display: 'flex', gap: '10px', padding: '10px 16px', height: '160px', alignItems: 'center', willChange: 'transform' }}>
                    {loopImages.map((src, i) => (
                      <div key={i} style={{ flexShrink: 0, width: '100px', height: '140px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
                        <img src={src} alt="" loading="eager" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ padding: '1.1rem 1.25rem 1.4rem', textAlign: 'left' }}>
                <span style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8B7355', opacity: 0.6 }}>Linha 01</span>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 600, color: '#5C4A3F', margin: '4px 0' }}>Convites Digitais</p>
                <p style={{ fontSize: '0.8rem', fontWeight: 300, color: '#8B7355', lineHeight: 1.5, marginBottom: '12px' }}>Prontos ou personalizados do zero para a festa do seu filho</p>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#D4A574', color: 'white', padding: '9px 20px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 500 }}>
                  Ver convites →
                </span>
              </div>
            </a>

            {/* CARD ENSAIO */}
            <a className="si-card" href="https://ensaios.studioinvitare.com.br" style={{ borderRadius: '20px', overflow: 'hidden', textDecoration: 'none', display: 'block', background: 'linear-gradient(135deg, #D4A574, #C09464)' }}>

              {/* animação IA */}
              <div ref={stageRef} style={{ width: '100%', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', background: 'rgba(0,0,0,0.08)' }}>
                <canvas ref={canvasRef} style={canvasStyle} />

                <div style={{ position: 'relative', width: '110px', height: '140px' }}>

                  {/* foto original */}
                  <div style={originalStyle}>
                    <img src={FOTO_ORIGINAL} alt="Foto original" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    <div style={{ position: 'absolute', inset: 0, background: '#E8DCC8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '4px', zIndex: -1 }}>
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <circle cx="16" cy="12" r="6" fill="rgba(212,165,116,0.5)" />
                        <path d="M4 28c0-6.6 5.4-12 12-12s12 5.4 12 12" fill="rgba(212,165,116,0.3)" />
                      </svg>
                      <span style={{ fontSize: '8px', color: '#8B7355', opacity: 0.6 }}>foto real</span>
                    </div>
                  </div>

                  {/* foto IA */}
                  <div style={resultStyle}>
                    <img src={FOTO_IA} alt="Ensaio com IA" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#2d1a0e,#4a2c1a)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '4px', zIndex: -1 }}>
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <circle cx="16" cy="12" r="6" fill="rgba(255,255,255,0.4)" />
                        <path d="M4 28c0-6.6 5.4-12 12-12s12 5.4 12 12" fill="rgba(255,255,255,0.2)" />
                      </svg>
                      <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.8)' }}>ensaio IA</span>
                    </div>
                  </div>

                  {/* loader */}
                  <div style={loaderStyle}>
                    <div style={{ width: '36px', height: '36px', border: '2px solid rgba(255,255,255,0.2)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.8)', letterSpacing: '0.1em' }}>gerando IA...</span>
                  </div>
                </div>

                {labelText && (
                  <span style={{ position: 'absolute', bottom: '8px', left: '50%', transform: 'translateX(-50%)', fontSize: '9px', color: 'rgba(255,255,255,0.75)', whiteSpace: 'nowrap', letterSpacing: '0.08em' }}>
                    {labelText}
                  </span>
                )}

                {showReplay && (
                  <button onClick={handleReplay} style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '100px', padding: '4px 10px', fontSize: '9px', color: 'white', cursor: 'pointer', fontFamily: "'Raleway', sans-serif" }}>
                    ↺ repetir
                  </button>
                )}
              </div>

              <div style={{ padding: '1.1rem 1.25rem 1.4rem', textAlign: 'left' }}>
                <span style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>Linha 02 · Novo</span>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 600, color: 'white', margin: '4px 0' }}>Ensaios com IA</p>
                <p style={{ fontSize: '0.8rem', fontWeight: 300, color: 'rgba(255,255,255,0.85)', lineHeight: 1.5, marginBottom: '12px' }}>Transforme a foto do seu filho em um ensaio profissional temático</p>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'white', color: '#D4A574', padding: '9px 20px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 500 }}>
                  Ver ensaios →
                </span>
              </div>
            </a>

          </div>
        </div>
      </section>

      <div style={{ textAlign: 'center', padding: '1.5rem', fontSize: '11px', color: '#8B7355', opacity: 0.45 }}>
        Studio Invitare · Feito com amor 💕
      </div>

    </main>
  );
}
