'use client';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { CheckCircle2, ExternalLink, Heart } from 'lucide-react';

function SucessoContent() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const templates = [
    { id: 1, nome: 'Chá Revelação Delicado', linkCanva: 'https://www.canva.com/design/SEU-LINK-1/view', emoji: '🤱' },
    { id: 2, nome: '1º Aninho Floral', linkCanva: 'https://www.canva.com/design/SEU-LINK-2/view', emoji: '🎂' },
    { id: 3, nome: 'Batizado Clássico', linkCanva: 'https://www.canva.com/design/SEU-LINK-3/view', emoji: '✨' },
    { id: 4, nome: 'Chá de Bebê Aquarela', linkCanva: 'https://www.canva.com/design/SEU-LINK-4/view', emoji: '🍼' },
    { id: 5, nome: 'Mesversário Minimalista', linkCanva: 'https://www.canva.com/design/SEU-LINK-5/view', emoji: '🎈' },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-beige-50 via-beige-100 to-beige-50 py-20 px-6">
      <div className="max-w-4xl mx-auto">
        
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-serif text-brown-700 mb-4">
            Pagamento Confirmado! 🎉
          </h1>
          
          <p className="text-xl text-brown-600 mb-2">Seus templates estão prontos!</p>
          <p className="text-brown-600/70 text-sm">Você também receberá um email com todos os links</p>
        </div>

        <div className="bg-blue-50 border-l-4 border-beige-300 rounded-lg p-6 mb-12">
          <h3 className="font-serif text-lg text-brown-700 mb-2 flex items-center gap-2">
            <Heart className="w-5 h-5 text-beige-300" />
            Como usar:
          </h3>
          <ol className="space-y-2 text-brown-600 text-sm ml-7 list-decimal">
            <li>Clique em Editar no Canva</li>
            <li>Altere nomes, datas e cores</li>
            <li>Baixe e compartilhe</li>
          </ol>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {templates.map((template) => (
            <div key={template.id} className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-start gap-4 mb-4">
                <div className="text-4xl">{template.emoji}</div>
                <div className="flex-1">
                  <h3 className="font-serif text-xl text-brown-700 mb-1">{template.nome}</h3>
                  <p className="text-sm text-brown-600/60">Template {template.id}</p>
                </div>
              </div>
              <a 
                href={template.linkCanva} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center justify-center gap-2 w-full py-3 bg-beige-300 text-white rounded-full font-medium hover:bg-beige-400 transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                Editar no Canva
              </a>
            </div>
          ))}
        </div>

        <div className="text-center">
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

export default function Sucesso() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-beige-300 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SucessoContent />
    </Suspense>
  );
}
