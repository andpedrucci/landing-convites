import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// ============================================
// 🔧 CONFIGURAÇÃO SUPABASE
// ============================================
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// ============================================
// 📌 IDS FIXOS DO STUDIO INVITARE NA DATAMIND
// ============================================
const EMPRESA_ID = '4cc6753d-0002-4ae8-90ad-6c3bc418f015';
const FUNIL_TEMPLATES_DIGITAIS = '9ce3a9c2-0540-40ee-9c8e-bbe83df4001a';
const ETAPA_INICIAL = 'Projeto iniciado';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cliente, templates } = body;

    // ============================================
    // 🔍 VALIDAÇÃO DOS DADOS - ATUALIZADO
    // ============================================
    if (!cliente || !templates || templates.length !== 2) {
      return NextResponse.json(
        { error: 'Dados inválidos. Envie cliente e exatamente 2 templates.' },
        { status: 400 }
      );
    }

    const { nomeCrianca, idadeConvite, dataEvento, endereco, whatsapp, observacoes } = cliente;

    if (!nomeCrianca || !whatsapp || !dataEvento) {
      return NextResponse.json(
        { error: 'Nome da Criança, WhatsApp e Data do Evento são obrigatórios.' },
        { status: 400 }
      );
    }

    console.log('📨 Dados recebidos:', JSON.stringify(body, null, 2));

    // ============================================
    // 1️⃣ CRIAR EMPRESA_LEAD
    // ============================================
    const { data: empresaLead, error: erroEmpresa } = await supabase
      .from('empresa_leads')
      .insert({
        nome: nomeCrianca,
        telefone: whatsapp,
        empresa_id: EMPRESA_ID,
        origem: 'Landing Page - Studio Invitare'
      })
      .select()
      .single();

    if (erroEmpresa) {
      console.error('❌ Erro ao criar empresa_lead:', erroEmpresa);
      throw new Error(`Erro ao criar empresa: ${erroEmpresa.message}`);
    }

    console.log('✅ Empresa criada:', empresaLead.id);

    // ============================================
    // 2️⃣ CRIAR CONTATO (vinculado à empresa)
    // ============================================
    const { data: contato, error: erroContato } = await supabase
      .from('contato_leads')
      .insert({
        empresa_lead_id: empresaLead.id,
        nome: nomeCrianca,
        email: null,
        telefone: whatsapp,
        contato_principal: true,
        empresa_id: EMPRESA_ID,
        origem: 'Landing Page - Studio Invitare'
      })
      .select()
      .single();

    if (erroContato) {
      console.error('⚠️ Erro ao criar contato:', erroContato);
      // Não falha se contato não for criado
    } else {
      console.log('✅ Contato criado:', contato.id);
    }

    // ============================================
    // 3️⃣ CRIAR PROJETO - ATUALIZADO COM NOVOS CAMPOS
    // ============================================
    
    // Montar descrição com os templates
    const templatesTexto = templates
      .map((t: any) => `${t.ordem}. ${t.nome} (${t.tema}) - ${t.linkCanva}`)
      .join('\n');

    // Formatar data para exibição
    const dataFormatada = new Date(dataEvento).toLocaleDateString('pt-BR');

    const descricaoProjeto = `
👶 NOME DA CRIANÇA: ${nomeCrianca}
🎂 IDADE: ${idadeConvite || 'Não informado'}
📅 DATA DO EVENTO: ${dataFormatada}
📍 ENDEREÇO: ${endereco || 'Não informado'}

🎨 TEMPLATES SELECIONADOS (${templates.length}):
${templatesTexto}

💬 OBSERVAÇÕES DO CLIENTE:
${observacoes || 'Nenhuma observação.'}
    `.trim();

    const { data: projeto, error: erroProjeto } = await supabase
      .from('projetos')
      .insert({
        nome: `Templates - ${nomeCrianca}`,
        descricao: descricaoProjeto,
        empresa_id: EMPRESA_ID,
        funil_projeto_id: FUNIL_TEMPLATES_DIGITAIS,
        etapa: ETAPA_INICIAL,
        status: 'ativo',
        origem: 'Landing Page - Studio Invitare',
        valor: 47.00 // Valor fixo do pacote
      })
      .select()
      .single();

    if (erroProjeto) {
      console.error('❌ Erro ao criar projeto:', erroProjeto);
      throw new Error(`Erro ao criar projeto: ${erroProjeto.message}`);
    }

    console.log('✅ Projeto criado:', projeto.id);

    // ============================================
    // 4️⃣ SALVAR OS 2 TEMPLATES NA TABELA projeto_templates
    // ============================================
    
    const templatesParaSalvar = templates.map((t: any) => ({
      projeto_id: projeto.id,
      ordem: t.ordem,
      nome: t.nome,
      tema: t.tema,
      link_canva: t.linkCanva
    }));

    const { error: erroTemplates } = await supabase
      .from('projeto_templates')
      .insert(templatesParaSalvar);

    if (erroTemplates) {
      console.error('⚠️ Erro ao salvar templates:', erroTemplates);
      // Não falha o processo, apenas loga
    } else {
      console.log('✅ Templates salvos:', templatesParaSalvar.length);
    }

    // ============================================
    // 5️⃣ CHAMAR API DO MAKE (ENVIAR EMAIL) - ATUALIZADO
    // ============================================
    const templatesDetalhes = templates
      .map((t: any) => `${t.ordem}. ${t.nome} (${t.tema})`)
      .join('\n');

    try {
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/enviar-email-make`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          produto: 'Templates Digitais',
          preco: 47.00,
          cliente: {
            nome: nomeCrianca,
            email: '',
            whatsapp
          },
          detalhes: `
Nome da Criança: ${nomeCrianca}
Idade: ${idadeConvite || 'Não informado'}
Data do Evento: ${dataFormatada}
Endereço: ${endereco || 'Não informado'}

Templates selecionados:
${templatesDetalhes}

Observações: ${observacoes || 'Nenhuma'}
          `.trim(),
          tipoEvento: templates[0]?.tema || 'Não informado',
          datamind: {
            empresa_lead_id: empresaLead.id,
            contato_id: contato?.id,
            projeto_id: projeto.id
          }
        }),
      });
      console.log('✅ Email enviado via Make');
    } catch (erroMake) {
      console.warn('⚠️ Falha ao enviar email (não crítico):', erroMake);
    }

    // ============================================
    // ✅ RESPOSTA DE SUCESSO
    // ============================================
    return NextResponse.json({
      success: true,
      message: 'Projeto criado com sucesso na DataMind!',
      data: {
        empresa_lead_id: empresaLead.id,
        contato_id: contato?.id,
        projeto_id: projeto.id
      }
    });

  } catch (erro: any) {
    console.error('❌ Erro ao processar requisição:', erro);
    
    return NextResponse.json(
      { error: erro.message || 'Erro ao processar envio' },
      { status: 500 }
    );
  }
}
