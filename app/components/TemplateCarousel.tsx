'use client';

import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Template {
  id: number;
  title: string;
  image: string;
  subtitle: string;
}

export default function TemplateCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const templates: Template[] = [
    { id: 1, title: 'Chá Revelação', image: '/template-1.jpg', subtitle: 'Delicado' },
    { id: 2, title: '1º Aninho', image: '/placeholder-2.jpg', subtitle: 'Floral' },
    { id: 3, title: 'Batizado', image: '/placeholder-3.jpg', subtitle: 'Clássico' },
    { id: 4, title: 'Chá de Bebê', image: '/placeholder-4.jpg', subtitle: 'Aquarela' },
    { id: 5, title: 'Mesversário', image: '/placeholder-5.jpg', subtitle: 'Minimalista' },
  ];

  const next = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % templates.length);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const prev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + templates.length) % templates.length);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const getCardStyle = (index: number) => {
    const diff = index - currentIndex;
    const total = templates.length;
    
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
    <section className="py-32 px-6 bg-gradient-to-b from-white to-beige-50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-serif text-brown-700 mb-6">
            Nossos
            <br />
            <span className="text-beige-300 italic">Templates</span>
          </h2>
          <p className="text-lg text-brown-600 font-light">
            5 designs exclusivos prontos para personalizar
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative h-[600px] mb-16">
          
          {/* Perspective wrapper */}
          <div 
            className="relative w-full h-full"
            style={{
              perspective: '2000px',
              perspectiveOrigin: 'center center',
            }}
          >
            {/* Cards */}
            {templates.map((template, index) => (
              <div
                key={template.id}
                className="absolute left-1/2 top-1/2 -translate-y-1/2 cursor-pointer"
                style={{
                  ...getCardStyle(index),
                  transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                  transformStyle: 'preserve-3d',
                  width: '380px',
                  height: '520px',
                }}
                onClick={() => goToSlide(index)}
              >
                {/* Card */}
                <div className="relative w-full h-full bg-white rounded-3xl shadow-2xl overflow-hidden group">
                  
                  {/* Image */}
                  <div className="absolute inset-0">
                    <img
                      src={template.image}
                      alt={template.title}
                      className="w-full h-full object-cover"
                      loading="eager"
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
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 w-14 h-14 bg-white/90 backdrop-blur-md rounded-full shadow-xl flex items-center justify-center text-brown-700 hover:bg-white hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" strokeWidth={2.5} />
          </button>

          <button
            onClick={next}
            disabled={isAnimating}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 w-14 h-14 bg-white/90 backdrop-blur-md rounded-full shadow-xl flex items-center justify-center text-brown-700 hover:bg-white hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
            aria-label="Próximo"
          >
            <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" strokeWidth={2.5} />
          </button>
        </div>

        {/* Dots Navigation */}
        <div className="flex items-center justify-center gap-3">
          {templates.map((_, index) => (
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
        <div className="text-center mt-12">
          <p className="text-brown-600/70 text-sm max-w-2xl mx-auto">
            Escolha seu favorito e personalize com suas próprias cores, textos e fotos no Canva.
          </p>
        </div>

      </div>
    </section>
  );
}
