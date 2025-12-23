'use client';

import { Suspense } from 'react';
import { CheckCircle2, Heart, Home } from 'lucide-react';

function TemplatesSucessoContent() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-beige-50 via-beige-100 to-beige-50 flex items-center justify-center py-20 px-6">
      <div className="max-w-2xl mx-auto text-center">
        
        {/* Ícone de Sucesso */}
        <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
          <CheckCircle2 className="w-16 h-16 text-green-600" />
        </div>
        
        {/* Título */}
        <h1 className="text-4xl md:text-5xl font-serif text-brown-700 mb-4">
          Pagamento Confirmado! 🎉
        </h1>
        
        {/* Mensagem */}
        <div className="bg-white rounded-2xl p-8 shadow-xl mb-8">
          <p className="text-xl text-brown-600 mb-4">
            Obrigado pela sua compra!
          </p>
          <p className="text-brown-600 mb-6">
            Em breve você receberá um <strong>email</strong> e também uma mensagem no <strong>WhatsApp</strong> com os links dos seus 2 templates editáveis.
          </p>
          
          <div className="bg-beige-50 rounded-xl p-6 text-left">
            <p className="text-sm text-brown-700 mb-3">
              <strong>📧 O que fazer agora?</strong>
            </p>
            <ul className="space-y-2 text-sm text-brown-600">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Aguarde nosso contato com os links dos templates</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Os templates já estarão prontos para edição no Canva</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Você poderá personalizá-los com seus dados</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Botões */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="/" 
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-beige-300 text-white rounded-full font-medium hover:bg-beige-400 transition-all shadow-lg"
          >
            <Home className="w-5 h-5" />
            Voltar para o site
          </a>
          
          <a 
            href="https://wa.me/5511995087592?text=Olá!%20Acabei%20de%20comprar%20os%20templates%20digitais!" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-beige-300 border-2 border-beige-300 rounded-full font-medium hover:bg-beige-50 transition-all shadow-lg"
          >
            Falar no WhatsApp
          </a>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 flex items-center justify-center gap-2 text-brown-600">
          <Heart className="w-4 h-4 fill-current text-beige-300" />
          <span className="text-sm">Feito com amor pela Studio Invitare</span>
        </div>

      </div>
    </main>
  );
}

export default function TemplatesSucesso() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-beige-300 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <TemplatesSucessoContent />
    </Suspense>
  );
}
