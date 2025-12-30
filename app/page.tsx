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
    { id: 'como-funciona', nome: 'Como Funciona' },
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

        <section id="carrossel" className="snap-section snap-start min-h-screen flex items-center px-6 relative bg-gradient-to-b from-beige-50 via-white to-beige-50">
          <div className="relative max-w-7xl mx-auto w-full py-20 overflow-visible">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-serif text-brown-700 mb-2">Explore nossos <span className="text-beige-300 italic">temas exclusivos</span></h2>
              <p className="text-sm text-brown-600 font-light">Escolha o convite perfeito para o seu momento!</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3 mb-12">
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
            <div className="relative h-[450px] flex items-center justify-center mb-8 overflow-visible">
              <div className="relative w-full h-full preserve-3d overflow-visible" style={{ perspective: '2200px' }}>
                {getImagensTema(temaAtivo).map((imagem, index) => {
                  const totalImagens = getImagensTema(temaAtivo).length;
                  const diff = index - imagemDestaque;
                  const anglePerImage = 360 / totalImagens;
                  const angle = diff * anglePerImage;
                  const radius = 450;
                  
                  return (
                    <div 
                      key={index} 
                      className="absolute left-1/2 top-1/2 w-72 h-96 cursor-pointer carousel-card transition-all duration-700"
                      style={{ 
                        transform: `translateX(-50%) translateY(-50%) rotateY(${angle}deg) translateZ(${diff === 0 ? radius + 50 : radius}px)`,
                        opacity: Math.abs(diff) <= 2 ? 1 : 0.3,
                        transformStyle: 'preserve-3d'
                      }}
                      onClick={() => setImagemDestaque(index)}
                    >
                      <img 
                        src={imagem.imagem} 
                        alt={imagem.nome} 
                        className="w-full h-full object-cover rounded-xl shadow-2xl"
                      />
                      {diff === 0 && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 rounded-b-xl">
                          <p className="text-white font-medium text-center">{imagem.nome}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Controles do Carrossel */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setImagemDestaque((prev) => (prev - 1 + getImagensTema(temaAtivo).length) % getImagensTema(temaAtivo).length)}
                className="w-12 h-12 rounded-full bg-white border-2 border-beige-300 text-beige-300 hover:bg-beige-300 hover:text-white transition-all shadow-lg flex items-center justify-center text-2xl font-bold"
              >
                ‹
              </button>
              <div className="flex gap-2">
                {getImagensTema(temaAtivo).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setImagemDestaque(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === imagemDestaque ? 'bg-beige-300 w-8' : 'bg-beige-300/30'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={() => setImagemDestaque((prev) => (prev + 1) % getImagensTema(temaAtivo).length)}
                className="w-12 h-12 rounded-full bg-white border-2 border-beige-300 text-beige-300 hover:bg-beige-300 hover:text-white transition-all shadow-lg flex items-center justify-center text-2xl font-bold"
              >
                ›
              </button>
            </div>
          </div>
        </section>

        <section id="como-funciona" className="snap-section snap-start min-h-screen flex items-center px-6 relative bg-gradient-to-b from-beige-50 to-white">
          <div className="max-w-6xl mx-auto w-full py-20">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif text-brown-700 mb-3">
                Como <span className="text-beige-300 italic">funciona?</span>
              </h2>
              <p className="text-brown-600">Convites prontos! Simples, rápido e feito com carinho para você</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              
              {/* Card 1 - Escolha */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-beige-100 rounded-full mb-6">
                  <svg className="w-10 h-10 text-beige-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-serif text-brown-700 mb-3">1. Escolha seu convite</h3>
                <p className="text-brown-600 text-sm leading-relaxed">
                  Na próxima página ao clicar em "Escolher convites", você irá selecionar seus 2 convites preferidos e preencherá as informações do convite, como nome da criança, idade, endereço e observações.
                </p>
              </div>

              {/* Card 2 - Pagamento */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-beige-100 rounded-full mb-6">
                  <svg className="w-10 h-10 text-beige-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-serif text-brown-700 mb-3">2. Pagamento seguro</h3>
                <p className="text-brown-600 text-sm leading-relaxed">
                  Ao clicar em comprar, você sera redirecionada para o Mercado Pago, onde poderá pagar com cartão, PIX ou boleto de forma 100% segura.
                </p>
              </div>

              {/* Card 3 - Receba */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-beige-100 rounded-full mb-6">
                  <svg className="w-10 h-10 text-beige-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-serif text-brown-700 mb-3">3. Entrega do Convite</h3>
                <p className="text-brown-600 text-sm leading-relaxed">
                  Após a confirmação do pagamento, nossa equipe já começa a transformar seus 2 convites preferidos com as informações da sua festa. Mas fique tranquila, antes de entregar a versão finalizada, entraremos em contato para verificar se está tudo certo conforme você planejou!
                </p>
              </div>

            </div>

            {/* Destaque adicional */}
            <div className="bg-gradient-to-r from-beige-100 to-rose-100 rounded-2xl p-8 text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Heart className="w-6 h-6 text-beige-300" />
                <h3 className="text-xl font-serif text-brown-700">Convite Personalizado</h3>
                <Heart className="w-6 h-6 text-beige-300" />
              </div>
              <p className="text-brown-600 max-w-2xl mx-auto">
                Aqui é onde a sua imaginação ganha espaço! Selecionando o convite personalizado, você será direcionada para uma página onde pode nos dizer com suas palavras como é o convite perfeito para você. Defina cores, elementos, imagens, texto e muito mais! E mais uma vez, para que você fique tranquila e tenha certeza que ficará perfeito, nossa equipe fará duas revisões com você para garantir que cada detalhe esteja perfeito!
              </p>
            </div>
          </div>
        </section>

        <section id="produtos" className="snap-section snap-start py-12 px-6 min-h-screen flex items-center bg-gradient-to-b from-white to-beige-50">
          <div className="max-w-7xl mx-auto w-full">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif text-brown-700 mb-3">
                Escolha seu <span className="text-beige-300 italic">convite perfeito</span>
              </h2>
              <p className="text-brown-600">Convites prontos, totalmente personalizados ou faça a assinatura e tenha todo mês uma arte para o seu Mêsversário!</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
              
              {/* Card 1 - Templates Prontos */}
              <div className="bg-white rounded-[2rem] p-8 shadow-2xl border border-beige-200/50 hover:shadow-3xl transition-all flex flex-col h-[580px]">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-beige-100 rounded-full mb-4">
                    <Sparkles className="w-10 h-10 text-beige-300" />
                  </div>
                  <h3 className="text-2xl font-serif text-brown-700 mb-2">Convites Prontos</h3>
                  <p className="text-brown-600 text-sm">Escolha 2 convites do mesmo tema</p>
                </div>
                
                <ul className="space-y-3 mb-6 flex-grow">
                  <li className="flex items-start gap-2 text-brown-600">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Preencha as informações do evento</span>
                  </li>
                  <li className="flex items-start gap-2 text-brown-600">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Nossa equipe faz uma revisão</span>
                  </li>
                  <li className="flex items-start gap-2 text-brown-600">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Pronto! te entregamos uma imagem de alta qualidade do convite e um arquivo configurado para impressão</span>
                  </li>
                </ul>
                
                <div className="mt-auto space-y-3">
                  <button 
                    onClick={() => window.location.href = '/pre-checkout/template'} 
                    className="w-full py-3.5 bg-beige-300 text-white rounded-full font-medium hover:bg-beige-400 transition-all"
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
              </div>

              {/* Card 2 - Personalizado */}
              <div className="bg-gradient-to-br from-beige-300 to-beige-400 rounded-[2rem] p-8 shadow-2xl text-white hover:shadow-3xl transition-all relative overflow-hidden flex flex-col h-[580px]">
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold">
                  EXCLUSIVO
                </div>
                
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                    <Heart className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-serif mb-2">Convite Personalizado</h3>
                  <p className="text-white/90 text-sm">Criado especialmente para você</p>
                </div>
                
                <ul className="space-y-3 mb-6 flex-grow">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Design 100% exclusivo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Criado do zero para você</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Atendimento personalizado</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                    <span className="text-sm">2 revisões incluídas</span>
                  </li>
                </ul>
                
                <div className="mt-auto space-y-3">
                  <button 
                    onClick={() => window.location.href = '/pre-checkout/personalizado'} 
                    className="w-full py-3.5 bg-white text-beige-300 rounded-full font-medium hover:bg-white/90 transition-all"
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

              {/* Card 3 - Assinatura Mêsversário */}
              <div className="bg-gradient-to-br from-rose-200 to-beige-200 rounded-[2rem] p-8 shadow-2xl hover:shadow-3xl transition-all relative overflow-hidden flex flex-col h-[580px]">
                <div className="absolute top-4 right-4 bg-white/40 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-brown-700">
                  NOVO
                </div>
                
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-white/40 backdrop-blur-sm rounded-full mb-4">
                    <Star className="w-10 h-10 text-beige-400" />
                  </div>
                  <h3 className="text-2xl font-serif text-brown-700 mb-2">Assinatura Mêsversário</h3>
                  <p className="text-brown-700 text-sm">12 artes personalizadas para o 1º ano</p>
                </div>
                
                <ul className="space-y-3 mb-6 flex-grow">
                  <li className="flex items-start gap-2 text-brown-700">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">12 artes exclusivas (1 por mês)</span>
                  </li>
                  <li className="flex items-start gap-2 text-brown-700">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Acompanhe o crescimento do bebê</span>
                  </li>
                  <li className="flex items-start gap-2 text-brown-700">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Perfeito para redes sociais</span>
                  </li>
                  <li className="flex items-start gap-2 text-brown-700">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Ao final do 12º mês, grátis imagens de Varal do Crescimento!</span>
                  </li>
                </ul>
                
                <div className="mt-auto space-y-3">
                  <button 
                    onClick={() => window.location.href = getWhatsAppLink("Assinatura Mêsversário", "Quero saber mais sobre a assinatura!")}
                    className="w-full py-3.5 bg-beige-300 text-white rounded-full font-medium hover:bg-beige-400 transition-all"
                  >
                    Saber Mais
                  </button>
                  <a 
                    href={getWhatsAppLink("Assinatura Mêsversário", "")} 
                    className="block text-center text-beige-300 border border-beige-300 py-3 rounded-full hover:bg-beige-50 transition-all"
                  >
                    Tirar Dúvidas
                  </a>
                </div>
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
