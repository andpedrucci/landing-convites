'use client';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { CheckCircle2, Heart, Send, X, Check, AlertCircle } from 'lucide-react';
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
  const [temaEscolhido, setTemaEscolhido] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  // Dados do formulário - ATUALIZADO
  const [formData, setFormData] = useState({
    nomeCrianca: '',
    idadeConvite: '',
    dataEvento: '',
    endereco: '',
    whatsapp: '',
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
      
      // Se removeu todos, libera a escolha de tema novamente
      if (templatesSelecionados.length === 1) {
        setTemaEscolhido(null);
      }
      return;
    }

    // NOVA LÓGICA: Verifica se já escolheu um tema
    if (temaEscolhido && template.tema !== temaEscolhido) {
      alert(`Você só pode escolher templates do tema "${getTemaLabel(temaEscolhido)}". Remova os templates selecionados para escolher outro tema.`);
      return;
    }

    // Se já tem 2, não adiciona mais (MUDOU DE 5 PARA 2)
    if (templatesSelecionados.length >= 2) {
      alert('Você já selecionou 2 templates! Remova um para adicionar outro.');
      return;
    }

    // Define o tema escolhido na primeira seleção
    if (templatesSelecionados.length === 0) {
      setTemaEscolhido(template.tema);
    }

    // Adiciona o template
    setTemplatesSelecionados([...templatesSelecionados, template]);
  };

  const getTemaLabel = (temaId: string) => {
    const temas: { [key: string]: string } = {
      'aniversario': 'Aniversário',
      'batizado': 'Batizado',
      'revelacao': 'Chá Revelação',
      'cha-bebe': 'Chá de Bebê',
      'fundomar': 'Fundo do Mar',
      'princesa': 'Princesas',
      'diversos': 'Diversos'
    };
    return temas[temaId] || temaId;
  };

  const estaSelecionado = (linkCanva: string) => {
    return templatesSelecionados.some(t => t.linkCanva === linkCanva);
  };

  const handleEnviarTemplates = async () => {
    // Validações - ATUALIZADO
    if (templatesSelecionados.length !== 2) {
      alert('Você precisa selecionar exatamente 2 templates!');
      return;
    }

    if (!formData.nomeCrianca || !formData.whatsapp || !formData.dataEvento) {
      alert('Por favor, preencha todos os campos obrigatórios (Nome da Criança, WhatsApp e Data do Evento)!');
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
          templates: templatesSelecionados.map((t, index) => ({
            ordem: index + 1,
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
            Você receberá um email com os 2 templates selecionados em instantes!
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
          
          <p className="text-lg text-brown-600 mb-1">Selecione 2 templates do mesmo tema</p>
          <p className="text-brown-600/70 text-sm">
            {templatesSelecionados.length} de 2 selecionados
            {temaEscolhido && ` • Tema: ${getTemaLabel(temaEscolhido)}`}
          </p>
        </div>

        {/* Aviso sobre tema único */}
        {temaEscolhido && (
          <div className="max-w-2xl mx-auto mb-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800">
                Você está selecionando templates do tema <strong>{getTemaLabel(temaEscolhido)}</strong>. 
                Para escolher outro tema, remova os templates já selecionados.
              </p>
            </div>
          </div>
        )}

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
                  disabled={temaEscolhido !== null && temaEscolhido !== tema.id}
                  className={`px-3 py-2 rounded-full font-medium transition-all text-sm ${
                    temaAtivo === tema.id
                      ? 'bg-beige-300 text-white shadow-lg'
                      : temaEscolhido !== null && temaEscolhido !== tema.id
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
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
                const desabilitado = temaEscolhido !== null && temaEscolhido !== temaAtivo;
                
                return (
                  <div
                    key={index}
                    onClick={() => !desabilitado && handleSelecionarTemplate(templateComTema)}
                    className={`relative cursor-pointer group rounded-xl overflow-hidden transition-all ${
                      selecionado 
                        ? 'ring-4 ring-green-400 shadow-xl' 
                        : desabilitado
                        ? 'opacity-40 cursor-not-allowed'
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
                        : desabilitado
                        ? 'bg-gray-500/50'
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
                  Selecionados ({templatesSelecionados.length}/2)
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
                          <p className="text-xs text-brown-600/60 capitalize">{getTemaLabel(template.tema)}</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelecionarTemplate(template);
                          }}
                          className="p-1 hover:bg-red-100 rounded-full transition-colors"
                        >
                          <X className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Formulário - ATUALIZADO */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="font-serif text-xl text-brown-700 mb-4">Dados do Evento</h3>

                <div className="space-y-4">
                  
                  {/* Nome da Criança */}
                  <div>
                    <label className="block text-sm font-medium text-brown-700 mb-1">
                      Nome da Criança *
                    </label>
                    <input
                      type="text"
                      value={formData.nomeCrianca}
                      onChange={(e) => setFormData({ ...formData, nomeCrianca: e.target.value })}
                      className="w-full px-4 py-2 border border-beige-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-beige-300"
                      placeholder="Maria"
                    />
                  </div>

                  {/* Idade do Convite */}
                  <div>
                    <label className="block text-sm font-medium text-brown-700 mb-1">
                      Idade do Convite *
                    </label>
                    <input
                      type="text"
                      value={formData.idadeConvite}
                      onChange={(e) => setFormData({ ...formData, idadeConvite: e.target.value })}
                      className="w-full px-4 py-2 border border-beige-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-beige-300"
                      placeholder="Ex: 1 ano, 3 meses, etc"
                    />
                  </div>

                  {/* Data do Evento */}
                  <div>
                    <label className="block text-sm font-medium text-brown-700 mb-1">
                      Data do Evento *
                    </label>
                    <input
                      type="date"
                      value={formData.dataEvento}
                      onChange={(e) => setFormData({ ...formData, dataEvento: e.target.value })}
                      className="w-full px-4 py-2 border border-beige-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-beige-300"
                    />
                  </div>

                  {/* Endereço */}
                  <div>
                    <label className="block text-sm font-medium text-brown-700 mb-1">
                      Endereço do Evento *
                    </label>
                    <input
                      type="text"
                      value={formData.endereco}
                      onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                      className="w-full px-4 py-2 border border-beige-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-beige-300"
                      placeholder="Rua, número, bairro, cidade"
                    />
                  </div>

                  {/* WhatsApp */}
                  <div>
                    <label className="block text-sm font-medium text-brown-700 mb-1">
                      WhatsApp *
                    </label>
                    <input
                      type="tel"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      className="w-full px-4 py-2 border border-beige-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-beige-300"
                      placeholder="(11) 99508-7592"
                    />
                  </div>

                  {/* Observações */}
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
                    disabled={enviando || templatesSelecionados.length !== 2}
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
