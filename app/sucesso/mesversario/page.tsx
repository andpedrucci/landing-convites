'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Star, Heart, ArrowRight } from 'lucide-react';
import { Suspense } from 'react';

function SucessoMesversarioContent() {
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();
  const paymentId = searchParams?.get('payment_id');
  const status = searchParams?.get('status');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-beige-50 to-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
          
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          <h1 className="text-3xl md:text-4xl font-serif text-brown-700 mb-4">
            Pagamento Confirmado! 🎉
          </h1>

          <div className="inline-flex items-center gap-2 bg-rose-100 px-4 py-2 rounded-full mb-6">
            <Star className="w-5 h-5 text-rose-400" />
            <span className="text-sm font-medium text-brown-700">Assinatura Recorrente Confirmada</span>
          </div>

          <div className="bg-gradient-to-br from-rose-50 to-beige-50 rounded-2xl p-6 mb-8 text-left">
            <h2 className="font-semibold text-brown-700 mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-400" />
              Como funciona sua assinatura
            </h2>
            
            <ol className="space-y-3 text-brown-600">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-rose-400 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                <span className="text-sm">Nossa equipe entrará em contato pelo WhatsApp nas próximas horas</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-rose-400 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                <span className="text-sm">Todo mês você será cobrado automaticamente no cartão cadastrado</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-rose-400 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                <span className="text-sm">Receberá 1 arte personalizada nova a cada mês (12 artes no total)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-rose-400 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                <span className="text-sm">Cancele quando quiser pelo WhatsApp ou diretamente no Mercado Pago</span>
              </li>
            </ol>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-blue-800">
              <strong>ℹ️ Cobrança Recorrente:</strong> Sua assinatura está ativa e você será cobrado mensalmente. 
              A cobrança não consome limite total do cartão (como Netflix). Você pode cancelar a qualquer momento.
            </p>
          </div>

          {paymentId && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-xs text-blue-800">
                ID do Pagamento: <span className="font-mono font-semibold">{paymentId}</span>
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-beige-300 text-white rounded-full font-medium hover:bg-beige-400 transition-all"
            >
              <span>Voltar ao Início</span>
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="https://wa.me/5511995087592?text=Olá!%20Acabei%20de%20assinar%20o%20Mêsversário"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-green-500 text-white rounded-full font-medium hover:bg-green-600 transition-all"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span>Falar no WhatsApp</span>
            </a>
          </div>

          <p className="text-xs text-brown-600/60 mt-8">
            💝 Obrigada por confiar na Studio Invitare para celebrar cada mêsversário do seu bebê!
          </p>
        </div>

      </div>
    </div>
  );
}

export default function SucessoMesversario() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-rose-50 via-beige-50 to-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-rose-400 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SucessoMesversarioContent />
    </Suspense>
  );
}
