'use client';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Heart,
  Send,
  X,
  Check,
  AlertCircle,
  TicketPercent,
  CreditCard
} from 'lucide-react';
import { imagensPorTema } from '@/lib/templates-data';
import { AVAILABLE_COUPONS } from '@/lib/cupons';

interface TemplateComTema {
  nome: string;
  descricao: string;
  imagem: string;
  linkCanva: string;
  tema: string;
}

function SucessoContent() {
  const [mounted, setMounted] = useState(false);

  // ===== Templates =====
  const [templatesSelecionados, setTemplatesSelecionados] = useState<TemplateComTema[]>([]);
  const [temaAtivo, setTemaAtivo] = useState('aniversario');
  const [temaEscolhido, setTemaEscolhido] = useState<string | null>(null);

  // ===== Formulário =====
  const [formData, setFormData] = useState({
    nomeCrianca: '',
    idadeConvite: '',
    dataEvento: '',
    endereco: '',
    whatsapp: '',
    observacoes: ''
  });

  // ===== Pagamento =====
  const PRECO_BASE = 47;
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [loadingPagamento, setLoadingPagamento] = useState(false);

  const precoFinal = Number((PRECO_BASE * (1 - discount / 100)).toFixed(2));

  useEffect(() => {
    setMounted(true);
  }, []);

  // ===== Helpers =====
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

  // ===== Seleção de templates =====
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

  // ===== Cupom =====
  const aplicarCupom = () => {
    const found = AVAILABLE_COUPONS.find(
      c =>
        c.code === coupon.toUpperCase() &&
        c.isActive &&
        (c.allowedProduct === 'TEMPLATE' || c.allowedProduct === 'ALL')
    );

    if (!found) {
      alert('Cupom inválido ou expirado.');
      setDiscount(0);
      return;
    }

    setDiscount(found.discountPercentage);
    alert(`Cupom de ${found.discountPercentage}% aplicado!`);
  };

  // ===== Checkout =====
  const handleIrParaPagamento = async () => {
    if (templatesSelecionados.length !== 2) {
      alert('Selecione exatamente 2 templates.');
      return;
    }

    if (!formData.nomeCrianca || !formData.whatsapp || !formData.dataEvento) {
      alert('Preencha todos os campos obrigatórios.');
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
            templates: templatesSelecionados
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

  // ===== Render =====
  return (
    <main className="min-h-screen bg-gradient-to-b from-beige-50 via-beige-100 to-beige-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-beige-200 rounded-full mb-4">
            <CheckCircle2 className="w-8 h-8 text-brown-700" />
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-brown-700 mb-2">
            Último passo antes do pagamento
          </h1>
          <p className="text-brown-600">
            Escolha 2 convites e finalize seu pedido
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Templates */}
          <div className="lg:col-span-2">
            <div className="flex flex-wrap gap-2 mb-6">
              {Object.keys(imagensPorTema).map(tema => (
                <button
                  key={tema}
                  onClick={() => setTemaAtivo(tema)}
                  disabled={temaEscolhido !== null && temaEscolhido !== tema}
                  className={`px-3 py-2 rounded-full text-sm font-medium ${
                    temaAtivo === tema
                      ? 'bg-beige-300 text-white'
                      : 'bg-white text-brown-700'
                  }`}
                >
                  {getTemaLabel(tema)}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {imagensPorTema[temaAtivo as keyof typeof imagensPorTema]?.map((template, index) => {
                const selecionado = estaSelecionado(template.linkCanva);
                return (
                  <div
                    key={index}
                    onClick={() => handleSelecionarTemplate({ ...template, tema: temaAtivo })}
                    className={`cursor-pointer rounded-xl overflow-hidden border-4 ${
                      selecionado ? 'border-green-400' : 'border-transparent'
                    }`}
                  >
                    <img src={template.imagem} alt={template.nome} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Dados */}
            <div className="bg-white rounded-2xl p-6 shadow-lg space-y-3">
              <h3 className="font-serif text-xl text-brown-700">Dados do Evento</h3>

              {[
                ['Nome da Criança', 'nomeCrianca'],
                ['Idade', 'idadeConvite'],
                ['WhatsApp', 'whatsapp'],
                ['Endereço', 'endereco']
              ].map(([label, key]) => (
                <input
                  key={key}
                  placeholder={label}
                  value={(formData as any)[key]}
                  onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              ))}
            </div>

            {/* Pagamento */}
            <div className="bg-white rounded-2xl p-6 shadow-lg space-y-4">
              <h3 className="font-serif text-xl text-brown-700 flex items-center gap-2">
                <CreditCard className="w-5 h-5" /> Pagamento
              </h3>

              <div className="flex gap-2">
                <input
                  placeholder="Cupom"
                  value={coupon}
                  onChange={e => setCoupon(e.target.value)}
                  className="flex-1 px-4 py-2 border rounded-lg"
                />
                <button
                  onClick={aplicarCupom}
                  className="px-4 bg-beige-200 rounded-lg"
                >
                  <TicketPercent className="w-4 h-4" />
                </button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-400">Total</p>
                <p className="text-3xl font-bold text-brown-700">
                  R$ {precoFinal.toFixed(2)}
                </p>
              </div>

              <button
                onClick={handleIrParaPagamento}
                disabled={loadingPagamento}
                className="w-full py-3 bg-beige-300 text-white rounded-full font-medium"
              >
                {loadingPagamento ? 'Redirecionando...' : 'Ir para pagamento'}
              </button>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}

export default function Sucesso() {
  return (
    <Suspense fallback={<div className="p-20 text-center">Carregando...</div>}>
      <SucessoContent />
    </Suspense>
  );
}
