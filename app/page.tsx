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

const FOTO_ORIGINAL = '/selina-original.png';
const FOTO_IA_01    = '/selina-ia-01.png';
const FOTO_IA_02    = '/selina-ia-02.png';

type AnimState = 'idle' | 'dragging' | 'fadeout' | 'glitch' | 'result';

function preloadImages(srcs: string[]): Promise<void> {
  return Promise.all(
    srcs.map(src => new Promise<void>(resolve => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => resolve();
      img.src = src;
    }))
  ).then(() => undefined);
}

export default function HomeInstitucional() {
  const stageRef     = useRef<HTMLDivElement>(null);
  const glitchRef    = useRef<HTMLCanvasElement>(null);
  const trackRef     = useRef<HTMLDivElement>(null);
  const rafCarousel  = useRef<number>(0);
  const rafGlitch    = useRef<number>(0);
  const hasRun       = useRef(false);

  const [animState, setAnimState]         = useState<AnimState>('idle');
  const [labelText, setLabelText]         = useState('foto original');
  const [showReplay, setShowReplay]       = useState(false);
  const [carouselReady, setCarouselReady] = useState(false);

  // ── pré-carrega imagens ──────────────────────────────────
  useEffect(() => {
    preloadImages(CAROUSEL_IMAGES).then(() => setCarouselReady(true));
    preloadImages([FOTO_ORIGINAL, FOTO_IA_01, FOTO_IA_02]);
  }, []);

  // ── carrossel JS infinito ────────────────────────────────
  useEffect(() => {
    if (!carouselReady) return;
    const track = trackRef.current;
    if (!track) return;
    const ITEM_W = 110;
    const SET_W  = CAROUSEL_IMAGES.length * ITEM_W;
    const SPEED  = 0.6;
    let x = 0;
    function step() {
      x -= SPEED;
      if (Math.abs(x) >= SET_W) x = 0;
      track!.style.transform = `translateX(${x}px)`;
      rafCarousel.current = requestAnimationFrame(step);
    }
    rafCarousel.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafCarousel.current);
  }, [carouselReady]);

  // ── glitch scanline ──────────────────────────────────────
  function startGlitch(onDone: () => void) {
    const canvas = glitchRef.current;
    if (!canvas) { onDone(); return; }
    const ctx = canvas.getContext('2d')!;
    const stage = stageRef.current!;
    canvas.width  = stage.offsetWidth;
    canvas.height = stage.offsetHeight;

    const W = canvas.width;
    const H = canvas.height;
    let frame = 0;
    const TOTAL = 55; // ~0.9s a 60fps

    function drawFrame() {
      ctx.clearRect(0, 0, W, H);

      // scanline verde/ciano estilo "processando"
      const scanY = (frame / TOTAL) * H;
      const grad = ctx.createLinearGradient(0, scanY - 40, 0, scanY + 4);
      grad.addColorStop(0, 'rgba(100,220,180,0)');
      grad.addColorStop(0.7, 'rgba(100,220,180,0.18)');
      grad.addColorStop(1, 'rgba(100,220,180,0.55)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, scanY - 40, W, 44);

      // linha brilhante
      ctx.strokeStyle = 'rgba(180,255,230,0.7)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(W, scanY);
      ctx.stroke();

      // glitch horizontal aleatório
      if (frame % 4 === 0) {
        for (let i = 0; i < 3; i++) {
          const gy = Math.random() * H;
          const gh = 2 + Math.random() * 4;
          const gx = (Math.random() - 0.5) * 12;
          ctx.fillStyle = `rgba(100,220,180,${0.08 + Math.random() * 0.12})`;
          ctx.fillRect(gx, gy, W, gh);
        }
      }

      // overlay escuro diminuindo
      ctx.fillStyle = `rgba(20,12,8,${0.45 * (1 - frame / TOTAL)})`;
      ctx.fillRect(0, 0, W, H);

      frame++;
      if (frame < TOTAL) {
        rafGlitch.current = requestAnimationFrame(drawFrame);
      } else {
        ctx.clearRect(0, 0, W, H);
        onDone();
      }
    }

    rafGlitch.current = requestAnimationFrame(drawFrame);
  }

  // ── animação principal ───────────────────────────────────
  function runAnimation() {
    cancelAnimationFrame(rafGlitch.current);
    const canvas = glitchRef.current;
    if (canvas) canvas.getContext('2d')!.clearRect(0, 0, canvas.width, canvas.height);

    setAnimState('idle');
    setLabelText('foto original');
    setShowReplay(false);

    setTimeout(() => { setAnimState('dragging'); setLabelText('foto original'); }, 400);
    setTimeout(() => { setAnimState('fadeout');  setLabelText('processando...'); }, 1800);
    setTimeout(() => {
      setAnimState('glitch');
      startGlitch(() => {
        setAnimState('result');
        setLabelText('ensaio com IA ✨');
        setShowReplay(true);
      });
    }, 2400);
  }

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

  // ── estilos dinâmicos ────────────────────────────────────
  const originalStyle: React.CSSProperties = {
    position: 'absolute', inset: 0,
    borderRadius: '12px', overflow: 'hidden',
    transition: 'opacity 0.5s ease, transform 0.5s ease',
    opacity:   ['idle'].includes(animState) ? 0
             : ['dragging'].includes(animState) ? 1
             : 0,
    transform: animState === 'idle' ? 'translateY(20px)' : 'translateY(0)',
    zIndex: 1,
  };

  const result01Style: React.CSSProperties = {
    position: 'absolute', inset: 0,
    borderRadius: '12px', overflow: 'hidden',
    transition: 'opacity 0.6s ease, transform 0.6s ease',
    opacity:   animState === 'result' ? 1 : 0,
    transform: animState === 'result' ? 'translateX(0)' : 'translateX(-10px)',
    zIndex: 2,
  };

  const result02Style: React.CSSProperties = {
    position: 'absolute',
    top: '8px', right: '-28px',
    width: '80px', height: '104px',
    borderRadius: '10px', overflow: 'hidden',
    boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
    transition: 'opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s',
    opacity:   animState === 'result' ? 1 : 0,
    transform: animState === 'result' ? 'translateX(0) rotate(3deg)' : 'translateX(10px) rotate(3deg)',
    zIndex: 3,
  };

  const glitchCanvasStyle: React.CSSProperties = {
    position: 'absolute', inset: 0,
    pointerEvents: 'none',
    zIndex: 10,
    opacity: ['glitch'].includes(animState) ? 1 : 0,
    transition: 'opacity 0.1s',
  };

  const loopImages = [...CAROUSEL_IMAGES, ...CAROUSEL_IMAGES, ...CAROUSEL_IMAGES];

  return (
    <main style={{ fontFamily: "'Raleway', sans-serif", background: '#FAF8F5', minHeight: '100svh', overflowX: 'hidden' }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Raleway:wght@300;400;500&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }

        .si-wrap {
          max-width: 960px;
          margin: 0 auto;
          padding: 4rem 1.5rem 3rem;
          text-align: center;
        }
        .si-cards {
          display: flex;
          flex-direction: column;
          gap: 16px;
          width: 100%;
        }
        .si-card { flex: 1; border-radius: 20px; overflow: hidden; text-decoration: none; display: block; }

        @media (min-width: 768px) {
          .si-wrap { padding: 6rem 2.5rem 4rem; }
          .si-h1   { font-size: 4.5rem !important; }
          .si-cards { flex-direction: row; align-items: stretch; }
          .si-about { max-width: 560px !important; font-size: 1rem !important; }
        }
      `}</style>

      <section style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-80px', right: '-100px', width: '400px', height: '400px', background: '#E8B4BC', opacity: 0.18, borderRadius: '50%', filter: 'blur(110px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '-80px', width: '320px', height: '320px', background: '#D4A574', opacity: 0.14, borderRadius: '50%', filter: 'blur(90px)', pointerEvents: 'none' }} />

        <div className="si-wrap">

          {/* badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)', border: '1px solid rgba(212,165,116,0.3)', borderRadius: '100px', padding: '6px 18px', fontSize: '11px', fontWeight: 500, color: '#8B7355', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1.75rem' }}>
            ✦ Studio Invitare
          </div>

          {/* headline */}
          <h1 className="si-h1" style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.8rem', lineHeight: 1.1, color: '#5C4A3F', marginBottom: '0.75rem' }}>
            Momentos que<br />
            <em style={{ color: '#D4A574', fontStyle: 'italic', fontWeight: 400 }}>ficam para sempre</em>
          </h1>

          <p style={{ fontSize: '1rem', color: '#8B7355', fontWeight: 300, lineHeight: 1.7, maxWidth: '320px', margin: '0 auto 2.5rem' }}>
            Escolha sua linha de produto e crie algo inesquecível para quem você ama.
          </p>

          {/* quem somos — sem título, com emoção */}
          <p className="si-about" style={{
            maxWidth: '440px', margin: '0 auto 3rem',
            fontSize: '0.93rem', color: '#8B7355', fontWeight: 300,
            lineHeight: 1.85, fontStyle: 'italic',
            borderLeft: '2px solid #D4A574', paddingLeft: '1.25rem',
            textAlign: 'left',
          }}>
            Sabemos que você tem mil coisas para cuidar — e ainda assim quer registrar cada momento especial do seu filho com toda a beleza que ele merece. Por isso criamos o Studio Invitare: para transformar uma simples foto ou ideia em algo lindo, rápido e acessível. Sem sair de casa. Sem complicação. Com todo o carinho.
          </p>

          {/* cards */}
          <div className="si-cards">

            {/* CARD CONVITES */}
            <a className="si-card" href="https://convites.studioinvitare.com.br" style={{ background: 'white', border: '1px solid #E8DCC8' }}>
              <div style={{ width: '100%', height: '160px', overflow: 'hidden', position: 'relative' }}>
                {!carouselReady ? (
                  <div style={{ width: '100%', height: '100%', background: '#F5EDE3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '24px', height: '24px', border: '2px solid #E8DCC8', borderTop: '2px solid #D4A574', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  </div>
                ) : (
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
            <a className="si-card" href="https://ensaios.studioinvitare.com.br" style={{ background: 'linear-gradient(135deg, #D4A574, #C09464)' }}>
              <div ref={stageRef} style={{ width: '100%', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', background: 'rgba(0,0,0,0.1)', overflow: 'hidden' }}>

                <canvas ref={glitchRef} style={glitchCanvasStyle} />

                {/* stage das fotos — empilhadas, com foto02 saindo pela direita */}
                <div style={{ position: 'relative', width: '110px', height: '136px' }}>

                  {/* original */}
                  <div style={originalStyle}>
                    <img src={FOTO_ORIGINAL} alt="Foto original" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>

                  {/* resultado 01 — foto principal */}
                  <div style={result01Style}>
                    <img src={FOTO_IA_01} alt="Ensaio IA 1" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>

                  {/* resultado 02 — foto menor saindo pela direita */}
                  <div style={result02Style}>
                    <img src={FOTO_IA_02} alt="Ensaio IA 2" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                </div>

                {/* label */}
                {labelText && (
                  <span style={{ position: 'absolute', bottom: '8px', left: '50%', transform: 'translateX(-50%)', fontSize: '9px', color: 'rgba(255,255,255,0.8)', whiteSpace: 'nowrap', letterSpacing: '0.08em', zIndex: 5 }}>
                    {labelText}
                  </span>
                )}

                {/* replay */}
                {showReplay && (
                  <button onClick={handleReplay} style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '100px', padding: '4px 10px', fontSize: '9px', color: 'white', cursor: 'pointer', fontFamily: "'Raleway', sans-serif", zIndex: 5 }}>
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

      <div style={{ textAlign: 'center', padding: '1.5rem', fontSize: '11px', color: '#8B7355', opacity: 0.4 }}>
        Studio Invitare · Feito com amor 💕
      </div>
    </main>
  );
}
