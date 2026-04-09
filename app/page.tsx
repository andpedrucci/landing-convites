'use client';

import { useEffect, useRef, useState } from 'react';

const CAROUSEL_CONVITES = [
  '/templates/aniversario/INV-ANI-M-01.png',
  '/templates/aniversario/INV-ANI-M-03.png',
  '/templates/aniversario/INV-ANI-M-07.png',
  '/templates/aniversario/INV-ANI-M-08.png',
  '/templates/aniversario/INV-ANI-M-09.png',
  '/templates/aniversario/INV-ANI-M-10.png',
  '/templates/aniversario/INV-ANI-H-04.png',
  '/templates/aniversario/INV-ANI-H-05.png',
  '/templates/aniversario/INV-ANI-H-06.png',
  '/templates/aniversario/INV-ANI-U-11.png',
  '/templates/aniversario/INV-ANI-U-12.png',

];

const ENSAIO_FOTOS = [
  '/selina-ia-01.png',
  '/selina-ia-02.png',
  '/selina-ia-03.png',
  '/selina-ia-04.png',
];

const FOTO_ORIGINAL = '/selina-original.jpeg';

// ── carrossel com loop infinito via rAF, isolado em componente próprio ──
function CarrosselInfinito({ images, dark = false }: { images: string[]; dark?: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef   = useRef<number>(0);
  const xRef     = useRef(0);

  // triplicamos para garantir que nunca tem gap
  const loop = [...images, ...images, ...images];
  const ITEM_W = 110; // 100px largura + 10px gap
  const SET_W  = images.length * ITEM_W;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    function step() {
      xRef.current -= 0.6;
      if (Math.abs(xRef.current) >= SET_W) xRef.current = 0;
      track!.style.transform = `translateX(${xRef.current}px)`;
      rafRef.current = requestAnimationFrame(step);
    }

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // sem dependências — nunca reinicia

  return (
    <div style={{ width: '100%', height: '160px', overflow: 'hidden' }}>
      <div ref={trackRef} style={{ display: 'flex', gap: '10px', padding: '10px 16px', height: '160px', alignItems: 'center', willChange: 'transform' }}>
        {loop.map((src, i) => (
          <div key={i} style={{ flexShrink: 0, width: '100px', height: '140px', borderRadius: '12px', overflow: 'hidden', boxShadow: `0 4px 16px rgba(0,0,0,${dark ? 0.25 : 0.1})` }}>
            <img src={src} alt="" loading="eager" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── animação IA: foto original → glitch → carrossel infinito das IAs ──
function AnimacaoIA() {
  const stageRef  = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafGlitch = useRef<number>(0);
  const hasRun    = useRef(false);

  type Phase = 'original' | 'glitch' | 'carrossel';
  const [phase, setPhase]           = useState<Phase>('original');
  const [showReplay, setShowReplay] = useState(false);
  const [label, setLabel]           = useState('foto original');
  const [visible, setVisible]       = useState(false);

  useEffect(() => { setTimeout(() => setVisible(true), 400); }, []);

  function startGlitch(onDone: () => void) {
    const canvas = canvasRef.current;
    const stage  = stageRef.current;
    if (!canvas || !stage) { onDone(); return; }
    const ctx = canvas.getContext('2d')!;
    canvas.width  = stage.offsetWidth;
    canvas.height = stage.offsetHeight;
    const W = canvas.width, H = canvas.height;
    let frame = 0;
    const TOTAL = 55;
    function draw() {
      ctx.clearRect(0, 0, W, H);
      const scanY = (frame / TOTAL) * H;
      const g = ctx.createLinearGradient(0, scanY - 40, 0, scanY + 4);
      g.addColorStop(0,   'rgba(100,220,180,0)');
      g.addColorStop(0.7, 'rgba(100,220,180,0.18)');
      g.addColorStop(1,   'rgba(100,220,180,0.55)');
      ctx.fillStyle = g;
      ctx.fillRect(0, scanY - 40, W, 44);
      ctx.strokeStyle = 'rgba(180,255,230,0.7)';
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(0, scanY); ctx.lineTo(W, scanY); ctx.stroke();
      if (frame % 4 === 0) {
        for (let i = 0; i < 3; i++) {
          ctx.fillStyle = `rgba(100,220,180,${0.08 + Math.random() * 0.12})`;
          ctx.fillRect((Math.random() - 0.5) * 12, Math.random() * H, W, 2 + Math.random() * 4);
        }
      }
      ctx.fillStyle = `rgba(20,12,8,${0.45 * (1 - frame / TOTAL)})`;
      ctx.fillRect(0, 0, W, H);
      frame++;
      if (frame < TOTAL) rafGlitch.current = requestAnimationFrame(draw);
      else { ctx.clearRect(0, 0, W, H); onDone(); }
    }
    rafGlitch.current = requestAnimationFrame(draw);
  }

  function runAnimation() {
    cancelAnimationFrame(rafGlitch.current);
    setPhase('original');
    setLabel('foto original');
    setShowReplay(false);
    setVisible(false);
    setTimeout(() => setVisible(true), 300);
    setTimeout(() => setLabel('processando...'), 1600);
    setTimeout(() => {
      setPhase('glitch');
      startGlitch(() => {
        setPhase('carrossel');
        setLabel('ensaio com IA ✨');
        setShowReplay(true);
      });
    }, 2200);
  }

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && !hasRun.current) {
          hasRun.current = true;
          setTimeout(runAnimation, 800);
        }
      });
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleReplay(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    hasRun.current = false;
    runAnimation();
    hasRun.current = true;
  }

  return (
    <div ref={stageRef} style={{ width: '100%', height: '160px', position: 'relative', overflow: 'hidden', background: 'rgba(0,0,0,0.1)' }}>

      {/* glitch canvas */}
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10, opacity: phase === 'glitch' ? 1 : 0, transition: 'opacity 0.1s' }} />

      {/* fase original — foto centralizada */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: phase === 'original' ? 1 : 0, transition: 'opacity 0.4s', pointerEvents: 'none' }}>
        <div style={{ width: '110px', height: '136px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.3)', transition: 'opacity 0.5s, transform 0.5s', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)' }}>
          <img src={FOTO_ORIGINAL} alt="Foto original" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
      </div>

      {/* fase carrossel — igual ao de convites, aparece após glitch */}
      <div style={{ position: 'absolute', inset: 0, opacity: phase === 'carrossel' ? 1 : 0, transition: 'opacity 0.5s', pointerEvents: phase === 'carrossel' ? 'auto' : 'none' }}>
        {phase === 'carrossel' && <CarrosselInfinito images={ENSAIO_FOTOS} dark />}
      </div>

      {/* label */}
      {label && (
        <span style={{ position: 'absolute', bottom: '8px', left: '50%', transform: 'translateX(-50%)', fontSize: '9px', color: 'rgba(255,255,255,0.85)', whiteSpace: 'nowrap', letterSpacing: '0.08em', zIndex: 5 }}>
          {label}
        </span>
      )}

      {/* replay */}
      {showReplay && (
        <button onClick={handleReplay} style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '100px', padding: '4px 10px', fontSize: '9px', color: 'white', cursor: 'pointer', fontFamily: 'inherit', zIndex: 5 }}>
          ↺ repetir
        </button>
      )}
    </div>
  );
}

// ── spinner ──
function Spinner() {
  return (
    <div style={{ width: '100%', height: '160px', background: '#F5EDE3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '24px', height: '24px', border: '2px solid #E8DCC8', borderTop: '2px solid #D4A574', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );
}

// ── página principal ──
export default function HomeInstitucional() {
  const [convitesReady, setConvitesReady] = useState(false);

  useEffect(() => {
    let loaded = 0;
    const total = CAROUSEL_CONVITES.length;
    CAROUSEL_CONVITES.forEach(src => {
      const img = new Image();
      img.onload = img.onerror = () => { loaded++; if (loaded >= total) setConvitesReady(true); };
      img.src = src;
    });
    // pré-carrega ensaios também
    [...ENSAIO_FOTOS, FOTO_ORIGINAL].forEach(src => { const i = new Image(); i.src = src; });
  }, []);

  return (
    <main style={{ fontFamily: "'Raleway', sans-serif", background: '#FAF8F5', minHeight: '100svh', overflowX: 'hidden' }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Raleway:wght@300;400;500&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        .si-wrap  { max-width: 960px; margin: 0 auto; padding: 4rem 1.5rem 3rem; text-align: center; }
        .si-cards { display: flex; flex-direction: column; gap: 16px; width: 100%; }
        .si-card  { flex: 1; border-radius: 20px; overflow: hidden; text-decoration: none; display: block; }
        @media (min-width: 768px) {
          .si-wrap  { padding: 6rem 2.5rem 4rem; }
          .si-h1    { font-size: 4.5rem !important; }
          .si-cards { flex-direction: row; align-items: stretch; }
          .si-about { max-width: 560px !important; }
        }
      `}</style>

      <section style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-80px', right: '-100px', width: '400px', height: '400px', background: '#E8B4BC', opacity: 0.18, borderRadius: '50%', filter: 'blur(110px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '-80px', width: '320px', height: '320px', background: '#D4A574', opacity: 0.14, borderRadius: '50%', filter: 'blur(90px)', pointerEvents: 'none' }} />

        <div className="si-wrap">

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

          <p className="si-about" style={{ maxWidth: '440px', margin: '0 auto 3rem', fontSize: '0.93rem', color: '#8B7355', fontWeight: 300, lineHeight: 1.85, fontStyle: 'italic', borderLeft: '2px solid #D4A574', paddingLeft: '1.25rem', textAlign: 'left' }}>
            Sabemos que você tem mil coisas para cuidar — e ainda assim quer registrar cada momento especial do seu filho com toda a beleza que ele merece. Por isso criamos o Studio Invitare: para transformar uma simples foto ou ideia em algo lindo, rápido e acessível. Sem sair de casa. Sem complicação. Com todo o carinho.
          </p>

          <div className="si-cards">

            {/* CONVITES */}
            <a className="si-card" href="https://convites.studioinvitare.com.br" style={{ background: 'white', border: '1px solid #E8DCC8' }}>
              {convitesReady ? <CarrosselInfinito images={CAROUSEL_CONVITES} /> : <Spinner />}
              <div style={{ padding: '1.1rem 1.25rem 1.4rem', textAlign: 'left' }}>
                <span style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8B7355', opacity: 0.6 }}>Linha 01</span>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 600, color: '#5C4A3F', margin: '4px 0' }}>Convites Digitais</p>
                <p style={{ fontSize: '0.8rem', fontWeight: 300, color: '#8B7355', lineHeight: 1.5, marginBottom: '12px' }}>Prontos ou personalizados do zero para a festa do seu filho</p>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#D4A574', color: 'white', padding: '9px 20px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 500 }}>
                  Ver convites →
                </span>
              </div>
            </a>

            {/* ENSAIOS */}
            <a className="si-card" href="https://ensaios.studioinvitare.com.br" style={{ background: 'linear-gradient(135deg, #D4A574, #C09464)' }}>
              <AnimacaoIA />
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
