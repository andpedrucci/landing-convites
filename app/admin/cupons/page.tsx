'use client';

import { useState } from 'react';
import { Ticket, Percent, Calendar, DollarSign, Tag } from 'lucide-react';

export default function AdminCupons() {
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<any>(null);
  const [erro, setErro] = useState('');

  const [formData, setFormData] = useState({
    codigo: '',
    tipo: 'percent', // 'percent' ou 'amount'
    valor: '',
    dataExpiracao: '',
    usosMaximos: '',
    produto: 'templates' // 'templates' ou 'personalizado'
  });

  const criarCupom = async () => {
    setLoading(true);
    setErro('');
    setResultado(null);

    try {
      const response = await fetch('/api/criar-cupom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar cupom');
      }

      setResultado(data);
      
      // Limpar formulário
      setFormData({
        codigo: '',
        tipo: 'percent',
        valor: '',
        dataExpiracao: '',
        usosMaximos: '',
        produto: 'templates'
      });
      
    } catch (error: any) {
      setErro(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-beige-50 to-beige-100 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg mb-4">
            <Ticket className="w-5 h-5 text-beige-300" />
            <h1 className="text-xl font-serif text-brown-700">Criar Cupom de Desconto</h1>
          </div>
          <p className="text-brown-600">Configure cupons para seus produtos</p>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Código do Cupom */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-brown-700 mb-2">
                <Tag className="w-4 h-4" />
                Código do Cupom *
              </label>
              <input
                type="text"
                value={formData.codigo}
                onChange={(e) => setFormData({ ...formData, codigo: e.target.value.toUpperCase() })}
                placeholder="Ex: NATAL2024"
                className="w-full px-4 py-3 border-2 border-beige-200 rounded-lg focus:border-beige-300 focus:outline-none uppercase"
                required
              />
              <p className="text-xs text-brown-600/60 mt-1">Use letras maiúsculas e números. Ex: BEMVINDO, NATAL2024</p>
            </div>

            {/* Produto */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-brown-700 mb-2">
                <DollarSign className="w-4 h-4" />
                Produto *
              </label>
              <select
                value={formData.produto}
                onChange={(e) => setFormData({ ...formData, produto: e.target.value })}
                className="w-full px-4 py-3 border-2 border-beige-200 rounded-lg focus:border-beige-300 focus:outline-none"
              >
                <option value="templates">Templates Digitais (R$ 47)</option>
                <option value="personalizado">Personalizado (R$ 147)</option>
              </select>
            </div>

            {/* Tipo de Desconto */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-brown-700 mb-2">
                <Percent className="w-4 h-4" />
                Tipo de Desconto *
              </label>
              <select
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                className="w-full px-4 py-3 border-2 border-beige-200 rounded-lg focus:border-beige-300 focus:outline-none"
              >
                <option value="percent">Percentual (%)</option>
                <option value="amount">Valor Fixo (R$)</option>
              </select>
            </div>

            {/* Valor do Desconto */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-brown-700 mb-2">
                {formData.tipo === 'percent' ? <Percent className="w-4 h-4" /> : <DollarSign className="w-4 h-4" />}
                Valor do Desconto *
              </label>
              <input
                type="number"
                value={formData.valor}
                onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                placeholder={formData.tipo === 'percent' ? '10' : '5.00'}
                step={formData.tipo === 'percent' ? '1' : '0.01'}
                min="0"
                max={formData.tipo === 'percent' ? '100' : undefined}
                className="w-full px-4 py-3 border-2 border-beige-200 rounded-lg focus:border-beige-300 focus:outline-none"
                required
              />
              <p className="text-xs text-brown-600/60 mt-1">
                {formData.tipo === 'percent' ? 'Ex: 10 para 10% de desconto' : 'Ex: 5.00 para R$ 5,00 de desconto'}
              </p>
            </div>

            {/* Data de Expiração */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-brown-700 mb-2">
                <Calendar className="w-4 h-4" />
                Data de Expiração
              </label>
              <input
                type="date"
                value={formData.dataExpiracao}
                onChange={(e) => setFormData({ ...formData, dataExpiracao: e.target.value })}
                className="w-full px-4 py-3 border-2 border-beige-200 rounded-lg focus:border-beige-300 focus:outline-none"
              />
              <p className="text-xs text-brown-600/60 mt-1">Deixe vazio para sem expiração</p>
            </div>

            {/* Usos Máximos */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-brown-700 mb-2">
                <Ticket className="w-4 h-4" />
                Número Máximo de Usos
              </label>
              <input
                type="number"
                value={formData.usosMaximos}
                onChange={(e) => setFormData({ ...formData, usosMaximos: e.target.value })}
                placeholder="Ilimitado"
                min="1"
                className="w-full px-4 py-3 border-2 border-beige-200 rounded-lg focus:border-beige-300 focus:outline-none"
              />
              <p className="text-xs text-brown-600/60 mt-1">Deixe vazio para ilimitado</p>
            </div>

          </div>

          {/* Botão Criar */}
          <button
            onClick={criarCupom}
            disabled={loading || !formData.codigo || !formData.valor}
            className="w-full mt-8 flex items-center justify-center gap-2 py-4 bg-beige-300 text-white rounded-lg font-semibold hover:bg-beige-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Criando Cupom...
              </>
            ) : (
              <>
                <Ticket className="w-5 h-5" />
                Criar Cupom
              </>
            )}
          </button>
        </div>

        {/* Erro */}
        {erro && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-6">
            <p className="text-red-700 font-medium">❌ Erro: {erro}</p>
          </div>
        )}

        {/* Resultado */}
        {resultado && (
          <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-6">
            <h3 className="text-green-700 font-semibold text-lg mb-3">✅ Cupom criado com sucesso!</h3>
            
            <div className="bg-white rounded-lg p-4 space-y-2">
              <p><strong>Código:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{resultado.cupom.name || resultado.cupom.id}</code></p>
              <p><strong>Desconto:</strong> {resultado.cupom.percent_off ? `${resultado.cupom.percent_off}%` : `R$ ${resultado.cupom.amount_off}`}</p>
              <p><strong>Válido até:</strong> {resultado.cupom.valid_until || 'Sem expiração'}</p>
              <p><strong>Usos máximos:</strong> {resultado.cupom.max_uses || 'Ilimitado'}</p>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>💡 Como usar:</strong> Os clientes podem inserir o código <code className="bg-white px-2 py-1 rounded">{resultado.cupom.name || resultado.cupom.id}</code> no checkout do Mercado Pago.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
