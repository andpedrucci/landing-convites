'use client';

import { useState } from 'react';
import { Heart, CheckCircle2, Send, Star } from 'lucide-react';

export default function EnsaiosPage() {
  const whatsappNumber = '5511995087592';

  const temas = [
    { id: 'natalino', label: 'Natalino Rústico', emoji: '🎄' },
    { id: 'neve', label: 'Neve & Inverno', emoji: '❄️' },
    { id: 'papai-noel', label: 'Papai Noel', emoji: '🎅' },
    { id: 'floresta', label: 'Floresta Mágica', emoji: '🌲' },
  ];

  const planos = [
    {
      id: 'basico',
      nome: 'Básico',
      fotos: '2 fotos',
      precoRiscado: 'R$ 59,90',
      preco: 'R$ 39,90',
      destaque: false,
      features: [
        '2 imagens geradas com IA',
        '1 tema à sua escolha',
        'Entrega em até 24h',
        'Alta resolução',
      ],
    },
    {
      id: 'premium',
      nome: 'Premium',
      fotos: '4 fotos',
      precoRiscado: 'R$ 129,90',
      preco: 'R$ 67,90',
      destaque: true,
      features: [
        '4 imagens geradas com IA',
        '1 tema à sua escolha',
        'Seleção curada dos melhores resultados',
        'Entrega em até 24h',
        'Revisão incluída',
      ],
    },
  ];

  const [temaAtivo, setTemaAtivo] = useState('natalino');

  const getWhatsAppLink = (plano: string) => {
    const message = encodeURIComponent(
      `Olá! Tenho interesse no *Ensaio com IA - Plano ${plano}*. Gostaria de mais informações! 💕`
    );
    return `https://wa.me/${whatsappNumber}?text=${message}`;
  };

  const getWhatsAppDuvidas = () => {
    const message = encodeURIComponent(
      `Olá! Tenho dúvidas sobre o *Ensaio Natalino com IA*. Pode me ajudar? 💕`
    );
    return `https://wa.me/${whatsappNumber}?text=${message}`;
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-beige-50 to-beige-100">

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden min-h-[85vh] flex items-center px-6 py-20">
        <div className="absolute top-20 right-10 w-[400px] h-[400px] bg-rose-200 opacity-20 blur-[120px] rounded-full" />
        <div className="absolute bottom-20 left-10 w-[300px] h-[300px] bg-beige-300 opacity-20 blur-[100px] rounded-full" />

        <div className="relative max-w-7xl mx-auto w-full text-center">
          <a href="https://studioinvitare.com.br">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/70 backdrop-blur-md rounded-full border border-beige-300/30 shadow-sm mb-6 hover:bg-white/90 transition-all">
              <span className="text-sm font-medium text-brown-600 tracking-[0.2em] uppercase">Studio Invitare</span>
            </div>
          </a>

          <h1 className="text-5xl md:text-7xl font-serif text-brown-700 mb-6 leading-[1.1] px-4">
            Ensaio Natalino<br />
            <span className="text-beige-300 italic font-light">com Inteligência Artificial</span>
          </h1>

          <p className="text-xl md:text-2xl text-brown-600 max-w-3xl mx-auto mb-4 font-light leading-relaxed px-4">
            Transforme a foto do seu filho em um ensaio profissional de estúdio —{' '}
            <b>sem sair de casa.</b>
          </p>

          <p className="text-base text-brown-600/70 mb-12">
            Resultado com qualidade de fotógrafo profissional. Entregue pelo WhatsApp em até 24h.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={getWhatsAppLink('Premium')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-10 py-5 bg-beige-300 text-white rounded-full font-medium text-lg hover:bg-beige-400 transition-all duration-300 hover:scale-105 shadow-xl group"
            >
              <span>Criar meu ensaio</span>
              <Heart className="w-5 h-5 group-hover:fill-white transition-all" />
            </a>
            <a
              href={getWhatsAppDuvidas()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-10 py-5 bg-white text-brown-700 rounded-full font-medium text-lg hover:bg-beige-50 transition-all duration-300 shadow-lg border border-beige-200"
            >
              Tirar dúvidas
            </a>
          </div>
        </div>
      </section>

      {/* ===== GALERIA ===== */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-serif text-brown-700 mb-3">
              Qualidade de estúdio,{' '}
              <span className="text-beige-300 italic">direto no seu celular</span>
            </h2>
            <p className="text-brown-600">Resultados reais gerados com IA. Escolha o tema:</p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {temas.map((tema) => (
              <button
                key={tema.id}
                onClick={() => setTemaAtivo(tema.id)}
                className={`px-5 py-2.5 rounded-full font-medium transition-all duration-300 text-sm ${
                  temaAtivo === tema.id
                    ? 'bg-beige-300 text-white shadow-lg'
                    : 'bg-beige-50 text-brown-700 border border-beige-200 hover:bg-beige-100'
                }`}
              >
                <span className="mr-1.5">{tema.emoji}</span>
                {tema.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="row-span-2 rounded-2xl overflow-hidden bg-beige-50 border border-beige-200 min-h-[320px]">
              <img src="/selina-ia-01.png" alt="Ensaio natalino com IA" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-2xl overflow-hidden bg-beige-50 border border-beige-200 aspect-[3/4]">
              <img src="/selina-ia-02.png" alt="Ensaio natalino com IA" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-2xl overflow-hidden bg-beige-50 border border-beige-200 aspect-[3/4]">
              <img src="/selina-ia-03.png" alt="Ensaio natalino com IA" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-2xl overflow-hidden bg-beige-50 border border-beige-200 aspect-[3/4]">
              <img src="/selina-ia-04.png" alt="Ensaio natalino com IA" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-10 max-w-lg mx-auto">
            <div className="bg-beige-50 rounded-2xl p-5 text-center border border-beige-200">
              <p className="text-2xl font-serif font-bold text-beige-300 mb-1">100%</p>
              <p className="text-xs text-brown-600">Personalizado com o rosto do seu filho</p>
            </div>
            <div className="bg-beige-50 rounded-2xl p-5 text-center border border-beige-200">
              <p className="text-2xl font-serif font-bold text-beige-300 mb-1">24h</p>
              <p className="text-xs text-brown-600">Prazo de entrega após o envio da foto</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== COMO FUNCIONA ===== */}
      <section className="px-6 py-20 bg-gradient-to-b from-beige-50 to-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-brown-700 mb-3">
              Como <span className="text-beige-300 italic">funciona?</span>
            </h2>
            <p className="text-brown-600">Simples, rápido e feito com carinho para você</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: '1', titulo: 'Escolha o tema', texto: 'Natalino, neve, floresta mágica e mais temas disponíveis. Cada um tem cenário e decoração exclusivos.' },
              { num: '2', titulo: 'Envie uma foto', texto: 'Qualquer foto nítida do rosto do seu filho. Não precisa ser profissional — a IA cuida de todo o resto.' },
              { num: '3', titulo: 'Receba seu ensaio', texto: 'Imagens em alta resolução prontas para salvar, compartilhar e imprimir. Direto no seu WhatsApp.' },
            ].map((step) => (
              <div key={step.num} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-beige-100 rounded-full mb-5">
                  <span className="font-serif text-2xl text-beige-300 font-bold">{step.num}</span>
                </div>
                <h3 className="text-lg font-serif text-brown-700 mb-3">{step.titulo}</h3>
                <p className="text-brown-600 text-sm leading-relaxed">{step.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PLANOS ===== */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-brown-700 mb-3">
              Escolha seu <span className="text-beige-300 italic">plano</span>
            </h2>
            <p className="text-brown-600">Sem taxa de estúdio. Sem agendar horário. Sem sair de casa.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {planos.map((plano) => (
              <div
                key={plano.id}
                className={`rounded-[2rem] p-8 shadow-xl flex flex-col transition-all hover:shadow-2xl ${
                  plano.destaque
                    ? 'bg-gradient-to-br from-beige-300 to-beige-400 text-white relative overflow-hidden'
                    : 'bg-white border border-beige-200'
                }`}
              >
                {plano.destaque && (
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold">
                    MAIS POPULAR
                  </div>
                )}
                <div className="mb-5">
                  <h3 className={`text-2xl font-serif mb-1 ${plano.destaque ? 'text-white' : 'text-brown-700'}`}>{plano.nome}</h3>
                  <p className={`text-sm ${plano.destaque ? 'text-white/80' : 'text-brown-600'}`}>{plano.fotos} em alta resolução</p>
                </div>
                <div className="mb-6">
                  <p className={`text-sm line-through mb-1 ${plano.destaque ? 'text-white/50' : 'text-brown-600/40'}`}>{plano.precoRiscado}</p>
                  <p className={`text-4xl font-serif font-bold ${plano.destaque ? 'text-white' : 'text-brown-700'}`}>{plano.preco}</p>
                </div>
                <ul className="space-y-2.5 mb-8 flex-grow">
                  {plano.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plano.destaque ? 'text-white' : 'text-green-500'}`} />
                      <span className={`text-sm ${plano.destaque ? 'text-white/90' : 'text-brown-600'}`}>{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={getWhatsAppLink(plano.nome)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block text-center py-4 rounded-full font-medium transition-all hover:scale-105 ${
                    plano.destaque ? 'bg-white text-beige-300 hover:bg-white/90' : 'bg-beige-300 text-white hover:bg-beige-400'
                  }`}
                >
                  Criar meu ensaio
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="px-6 py-20 bg-gradient-to-b from-beige-50 to-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-brown-700 mb-3">
              Perguntas <span className="text-beige-300 italic">Frequentes</span>
            </h2>
          </div>
          <div className="space-y-4">
            {[
              { q: 'O rosto fica parecido com meu filho de verdade?', a: 'Sim. A IA preserva os traços faciais com alta precisão — olhos, tom de pele e características são mantidos. Os resultados são impressionantes.' },
              { q: 'Que tipo de foto devo enviar?', a: 'Qualquer foto nítida do rosto, de frente ou levemente de lado. Não precisa ser profissional — foto de celular funciona muito bem.' },
              { q: 'Como recebo as imagens?', a: 'Diretamente pelo WhatsApp em alta resolução, prontas para salvar, compartilhar ou imprimir.' },
              { q: 'Funciona para qualquer idade?', a: 'Funciona melhor para bebês e crianças de 0 a 8 anos. Quanto mais nítida a foto do rosto, melhor o resultado.' },
              { q: 'Quantos temas estão disponíveis?', a: 'Hoje temos 4 temas natalinos: Natalino Rústico, Neve & Inverno, Papai Noel e Floresta Mágica. Novos temas serão lançados em breve.' },
            ].map((item) => (
              <details key={item.q} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all group">
                <summary className="flex items-center justify-between cursor-pointer font-semibold text-brown-700 text-base">
                  <span>{item.q}</span>
                  <span className="text-beige-300 text-2xl group-open:rotate-45 transition-transform ml-4 flex-shrink-0">+</span>
                </summary>
                <p className="mt-4 text-brown-600 text-sm leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="px-6 py-20 bg-gradient-to-b from-white to-beige-50">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-beige-100 to-rose-100 rounded-3xl p-12 shadow-2xl text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/60 backdrop-blur-sm rounded-full mb-5">
              <Star className="w-9 h-9 text-beige-300" />
            </div>
            <h2 className="text-3xl md:text-4xl font-serif text-brown-700 mb-4">
              Transforme a foto do seu filho<br />
              <span className="text-beige-300 italic">em um ensaio inesquecível</span>
            </h2>
            <p className="text-brown-600 mb-8">
              Sem sair de casa. Sem estúdio. Sem estresse.<br />
              Resultado profissional no seu WhatsApp em até 24h.
            </p>
            <a
              href={getWhatsAppLink('Premium')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-12 py-5 bg-beige-300 text-white rounded-full font-semibold text-lg hover:bg-beige-400 transition-all shadow-xl hover:scale-105"
            >
              <Send className="w-5 h-5" />
              Criar meu ensaio agora
            </a>
            <p className="text-xs text-brown-600/50 mt-6">
              Atendimento via WhatsApp · Studio Invitare
            </p>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-brown-700 text-white rounded-t-3xl w-full">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-serif mb-3">Studio Invitare</h3>
              <p className="text-white/80 text-xs leading-relaxed mb-3">
                Criamos convites digitais e ensaios com IA com carinho e dedicação para tornar seu momento ainda mais especial.
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
                <li><a href="https://studioinvitare.com.br" className="text-white/80 hover:text-white transition-colors">Início</a></li>
                <li><a href="https://convites.studioinvitare.com.br" className="text-white/80 hover:text-white transition-colors">Convites Digitais</a></li>
                <li><button onClick={() => scrollToSection('como-funciona')} className="text-white/80 hover:text-white transition-colors">Como Funciona</button></li>
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

        <a
          href={getWhatsAppLink('Premium')}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-8 right-8 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 transition-all hover:scale-110 z-50 flex items-center justify-center"
        >
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
      </footer>

    </main>
  );
}
