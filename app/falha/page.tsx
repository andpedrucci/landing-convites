'use client';

import { XCircle, ArrowLeft } from 'lucide-react';

export default function Falha() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-beige-50 to-beige-100 flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        
        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
          <XCircle className="w-12 h-12 text-red-600" />
        </div>
        
        <h1 className="text-3xl font-serif text-brown-700 mb-4">
          Ops! Algo deu errado
        </h1>
        
        <p className="text-brown-600 mb-8">
          Não conseguimos processar seu pagamento. Isso pode acontecer por diversos motivos, como dados incorretos ou falta de saldo.
        </p>

        <div className="space-y-4">
          <a
            href="/"
            className="flex items-center justify-center gap-2 w-full py-4 bg-beige-300 text-white rounded-full font-medium hover:bg-beige-400 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Tentar novamente
          </a>
          
          <a
            href="https://wa.me/5511995087592?text=Tive%20problema%20com%20o%20pagamento"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-4 bg-beige-100 text-brown-700 rounded-full font-medium hover:bg-beige-200 transition-all"
          >
            Falar no WhatsApp
          </a>
        </div>

      </div>
    </main>
  );
}
