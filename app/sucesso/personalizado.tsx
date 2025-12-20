'use client';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { CheckCircle2, Heart, Send, Sparkles } from 'lucide-react';

function PersonalizadoContent() {
  const [mounted, setMounted] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  // Dados do formulário
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    whatsapp: '',
    tipoEvento: '',
    observacoes: ''
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleEnviarSolicitacao = async () => {
    // Validações
    if (!formData.nome || !formData.whatsapp) {
      alert('Por favor, preencha Nome e WhatsApp!');
      return;
    }

    setEnviando(true);

    try {
      const response = await fetch('/api/enviar-personalizado', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cliente: formData
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar solicitação');
      }

      setEnviado(true);
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao enviar solicitação. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  };

  if (!mounted) {
    return null;
  }

  if (enviado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900">
            Solicitação Enviada! 🎉
          </h1>
          
          <div className="space-y-3 text-left bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
            <p className="text-gray-700">
              <strong>Olá, {formData.nome}!</strong>
            </p>
            <p className="text-gray-700">
              Recebemos sua solicitação para criação de convite personalizado! 
            </p>
            <p className="text-gray-700">
              Em breve entraremos em contato pelo WhatsApp <strong>{formData.whatsapp}</strong> para entender melhor sua visão e criar algo único para você.
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-pink-600">
            <Heart className="w-5 h-5 fill-current" />
            <span className="text-sm font-medium">Studio Invitare</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg mb-6">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span className="font-semibold text-gray-800">Convite Personalizado</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Crie seu convite único! ✨
          </h1>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Preencha o formulário abaixo e nossa equipe entrará em contato para criar um convite totalmente personalizado para o seu evento especial.
          </p>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          <div className="space-y-6">
            
            {/* Nome */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nome completo *
              </label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Seu nome"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="seu@email.com"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
              />
            </div>

            {/* WhatsApp */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                WhatsApp *
              </label>
              <input
                type="tel"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                placeholder="(11) 99999-9999"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
                required
              />
            </div>

            {/* Tipo de Evento */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tipo de evento
              </label>
              <select
                value={formData.tipoEvento}
                onChange={(e) => setFormData({ ...formData, tipoEvento: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all outline-none bg-white"
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Conte-nos sobre sua visão
              </label>
              <textarea
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                placeholder="Descreva como você imagina seu convite: cores, estilo, tema, elementos especiais..."
                rows={6}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all outline-none resize-none"
              />
            </div>

            {/* Botão Enviar */}
            <button
              onClick={handleEnviarSolicitacao}
              disabled={enviando}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg"
            >
              {enviando ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Enviar Solicitação
                </>
              )}
            </button>

            <p className="text-sm text-gray-500 text-center">
              * Campos obrigatórios
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 flex items-center justify-center gap-2 text-gray-600">
          <Heart className="w-4 h-4 fill-current text-pink-600" />
          <span className="text-sm">Feito com amor pela Studio Invitare</span>
        </div>

      </div>
    </div>
  );
}

export default function PersonalizadoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PersonalizadoContent />
    </Suspense>
  );
}
