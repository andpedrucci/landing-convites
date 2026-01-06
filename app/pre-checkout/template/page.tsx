'use client';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { Sparkles, Heart, X, Check, AlertCircle, CreditCard, Ticket, Send } from 'lucide-react';
import { imagensPorTema } from '@/lib/templates-data';
import { AVAILABLE_COUPONS } from '@/lib/cupons';

interface TemplateComTema {
  nome: string;
  descricao: string;
  imagem: string;
  linkCanva: string;
  tema: string;
}

function TemplatePreCheckoutContent() {
  const [mounted, setMounted] = useState(false);
  const [templatesSelecionados, setTemplatesSelecionados] = useState<TemplateComTema[]>([]);
  const [temaAtivo, setTemaAtivo] = useState('aniversario');
  const [temaEscolhido, setTemaEscolhido] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nomeMae: '',
    nomeCrianca: '',
    idadeConvite: '',
    dataEvento: '',
    horarioEvento: '',
    endereco: '',
    whatsapp: '',
    observacoes: ''
  });

  const PRECO_BASE = 20;
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [loadingPagamento, setLoadingPagamento] = useState(false);

  const precoFinal = Number((PRECO_BASE * (1 - discount / 100)).toFixed(2));

  useEffect(() => setMounted(true), []);

  const getTemaLabel = (temaId: string) => {
    const temas: Record<string, string> = {
      aniversario: 'Aniversário',
      batizado: 'Batizado',
      revelacao: 'Chá Revelação',
      'cha-bebe': 'Chá de Bebê',
      fundomar: 'Fundo do Mar',
      princesa: 'Princesas',
      diversos: 'Diversos'
    };
    return temas[temaId] || temaId;
  };

  const estaSelecionado = (linkCanva: string) =>
    templatesSelecionados.some(t => t.linkCanva === linkCanva);

  const handleSelecionarTemplate = (template: TemplateComTema) => {
    if (estaSelecionado(template.linkCanva)) {
      const novos = templatesSelecionados.filter(t => t.linkCanva !== template.linkCanva);
      setTemplatesSelecionados(novos);
      if (novos.length === 0) setTemaEscolhido(null);
      return;
    }

    if (temaEscolhido && template.tema !== temaEscolhido) {
      alert(`Você só pode escolher convites do tema "${getTemaLabel(temaEscolhido)}".`);
      return;
    }

    if (templatesSelecionados.length >= 2) {
      alert('Você já selecionou 2 templates.');
      return;
    }

    if (templatesSelecionados.length === 0) {
      setTemaEscolhido(template.tema);
    }

    setTemplatesSelecionados([...templatesSelecionados, template]);
  };

  const aplicarCupom = () => {
    const found = AVAILABLE_COUPONS.find(
      c => c.code === coupon.toUpperCase() && c.isActive && 
      (c.allowedProduct === 'TEMPLATE' || c.allowedProduct === 'ALL')
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
    if (templatesSelecionados.length !== 2) {
      alert('Selecione exatamente 2 templates.');
      return;
    }

    if (!formData.nomeCrianca || !formData.whatsapp || !formData.dataEvento) {
      alert('Preencha todos os campos obrigatórios (Nome da Criança, WhatsApp e Data do Evento).');
      return;
    }

    setLoadingPagamento(true);

    try {
      const response = await fetch('/api/create-preference-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          couponCode: coupon || null,
          metadata: {
            cliente: formData,
            templates: templatesSelecionados.map(t => t.linkCanva) // ENVIANDO SÓ OS LINKS
          }
        })
      });

      const data = await response.json();

      if (!data.init_point) {
        throw new Error('Checkout inválido');
      }

      window.location.href = data.init_point;
    } catch (err) {
      console.error(err);
      alert('Erro ao iniciar pagamento.');
      setLoadingPagamento(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-beige-50 via-beige-100 to-beige-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-beige-200 rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-beige-300" />
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-brown-700 mb-2">
            Escolha seus templates e finalize
          </h1>
          <p className="text-brown-600">Selecione 2 convites do mesmo tema</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex flex-wrap gap-2 mb-6">
              {Object.keys(imagensPorTema).map(tema => (
                <button
                  key={tema}
                  onClick={() => setTemaAtivo(tema)}
                  disabled={temaEscolhido !== null && temaEscolhido !== tema}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                    temaAtivo === tema
                      ? 'bg-beige-300 text-white'
                      : temaEscolhido !== null && temaEscolhido !== tema
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-brown-700 hover:bg-beige-50'
                  }`}
                >
                  {getTemaLabel(tema)}
                </button>
              ))}
            </div>

            {temaEscolhido && (
              <div className="mb-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-800">
                    Você está selecionando do tema <strong>{getTemaLabel(temaEscolhido)}</strong>. 
                    Para escolher outro tema, remova os templates selecionados.
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {imagensPorTema[temaAtivo as keyof typeof imagensPorTema]?.map((template, index) => {
                const templateComTema = { ...template, tema: temaAtivo };
                const selecionado = estaSelecionado(template.linkCanva);
                const desabilitado = temaEscolhido !== null && temaEscolhido !== temaAtivo;
                
                return (
                  <div
                    key={index}
                    onClick={() => !desabilitado && handleSelecionarTemplate(templateComTema)}
                    className={`relative cursor-pointer group rounded-xl overflow-hidden transition-all ${
                      selecionado ? 'ring-4 ring-green-400 shadow-xl' : 
                      desabilitado ? 'opacity-40 cursor-not-allowed' : 'hover:shadow-lg'
                    }`}
                  >
                    <img 
                      src={template.imagem} 
                      alt={template.nome}
                      className="w-full aspect-[3/4] object-cover"
                    />
                    
                    <div className={`absolute inset-0 transition-all ${
                      selecionado ? 'bg-green-600/20' : 
                      desabilitado ? 'bg-gray-500/50' : 'bg-black/0 group-hover:bg-black/10'
                    }`} />

                    {selecionado && (
                      <div className="absolute top-2 right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                        <Check className="w-5 h-5 text-white" strokeWidth={3} />
                      </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-sm font-medium">{template.nome}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="font-serif text-xl text-brown-700 mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-beige-300" />
                Selecionados ({templatesSelecionados.length}/2)
              </h3>

              {templatesSelecionados.length === 0 ? (
                <p className="text-brown-600/60 text-sm text-center py-4">Nenhum convite selecionado</p>
              ) : (
                <div className="space-y-3">
                  {templatesSelecionados.map((template, index) => (
                    <div key={index} className="flex items-center gap-3 bg-beige-50 rounded-lg p-3">
                      <img src={template.imagem} alt={template.nome} className="w-12 h-16 object-cover rounded" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-brown-700 truncate">{template.nome}</p>
                        <p className="text-xs text-brown-600/60 capitalize">{getTemaLabel(template.tema)}</p>
                      </div>
                      <button
                        onClick={() => handleSelecionarTemplate(template)}
                        className="p-1 hover:bg-red-100 rounded-full transition-colors"
                      >
                        <X className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg space-y-3">
              <h3 className="font-serif text-xl text-brown-700 mb-4">Dados do Evento</h3>

              <div>
                <label className="block text-sm font-medium text-brown-700 mb-1">Seu Nome *</label>
                <input
                  placeholder="Ana Paula"
                  value={formData.nomeMae}
                  onChange={e => setFormData({ ...formData, nomeMae: e.target.value })}
                  className="w-full px-4 py-2 border border-beige-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-beige-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brown-700 mb-1">Nome da Criança *</label>
                <input
                  placeholder="Maria"
                  value={formData.nomeCrianca}
                  onChange={e => setFormData({ ...formData, nomeCrianca: e.target.value })}
                  className="w-full px-4 py-2 border border-beige-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-beige-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brown-700 mb-1">Idade</label>
                <input
                  placeholder="Ex: 1 ano"
                  value={formData.idadeConvite}
                  onChange={e => setFormData({ ...formData, idadeConvite: e.target.value })}
                  className="w-full px-4 py-2 border border-beige-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-beige-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brown-700 mb-1">Data do Evento *</label>
                <input
                  type="date"
                  value={formData.dataEvento}
                  onChange={e => setFormData({ ...formData, dataEvento: e.target.value })}
                  className="w-full px-4 py-2 border border-beige-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-beige-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brown-700 mb-1">Horário do Evento</label>
                <input
                  type="time"
                  value={formData.horarioEvento}
                  onChange={e => setFormData({ ...formData, horarioEvento: e.target.value })}
                  className="w-full px-4 py-2 border border-beige-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-beige-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brown-700 mb-1">Endereço</label>
                <input
                  placeholder="Local do evento"
                  value={formData.endereco}
                  onChange={e => setFormData({ ...formData, endereco: e.target.value })}
                  className="w-full px-4 py-2 border border-beige-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-beige-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brown-700 mb-1">WhatsApp *</label>
                <input
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={formData.whatsapp}
                  onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full px-4 py-2 border border-beige-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-beige-300"
                />
              </div>
            </div>

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
                  <p className="text-sm text-gray-400 line-through mb-1">R$ {PRECO_BASE.toFixed(2)}</p>
                )}
                <p className="text-3xl font-bold text-brown-700">R$ {precoFinal.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">Pacote com 2 templates</p>
              </div>

              <button
                onClick={handleIrParaPagamento}
                disabled={loadingPagamento || templatesSelecionados.length !== 2}
                className="w-full py-3 bg-beige-300 text-white rounded-full font-medium hover:bg-beige-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

              <p className="text-xs text-center text-brown-600/60">Pagamento seguro via Mercado Pago</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function TemplatePreCheckout() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-beige-50 via-beige-100 to-beige-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-beige-300 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <TemplatePreCheckoutContent />
    </Suspense>
  );
}
