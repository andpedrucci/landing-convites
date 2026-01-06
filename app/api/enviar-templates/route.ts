// ============================================
// 📁 ARQUIVO: /app/api/enviar-templates/route.ts
// 📝 FUNÇÃO: Salvar dados de TEMPLATES no CRM
// 🎯 CHAMADO POR: Webhook do Mercado Pago
// 💾 SALVA EM: Supabase (empresa_leads, contato_leads, projetos, projeto_templates)
// ✨ ATUALIZADO: Recebe metadata flat + novos campos
// ============================================

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

    console.log('📨 Dados recebidos do webhook:', JSON.stringify(body, null, 2));

    // ============================================
    // 🔍 DETECTAR FORMATO DOS DADOS
    // ============================================
    
    // FORMATO NOVO (flat): { nomeMae, nomeCrianca, template1, template2, ... }
    // FORMATO ANTIGO (aninhado): { cliente: {...}, templates: [...] }
    
    const isFormatoNovo = body.nomeCrianca !== undefined;
    
    let nomeMae, nomeCrianca, idadeCrianca, dataEvento, horarioEvento, endereco, whatsapp, observacoes;
    let template1Link, template2Link;

    if (isFormatoNovo) {
      // ✨ FORMATO NOVO (FLAT)
      nomeMae = body.nomeMae || '';
      nomeCrianca = body.nomeCrianca || '';
      idadeCrianca = body.idadeCrianca || '';
      dataEvento = body.dataEvento || '';
      horarioEvento = body.horarioEvento || '';
      endereco = body.endereco || '';
      whatsapp = body.whatsapp || '';
      observacoes = body.observacoes || '';
      template1Link = body.template1 || '';
      template2Link = body.template2 || '';

      console.log('✅ Formato NOVO detectado (metadata flat)');
    } else {
      // 📦 FORMATO ANTIGO (COMPATIBILIDADE)
      const { cliente, templates } = body;

      if (!cliente || !templates || templates.length !== 2) {
        return NextResponse.json(
          { error: 'Dados inválidos. Envie cliente e exatamente 2 templates.' },
          { status: 400 }
        );
      }

      nomeMae = cliente.nomeMae || '';
      nomeCrianca = cliente.nomeCrianca || '';
      idadeCrianca = cliente.idadeConvite || '';
      dataEvento = cliente.dataEvento || '';
      horarioEvento = cliente.horarioEvento || '';
      endereco = cliente.endereco || '';
      whatsapp = cliente.whatsapp || '';
      observacoes = cliente.observacoes || '';
      template1Link = templates[0]?.linkCanva || templates[0] || '';
      template2Link = templates[1]?.linkCanva || templates[1] || '';

      console.log('⚠️ Formato ANTIGO detectado (compatibilidade)');
    }

    // ============================================
    // 🔍 VALIDAÇÃO DOS DADOS OBRIGATÓRIOS
    // ============================================
    if (!nomeCrianca || !whatsapp || !dataEvento) {
      console.error('❌ Validação falhou:', { nomeCrianca, whatsapp, dataEvento });
      return NextResponse.json(
        { error: 'Nome da Criança, WhatsApp e Data do Evento são obrigatórios.' },
        { status: 400 }
      );
    }

    if (!template1Link || !template2Link) {
      console.error('❌ Templates ausentes:', { template1Link, template2Link });
      return NextResponse.json(
        { error: 'Os 2 templates são obrigatórios.' },
        { status: 400 }
      );
    }

    console.log('✅ Validação OK');

    // ============================================
    // 1️⃣ CRIAR EMPRESA_LEAD
    // ============================================
    const { data: empresaLead, error: erroEmpresa } = await supabase
      .from('empresa_leads')
      .insert({
        nome: nomeCrianca,
        telefone: whatsapp,
        empresa_id: EMPRESA_ID,
        origem: 'Landing Page - Studio Invitare (Templates)'
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
        origem: 'Landing Page - Studio Invitare (Templates)'
      })
      .select()
      .single();

    if (erroContato) {
      console.error('⚠️ Erro ao criar contato:', erroContato);
    } else {
      console.log('✅ Contato criado:', contato.id);
    }

    // ============================================
    // 3️⃣ CRIAR PROJETO
    // ============================================
    
    // Formatar data e horário
    const dataFormatada = new Date(dataEvento).toLocaleDateString('pt-BR');
    const horarioTexto = horarioEvento ? `às ${horarioEvento}` : '';

    const descricaoProjeto = `
👤 NOME DA MÃE: ${nomeMae || 'Não informado'}
👶 NOME DA CRIANÇA: ${nomeCrianca}
🎂 IDADE: ${idadeCrianca || 'Não informado'}
📅 DATA DO EVENTO: ${dataFormatada} ${horarioTexto}
📍 ENDEREÇO: ${endereco || 'Não informado'}

🎨 TEMPLATES SELECIONADOS (2):
1. ${template1Link}
2. ${template2Link}

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
        valor: 20.00 // Valor fixo do pacote
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
    
    const templatesParaSalvar = [
      {
        projeto_id: projeto.id,
        ordem: 1,
        nome: 'Template 1',
        tema: 'Selecionado pelo cliente',
        link_canva: template1Link
      },
      {
        projeto_id: projeto.id,
        ordem: 2,
        nome: 'Template 2',
        tema: 'Selecionado pelo cliente',
        link_canva: template2Link
      }
    ];

    const { error: erroTemplates } = await supabase
      .from('projeto_templates')
      .insert(templatesParaSalvar);

    if (erroTemplates) {
      console.error('⚠️ Erro ao salvar templates:', erroTemplates);
    } else {
      console.log('✅ Templates salvos:', templatesParaSalvar.length);
    }

    // ============================================
    // ✅ RESPOSTA DE SUCESSO
    // ============================================
    return NextResponse.json({
      success: true,
      message: 'Projeto de templates criado com sucesso no CRM!',
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
