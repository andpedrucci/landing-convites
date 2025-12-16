'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, Download, ExternalLink, Heart } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function Sucesso() {
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const templates = [
    {
      id: 1,
      nome: 'Chá Revelação Delicado',
      linkCanva: 'https://www.canva.com/design/SEU-LINK-1/view',
      linkDownload: '/templates/cha-revelacao.pdf',
      emoji: '🤱'
    },
    {
      id: 2,
      nome: '1º Aninho Floral',
      linkCanva: 'https://www.canva.com/design/SEU-LINK-2/view',
      linkDownload: '/templates/aniversario.pdf',
      emoji: '🎂'
    },
    {
      id: 3,
      nome: 'Batizado Clássico',
      linkCanva: 'https://www.canva.com/design/SEU-LINK-3/view',
      linkDownload: '/templates/batizado.pdf',
      emoji: '✨'
    },
    {
      id: 4,
      nome: 'Chá de Bebê Aquarela',
      linkCanva: 'https://www.canva.com/design/SEU-LINK-4/view',
      linkDownload: '/templates/cha-bebe.pdf',
      emoji: '🍼'
    },
    {
      id: 5,
      nome: 'Mesversário Minimalista',
      linkCanva: 'https://www.canva.com/design/SEU-LINK-5/view',
      linkDownload: '/templates/mesversario.pdf',
      emoji: '🎈'
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-beige-50 via-beige-100 to-beige-50 py-20 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header de Sucesso */}
        <div className={`text-center mb-16 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-serif text-brown-700 mb-4">
            Pagamento Confirmado! 🎉
          </h1>
          
          <p className="text-xl text-brown-600 mb-2">
            Seus templates estão prontos para usar!
          </p>
          
          <p className="text-brown-600/70 text-sm">
            Você também receberá um email com todos os links
          </p>
        </div>

        {/* Instruções */}
        <div className="bg-blue-50 border-l-4 border-beige-300 rounded-lg p-6 mb-12">
          <h3 className="font-serif text-lg text-brown-700 mb-2 flex items-center gap-2">
            <Heart className="w-5 h-5 text-beige-300" />
            Como usar seus templates:
          </h3>
          <ol className="space-y-2 text-brown-600 text-sm ml-7 list-decimal">
            <li>Clique em "Editar no Canva" para personalizar</li>
            <li>Altere nomes, datas, local e cores como desejar</li>
            <li>Baixe em PNG ou PDF para compartilhar</li>
            <li>Guarde esses links - você pode editar sempre que quiser!</li>
          </ol>
        </div>

        {/* Cards dos Templates */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {templates.map((template, index) => (
            <div 
              key={template.id}
              className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Header do Card */}
              <div className="flex items-start gap-4 mb-4">
                <div className="text-4xl">{template.emoji}</div>
                <div className="flex-1">
                  <h3 className="font-serif text-xl text-brown-700 mb-1">
                    {template.nome}
                  </h3>
                  <p className="text-sm text-brown-600/60">Template {template.id}</p>
                </div>
              </div>

              {/* Botões */}
              <div className="space-y-3">
                <a
                  href={template.linkCanva}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-beige-300 text-white rounded-full font-medium hover:bg-beige-400 transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  Editar no Canva
                </a>
                
                <a
                  href={template.linkDownload}
                  download
                  className="flex items-center justify-center gap-2 w-full py-3 bg-beige-100 text-brown-700 rounded-full font-medium hover:bg-beige-200 transition-all"
                >
                  <Download className="w-4 h-4" />
                  Baixar PDF
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Email de Confirmação */}
        <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
          <p className="text-brown-700 mb-4">
            📧 Um email foi enviado para <strong>{searchParams.get('email') || 'seu email'}</strong> com todos os links
          </p>
          <p className="text-brown-600/70 text-sm">
            Não encontrou? Verifique a caixa de spam ou entre em contato pelo WhatsApp
          </p>
        </div>

        {/* Botão Voltar */}
        <div className="text-center mt-12">
          <a
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-brown-700 text-white rounded-full font-medium hover:bg-brown-600 transition-all"
          >
            Voltar para o site
          </a>
        </div>

      </div>
    </main>
  );
}
