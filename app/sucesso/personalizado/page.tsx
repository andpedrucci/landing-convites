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

  if (enviado) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-beige-50 via-beige-100 to-beige-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-3xl font-serif text-brown-700">
            Solicitação Enviada! 🎉
          </h1>
          
          <div className="space-y-3 text-left bg-beige-50 rounded-xl p-6">
            <p className="text-brown-700">
              <strong>Olá, {formData.nome}!</strong>
            </p>
            <p className="text-brown-700">
              Recebemos sua solicitação para criação de convite personalizado! 
            </p>
            <p className="text-brown-700">
              Em breve entraremos em contato pelo WhatsApp <strong>{formData.whatsapp}</strong> para entender melhor sua visão e criar algo único para você.
            </p>
          </div>

          <a 
            href="/" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-beige-300 text-white rounded-full font-medium hover:bg-beige-400 transition-all"
          >
            Voltar para o site
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-beige-50 via-beige-100 to-beige-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-serif text-brown-700 mb-3">
            Pagamento Confirmado! 🎉
          </h1>
          
          <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg mb-4">
            <Sparkles className="w-5 h-5 text-beige-300" />
            <span className="font-semibold text-brown-700">Convite Personalizado</span>
          </div>
          
          <p className="text-lg text-brown-600">
            Preencha o formulário abaixo para começarmos a criar seu convite exclusivo!
          </p>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
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

            {/* Botão Enviar */}
            <button
              onClick={handleEnviarSolicitacao}
              disabled={enviando}
              className="w-full bg-beige-300 hover:bg-beige-400 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg"
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

            <p className="text-sm text-brown-600/60 text-center">
              * Campos obrigatórios
            </p>
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

export default function PersonalizadoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-beige-50 via-beige-100 to-beige-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-beige-300 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PersonalizadoContent />
    </Suspense>
  );
}
