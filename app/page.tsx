'use client';

import { useState, useEffect } from 'react';
import { Heart, Sparkles, Clock, CheckCircle2, Star, Send } from 'lucide-react';
import TemplateCarousel from './components/TemplateCarousel';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [isLoadingCheckout, setIsLoadingCheckout] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const whatsappNumber = "5511999999999";
  
  const getWhatsAppLink = (produto: string, preco: string) => {
    const message = encodeURIComponent(
      `Olá! Tenho interesse no *${produto}* (${preco}). Gostaria de mais informações! 💕`
    );
    return `https://wa.me/${whatsappNumber}?text=${message}`;
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

  return (
    <main className="min-h-screen bg-gradient-to-b from-beige-50 via-beige-100 to-beige-50">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
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
            <a 
              href="#produtos"
              className="inline-flex items-center gap-2 px-12 py-5 bg-beige-300 text-white rounded-full font-medium text-lg hover:bg-beige-400 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl group"
            >
              <span>Ver Convites</span>
              <Heart className="w-5 h-5 group-hover:fill-white transition-all" />
            </a>
          </div>
        </div>
      </section>

      {/* Seção Interativa de Templates */}
      <TemplateCarousel />

      {/* Benefícios */}
      <section className="pb-24">
        <div className="max-w-6xl mx-auto px-6">
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

      {/* Produtos */}
      <section id="produtos" className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-serif text-brown-700 mb-6 leading-tight">
              Escolha seu
              <br />
              <span className="text-beige-300 italic">convite perfeito</span>
            </h2>
            <p className="text-xl text-brown-600 font-light">Criado especialmente para o seu momento</p>
          </div>

          {/* Cards de Produtos */}
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Template Pronto */}
            <div className="bg-white rounded-[2rem] p-10 shadow-2xl hover:shadow-3xl transition-all duration-500 relative overflow-hidden group border border-beige-200/50">
              
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-rose-200 opacity-10 blur-3xl group-hover:opacity-20 group-hover:scale-150 transition-all duration-700" />
              
              <div className="relative">
                <div className="mb-8">
                  <div className="flex items-baseline justify-between mb-2">
                    <h3 className="text-3xl font-serif text-brown-700">Template Pronto</h3>
                    <div className="text-4xl font-bold text-beige-300">R$ 47</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-brown-600/70 text-sm">Personalize você mesma</p>
                    <div className="text-xs text-brown-600/60">a partir de</div>
                  </div>
                </div>

                <ul className="space-y-4 mb-10">
                  {[
                    "5 modelos lindos para escolher",
                    "Edite você mesma no Canva",
                    "PNG + PDF em alta qualidade",
                    "Entrega imediata"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3.5 group/item">
                      <CheckCircle2 className="w-5 h-5 text-beige-300 mt-0.5 flex-shrink-0 group-hover/item:scale-110 transition-transform" strokeWidth={2} />
                      <span className="text-brown-700 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={handleComprarTemplate}
                  disabled={isLoadingCheckout}
                  className="flex items-center justify-center gap-2 w-full py-4 bg-beige-300 text-white text-center rounded-full font-medium hover:bg-beige-400 transition-all duration-300 shadow-md hover:shadow-xl group/btn disabled:opacity-50 disabled:cursor-not-allowed"
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
            <div className="bg-gradient-to-br from-beige-300 via-beige-400 to-beige-300 rounded-[2rem] p-10 shadow-2xl hover:shadow-3xl transition-all duration-500 relative overflow-hidden group">
              
              <div className="absolute top-6 right-6 bg-rose-200 text-white px-5 py-2 rounded-full text-sm font-medium shadow-lg rotate-3 hover:rotate-6 transition-transform">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4" fill="white" />
                  <span>Mais Escolhido</span>
                </div>
              </div>

              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white opacity-10 blur-3xl group-hover:opacity-20 group-hover:scale-150 transition-all duration-700" />
              
              <div className="relative pt-8">
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <h3 className="text-3xl font-serif text-white mb-2">Personalizado</h3>
                    <p className="text-white/80 text-sm">Exclusivo para você</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-white/70 mb-1">investimento</div>
                    <div className="text-4xl font-bold text-white">R$ 147</div>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {[
                    "Design exclusivo pro seu momento",
                    "2 revisões incluídas",
                    "Arquivo final + Canva editável",
                    "Entrega em 3-5 dias úteis"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3.5 group/item">
                      <Star className="w-5 h-5 text-white mt-0.5 flex-shrink-0 group-hover/item:scale-110 transition-transform" fill="white" strokeWidth={2} />
                      <span className="text-white leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 mb-6 text-center border border-white/30">
                  <p className="text-white font-medium flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Apenas 10 vagas este mês</span>
                  </p>
                </div>

                
                  <a href={getWhatsAppLink("Personalizado", "R$ 147")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-4 bg-white text-beige-300 text-center rounded-full font-medium hover:bg-beige-50 transition-all duration-300 shadow-xl hover:shadow-2xl group/btn"
                >
                  <span>Quero Personalizado!</span>
                  <Send className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            {/* Assinatura Mesversário */}
            <div className="bg-white rounded-[2rem] p-10 shadow-2xl hover:shadow-3xl transition-all duration-500 relative overflow-hidden group border-2 border-beige-300">
              
              <div className="absolute top-6 right-6 bg-beige-300 text-white px-4 py-2 rounded-full text-xs font-medium shadow-lg">
                Recorrente
              </div>

              <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-beige-300 opacity-10 blur-3xl group-hover:opacity-20 group-hover:scale-150 transition-all duration-700" />
              
              <div className="relative pt-8">
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <h3 className="text-3xl font-serif text-brown-700 mb-2">Mesversário</h3>
                    <p className="text-brown-600/70 text-sm">Todo mês um novo convite</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-brown-600/60 mb-1">por apenas</div>
                    <div className="text-4xl font-bold text-beige-300">R$ 45</div>
                    <div className="text-xs text-brown-600/60">/mês</div>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {[
                    "Convite novo todo mês",
                    "Personalizado com foto do bebê",
                    "Edite quantas vezes quiser",
                    "Cancele quando quiser"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3.5 group/item">
                      <CheckCircle2 className="w-5 h-5 text-beige-300 mt-0.5 flex-shrink-0 group-hover/item:scale-110 transition-transform" strokeWidth={2} />
                      <span className="text-brown-700 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="bg-beige-50 rounded-2xl p-4 mb-6 text-center border border-beige-200/50">
                  <p className="text-brown-700 font-medium flex items-center justify-center gap-2 text-sm">
                    <Heart className="w-4 h-4 text-beige-300" fill="currentColor" />
                    <span>12 meses = Chá de 1 ano grátis!</span>
                  </p>
                </div>

                
                  <a href={getWhatsAppLink("Assinatura Mesversário", "R$ 45/mês")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-4 bg-beige-300 text-white text-center rounded-full font-medium hover:bg-beige-400 transition-all duration-300 shadow-md hover:shadow-xl group/btn"
                >
                  <span>Quero Assinar!</span>
                  <Heart className="w-5 h-5 group-hover/btn:fill-white transition-all" />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-24 px-6 bg-white/40 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-serif text-brown-700 text-center mb-16">
            O que dizem sobre nós
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
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
              <div key={i} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="w-4 h-4 text-beige-300" fill="currentColor" />
                  ))}
                </div>
                <p className="text-brown-700 mb-6 leading-relaxed italic">"{item.text}"</p>
                <div className="border-t border-beige-200 pt-4">
                  <p className="text-brown-700 font-medium">{item.author}</p>
                  <p className="text-brown-600/60 text-sm">{item.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-serif text-brown-700 text-center mb-16">
            Dúvidas Frequentes
          </h2>

          <div className="space-y-6">
            {[
              {
                q: "Os convites são digitais?",
                a: "Sim! Você recebe o arquivo em alta qualidade para compartilhar por WhatsApp, redes sociais ou imprimir se preferir."
              },
              {
                q: "Como funciona a entrega?",
                a: "Templates prontos: entrega imediata após pagamento. Personalizados: entregamos em 3-5 dias úteis."
              },
              {
                q: "Posso editar depois de receber?",
                a: "Sim! Você recebe o link do Canva totalmente editável para fazer ajustes sempre que precisar."
              },
              {
                q: "Como funciona a assinatura?",
                a: "Todo mês você recebe um convite de mesversário personalizado com a foto do bebê. Pode cancelar quando quiser!"
              },
              {
                q: "Quantas revisões posso solicitar?",
                a: "No personalizado estão incluídas 2 rodadas de revisão. Queremos que fique perfeito!"
              }
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-all duration-300">
                <h3 className="text-xl font-serif text-brown-700 mb-3">{item.q}</h3>
                <p className="text-brown-600 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 px-6 bg-gradient-to-br from-beige-300 to-beige-400">
        <div className="max-w-4xl mx-auto text-center text-white">
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
      <footer className="py-16 px-6 bg-brown-700 text-white mb-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-serif mb-3">Studio Invitare</h3>
            <p className="text-white/70 font-light">Convites que celebram sua história</p>
          </div>
          
          <div className="flex justify-center mb-10">
            
              <a href={getWhatsAppLink("Olá, gostaria de saber mais!", "")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all border border-white/20"
            >
              <Send className="w-4 h-4" />
              <span>Fale conosco</span>
            </a>
          </div>

          <div className="pt-8 border-t border-white/10 text-center">
            <p className="text-sm text-white/50">
              © 2024 Studio Invitare. Feito com <Heart className="w-4 h-4 inline fill-rose-200 text-rose-200" /> para celebrar seus momentos especiais.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
