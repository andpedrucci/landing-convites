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

  useEffect(() => {
    const music = new Audio('/sunshine.mp3');
    music.loop = true;
    music.volume = 0.5;
    setAudio(music);

    return () => {
      music.pause();
      setAudio(null);
    };
  }, []);

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
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const whatsappNumber = "5511995087592";
  
  const getWhatsAppLink = (produto: string, extra: string = "") => {
    const message = encodeURIComponent(
      `Olá! Tenho interesse no *${produto}*. Gostaria de mais informações! 💕 ${extra}`
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
                <span className="text-sm font-medium text-brown-600 tracking-[0.25em] uppercase">Studio Invitare</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-serif text-brown-700 mb-8 leading-[1.1] px-4 mt-16">
                Convites que tocam<br />
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
              <h2 className="text-3xl md:text-4xl font-serif text-brown-700 mb-2">Explore nossos <span className="text-beige-300 italic">temas exclusivos</span></h2>
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
                  onClick={() => { setTemaAtivo(tema.id); iniciarMusica(); }}
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-300 text-sm ${temaAtivo === tema.id ? 'bg-beige-300 text-white shadow-lg' : 'bg-white text-brown-700'}`}
                >
                  <span className="mr-1.5">{tema.emoji}</span>{tema.label}
                </button>
              ))}
            </div>
            <div className="relative h-[420px] flex items-start justify-center mb-2">
              <div className="relative w-full h-full" style={{ perspective: '2200px' }}>
                {getImagensTema(temaAtivo).map((imagem, index) => {
                  const diff = index - imagemDestaque;
                  return (
                    <div key={index} className="absolute left-1/2 top-0 w-72 h-96 cursor-pointer"
                      style={{ transform: `translateX(-50%)`, display: index === imagemDestaque ? 'block' : 'none' }}>
                      <img src={imagem.imagem} alt={imagem.nome} className="w-full h-full object-cover rounded-xl shadow-2xl" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section id="produtos" className="snap-section snap-start py-12 px-6 min-h-screen flex items-center bg-gradient-to-b from-white to-beige-50">
          <div className="max-w-6xl mx-auto w-full">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif text-brown-700 mb-3">
                Escolha seu <span className="text-beige-300 italic">estilo perfeito</span>
              </h2>
              <p className="text-brown-600">Convites prontos ou totalmente personalizados</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              
              {/* Card Templates */}
              <div className="bg-white rounded-[2rem] p-8 shadow-2xl border border-beige-200/50 hover:shadow-3xl transition-all">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-beige-100 rounded-full mb-4">
                    <Sparkles className="w-8 h-8 text-beige-300" />
                  </div>
                  <h3 className="text-2xl font-serif text-brown-700 mb-2">Templates Digitais</h3>
                  <p className="text-brown-600 text-sm">Escolha 2 convites do mesmo tema</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-brown-600">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>2 templates editáveis</span>
                  </li>
                  <li className="flex items-center gap-2 text-brown-600">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>Entrega imediata</span>
                  </li>
                  <li className="flex items-center gap-2 text-brown-600">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>Edição fácil no Canva</span>
                  </li>
                </ul>
                
                <button 
                  onClick={() => window.location.href = '/pre-checkout/template'} 
                  className="w-full py-3.5 bg-beige-300 text-white rounded-full mb-3 font-medium hover:bg-beige-400 transition-all"
                >
                  Escolher Templates
                </button>
                <a 
                  href={getWhatsAppLink("Templates Digitais", "")} 
                  className="block text-center text-beige-300 border border-beige-300 py-3 rounded-full hover:bg-beige-50 transition-all"
                >
                  Tirar Dúvidas
                </a>
              </div>

              {/* Card Personalizado */}
              <div className="bg-gradient-to-br from-beige-300 to-beige-400 rounded-[2rem] p-8 shadow-2xl text-white hover:shadow-3xl transition-all relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold">
                  EXCLUSIVO
                </div>
                
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-serif mb-2">Convite Personalizado</h3>
                  <p className="text-white/90 text-sm">Criado especialmente para você</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                    <span>Design 100% exclusivo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                    <span>Criado do zero para você</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                    <span>Atendimento personalizado</span>
                  </li>
                </ul>
                
                <button 
                  onClick={() => window.location.href = '/pre-checkout/personalizado'} 
                  className="w-full py-3.5 bg-white text-beige-300 rounded-full mb-3 font-medium hover:bg-white/90 transition-all"
                >
                  Quero Meu Convite
                </button>
                <a 
                  href={getWhatsAppLink("Convite Personalizado", "")} 
                  className="block text-center border border-white py-3 rounded-full hover:bg-white/10 transition-all"
                >
                  Tirar Dúvidas
                </a>
              </div>

            </div>
          </div>
        </section>

        <footer className="py-12 px-6 bg-brown-700 text-white text-center">
          <p>© 2024 Studio Invitare</p>
          {isPlaying && (
            <button onClick={() => audio?.paused ? audio.play() : audio?.pause()} className="fixed bottom-24 right-8 bg-white/80 p-3 rounded-full shadow-lg text-brown-600 text-[10px] font-bold">
              SOM ON/OFF
            </button>
          )}
        </footer>
      </main>
    </>
  );
}
