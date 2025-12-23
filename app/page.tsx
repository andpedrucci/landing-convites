'use client';

import { useState, useEffect } from 'react';
import { Heart, Sparkles, Clock, CheckCircle2, Star, Send } from 'lucide-react';
import { imagensPorTema } from '@/lib/templates-data';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [temaAtivo, setTemaAtivo] = useState('aniversario');
  const [imagemDestaque, setImagemDestaque] = useState(0);
  const [secaoAtual, setSecaoAtual] = useState(0);


const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  // 1. Criar o áudio apenas uma vez quando a página carregar
  useEffect(() => {
    const music = new Audio('/sunshine.mp3');
    music.loop = true;
    music.volume = 0.5; // Opcional: volume em 50% para não assustar
    setAudio(music);

    // Limpeza: desliga a música se o usuário sair da página
    return () => {
      music.pause();
      setAudio(null);
    };
  }, []);

  // 2. Função de iniciar música
  const iniciarMusica = () => {
    if (audio && !isPlaying) {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log("Permissão de áudio pendente:", err));
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setImagemDestaque(0);
  }, [temaAtivo]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.snap-section');
      sections.forEach((section, index) => {
        const element = section as HTMLElement;
        const rect = element.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          setSecaoAtual(index);
        }
      });
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    setTimeout(handleScroll, 100);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const whatsappNumber = "5511995087592";
  
  const getWhatsAppLink = (produto: string, mensagemExtra: string = "") => {
  const message = encodeURIComponent(
    `Olá! Tenho interesse no *${produto}*. Gostaria de mais informações! 💕`
  );
  return `https://wa.me/${whatsappNumber}?text=${message}`;
};

  const getImagensTema = (tema: string) => {
    return imagensPorTema[tema as keyof typeof imagensPorTema] || imagensPorTema['aniversario'];
  };


  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const secoes = [
    { id: 'hero', nome: 'Início' },
    { id: 'carrossel', nome: 'Temas' },
    { id: 'beneficios', nome: 'Benefícios' },
    { id: 'produtos', nome: 'Produtos' },
    { id: 'depoimentos', nome: 'Depoimentos' },
    { id: 'faq', nome: 'FAQ' },
    { id: 'cta', nome: 'Contato' },
  ];

  return (
    <>
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-4">
        {secoes.map((secao, index) => (
          <button
              key={secao.id}
              onClick={() => {
                scrollToSection(secao.id);
                setSecaoAtual(index);
              }}
              className="group relative"
              aria-label={`Ir para ${secao.nome}`}
            >
            <div className={`w-3 h-3 rounded-full transition-all duration-300 border-2 ${
              secaoAtual === index 
                ? 'bg-beige-300 border-beige-300 scale-125' 
                : 'bg-transparent border-brown-400 hover:bg-brown-400 hover:border-brown-400'
            }`} />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 bg-brown-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
              {secao.nome}
            </span>
          </button>
        ))}
      </div>

      <main className="snap-y snap-mandatory h-screen overflow-y-scroll scroll-smooth">
        <section id="hero" className="snap-section snap-start relative overflow-hidden min-h-screen flex items-center">
          <div className="absolute top-20 right-10 w-[500px] h-[500px] bg-rose-200 opacity-20 blur-[120px] rounded-full animate-pulse" style={{animationDuration: '4s'}} />
          <div className="absolute bottom-20 left-10 w-[400px] h-[400px] bg-beige-300 opacity-20 blur-[100px] rounded-full animate-pulse" style={{animationDuration: '5s'}} />
          
          <div className="relative max-w-7xl mx-auto px-6 py-20 w-full">
            <div className={`text-center transition-all duration-1000 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
              
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/70 backdrop-blur-md rounded-full border border-beige-300/30 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-beige-300">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="m14.31 8 5.74 9.94"/>
                  <path d="M9.69 8h11.48"/>
                  <path d="m7.38 12 5.74-9.94"/>
                  <path d="M9.69 16 3.95 6.06"/>
                  <path d="M14.31 16H2.83"/>
                  <path d="m16.62 12-5.74 9.94"/>
                </svg>
                <span className="text-sm font-medium text-brown-600 tracking-[0.25em] uppercase">Studio Invitare</span>
              </div>

              <h1 className="text-6xl md:text-8xl font-serif text-brown-700 mb-8 leading-[1.1] px-4 mt-16">
                Convites que tocam
                <br />
                <span className="text-beige-300 italic font-light">o coração</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-brown-600 max-w-3xl mx-auto mb-14 font-light leading-relaxed px-4">
                Escolha entre dezenas de estilos ou descreva o <b>seu</b> convite perfeito!
                <br className="hidden md:block" />
                Nós cuidamos <b>com todo carinho</b> de todo o processo para você!
              </p>

              <button
                onClick={() => scrollToSection('carrossel')}
                className="inline-flex items-center gap-2 px-12 py-5 bg-beige-300 text-white rounded-full font-medium text-lg hover:bg-beige-400 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl group"
              >
                <span>Encontrar meu convite perfeito</span>
                <Heart className="w-5 h-5 group-hover:fill-white transition-all" />
              </button>
            </div>
          </div>
        </section>

        <section id="carrossel" className="snap-section snap-start py-8 px-6 relative overflow-hidden pt-6 pb-10 flex items-start bg-gradient-to-b from-beige-50 via-white to-beige-50">
          <div className="relative max-w-7xl mx-auto w-full">
            <div className="text-center mb-4">
              <h2 className="text-3xl md:text-4xl font-serif text-brown-700 mb-2">
                Explore nossos <span className="text-beige-300 italic">temas exclusivos</span>
              </h2>
              <p className="text-sm text-brown-600 font-light">Escolha o estilo perfeito para o seu momento</p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {[
                { id: 'aniversario', label: 'Aniversário', emoji: '🎂' },
                { id: 'batizado', label: 'Batizado', emoji: '✨' },
                { id: 'revelacao', label: 'Chá Revelação', emoji: '🎀' },
                { id: 'cha-bebe', label: 'Chá de Bebê', emoji: '🍼' },
                { id: 'fundomar', label: 'Fundo do Mar', emoji: '🌊' },
                { id: 'princesa', label: 'Princesas', emoji: '👸🏼' },
                { id: 'diversos', label: 'Diversos', emoji: '👸🎉' },
              ].map((tema) => (
                <button
                  key={tema.id}
                  onClick={() => {
                    setTemaAtivo(tema.id);
                    iniciarMusica();
                  }}
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-300 text-sm ${
                    temaAtivo === tema.id
                      ? 'bg-beige-300 text-white shadow-lg scale-105'
                      : 'bg-white text-brown-700 hover:bg-beige-50 shadow-md'
                  }`}
                >
                  <span className="mr-1.5">{tema.emoji}</span>
                  {tema.label}
                </button>
              ))}
            </div>

            <div className="relative h-[420px] flex items-start justify-center mb-2">
              <div 
                className="relative w-full h-full"
                style={{
                  perspective: '2200px',
                  perspectiveOrigin: 'center center',
                }}
              >
                {getImagensTema(temaAtivo).map((imagem, index) => {
                  const diff = index - imagemDestaque;
                  const total = getImagensTema(temaAtivo).length;
                  
                  let normalizedDiff = diff;
                  if (Math.abs(diff) > total / 2) {
                    normalizedDiff = diff > 0 ? diff - total : diff + total;
                  }

                  let cardStyle = {};
                  
                  if (normalizedDiff === 0) {
                    cardStyle = {
                      transform: 'translateX(-50%) translateZ(0px) rotateY(0deg) scale(1)',
                      opacity: 1,
                      zIndex: 50,
                    };
                  } else if (normalizedDiff === 1) {
                    cardStyle = {
                      transform: 'translateX(20%) translateZ(-200px) rotateY(-35deg) scale(0.85)',
                      opacity: 0.7,
                      zIndex: 40,
                    };
                  } else if (normalizedDiff === -1) {
                    cardStyle = {
                      transform: 'translateX(-120%) translateZ(-200px) rotateY(35deg) scale(0.85)',
                      opacity: 0.7,
                      zIndex: 40,
                    };
                  } else if (normalizedDiff === 2) {
                    cardStyle = {
                      transform: 'translateX(50%) translateZ(-350px) rotateY(-45deg) scale(0.7)',
                      opacity: 0.4,
                      zIndex: 30,
                    };
                  } else if (normalizedDiff === -2) {
                    cardStyle = {
                      transform: 'translateX(-150%) translateZ(-350px) rotateY(45deg) scale(0.7)',
                      opacity: 0.4,
                      zIndex: 30,
                    };
                  } else {
                    cardStyle = {
                      transform: 'translateX(-50%) translateZ(-500px) scale(0.5)',
                      opacity: 0,
                      zIndex: 20,
                    };
                  }
                  
                  return (
                    <div
                      key={index}
                      className="absolute left-1/2 top-0 w-72 h-96 cursor-pointer"
                      style={{
                        ...cardStyle,
                        transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                        transformStyle: 'preserve-3d',
                      }}
                      onClick={() => {
                        setImagemDestaque(index);
                        iniciarMusica();
                      }}
                    >
                      <div className="w-full h-full bg-white rounded-xl shadow-2xl overflow-hidden border-4 border-beige-200 hover:border-beige-300 transition-all duration-300 group">
                        <div className="w-full h-full relative overflow-hidden">
                          <img 
                            src={imagem.imagem} 
                            alt={imagem.nome}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const parent = e.currentTarget.parentElement;
                              if (parent) {
                                parent.innerHTML = `
                                  <div class="w-full h-full bg-gradient-to-br from-beige-100 to-rose-100 flex items-center justify-center">
                                    <div class="text-center p-4">
                                      <h3 class="text-xl font-serif text-brown-700 mb-1">${imagem.nome}</h3>
                                      <p class="text-sm text-brown-600">${imagem.descricao}</p>
                                      <p class="text-xs text-red-600 mt-2">Imagem não disponível</p>
                                    </div>
                                  </div>
                                `;
                              }
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <h3 className="text-lg font-serif mb-1">{imagem.nome}</h3>
                            <p className="text-xs text-white/90">{imagem.descricao}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  const total = getImagensTema(temaAtivo).length;
                  setImagemDestaque((imagemDestaque - 1 + total) % total);
                  iniciarMusica();
                }}
                className="p-3 bg-white rounded-full shadow-lg hover:bg-beige-50 transition-all hover:scale-110"
                aria-label="Anterior"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-beige-300">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
              </button>
              <button
                onClick={() => {
                  const total = getImagensTema(temaAtivo).length;
                  setImagemDestaque((imagemDestaque + 1) % total);
                  iniciarMusica();
                }}
                className="p-3 bg-white rounded-full shadow-lg hover:bg-beige-50 transition-all hover:scale-110"
                aria-label="Próximo"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-beige-300">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </button>
            </div>
          </div>
        </section>

        <section id="beneficios" className="snap-section snap-start py-24 min-h-screen flex items-center bg-white">
          <div className="max-w-6xl mx-auto px-6 w-full">
            <div className="grid md:grid-cols-3 gap-16">
              {[
                {
                  icon: <CheckCircle2 className="w-8 h-8" strokeWidth={1.5} />,
                  title: "Como Funciona?",
                  desc: "Você seleciona 2 modelos preferidos, e nossa equipe preenche com as informações do seu evento!"
                },
                {
                  icon: <Heart className="w-8 h-8" strokeWidth={1.5} />,
                  title: "E se eu não gostar?",
                  desc: "Fique tranquila! Antes da entrega final, enviamos uma prévia para conferência e você pode solicitar uma revisão gratuita."
                },
                {
                  icon: <Clock className="w-8 h-8" strokeWidth={1.5} />,
                  title: "Recebo em quanto tempo?",
                  desc: "Em até 3 dias úteis te enviamos a versão para aprovação."
                }
                
                
              ].map((item, i) => (
                <div 
                  key={i}
                  className={`text-center transition-all duration-700 delay-${i * 150} ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                >
                  <div className="inline-flex p-5 bg-beige-100/80 rounded-full text-beige-300 mb-6 shadow-sm">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-serif text-brown-700 mb-3">{item.title}</h3>
                  <p className="text-brown-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="produtos" className="snap-section snap-start py-12 px-6 min-h-screen flex items-center bg-gradient-to-b from-white to-beige-50">
          <div className="max-w-6xl mx-auto w-full">
            
            <div className="text-center mb-10">
              <h2 className="text-4xl md:text-5xl font-serif text-brown-700 mb-3 leading-tight">
                Escolha seu
                <br />
                <span className="text-beige-300 italic">convite perfeito</span>
              </h2>
              <p className="text-base text-brown-600 font-light">Criado especialmente para o seu momento</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              
             {/* Card Template Pronto */}
<div className="bg-white rounded-[2rem] p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 relative overflow-hidden group border border-beige-200/50">
  <div className="absolute -top-20 -right-20 w-40 h-40 bg-rose-200 opacity-10 blur-3xl group-hover:opacity-20 group-hover:scale-150 transition-all duration-700" />
  <div className="relative">
    
    <div className="mb-6">
      <h3 className="text-2xl font-serif text-brown-700 mb-2">Convite Pronto</h3>
      <p className="text-brown-600/70 text-sm">Escolha seus favoritos</p>
    </div>

    <ul className="space-y-2.5 mb-8">
      {[
        "2 modelos lindos para escolher;",
        "1 revisão no momento do envio da arte;",
        "1 revisão extra por R$ 9,90 em até um mês;",
        "Enviado no WhatsApp em imagem e PDF para impressão."
      ].map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <CheckCircle2 className="w-4 h-4 text-beige-300 mt-0.5 flex-shrink-0" strokeWidth={2} />
          <span className="text-brown-700 leading-relaxed text-sm">{item}</span>
        </li>
      ))}
    </ul>

    <div className="space-y-3">
      <button
        onClick={() => (window.location.href = '/pre-checkout/template')}
        className="flex items-center justify-center gap-2 w-full py-3.5 bg-beige-300 text-white text-center rounded-full font-medium hover:bg-beige-400 transition-all duration-300 shadow-md hover:shadow-xl"
      >
        <span>Escolher meus convites</span>
        <Heart className="w-5 h-5 fill-white" />
      </button>

      <a
        href={getWhatsAppLink("Convite Pronto", "")}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full py-3 border-2 border-beige-300 text-beige-300 text-center rounded-full font-medium hover:bg-beige-50 transition-all duration-300"
      >
        <Send className="w-4 h-4" />
        <span>Tirar Dúvidas</span>
      </a>
    </div>

  </div>
</div>

{/* Card Personalizado */}
<div className="bg-gradient-to-br from-beige-300 via-beige-400 to-beige-300 rounded-[2rem] p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 relative overflow-hidden group">
  <div className="absolute top-6 right-6 bg-rose-200 text-white px-4 py-1.5 rounded-full text-xs font-medium shadow-lg rotate-3">
    <div className="flex items-center gap-1.5">
      <Star className="w-3 h-3" fill="white" />
      <span>Mais Escolhido</span>
    </div>
  </div>

  <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white opacity-10 blur-3xl group-hover:opacity-20 group-hover:scale-150 transition-all duration-700" />

  <div className="relative pt-6">
    <div className="mb-6">
      <h3 className="text-2xl font-serif text-white mb-1">Personalizado</h3>
      <p className="text-white/80 text-xs">Exclusivo para você | Escolha seu próprio tema!</p>
    </div>

    <ul className="space-y-2.5 mb-8">
      {[
        "Design exclusivo para o seu momento;",
        "Até 2 alterações incluídas no período de um mês;",
        "Entrega em 3–5 dias úteis;",
        "Enviado no WhatsApp em imagem e PDF para impressão."
      ].map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <Star className="w-4 h-4 text-white mt-0.5 flex-shrink-0" fill="white" strokeWidth={2} />
          <span className="text-white leading-relaxed text-sm">{item}</span>
        </li>
      ))}
    </ul>

    <div className="bg-white/20 backdrop-blur-md rounded-2xl p-3 mb-6 text-center border border-white/30">
      <p className="text-white font-medium flex items-center justify-center gap-2 text-sm">
        <Sparkles className="w-3 h-3" />
        <span>Apenas 10 vagas este mês</span>
      </p>
    </div>

    <div className="space-y-3">
      <button
        onClick={() => (window.location.href = '/pre-checkout/personalizado')}
        className="flex items-center justify-center gap-2 w-full py-3.5 bg-white text-beige-300 text-center rounded-full font-medium hover:bg-beige-50 transition-all duration-300 shadow-xl hover:shadow-2xl"
      >
        <span>Quero meu convite personalizado</span>
        <Heart className="w-5 h-5 fill-beige-300" />
      </button>

      <a
        href={getWhatsAppLink("Convite Personalizado", "")}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full py-3 border-2 border-white text-white text-center rounded-full font-medium hover:bg-white/10 transition-all duration-300"
      >
        <Send className="w-4 h-4" />
        <span>Tirar Dúvidas</span>
      </a>
    </div>
  </div>
</div>
            </div>
</section>

        <section id="depoimentos" className="snap-section snap-start py-20 px-6 min-h-screen flex items-center bg-white/40 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto w-full">
            <h2 className="text-4xl md:text-5xl font-serif text-brown-700 text-center mb-12">
              O que dizem sobre nós
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  text: "Meu chá revelação ficou PERFEITO! Todo mundo adorou o convite, muito delicado e lindo 💕",
                  author: "Maria S.",
                  event: "Chá Revelação"
                },
                {
                  text: "Atendimento incrível, entrega rápida e o convite ficou exatamente como eu imaginei!",
                  author: "Ana Paula",
                  event: "1º Aninho"
                },
                {
                  text: "Melhor custo-benefício! Arquivo editável é tudo, pude fazer pequenos ajustes depois.",
                  author: "Júlia M.",
                  event: "Batizado"
                }
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex gap-1 mb-3">
                    {[1,2,3,4,5].map((star) => (
                      <Star key={star} className="w-4 h-4 text-beige-300" fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-brown-700 mb-4 leading-relaxed italic text-sm">"{item.text}"</p>
                  <div className="border-t border-beige-200 pt-3">
                    <p className="text-brown-700 font-medium text-sm">{item.author}</p>
                    <p className="text-brown-600/60 text-xs">{item.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="snap-section snap-start py-12 px-6 min-h-screen flex items-center bg-beige-50">
          <div className="max-w-5xl mx-auto w-full">
            <h2 className="text-4xl md:text-5xl font-serif text-brown-700 text-center mb-10">
              Dúvidas Frequentes
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  q: "Os convites são digitais?",
                  a: "Sim! Você recebe o arquivo em alta qualidade para compartilhar por WhatsApp, redes sociais junto com o PDF para imprimir."
                },
                {
                  q: "Como funciona a entrega?",
                  a: "3-5 dias úteis."
                },
                {
                  q: "Posso editar depois?",
                  a: "Sim! No período de um mês você pode solicitar uma revisão extra por R$ 9,90 (limitado a alteração de texto nos Convites Prontos)"
                },
                {
                  q: "Como funciona a assinatura?",
                  a: "Todo mês você recebe um convite personalizado. Cancele quando quiser!"
                },
                {
                  q: "Quantas revisões?",
                  a: "No personalizado: 2 rodadas de revisão incluídas. Queremos que fique perfeito!"
                },
                {
                  q: "Quais formatos recebo?",
                  a: "Imagem de alta qualidade + PDF para impressão."
                }
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300">
                  <h3 className="text-base font-serif text-brown-700 mb-2">{item.q}</h3>
                  <p className="text-brown-600 leading-relaxed text-sm">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="cta" className="snap-section snap-start py-24 px-6 min-h-screen flex items-center bg-gradient-to-br from-beige-300 to-beige-400">
          <div className="max-w-4xl mx-auto text-center text-white w-full">
            <h2 className="text-4xl md:text-6xl font-serif mb-6">
              Pronta para criar seu
              <br />
              <span className="italic font-light">convite perfeito?</span>
            </h2>
            <p className="text-xl mb-10 text-white/90 font-light">
              Celebre seu momento especial com um convite único
            </p>
            <a href={getWhatsAppLink("Quero conhecer os convites", "")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-5 bg-white text-beige-300 rounded-full font-medium text-lg hover:bg-beige-50 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105"
            >
              <span>Fale Conosco no WhatsApp</span>
              <Send className="w-5 h-5" />
            </a>
          </div>
        </section>

        <footer className="py-12 px-6 bg-brown-700 text-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-serif mb-2">Studio Invitare</h3>
              <p className="text-white/70 font-light text-sm">Convites que celebram sua história</p>
            </div>
            <div className="flex justify-center mb-8">
              <a href={getWhatsAppLink("Olá, gostaria de saber mais!", "")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all border border-white/20"
              >
                <Send className="w-4 h-4" />
                <span>Fale conosco</span>
              </a>
            </div>
            <div className="pt-6 border-t border-white/10 text-center">
              <p className="text-xs text-white/50">
                © 2024 Studio Invitare. Feito com <Heart className="w-4 h-4 inline fill-rose-200 text-rose-200" /> para celebrar seus momentos especiais.
              </p>
            </div>
          </div>
          {isPlaying && (
          <button 
            onClick={() => {
              if (audio?.paused) { audio.play(); } else { audio?.pause(); }
            }}
            className="fixed bottom-24 right-8 z-[70] bg-white/80 p-3 rounded-full shadow-lg border border-beige-200 text-brown-600 text-[10px] font-bold"
          >
            SOM ON/OFF
          </button>
        )}
        </footer>
      </main>
    </>
  );
}
