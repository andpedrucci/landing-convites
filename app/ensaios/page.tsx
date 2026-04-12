'use client';

import { useState } from 'react';
import { Heart, CheckCircle2, Send, Star, Camera } from 'lucide-react';

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

  return (
    <main className="min-h-screen bg-gradient-to-b from-beige-50 to-beige-100">

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden min-h-[85vh] flex items-center px-6 py-20">
        <div className="absolute top-20 right-10 w-[400px] h-[400px] bg-rose-200 opacity-20 blur-[120px] rounded-full" />
        <div className="absolute bottom-20 left-10 w-[300px] h-[300px] bg-beige-300 opacity-20 blur-[100px] rounded-full" />

        <div className="relative max-w-7xl mx-auto w-full text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/70 backdrop-blur-md rounded-full border border-beige-300/30 shadow-sm mb-6">
            <Camera className="w-4 h-4 text-beige-300" />
            <span className="text-sm font-medium text-brown-600 tracking-[0.2em] uppercase">Novo no Studio Invitare</span>
          </div>

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

          {/*
            =====================================================================
            GALERIA DE FOTOS — INSTRUÇÕES:
            1. Salve as fotos geradas em /public/ensaio/foto1.jpg (foto2, foto3, foto4)
            2. Substitua cada bloco abaixo pelo <img> correspondente
            Exemplo:
            <img src="/ensaio/foto1.jpg" alt="Ensaio natalino com IA" className="w-full h-full object-cover" />
            =====================================================================
          */}
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
              {
                num: '1',
                titulo: 'Escolha o tema',
                texto: 'Natalino, neve, floresta mágica e mais temas disponíveis. Cada um tem cenário e decoração exclusivos.',
              },
              {
                num: '2',
                titulo: 'Envie uma foto',
                texto: 'Qualquer foto nítida do rosto do seu filho. Não precisa ser profissional — a IA cuida de todo o resto.',
              },
              {
                num: '3',
                titulo: 'Receba seu ensaio',
                texto: 'Imagens em alta resolução prontas para salvar, compartilhar e imprimir. Direto no seu WhatsApp.',
              },
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
                  <h3 className={`text-2xl font-serif mb-1 ${plano.destaque ? 'text-white' : 'text-brown-700'}`}>
                    {plano.nome}
                  </h3>
                  <p className={`text-sm ${plano.destaque ? 'text-white/80' : 'text-brown-600'}`}>
                    {plano.fotos} em alta resolução
                  </p>
                </div>

                <div className="mb-6">
                  <p className={`text-sm line-through mb-1 ${plano.destaque ? 'text-white/50' : 'text-brown-600/40'}`}>
                    {plano.precoRiscado}
                  </p>
                  <p className={`text-4xl font-serif font-bold ${plano.destaque ? 'text-white' : 'text-brown-700'}`}>
                    {plano.preco}
                  </p>
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
                    plano.destaque
                      ? 'bg-white text-beige-300 hover:bg-white/90'
                      : 'bg-beige-300 text-white hover:bg-beige-400'
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
              {
                q: 'O rosto fica parecido com meu filho de verdade?',
                a: 'Sim. A IA preserva os traços faciais com alta precisão — olhos, tom de pele e características são mantidos. Os resultados são impressionantes.',
              },
              {
                q: 'Que tipo de foto devo enviar?',
                a: 'Qualquer foto nítida do rosto, de frente ou levemente de lado. Não precisa ser profissional — foto de celular funciona muito bem.',
              },
              {
                q: 'Como recebo as imagens?',
                a: 'Diretamente pelo WhatsApp em alta resolução, prontas para salvar, compartilhar ou imprimir.',
              },
              {
                q: 'Funciona para qualquer idade?',
                a: 'Funciona melhor para bebês e crianças de 0 a 8 anos. Quanto mais nítida a foto do rosto, melhor o resultado.',
              },
              {
                q: 'Quantos temas estão disponíveis?',
                a: 'Hoje temos 4 temas natalinos: Natalino Rústico, Neve & Inverno, Papai Noel e Floresta Mágica. Novos temas serão lançados em breve.',
              },
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

      <div className="text-center py-8 px-6 border-t border-beige-200">
        <a href="/" className="text-sm text-brown-600/60 hover:text-beige-300 transition-colors">
          ← Voltar para Studio Invitare
        </a>
        <p className="text-xs text-brown-600/40 mt-2">© 2024 Studio Invitare</p>
      </div>
    </main>
  );
}
