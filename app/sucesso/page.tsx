'use client';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { CheckCircle2, Heart, Send, X, Check } from 'lucide-react';
import { imagensPorTema } from '@/lib/templates-data';

interface TemplateComTema {
  nome: string;
  descricao: string;
  imagem: string;
  linkCanva: string;
  tema: string;
}

function SucessoContent() {
  const [mounted, setMounted] = useState(false);
  const [templatesSelecionados, setTemplatesSelecionados] = useState<TemplateComTema[]>([]);
  const [temaAtivo, setTemaAtivo] = useState('aniversario');
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

  // Todos os templates em um array único com tema identificado
  const todosTemplates: TemplateComTema[] = Object.entries(imagensPorTema).flatMap(
    ([tema, templates]) => templates.map(t => ({ ...t, tema }))
  );

  const handleSelecionarTemplate = (template: TemplateComTema) => {
    // Se já está selecionado, remove
    if (templatesSelecionados.find(t => t.linkCanva === template.linkCanva)) {
      setTemplatesSelecionados(templatesSelecionados.filter(t => t.linkCanva !== template.linkCanva));
      return;
    }

    // Se já tem 5, não adiciona mais
    if (templatesSelecionados.length >= 5) {
      alert('Você já selecionou 5 templates! Remova um para adicionar outro.');
      return;
    }

    // Adiciona o template
    setTemplatesSelecionados([...templatesSelecionados, template]);
  };

  const estaSelecionado = (linkCanva: string) => {
    return templatesSelecionados.some(t => t.linkCanva === linkCanva);
  };

  const handleEnviarTemplates = async () => {
    // Validações
    if (templatesSelecionados.length !== 5) {
      alert('Você precisa selecionar exatamente 5 templates!');
      return;
    }

    if (!formData.nome || !formData.email || !formData.whatsapp) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    setEnviando(true);

    try {
      const response = await fetch('/api/enviar-templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cliente: formData,
          templates: templatesSelecionados.map(t => ({
            nome: t.nome,
            linkCanva: t.linkCanva,
            tema: t.tema
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar templates');
      }

      setEnviado(true);
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao enviar templates. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  };

  // Tela de confirmação após envio
  if (enviado) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-beige-50 via-beige-100 to-beige-50 flex items-center justify-center py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
            <CheckCircle2 className="w-16 h-16 text-green-600" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-serif text-brown-700 mb-4">
            Templates Enviados! 🎉
          </h1>
          
          <p className="text-xl text-brown-600 mb-8">
            Você receberá um email com os 5 templates selecionados em instantes!
          </p>

          <a 
            href="/" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-beige-300 text-white rounded-full font-medium hover:bg-beige-400 transition-all"
          >
            Voltar para o site
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-beige-50 via-beige-100 to-beige-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-serif text-brown-700 mb-3">
            Pagamento Confirmado! 🎉
          </h1>
          
          <p className="text-lg text-brown-600 mb-1">Selecione seus 5 templates favoritos</p>
          <p className="text-brown-600/70 text-sm">
            {templatesSelecionados.length} de 5 selecionados
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Coluna Esquerda - Seletor de Templates */}
          <div className="lg:col-span-2">
            
            {/* Menu de Temas */}
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { id: 'aniversario', label: 'Aniversário', emoji: '🎂' },
                { id: 'batizado', label: 'Batizado', emoji: '✨' },
                { id: 'revelacao', label: 'Chá Revelação', emoji: '🎀' },
                { id: 'cha-bebe', label: 'Chá de Bebê', emoji: '🍼' },
                { id: 'fundomar', label: 'Fundo do Mar', emoji: '🌊' },
                { id: 'princesa', label: 'Princesas', emoji: '👸🏼' },
                { id: 'diversos', label: 'Diversos', emoji: '🎉' },
              ].map((tema) => (
                <button
                  key={tema.id}
                  onClick={() => setTemaAtivo(tema.id)}
                  className={`px-3 py-2 rounded-full font-medium transition-all text-sm ${
                    temaAtivo === tema.id
                      ? 'bg-beige-300 text-white shadow-lg'
                      : 'bg-white text-brown-700 hover:bg-beige-50 shadow-md'
                  }`}
                >
                  <span className="mr-1">{tema.emoji}</span>
                  {tema.label}
                </button>
              ))}
            </div>

            {/* Grid de Templates */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {imagensPorTema[temaAtivo as keyof typeof imagensPorTema]?.map((template, index) => {
                const templateComTema = { ...template, tema: temaAtivo };
                const selecionado = estaSelecionado(template.linkCanva);
                
                return (
                  <div
                    key={index}
                    onClick={() => handleSelecionarTemplate(templateComTema)}
                    className={`relative cursor-pointer group rounded-xl overflow-hidden transition-all ${
                      selecionado 
                        ? 'ring-4 ring-green-400 shadow-xl' 
                        : 'hover:shadow-lg'
                    }`}
                  >
                    <img 
                      src={template.imagem} 
                      alt={template.nome}
                      className="w-full aspect-[3/4] object-cover"
                    />
                    
                    {/* Overlay */}
                    <div className={`absolute inset-0 transition-all ${
                      selecionado 
                        ? 'bg-green-600/20' 
                        : 'bg-black/0 group-hover:bg-black/10'
                    }`} />

                    {/* Checkmark se selecionado */}
                    {selecionado && (
                      <div className="absolute top-2 right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                        <Check className="w-5 h-5 text-white" strokeWidth={3} />
                      </div>
                    )}

                    {/* Nome ao hover */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-sm font-medium">{template.nome}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Coluna Direita - Templates Selecionados + Formulário */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              
              {/* Templates Selecionados */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="font-serif text-xl text-brown-700 mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-beige-300" />
                  Selecionados ({templatesSelecionados.length}/5)
                </h3>

                {templatesSelecionados.length === 0 ? (
                  <p className="text-brown-600/60 text-sm text-center py-4">
                    Nenhum template selecionado ainda
                  </p>
                ) : (
                  <div className="space-y-3">
                    {templatesSelecionados.map((template, index) => (
                      <div key={index} className="flex items-center gap-3 bg-beige-50 rounded-lg p-3">
                        <img 
                          src={template.imagem} 
                          alt={template.nome}
                          className="w-12 h-16 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-brown-700 truncate">{template.nome}</p>
                          <p className="text-xs text-brown-600/60 capitalize">{template.tema}</p>
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

              {/* Formulário */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="font-serif text-xl text-brown-700 mb-4">Seus Dados</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-brown-700 mb-1">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      className="w-full px-4 py-2 border border-beige-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-beige-300"
                      placeholder="Maria Silva"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brown-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-beige-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-beige-300"
                      placeholder="maria@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brown-700 mb-1">
                      WhatsApp *
                    </label>
                    <input
                      type="tel"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      className="w-full px-4 py-2 border border-beige-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-beige-300"
                      placeholder="(11) 99999-9999"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brown-700 mb-1">
                      Tipo de Evento
                    </label>
                    <select
                      value={formData.tipoEvento}
                      onChange={(e) => setFormData({ ...formData, tipoEvento: e.target.value })}
                      className="w-full px-4 py-2 border border-beige-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-beige-300"
                    >
                      <option value="">Selecione...</option>
                      <option value="aniversario">Aniversário</option>
                      <option value="batizado">Batizado</option>
                      <option value="cha-revelacao">Chá Revelação</option>
                      <option value="cha-bebe">Chá de Bebê</option>
                      <option value="outros">Outros</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brown-700 mb-1">
                      Observações
                    </label>
                    <textarea
                      value={formData.observacoes}
                      onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-beige-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-beige-300 resize-none"
                      placeholder="Alguma observação especial?"
                    />
                  </div>

                  <button
                    onClick={handleEnviarTemplates}
                    disabled={enviando || templatesSelecionados.length !== 5}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-beige-300 text-white rounded-full font-medium hover:bg-beige-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {enviando ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Enviando...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Enviar Templates</span>
                      </>
                    )}
                  </button>

                  <p className="text-xs text-center text-brown-600/60">
                    Você receberá um email com os links dos templates
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </main>
  );
}

export default function Sucesso() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-beige-300 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SucessoContent />
    </Suspense>
  );
}
