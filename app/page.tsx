'use client';

import { useState, useEffect } from 'react';
import { Heart, Sparkles, Clock, CheckCircle2, Star, Send } from 'lucide-react';

// Definição das imagens por tema
const imagensPorTema = {
  'cha-revelacao': [
    { nome: 'Delicado Rosa', descricao: 'Tons suaves e flores', emoji: '🌸' },
    { nome: 'Azul Clássico', descricao: 'Elegante e atemporal', emoji: '💙' },
    { nome: 'Neutro Moderno', descricao: 'Minimalista e chic', emoji: '🤍' },
    { nome: 'Aquarela', descricao: 'Arte fluida e única', emoji: '🎨' },
    { nome: 'Floral Dourado', descricao: 'Sofisticado com toques de ouro', emoji: '✨' },
  ],
  'aniversario': [
    { nome: 'Festa Jardim', descricao: 'Flores e borboletas', emoji: '🦋' },
    { nome: 'Circo Colorido', descricao: 'Alegre e divertido', emoji: '🎪' },
    { nome: 'Unicórnio Mágico', descricao: 'Encanto e fantasia', emoji: '🦄' },
    { nome: 'Safari Aventura', descricao: 'Animais selvagens', emoji: '🦁' },
    { nome: 'Princesa Realeza', descricao: 'Elegante e real', emoji: '👑' },
  ],
  'batizado': [
    { nome: 'Clássico Branco', descricao: 'Puro e tradicional', emoji: '🕊️' },
    { nome: 'Anjo Delicado', descricao: 'Celestial e suave', emoji: '👼' },
    { nome: 'Cruz Dourada', descricao: 'Religioso elegante', emoji: '✝️' },
    { nome: 'Floral Divino', descricao: 'Natureza e fé', emoji: '🌿' },
    { nome: 'Azul Serenidade', descricao: 'Paz e harmonia', emoji: '💫' },
  ],
  'cha-bebe': [
    { nome: 'Nuvens Sonhadoras', descricao: 'Suave como algodão', emoji: '☁️' },
    { nome: 'Bichinhos Fofos', descricao: 'Animais adoráveis', emoji: '🐻' },
    { nome: 'Lua e Estrelas', descricao: 'Noite mágica', emoji: '🌙' },
    { nome: 'Jardim Encantado', descricao: 'Flores delicadas', emoji: '🌺' },
    { nome: 'Balões Coloridos', descricao: 'Alegria no ar', emoji: '🎈' },
  ],
  'mesversario': [
    { nome: 'Minimalista Mensal', descricao: 'Clean e moderno', emoji: '📅' },
    { nome: 'Números Divertidos', descricao: 'Cada mês especial', emoji: '🔢' },
    { nome: 'Foto Destaque', descricao: 'Seu bebê é a estrela', emoji: '📸' },
    { nome: 'Tema Crescimento', descricao: 'Registrando marcos', emoji: '📏' },
    { nome: 'Alegria Mensal', descricao: 'Celebrando juntos', emoji: '🎊' },
  ],
};

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [isLoadingCheckout, setIsLoadingCheckout] = useState(false);
  const [temaAtivo, setTemaAtivo] = useState('cha-revelacao');
  const [rotacao, setRotacao] = useState(0);
  const [imagemDestaque, setImagemDestaque] = useState(0);
  const [secaoAtual, setSecaoAtual] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Resetar rotação quando mudar de tema
  useEffect(() => {
    setRotacao(0);
    setImagemDestaque(0);
  }, [temaAtivo]);

  // Detectar seção atual baseada no scroll - CORRIGIDO DINAMICAMENTE
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.snap-section');
      
      sections.forEach((section, index) => {
        const element = section as HTMLElement;
        const rect = element.getBoundingClientRect();
        
        // Considera a seção atual quando ela está mais próxima do topo da viewport
        // ou quando ocupa a maior parte da tela visível
        if (rect.top <= 100 && rect.bottom >= 100) {
          setSecaoAtual(index);
        }
      });
    };

    handleScroll(); // Executar imediatamente
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Também executar após um pequeno delay para garantir que pegue o estado inicial
    setTimeout(handleScroll, 100);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const whatsappNumber = "5511999999999";
  
  const getWhatsAppLink = (produto: string, preco: string) => {
    const message = encodeURIComponent(
      `Olá! Tenho interesse no *${produto}* (${preco}). Gostaria de mais informações! 💕`
    );
    return `https://wa.me/${whatsappNumber}?text=${message}`;
  };

  const getImagensTema = (tema: string) => {
    return imagensPorTema[tema as keyof typeof imagensPorTema] || imagensPorTema['cha-revelacao'];
  };

  const handleComprarTemplate = async () => {
    setIsLoadingCheckout(true);
    
    try {
      const response = await fetch('/api/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: '5 Templates Digitais Premium',
          price: 47,
        }),
      });

      const data = await response.json();

      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        alert('Erro ao processar pagamento. Tente novamente.');
        setIsLoadingCheckout(false);
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao processar pagamento. Tente novamente.');
      setIsLoadingCheckout(false);
    }
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
      {/* Indicador de Navegação Lateral - CORRIGIDO DINAMICAMENTE */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-4">
        {secoes.map((secao, index) => (
          <button
            key={secao.id}
            onClick={() => scrollToSection(secao.id)}
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
        
        {/* Hero Section */}
        <section id="hero" className="snap-section snap-start relative overflow-hidden min-h-screen flex items-center">
          <div className="absolute top-20 right-10 w-[500px] h-[500px] bg-rose-200 opacity-20 blur-[120px] rounded-full animate-pulse" style={{animationDuration: '4s'}} />
          <div className="absolute bottom-20 left-10 w-[400px] h-[400px] bg-beige-300 opacity-20 blur-[100px] rounded-full animate-pulse" style={{animationDuration: '5s'}} />
          
          <div className="relative max-w-7xl mx-auto px-6 py-20 w-full">
            <div className={`text-center transition-all duration-1000 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
              
              {/* Badge */}
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

              {/* Headline */}
              <h1 className="text-6xl md:text-8xl font-serif text-brown-700 mb-8 leading-[1.1] px-4 mt-16">
                Convites que tocam
                <br />
                <span className="text-beige-300 italic font-light">o coração</span>
              </h1>
              
              {/* Subheadline */}
              <p className="text-xl md:text-2xl text-brown-600 max-w-2xl mx-auto mb-14 font-light leading-relaxed px-4">
                Transforme momentos especiais em convites digitais inesquecíveis.
                <br className="hidden md:block" />
                Criados com carinho para celebrar sua história.
              </p>

              {/* CTA Principal */}
              <button
                onClick={() => scrollToSection('carrossel')}
                className="inline-flex items-center gap-2 px-12 py-5 bg-beige-300 text-white rounded-full font-medium text-lg hover:bg-beige-400 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl group"
              >
                <span>Ver Convites</span>
                <Heart className="w-5 h-5 group-hover:fill-white transition-all" />
              </button>
            </div>
          </div>
        </section>

        {/* Seção Carrossel 3D - AJUSTADO COM MELHOR ESPAÇAMENTO */}
        <section id="carrossel" className="snap-section snap-start py-16 px-6 relative overflow-hidden min-h-screen flex items-center bg-gradient-to-b from-beige-50 via-white to-beige-50">
          
          <div className="relative max-w-7xl mx-auto w-full">
            
            {/* Header - COMPACTO E EM UMA LINHA */}
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-serif text-brown-700 mb-2">
                Explore nossos <span className="text-beige-300 italic">temas exclusivos</span>
              </h2>
              <p className="text-sm text-brown-600 font-light">Escolha o estilo perfeito para o seu momento</p>
            </div>

            {/* Menu de Temas - COMPACTO */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {[
                { id: 'cha-revelacao', label: 'Chá Revelação', emoji: '🤱' },
                { id: 'aniversario', label: 'Aniversário', emoji: '🎂' },
                { id: 'batizado', label: 'Batizado', emoji: '✨' },
                { id: 'cha-bebe', label: 'Chá de Bebê', emoji: '🍼' },
                { id: 'mesversario', label: 'Mesversário', emoji: '🎈' },
              ].map((tema) => (
                <button
                  key={tema.id}
                  onClick={() => setTemaAtivo(tema.id)}
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

            {/* Carrossel 3D - CENTRALIZADO FIXO COM TRANSPARÊNCIA E ESCALA GRADATIVAS */}
            <div className="relative h-[340px] flex items-center justify-center mb-8" style={{ perspective: '1800px' }}>
              <div 
                className="relative w-full h-full flex items-center justify-center"
              >
                <div
                  className="relative"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: `rotateY(${rotacao}deg)`,
                    transition: 'transform 0.7s ease-out',
                    width: '240px',
                    height: '288px'
                  }}
                >
                  {getImagensTema(temaAtivo).map((imagem, index) => {
                    const totalImagens = getImagensTema(temaAtivo).length;
                    const angulo = (360 / totalImagens) * index;
                    const translateZ = 300;
                    
                    // Calcular a posição do card em relação à frente (0 graus)
                    const anguloNormalizado = ((angulo - rotacao) % 360 + 360) % 360;
                    
                    // Calcular opacidade e escala baseada no ângulo
                    // 0° (frente) = opacity: 1 (100%), scale: 1 (100%)
                    // 90° e 270° (laterais) = opacity: 0.4 (40%), scale: 0.85 (85%)
                    // 180° (trás) = opacity: 0.1 (10%), scale: 0.7 (70%)
                    let opacidade = 1;
                    let escala = 1;
                    
                    if (anguloNormalizado <= 90) {
                      // Frente → Lateral direita
                      const progresso = anguloNormalizado / 90;
                      opacidade = 1 - progresso * 0.6; // 1 → 0.4
                      escala = 1 - progresso * 0.15; // 1 → 0.85
                    } else if (anguloNormalizado <= 180) {
                      // Lateral direita → Trás
                      const progresso = (anguloNormalizado - 90) / 90;
                      opacidade = 0.4 - progresso * 0.3; // 0.4 → 0.1
                      escala = 0.85 - progresso * 0.15; // 0.85 → 0.7
                    } else if (anguloNormalizado <= 270) {
                      // Trás → Lateral esquerda
                      const progresso = (anguloNormalizado - 180) / 90;
                      opacidade = 0.1 + progresso * 0.3; // 0.1 → 0.4
                      escala = 0.7 + progresso * 0.15; // 0.7 → 0.85
                    } else {
                      // Lateral esquerda → Frente
                      const progresso = (anguloNormalizado - 270) / 90;
                      opacidade = 0.4 + progresso * 0.6; // 0.4 → 1
                      escala = 0.85 + progresso * 0.15; // 0.85 → 1
                    }
                    
                    return (
                      <div
                        key={index}
                        className="absolute top-0 left-0 w-60 h-72 cursor-pointer"
                        style={{
                          transform: `rotateY(${angulo}deg) translateZ(${translateZ}px) scale(${escala})`,
                          backfaceVisibility: 'visible',
                          transformOrigin: 'center center',
                          opacity: opacidade,
                          transition: 'opacity 0.7s ease-out, transform 0.7s ease-out'
                        }}
                        onClick={() => setImagemDestaque(index)}
                      >
                        <div className="w-full h-full bg-white rounded-xl shadow-2xl overflow-hidden border-4 border-beige-200 hover:border-beige-300 transition-all duration-300">
                          <div className="w-full h-full bg-gradient-to-br from-beige-100 to-rose-100 flex items-center justify-center">
                            <div className="text-center p-4">
                              <div className="text-4xl mb-2">{imagem.emoji}</div>
                              <h3 className="text-base font-serif text-brown-700 mb-1">{imagem.nome}</h3>
                              <p className="text-xs text-brown-600">{imagem.descricao}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Controles do Carrossel - COMPACTOS */}
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setRotacao(rotacao + (360 / getImagensTema(temaAtivo).length))}
                className="p-3 bg-white rounded-full shadow-lg hover:bg-beige-50 transition-all hover:scale-110"
                aria-label="Anterior"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-beige-300">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
              </button>
              <button
                onClick={() => setRotacao(rotacao - (360 / getImagensTema(temaAtivo).length))}
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

        {/* Benefícios */}
        <section id="beneficios" className="snap-section snap-start py-24 min-h-screen flex items-center bg-white">
          <div className="max-w-6xl mx-auto px-6 w-full">
            <div className="grid md:grid-cols-3 gap-16">
              {[
                {
                  icon: <Clock className="w-8 h-8" strokeWidth={1.5} />,
                  title: "Receba na hora",
                  desc: "Templates entregues imediatamente. Personalizados em até 5 dias."
                },
                {
                  icon: <Heart className="w-8 h-8" strokeWidth={1.5} />,
                  title: "Feito com carinho",
                  desc: "Cada detalhe pensado para celebrar seu momento especial."
                },
                {
                  icon: <CheckCircle2 className="w-8 h-8" strokeWidth={1.5} />,
                  title: "Edite quando quiser",
                  desc: "Canva editável + arquivos PNG e PDF de alta qualidade."
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

        {/* Produtos - SEM MESVERSÁRIO, MAIS COMPACTO */}
        <section id="produtos" className="snap-section snap-start py-12 px-6 min-h-screen flex items-center bg-gradient-to-b from-white to-beige-50">
          <div className="max-w-6xl mx-auto w-full">
            
            {/* Header - COMPACTO */}
            <div className="text-center mb-10">
              <h2 className="text-4xl md:text-5xl font-serif text-brown-700 mb-3 leading-tight">
                Escolha seu
                <br />
                <span className="text-beige-300 italic">convite perfeito</span>
              </h2>
              <p className="text-base text-brown-600 font-light">Criado especialmente para o seu momento</p>
            </div>

            {/* Cards de Produtos - APENAS 2 CARDS */}
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              
              {/* Template Pronto */}
              <div className="bg-white rounded-[2rem] p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 relative overflow-hidden group border border-beige-200/50">
                
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-rose-200 opacity-10 blur-3xl group-hover:opacity-20 group-hover:scale-150 transition-all duration-700" />
                
                <div className="relative">
                  <div className="mb-6">
                    <div className="flex items-baseline justify-between mb-2">
                      <h3 className="text-2xl font-serif text-brown-700">Template Pronto</h3>
                      <div className="text-3xl font-bold text-beige-300">R$ 47</div>
                    </div>
                    <p className="text-brown-600/70 text-sm">Personalize você mesma</p>
                  </div>

                  <ul className="space-y-2.5 mb-8">
                    {[
                      "5 modelos lindos para escolher",
                      "Edite você mesma no Canva",
                      "PNG + PDF em alta qualidade",
                      "Entrega imediata"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 group/item">
                        <CheckCircle2 className="w-4 h-4 text-beige-300 mt-0.5 flex-shrink-0 group-hover/item:scale-110 transition-transform" strokeWidth={2} />
                        <span className="text-brown-700 leading-relaxed text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={handleComprarTemplate}
                    disabled={isLoadingCheckout}
                    className="flex items-center justify-center gap-2 w-full py-3.5 bg-beige-300 text-white text-center rounded-full font-medium hover:bg-beige-400 transition-all duration-300 shadow-md hover:shadow-xl group/btn disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoadingCheckout ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Processando...</span>
                      </>
                    ) : (
                      <>
                        <span>Comprar Agora!</span>
                        <Heart className="w-5 h-5 group-hover/btn:fill-white transition-all" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Personalizado */}
              <div className="bg-gradient-to-br from-beige-300 via-beige-400 to-beige-300 rounded-[2rem] p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 relative overflow-hidden group">
                
                <div className="absolute top-6 right-6 bg-rose-200 text-white px-4 py-1.5 rounded-full text-xs font-medium shadow-lg rotate-3 hover:rotate-6 transition-transform">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-3 h-3" fill="white" />
                    <span>Mais Escolhido</span>
                  </div>
                </div>

                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white opacity-10 blur-3xl group-hover:opacity-20 group-hover:scale-150 transition-all duration-700" />
                
                <div className="relative pt-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-serif text-white mb-1">Personalizado</h3>
                      <p className="text-white/80 text-xs">Exclusivo para você</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-white/70 mb-1">investimento</div>
                      <div className="text-3xl font-bold text-white">R$ 147</div>
                    </div>
                  </div>

                  <ul className="space-y-2.5 mb-6">
                    {[
                      "Design exclusivo pro seu momento",
                      "2 revisões incluídas",
                      "Arquivo final + Canva editável",
                      "Entrega em 3-5 dias úteis"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 group/item">
                        <Star className="w-4 h-4 text-white mt-0.5 flex-shrink-0 group-hover/item:scale-110 transition-transform" fill="white" strokeWidth={2} />
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

                  <a href={getWhatsAppLink("Personalizado", "R$ 147")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3.5 bg-white text-beige-300 text-center rounded-full font-medium hover:bg-beige-50 transition-all duration-300 shadow-xl hover:shadow-2xl group/btn"
                  >
                    <span>Quero Personalizado!</span>
                    <Send className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Depoimentos */}
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

        {/* FAQ - 2 COLUNAS, COMPACTO */}
        <section id="faq" className="snap-section snap-start py-12 px-6 min-h-screen flex items-center bg-beige-50">
          <div className="max-w-5xl mx-auto w-full">
            <h2 className="text-4xl md:text-5xl font-serif text-brown-700 text-center mb-10">
              Dúvidas Frequentes
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  q: "Os convites são digitais?",
                  a: "Sim! Você recebe o arquivo em alta qualidade para compartilhar por WhatsApp, redes sociais ou imprimir."
                },
                {
                  q: "Como funciona a entrega?",
                  a: "Templates prontos: entrega imediata. Personalizados: 3-5 dias úteis."
                },
                {
                  q: "Posso editar depois?",
                  a: "Sim! Você recebe o link do Canva editável para ajustes sempre que precisar."
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
                  a: "PNG e PDF em alta qualidade + link do Canva totalmente editável."
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

        {/* CTA Final */}
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

        {/* Footer */}
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
        </footer>

      </main>
    </>
  );
}
