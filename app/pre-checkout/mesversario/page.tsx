'use client';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { Heart, Ticket, CreditCard, Send, Star, Baby } from 'lucide-react';
import { AVAILABLE_COUPONS } from '@/lib/cupons';

function MesversarioPreCheckoutContent() {
  const [mounted, setMounted] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    whatsapp: '',
    nomeBebe: '',
    dataNascimento: '',
    tema: '',
    observacoes: ''
  });

  const PRECO_MENSAL = 47.00; // 12 artes / 12 meses
  const PRECO_TOTAL = 564.00; // Total anual
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [loadingPagamento, setLoadingPagamento] = useState(false);

  const precoMensalFinal = Number((PRECO_MENSAL * (1 - discount / 100)).toFixed(2));
  const precoTotalFinal = Number((PRECO_TOTAL * (1 - discount / 100)).toFixed(2));

  useEffect(() => setMounted(true), []);

  const aplicarCupom = () => {
    const found = AVAILABLE_COUPONS.find(
      c => c.code === coupon.toUpperCase() && c.isActive &&
      (c.allowedProduct === 'MESVERSARIO' || c.allowedProduct === 'ALL')
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

  const handleIrParaPagamento = async () => {
    if (!formData.nome || !formData.whatsapp || !formData.nomeBebe) {
      alert('Por favor, preencha Nome, WhatsApp e Nome do Bebê!');
      return;
    }

    setLoadingPagamento(true);

    try {
      const response = await fetch('/api/create-preference-mesversario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          couponCode: coupon || null,
          email: formData.email,
          metadata: { cliente: formData }
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
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-beige-50 to-rose-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-200 rounded-full mb-4">
            <Star className="w-10 h-10 text-rose-400" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-serif text-brown-700 mb-3">
            Assinatura Mêsversário
          </h1>
          
          <p className="text-lg text-brown-600">
            12 artes personalizadas para o primeiro ano do bebê
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="font-serif text-xl text-brown-700 mb-6 flex items-center gap-2">
                <Baby className="w-6 h-6 text-rose-400" />
                Informações da Assinatura
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-brown-700 mb-2">Seu nome completo *</label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Seu nome"
                    className="w-full px-4 py-3 rounded-xl border-2 border-beige-200 focus:border-rose-300 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-brown-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="seu@email.com"
                    className="w-full px-4 py-3 rounded-xl border-2 border-beige-200 focus:border-rose-300 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-brown-700 mb-2">WhatsApp *</label>
                  <input
                    type="tel"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    placeholder="(11) 99999-9999"
                    className="w-full px-4 py-3 rounded-xl border-2 border-beige-200 focus:border-rose-300 focus:outline-none transition-all"
                  />
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-semibold text-brown-700 mb-4">Sobre o bebê</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-brown-700 mb-2">Nome do bebê *</label>
                      <input
                        type="text"
                        value={formData.nomeBebe}
                        onChange={(e) => setFormData({ ...formData, nomeBebe: e.target.value })}
                        placeholder="Nome do bebê"
                        className="w-full px-4 py-3 rounded-xl border-2 border-beige-200 focus:border-rose-300 focus:outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-brown-700 mb-2">Data de nascimento</label>
                      <input
                        type="date"
                        value={formData.dataNascimento}
                        onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-beige-200 focus:border-rose-300 focus:outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-brown-700 mb-2">Tema preferido (opcional)</label>
                      <select
                        value={formData.tema}
                        onChange={(e) => setFormData({ ...formData, tema: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-beige-200 focus:border-rose-300 focus:outline-none transition-all bg-white"
                      >
                        <option value="">Selecione um tema</option>
                        <option value="Ursinhos">Ursinhos</option>
                        <option value="Safári">Safári</option>
                        <option value="Espaço">Espaço</option>
                        <option value="Fundo do Mar">Fundo do Mar</option>
                        <option value="Flores">Flores</option>
                        <option value="Arco-íris">Arco-íris</option>
                        <option value="Minimalista">Minimalista</option>
                        <option value="Outro">Outro</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-brown-700 mb-2">
                    Observações ou preferências ✨
                  </label>
                  <textarea
                    value={formData.observacoes}
                    onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                    placeholder="Conte-nos sobre preferências de cores, estilos, elementos especiais..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border-2 border-beige-200 focus:border-rose-300 focus:outline-none transition-all resize-none"
                  />
                </div>

                <p className="text-sm text-brown-600/60">* Campos obrigatórios</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
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
                    className="flex-1 px-4 py-2 border border-beige-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                  <button
                    onClick={aplicarCupom}
                    className="px-4 py-2 bg-rose-200 hover:bg-rose-300 rounded-lg transition-colors"
                  >
                    <Ticket className="w-5 h-5 text-brown-700" />
                  </button>
                </div>

                {couponApplied && discount > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700">
                    ✅ Cupom aplicado: {discount}% de desconto
                  </div>
                )}

                <div className="text-center py-4">
                  {discount > 0 && (
                    <>
                      <p className="text-sm text-gray-400 line-through mb-1">
                        R$ {PRECO_MENSAL.toFixed(2)}/mês
                      </p>
                      <p className="text-xs text-gray-400 line-through mb-2">
                        Total: R$ {PRECO_TOTAL.toFixed(2)}
                      </p>
                    </>
                  )}
                  <p className="text-3xl font-bold text-brown-700">
                    R$ {precoMensalFinal.toFixed(2)}<span className="text-lg font-normal">/mês</span>
                  </p>
                  <p className="text-sm text-brown-600 mt-1">
                    Total: R$ {precoTotalFinal.toFixed(2)} (12 meses)
                  </p>
                  <p className="text-xs text-gray-500 mt-2">Cobrança automática mensal</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <p className="text-xs text-blue-800">
                    ℹ️ <strong>Assinatura Recorrente:</strong> Você será cobrado automaticamente R$ {precoMensalFinal.toFixed(2)} todo mês durante 12 meses no cartão de crédito cadastrado.
                  </p>
                </div>

                <button
                  onClick={handleIrParaPagamento}
                  disabled={loadingPagamento}
                  className="w-full bg-rose-400 hover:bg-rose-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg"
                >
                  {loadingPagamento ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Redirecionando...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Assinar Agora
                    </>
                  )}
                </button>

                <p className="text-xs text-center text-brown-600/60">Pagamento seguro via Mercado Pago</p>
              </div>

              <div className="bg-gradient-to-br from-rose-50 to-beige-50 rounded-2xl p-6">
                <h4 className="font-semibold text-brown-700 mb-3 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-400" />
                  O que está incluso
                </h4>
                <ul className="space-y-2 text-sm text-brown-600">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>12 artes exclusivas (1 por mês)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Design personalizado e consistente</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Perfeito para redes sociais</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Alta resolução para impressão</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Entrega mensal automática</span>
                  </li>
                </ul>

                <div className="mt-4 pt-4 border-t border-rose-200">
                  <p className="text-xs text-brown-600 leading-relaxed">
                    💝 <strong>Como funciona:</strong> Você será cobrado automaticamente todo mês durante 12 meses. Receba 1 arte personalizada a cada mês para celebrar cada mêsversário do bebê!
                  </p>
                  <p className="text-xs text-brown-600 mt-2">
                    🔄 <strong>Pagamento recorrente:</strong> Cobrança automática no cartão de crédito todo mês. Cancele quando quiser.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8 flex items-center justify-center gap-2 text-brown-600">
          <Heart className="w-4 h-4 fill-current text-rose-400" />
          <span className="text-sm">Feito com amor pela Studio Invitare</span>
        </div>
      </div>
    </div>
  );
}

export default function MesversarioPreCheckout() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-rose-50 via-beige-50 to-rose-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-rose-400 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <MesversarioPreCheckoutContent />
    </Suspense>
  );
}
