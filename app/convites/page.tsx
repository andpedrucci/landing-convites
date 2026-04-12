'use client';

import { useState, useEffect } from 'react';
import { Heart, Sparkles, CheckCircle2, Send } from 'lucide-react';
import { imagensPorTema } from '@/lib/templates-data';

export default function ConvitesPage() {
  const [mounted, setMounted] = useState(false);
  const [temaAtivo, setTemaAtivo] = useState('aniversario');
  const [imagemDestaque, setImagemDestaque] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const music = new Audio('/sunshine.mp3');
    music.loop = true;
    music.volume = 0.5;
    setAudio(music);
    return () => { music.pause(); setAudio(null); };
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
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => { setImagemDestaque(0); }, [temaAtivo]);

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
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <main className="snap-y snap-mandatory h-screen overflow-y-scroll scroll-smooth">

        {/* ── HERO ── */}
        <section id="hero" className="snap-section snap-start relative overflow-hidden min-h-screen flex items-center">
          <div className="absolute top-20 right-10 w-[500px] h-[500px] bg-rose-200 opacity-20 blur-[120px] rounded-full animate-pulse" style={{animationDuration: '4s'}} />
          <div className="absolute bottom-20 left-10 w-[400px] h-[400px] bg-beige-300 opacity-20 blur-[100px] rounded-full animate-pulse" style={{animationDuration: '5s'}} />

          <div className="relative max-w-7xl mx-auto px-6 py-20 w-full">
            <div className={`text-center transition-all duration-1000 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
              <a href="https://studioinvitare.com.br">
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/70 backdrop-blur-md rounded-full border border-beige-300/30 shadow-sm hover:bg-white/90 transition-all">
                  <span className="text-sm font-medium text-brown-600 tracking-[0.25em] uppercase">Studio Invitare</span>
                </div>
              </a>
              <h1 className="text-6xl md:text-8xl font-serif text-brown-700 mb-8 leading-[1.1] px-4 mt-16">
                Convites que tocam<br />
                <span className="text-beige-300 italic font-light">o coração</span>
              </h1>
              <p className="text-xl md:text-2xl text-brown-600 max-w-3xl mx-auto mb-14 font-light leading-relaxed px-4">
                Escolha entre dezenas de estilos para a festa do seu filho!<br className="hidden md:block" />
                Nós cuidamos <b>com todo carinho</b> de todo o processo para você.
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

        {/* ── CARROSSEL ── */}
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
                  if (isMobile && Math.abs(diff) > 1) return null;
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
                      <img src={imagem.imagem} alt={imagem.nome} className="w-full h-full object-cover rounded-xl shadow-2xl" />
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
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setImagemDestaque((prev) => (prev - 1 + getImagensTema(temaAtivo).length) % getImagensTema(temaAtivo).length)}
                className="w-12 h-12 rounded-full bg-white border-2 border-beige-300 text-beige-300 hover:bg-beige-300 hover:text-white transition-all shadow-lg flex items-center justify-center text-2xl font-bold"
              >‹</button>
              <div className="flex gap-2">
                {getImagensTema(temaAtivo).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setImagemDestaque(index)}
                    className={`w-2 h-2 rounded-full transition-all ${index === imagemDestaque ? 'bg-beige-300 w-8' : 'bg-beige-300/30'}`}
                  />
                ))}
              </div>
              <button
                onClick={() => setImagemDestaque((prev) => (prev + 1) % getImagensTema(temaAtivo).length)}
                className="w-12 h-12 rounded-full bg-white border-2 border-beige-300 text-beige-300 hover:bg-beige-300 hover:text-white transition-all shadow-lg flex items-center justify-center text-2xl font-bold"
              >›</button>
            </div>
          </div>
        </section>

        {/* ── COMO FUNCIONA ── */}
        <section id="como-funciona" className="snap-section snap-start min-h-screen flex items-center px-6 relative bg-gradient-to-b from-beige-50 to-white">
          <div className="max-w-6xl mx-auto w-full py-20">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif text-brown-700 mb-3">
                Como <span className="text-beige-300 italic">funciona?</span>
              </h2>
              <p className="text-brown-600">Simples, rápido e feito com carinho para você</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-beige-100 rounded-full mb-6">
                  <svg className="w-10 h-10 text-beige-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-serif text-brown-700 mb-3">1. Escolha seu convite</h3>
                <p className="text-brown-600 text-sm leading-relaxed">
                  Navegue pelos temas e selecione 2 convites do mesmo tema que você mais gostou. Preencha as informações do evento: nome da criança, idade, data, endereço e observações.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-beige-100 rounded-full mb-6">
                  <svg className="w-10 h-10 text-beige-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-serif text-brown-700 mb-3">2. Pagamento seguro</h3>
                <p className="text-brown-600 text-sm leading-relaxed">
                  Você é redirecionada para o Mercado Pago, onde pode pagar com cartão, PIX ou boleto de forma 100% segura. O pacote completo por apenas R$ 20,00.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-beige-100 rounded-full mb-6">
                  <svg className="w-10 h-10 text-beige-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-serif text-brown-700 mb-3">3. Entrega do convite</h3>
                <p className="text-brown-600 text-sm leading-relaxed">
                  Nossa equipe personaliza os 2 convites com as informações da sua festa e entra em contato para uma revisão antes da entrega final em alta resolução.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── PRODUTO ── */}
        <section id="produtos" className="snap-section snap-start py-12 px-6 min-h-screen flex items-center bg-gradient-to-b from-white to-beige-50">
          <div className="max-w-4xl mx-auto w-full">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif text-brown-700 mb-3">
                Tudo que você precisa,{' '}
                <span className="text-beige-300 italic">sem complicação</span>
              </h2>
              <p className="text-brown-600">Um pacote completo para a festa do seu filho</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">

              {/* CARD PRINCIPAL */}
              <div className="bg-gradient-to-br from-beige-300 to-beige-400 rounded-[2rem] p-8 shadow-2xl text-white flex flex-col">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-serif mb-1">Convites Prontos</h3>
                  <p className="text-white/80 text-sm">Escolha 2 convites do mesmo tema</p>
                </div>

                <div className="text-center mb-6">
                  <p className="text-white/60 text-sm line-through mb-1">R$ 39,90</p>
                  <p className="text-5xl font-serif font-bold">R$ 20</p>
                  <p className="text-white/70 text-sm mt-1">pacote com 2 convites</p>
                </div>

                <ul className="space-y-3 mb-8 flex-grow">
                  {[
                    'Escolha 2 convites do mesmo tema',
                    'Personalizamos com os dados do evento',
                    'Revisão antes da entrega final',
                    'Entrega em alta resolução para impressão',
                    'Atendimento via WhatsApp',
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-white/90">{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => window.location.href = '/pre-checkout/template'}
                  className="w-full py-4 bg-white text-beige-300 rounded-full font-semibold hover:bg-white/90 transition-all hover:scale-105"
                >
                  Escolher meus convites
                </button>
              </div>

              {/* CTA PERSONALIZADO */}
              <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-beige-200 flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-beige-100 rounded-full mb-5">
                    <Heart className="w-8 h-8 text-beige-300" />
                  </div>
                  <h3 className="text-xl font-serif text-brown-700 mb-3">
                    Precisa de algo mais personalizado?
                  </h3>
                  <p className="text-brown-600 text-sm leading-relaxed mb-6">
                    Se você tem uma ideia específica em mente — cores, elementos, tema exclusivo — fala com a gente pelo WhatsApp. Criamos o convite perfeito do zero para você, com carinho e atenção a cada detalhe.
                  </p>
                  <ul className="space-y-2 mb-8">
                    {[
                      'Design 100% exclusivo',
                      'Criado do zero para você',
                      '2 revisões incluídas',
                      'Atendimento personalizado',
                    ].map((f) => (
                      <li key={f} className="flex items-center gap-2 text-brown-600 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <a
                  href={getWhatsAppLink("Convite Personalizado", "Gostaria de criar um convite exclusivo!")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-4 bg-green-500 text-white rounded-full font-semibold hover:bg-green-600 transition-all hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Falar no WhatsApp
                </a>
              </div>

            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" className="snap-section snap-start min-h-screen flex items-center px-6 py-20 bg-gradient-to-b from-beige-50 to-white">
          <div className="max-w-4xl mx-auto w-full">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif text-brown-700 mb-3">
                Perguntas <span className="text-beige-300 italic">Frequentes</span>
              </h2>
              <p className="text-brown-600">Tire suas dúvidas sobre nossos convites</p>
            </div>
            <div className="space-y-4">
              {[
                {
                  q: 'Como funciona a entrega dos convites?',
                  a: 'Após a confirmação do pagamento, você receberá uma prévia dos 2 convites personalizados em até 48h úteis. Nossa equipe fará uma revisão com você antes da entrega final.',
                },
                {
                  q: 'Posso editar os convites depois de receber?',
                  a: 'Os convites são entregues em alta resolução (PNG/JPG) e PDF para impressão. Se precisar de ajustes, entre em contato — fazemos edições adicionais por R$ 9,90.',
                },
                {
                  q: 'Por que só posso escolher convites do mesmo tema?',
                  a: 'Para garantir coerência visual, trabalhamos com 2 variações dentro do mesmo tema. Assim você escolhe a que ficou mais bonita com os dados do seu evento.',
                },
                {
                  q: 'Posso imprimir os convites?',
                  a: 'Sim! Entregamos em alta resolução e no formato ideal para impressão. Pode imprimir em qualquer gráfica ou em casa.',
                },
                {
                  q: 'Quais formas de pagamento vocês aceitam?',
                  a: 'Aceitamos cartão de crédito (até 3x), PIX (aprovação imediata) e boleto bancário — tudo via Mercado Pago, 100% seguro.',
                },
              ].map((item) => (
                <details key={item.q} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all group">
                  <summary className="flex items-center justify-between cursor-pointer font-semibold text-brown-700 text-lg">
                    <span>{item.q}</span>
                    <span className="text-beige-300 text-2xl group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="mt-4 text-brown-600 leading-relaxed">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA FINAL + FOOTER ── */}
        <section className="snap-section snap-start min-h-screen flex flex-col bg-gradient-to-b from-white to-beige-50">
          <div className="flex-grow flex items-center px-6 py-12">
            <div className="max-w-4xl mx-auto w-full text-center">
              <div className="bg-gradient-to-r from-beige-100 to-rose-100 rounded-3xl p-12 shadow-2xl">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/60 backdrop-blur-sm rounded-full mb-6">
                  <Send className="w-10 h-10 text-beige-300" />
                </div>
                <h2 className="text-3xl md:text-4xl font-serif text-brown-700 mb-4">Ainda tem dúvidas?</h2>
                <p className="text-brown-600 text-lg mb-8 max-w-2xl mx-auto">
                  Estamos aqui para te ajudar! Entre em contato pelo WhatsApp e vamos conversar sobre o convite perfeito para você.
                </p>
                <a
                  href={getWhatsAppLink("Dúvidas", "Olá! Tenho algumas dúvidas sobre os convites.")}
                  className="inline-flex items-center gap-3 px-10 py-5 bg-green-500 text-white rounded-full font-semibold text-lg hover:bg-green-600 transition-all shadow-xl hover:scale-105"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Falar no WhatsApp
                </a>
                <div className="mt-8 pt-8 border-t border-brown-700/10">
                  <p className="text-brown-600 text-sm">
                    Ou nos envie um e-mail:{' '}
                    <a href="mailto:contato@studioinvitare.com.br" className="text-beige-300 hover:underline">
                      contato@studioinvitare.com.br
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <footer className="bg-brown-700 text-white rounded-t-3xl w-full">
            <div className="max-w-7xl mx-auto px-6 py-10">
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-serif mb-3">Studio Invitare</h3>
                  <p className="text-white/80 text-xs leading-relaxed mb-3">
                    Criamos convites digitais com carinho e dedicação para tornar seu momento ainda mais especial.
                  </p>
                  <div className="flex gap-2">
                    <a href="https://instagram.com/studioinvitare" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                    <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </a>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold mb-3">Links Rápidos</h3>
                  <ul className="space-y-1.5 text-xs">
                    <li><button onClick={() => scrollToSection('hero')} className="text-white/80 hover:text-white transition-colors">Início</button></li>
                    <li><button onClick={() => scrollToSection('carrossel')} className="text-white/80 hover:text-white transition-colors">Nossos Temas</button></li>
                    <li><button onClick={() => scrollToSection('produtos')} className="text-white/80 hover:text-white transition-colors">Produto</button></li>
                    <li><button onClick={() => scrollToSection('faq')} className="text-white/80 hover:text-white transition-colors">FAQ</button></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold mb-3">Contato</h3>
                  <ul className="space-y-1.5 text-xs">
                    <li className="text-white/80">contato@studioinvitare.com.br</li>
                    <li className="text-white/80">(11) 99508-7592</li>
                    <li className="text-white/80">Seg - Sex: 9h às 18h</li>
                  </ul>
                </div>
              </div>

              <div className="border-t border-white/10 pt-5 mb-5">
                <div className="flex flex-wrap items-center justify-center gap-6 text-white/60" style={{fontSize: '10px'}}>
                  {[
                    { label: 'Compra Segura', path: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
                    { label: 'Pagamento Protegido', path: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
                    { label: 'Suporte Dedicado', path: 'M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z' },
                    { label: 'Entrega Rápida', path: 'M13 10V3L4 14h7v7l9-11h-7z' },
                  ].map(item => (
                    <div key={item.label} className="flex flex-col items-center gap-1">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.path} />
                      </svg>
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/10 pt-5 text-center text-xs">
                <p className="text-white/60">© 2025 Studio Invitare - Todos os direitos reservados</p>
                <p className="text-white/40 mt-1" style={{fontSize: '10px'}}>Desenvolvido com 💕 para criar momentos inesquecíveis</p>
              </div>
            </div>

            {isPlaying && (
              <button
                onClick={() => audio?.paused ? audio.play() : audio?.pause()}
                className="fixed bottom-24 right-8 bg-white/80 p-3 rounded-full shadow-lg text-brown-600 text-[10px] font-bold hover:bg-white transition-all z-40"
              >
                SOM ON/OFF
              </button>
            )}

            <a
              href={getWhatsAppLink("Olá!", "Gostaria de fazer um pedido")}
              target="_blank"
              rel="noopener noreferrer"
              className="fixed bottom-8 right-8 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 transition-all hover:scale-110 z-50 flex items-center justify-center"
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
          </footer>
        </section>

      </main>
    </>
  );
}
