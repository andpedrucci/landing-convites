'use client';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import {
  Sparkles,
  Heart,
  X,
  Check,
  AlertCircle,
  TicketPercent,
  CreditCard
} from 'lucide-react';
import { AVAILABLE_COUPONS } from '@/lib/cupons';

function PersonalizadoPreCheckoutContent() {
  const [mounted, setMounted] = useState(false);

  // Dados do formulário
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    whatsapp: '',
    tipoEvento: '',
    observacoes: ''
  });

  // Pagamento
  const PRECO_BASE = 147;
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [loadingPagamento, setLoadingPagamento] = useState(false);

  const precoFinal = Number((PRECO_BASE * (1 - discount / 100)).toFixed(2));

  useEffect(() => {
    setMounted(true);
  }, []);

  // Aplicar cupom
  const aplicarCupom = () => {
    const found = AVAILABLE_COUPONS.find(
      c =>
        c.code === coupon.toUpperCase() &&
        c.isActive &&
        (c.allowedProduct === 'PERSONALIZADO' || c.allowedProduct === 'ALL')
    );

    if (!found) {
      alert('Cupom inválido ou expirado.');
      setDiscount(0);
      setCouponApplied(false);
      return;
    }

    setDiscount(found.discountPercentage);
    setCouponApplied(true);
    alert(`Cupom de ${found.discountPercentage}% aplicado!`);
  };

  // Ir para pagamento
  const handleIrParaPagamento = async () => {
    // Validações
    if (!formData.nome || !formData.whatsapp) {
      alert('Por favor, preencha Nome e WhatsApp!');
      return;
    }

    setLoadingPagamento(true);

    try {
      const response = await fetch('/api/create-preference-personalizado', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          couponCode: coupon || null,
          email: formData.email,
          metadata: {
            cliente: formData
          }
        }),
      });

      const data = await response.json();

      if (!data.init_point) {
        throw new Error('Erro ao criar checkout');
      }

      window.location.href = data.init_point;
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao iniciar pagamento. Tente novamente.');
      setLoadingPagamento(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-beige-50 via-beige-100 to-beige-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-beige-200 rounded-full mb-4">
            <Sparkles className="w-10 h-10 text-beige-300" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-serif text-brown-700 mb-3">
            Convite Personalizado
          </h1>
          
          <p className="text-lg text-brown-600">
            Preencha o formulário e finalize sua compra
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Formulário */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="font-serif text-xl text-brown-700 mb-6">Conte-nos sobre seu evento</h3>
              
              <div className="space-y-6">
                
                {/* Nome */}
                <div>
                  <label className="block text-sm font-semibold text-brown-700 mb-2">
                    Nome completo *
                  </label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Seu nome"
                    className="w-full px-4 py-3 rounded-xl border-2 border-beige-200 focus:border-beige-300 focus:outline-none transition-all"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-brown-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="seu@email.com"
                    className="w-full px-4 py-3 rounded-xl border-2 border-beige-200 focus:border-beige-300 focus:outline-none transition-all"
                  />
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="block text-sm font-semibold text-brown-700 mb-2">
                    WhatsApp *
                  </label>
                  <input
                    type="tel"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    placeholder="(11) 99999-9999"
                    className="w-full px-4 py-3 rounded-xl border-2 border-beige-200 focus:border-beige-300 focus:outline-none transition-all"
                    required
                  />
                </div>

                {/* Tipo de Evento */}
                <div>
                  <label className="block text-sm font-semibold text-brown-700 mb-2">
                    Tipo de evento
                  </label>
                  <select
                    value={formData.tipoEvento}
                    onChange={(e) => setFormData({ ...formData, tipoEvento: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-beige-200 focus:border-beige-300 focus:outline-none transition-all bg-white"
                  >
                    <option value="">Selecione o tipo de evento</option>
                    <option value="Aniversário">Aniversário</option>
                    <option value="Casamento">Casamento</option>
                    <option value="Chá de Bebê">Chá de Bebê</option>
                    <option value="Chá Revelação">Chá Revelação</option>
                    <option value="Batizado">Batizado</option>
                    <option value="Mesversário">Mesversário</option>
                    <option value="Formatura">Formatura</option>
                    <option value="Bodas">Bodas</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>

                {/* Observações */}
                <div>
                  <label className="block text-sm font-semibold text-brown-700 mb-2">
                    Conte-nos como você imagina o seu convite ✨
                  </label>
                  <textarea
                    value={formData.observacoes}
                    onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                    placeholder="Descreva como você imagina seu convite: cores, estilo, tema, elementos especiais..."
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl border-2 border-beige-200 focus:border-beige-300 focus:outline-none transition-all resize-none"
                  />
                </div>

                <p className="text-sm text-brown-600/60">
                  * Campos obrigatórios
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar - Pagamento */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              
              {/* Card Pagamento */}
              <div className="bg-white rounded-2xl p-6 shadow-lg space-y-4">
                <h3 className="font-serif text-xl text-brown-700 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" /> Pagamento
                </h3>

                <div className="flex gap-2">
                  <input
                    placeholder="Cupom de desconto"
                    value={coupon}
                    onChange={e => {
                      setCoupon(e.target.value);
                      setCouponApplied(false);
                      setDiscount(0);
                    }}
                    className="flex-1 px-4 py-2 border border-beige-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-beige-300"
                  />
                  <button
                    onClick={aplicarCupom}
                    className="px-4 py-2 bg-beige-200 hover:bg-beige-300 rounded-lg transition-colors"
                  >
                    <TicketPercent className="w-5 h-5 text-brown-700" />
                  </button>
                </div>

                {couponApplied && discount > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700">
                    ✅ Cupom aplicado: {discount}% de desconto
                  </div>
                )}

                <div className="text-center py-4">
                  {discount > 0 && (
                    <p className="text-sm text-gray-400 line-through mb-1">
                      R$ {PRECO_BASE.toFixed(2)}
                    </p>
                  )}
                  <p className="text-3xl font-bold text-brown-700">
                    R$ {precoFinal.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Convite personalizado</p>
                </div>

                <button
                  onClick={handleIrParaPagamento}
                  disabled={loadingPagamento}
                  className="w-full bg-beige-300 hover:bg-beige-400 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg"
                >
                  {loadingPagamento ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Redirecionando...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Finalizar Compra
                    </>
                  )}
                </button>

                <p className="text-xs text-center text-brown-600/60">
                  Pagamento seguro via Mercado Pago
                </p>
              </div>

              {/* Benefícios */}
              <div className="bg-beige-50 rounded-2xl p-6">
                <h4 className="font-semibold text-brown-700 mb-3 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-beige-300" />
                  O que está incluso
                </h4>
                <ul className="space-y-2 text-sm text-brown-600">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Design 100% exclusivo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Criado especialmente para você</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Atendimento personalizado</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Revisões até aprovação</span>
                  </li>
                </ul>
              </div>

            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="text-center mt-8 flex items-center justify-center gap-2 text-brown-600">
          <Heart className="w-4 h-4 fill-current text-beige-300" />
          <span className="text-sm">Feito com amor pela Studio Invitare</span>
        </div>

      </div>
    </div>
  );
}

export default function PersonalizadoPreCheckout() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-beige-50 via-beige-100 to-beige-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-beige-300 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PersonalizadoPreCheckoutContent />
    </Suspense>
  );
}
