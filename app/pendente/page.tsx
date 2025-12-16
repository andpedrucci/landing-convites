'use client';

import { Clock, Home } from 'lucide-react';

export default function Pendente() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-beige-50 to-beige-100 flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        
        <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full mb-6">
          <Clock className="w-12 h-12 text-yellow-600" />
        </div>
        
        <h1 className="text-3xl font-serif text-brown-700 mb-4">
          Pagamento Pendente
        </h1>
        
        <p className="text-brown-600 mb-8">
          Estamos aguardando a confirmação do seu pagamento. Você receberá um email assim que for aprovado!
        </p>

        <div className="bg-blue-50 border-l-4 border-beige-300 rounded-lg p-4 mb-8 text-left">
          <p className="text-sm text-brown-700">
            <strong>Boleto ou PIX?</strong><br/>
            A confirmação pode demorar alguns minutos (PIX) ou até 2 dias úteis (boleto).
          </p>
        </div>

        <a
          href="/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-beige-300 text-white rounded-full font-medium hover:bg-beige-400 transition-all"
        >
          <Home className="w-5 h-5" />
          Voltar para o site
        </a>

      </div>
    </main>
  );
}
