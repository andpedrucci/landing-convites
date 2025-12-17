'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Volume2, VolumeX, Pause, Play } from 'lucide-react';

interface Template {
  id: number;
  title: string;
  image: string;
  subtitle: string;
}

interface Theme {
  id: string;
  name: string;
  templates: Template[];
}

export default function TemplateCarousel() {
  const [currentTheme, setCurrentTheme] = useState('cha-revelacao');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Temas e seus templates
  const themes: Theme[] = [
    {
      id: 'cha-revelacao',
      name: 'Chá Revelação',
      templates: [
        { id: 1, title: 'Rosa Delicado', image: '/template-1.jpg', subtitle: 'Chá Revelação' },
        { id: 2, title: 'Azul Suave', image: '/placeholder-2.jpg', subtitle: 'Chá Revelação' },
        { id: 3, title: 'Neutro Elegante', image: '/placeholder-3.jpg', subtitle: 'Chá Revelação' },
        { id: 4, title: 'Floral Vintage', image: '/placeholder-4.jpg', subtitle: 'Chá Revelação' },
        { id: 5, title: 'Minimalista Moderno', image: '/placeholder-5.jpg', subtitle: 'Chá Revelação' },
      ]
    },
    {
      id: 'aniversario',
      name: '1º Aninho',
      templates: [
        { id: 6, title: 'Safari', image: '/placeholder-2.jpg', subtitle: '1º Aninho' },
        { id: 7, title: 'Jardim Encantado', image: '/placeholder-3.jpg', subtitle: '1º Aninho' },
        { id: 8, title: 'Balões', image: '/placeholder-4.jpg', subtitle: '1º Aninho' },
        { id: 9, title: 'Estrelinhas', image: '/placeholder-5.jpg', subtitle: '1º Aninho' },
        { id: 10, title: 'Arco-íris', image: '/template-1.jpg', subtitle: '1º Aninho' },
      ]
    },
    {
      id: 'batizado',
      name: 'Batizado',
      templates: [
        { id: 11, title: 'Clássico Branco', image: '/placeholder-3.jpg', subtitle: 'Batizado' },
        { id: 12, title: 'Anjos Delicados', image: '/placeholder-4.jpg', subtitle: 'Batizado' },
        { id: 13, title: 'Dourado Elegante', image: '/placeholder-5.jpg', subtitle: 'Batizado' },
        { id: 14, title: 'Flores Suaves', image: '/template-1.jpg', subtitle: 'Batizado' },
        { id: 15, title: 'Pombinha', image: '/placeholder-2.jpg', subtitle: 'Batizado' },
      ]
    },
    {
      id: 'cha-bebe',
      name: 'Chá de Bebê',
      templates: [
        { id: 16, title: 'Nuvens', image: '/placeholder-4.jpg', subtitle: 'Chá de Bebê' },
        { id: 17, title: 'Aquarela', image: '/placeholder-5.jpg', subtitle: 'Chá de Bebê' },
        { id: 18, title: 'Ursinhos', image: '/template-1.jpg', subtitle: 'Chá de Bebê' },
        { id: 19, title: 'Lua e Estrelas', image: '/placeholder-2.jpg', subtitle: 'Chá de Bebê' },
        { id: 20, title: 'Floral Moderno', image: '/placeholder-3.jpg', subtitle: 'Chá de Bebê' },
      ]
    },
    {
      id: 'mesversario',
      name: 'Mesversário',
      templates: [
        { id: 21, title: 'Minimalista Clean', image: '/placeholder-5.jpg', subtitle: 'Mesversário' },
        { id: 22, title: 'Colorido Alegre', image: '/template-1.jpg', subtitle: 'Mesversário' },
        { id: 23, title: 'Natureza', image: '/placeholder-2.jpg', subtitle: 'Mesversário' },
        { id: 24, title: 'Geométrico', image: '/placeholder-3.jpg', subtitle: 'Mesversário' },
        { id: 25, title: 'Vintage Suave', image: '/placeholder-4.jpg', subtitle: 'Mesversário' },
      ]
    },
  ];

  const currentTemplates = themes.find(t => t.id === currentTheme)?.templates || [];

  // Inicializar áudio
  useEffect(() => {
    audioRef.current = new Audio('/sunshine.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0;

    // Proteção anti-cópia
    const preventContextMenu = (e: MouseEvent) => e.preventDefault();
    const preventPrint = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        alert('Impressão desabilitada para proteger nossos designs 💕');
      }
    };
    const preventScreenshot = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen') {
        alert('Screenshots desabilitados para proteger nossos designs 💕');
      }
    };

    document.addEventListener('contextmenu', preventContextMenu);
    document.addEventListener('keydown', preventPrint);
    document.addEventListener('keydown', preventScreenshot);

    // Desabilita arrastar imagens
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      img.setAttribute('draggable', 'false');
      img.style.pointerEvents = 'none';
      img.style.userSelect = 'none';
    });

    return () => {
      document.removeEventListener('contextmenu', preventContextMenu);
      document.removeEventListener('keydown', preventPrint);
      document.removeEventListener('keydown', preventScreenshot);
    };
  }, []);

  // Reset index quando muda tema
  useEffect(() => {
    setCurrentIndex(0);
  }, [currentTheme]);

  const startMusic = () => {
    if (!audioRef.current || isPlaying) return;
    
    audioRef.current.volume = 0;
    audioRef.current.play().then(() => {
      setIsPlaying(true);
      setTimeout(() => setShowPlayer(true), 500);
      
      // Fade in
      const fadeInDuration = 2000;
      const targetVolume = 0.3;
      const steps = 50;
      const stepDuration = fadeInDuration / steps;
      const volumeIncrement = targetVolume / steps;
      
      let currentStep = 0;
      const fadeInterval = setInterval(() => {
        if (currentStep < steps && audioRef.current) {
          audioRef.current.volume = Math.min(volumeIncrement * currentStep, targetVolume);
          currentStep++;
        } else {
          clearInterval(fadeInterval);
          if (audioRef.current) {
            audioRef.current.volume = targetVolume;
          }
        }
      }, stepDuration);
    }).catch(err => console.log('Autoplay prevented:', err));
  };

  const next = () => {
    if (isAnimating) return;
    startMusic();
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % currentTemplates.length);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const prev = () => {
    if (isAnimating) return;
    startMusic();
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + currentTemplates.length) % currentTemplates.length);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentIndex) return;
    startMusic();
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const getCardStyle = (index: number) => {
    const diff = index - currentIndex;
    const total = currentTemplates.length;
    
    // Normaliza a diferença para o menor caminho circular
    let normalizedDiff = diff;
    if (Math.abs(diff) > total / 2) {
      normalizedDiff = diff > 0 ? diff - total : diff + total;
    }

    // Centro (card ativo)
    if (normalizedDiff === 0) {
      return {
        transform: 'translateX(-50%) translateZ(0px) rotateY(0deg) scale(1)',
        opacity: 1,
        zIndex: 50,
        filter: 'blur(0px) brightness(1)',
      };
    }

    // Direita
    if (normalizedDiff === 1) {
      return {
        transform: 'translateX(20%) translateZ(-200px) rotateY(-35deg) scale(0.75)',
        opacity: 0.6,
        zIndex: 40,
        filter: 'blur(1px) brightness(0.8)',
      };
    }

    // Esquerda
    if (normalizedDiff === -1) {
      return {
        transform: 'translateX(-120%) translateZ(-200px) rotateY(35deg) scale(0.75)',
        opacity: 0.6,
        zIndex: 40,
        filter: 'blur(1px) brightness(0.8)',
      };
    }

    // Direita distante
    if (normalizedDiff === 2) {
      return {
        transform: 'translateX(50%) translateZ(-350px) rotateY(-45deg) scale(0.5)',
        opacity: 0.3,
        zIndex: 30,
        filter: 'blur(2px) brightness(0.6)',
      };
    }

    // Esquerda distante
    if (normalizedDiff === -2) {
      return {
        transform: 'translateX(-150%) translateZ(-350px) rotateY(45deg) scale(0.5)',
        opacity: 0.3,
        zIndex: 30,
        filter: 'blur(2px) brightness(0.6)',
      };
    }

    // Escondidos
    return {
      transform: 'translateX(-50%) translateZ(-500px) scale(0.3)',
      opacity: 0,
      zIndex: 20,
      filter: 'blur(4px)',
    };
  };

  return (
    <>
      <section className="py-20 px-6 bg-gradient-to-b from-white to-beige-50 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-5xl md:text-6xl font-serif text-brown-700 mb-4">
              Nossos
              <br />
              <span className="text-beige-300 italic">Templates</span>
            </h2>
            <p className="text-lg text-brown-600 font-light mb-6">
              Escolha o tema e explore os 5 designs exclusivos
            </p>

            {/* Theme Selector */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex bg-white rounded-full p-2 shadow-lg border border-beige-200/50">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setCurrentTheme(theme.id)}
                    className={`px-6 py-3 rounded-full font-medium text-sm transition-all duration-300 ${
                      currentTheme === theme.id
                        ? 'bg-beige-300 text-white shadow-md'
                        : 'text-brown-600 hover:text-brown-700 hover:bg-beige-50'
                    }`}
                  >
                    {theme.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Carousel Container */}
          <div className="relative h-[520px] mb-12">
            
            {/* Perspective wrapper */}
            <div 
              className="relative w-full h-full"
              style={{
                perspective: '2000px',
                perspectiveOrigin: 'center center',
              }}
            >
              {/* Cards */}
              {currentTemplates.map((template, index) => (
                <div
                  key={template.id}
                  className="absolute left-1/2 top-1/2 -translate-y-1/2 cursor-pointer select-none"
                  style={{
                    ...getCardStyle(index),
                    transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                    transformStyle: 'preserve-3d',
                    width: '380px',
                    height: '520px',
                  }}
                  onClick={() => goToSlide(index)}
                  onContextMenu={(e) => e.preventDefault()}
                >
                  {/* Card */}
                  <div className="relative w-full h-full bg-white rounded-3xl shadow-2xl overflow-hidden group">
                    
                    {/* Image */}
                    <div className="absolute inset-0 select-none">
                      <img
                        src={template.image}
                        alt={template.title}
                        className="w-full h-full object-cover select-none pointer-events-none"
                        draggable="false"
                        loading="eager"
                        style={{
                          userSelect: 'none',
                          WebkitUserSelect: 'none',
                          MozUserSelect: 'none',
                          msUserSelect: 'none',
                        }}
                      />
                    </div>

                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-brown-700/90 via-brown-700/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Info overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <div className="text-white transform transition-all duration-300">
                        <p className="text-sm font-medium tracking-wider uppercase mb-2 opacity-0 group-hover:opacity-70 transition-opacity duration-300">
                          {template.subtitle}
                        </p>
                        <h3 className="text-2xl font-serif opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {template.title}
                        </h3>
                      </div>
                    </div>

                    {/* Active indicator */}
                    {index === currentIndex && (
                      <div className="absolute top-6 right-6">
                        <div className="w-3 h-3 bg-beige-300 rounded-full shadow-lg animate-pulse" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prev}
              disabled={isAnimating}
              className="absolute left-4 top-[260px] -translate-y-1/2 z-50 w-14 h-14 bg-white/90 backdrop-blur-md rounded-full shadow-xl flex items-center justify-center text-brown-700 hover:bg-white hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" strokeWidth={2.5} />
            </button>

            <button
              onClick={next}
              disabled={isAnimating}
              className="absolute right-4 top-[260px] -translate-y-1/2 z-50 w-14 h-14 bg-white/90 backdrop-blur-md rounded-full shadow-xl flex items-center justify-center text-brown-700 hover:bg-white hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
              aria-label="Próximo"
            >
              <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" strokeWidth={2.5} />
            </button>
          </div>

          {/* Dots Navigation */}
          <div className="flex items-center justify-center gap-3 mb-8">
            {currentTemplates.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                disabled={isAnimating}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? 'w-12 h-3 bg-beige-300'
                    : 'w-3 h-3 bg-beige-200 hover:bg-beige-300/60'
                }`}
                aria-label={`Ir para template ${index + 1}`}
              />
            ))}
          </div>

          {/* Description */}
          <div className="text-center">
            <p className="text-brown-600/70 text-sm max-w-2xl mx-auto">
              Escolha seu favorito e personalize com suas próprias cores, textos e fotos no Canva.
            </p>
          </div>

        </div>
      </section>

      {/* Music Player */}
      {showPlayer && (
        <div 
          className={`fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-beige-200 shadow-2xl z-50 transition-all duration-500 ${
            showPlayer ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <div className="max-w-md mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlayPause}
                className="w-10 h-10 rounded-full bg-beige-300 text-white flex items-center justify-center hover:bg-beige-400 transition-all hover:scale-110 shadow-lg"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>
              
              <div>
                <p className="text-sm font-medium text-brown-700">You Are My Sunshine</p>
                <p className="text-xs text-brown-600/60">Versão Instrumental</p>
              </div>
            </div>

            <button
              onClick={toggleMute}
              className="w-10 h-10 rounded-full bg-beige-100 text-beige-300 flex items-center justify-center hover:bg-beige-200 transition-all"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
