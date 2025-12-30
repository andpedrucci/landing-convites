// ============================================
// 📁 ARQUIVO: /app/api/enviar-mesversario/route.ts
// 📝 FUNÇÃO: Salvar dados da ASSINATURA MÊSVERSÁRIO no CRM
// 🎯 CHAMADO POR: Webhook do Mercado Pago
// 💾 SALVA EM: Supabase (empresa_leads, contato_leads, projetos)
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
const FUNIL_MESVERSARIO = 'COLE_AQUI_O_ID_DO_FUNIL_MESVERSARIO'; // ⚠️ VOCÊ PRECISA CRIAR ESSE FUNIL!
const ETAPA_INICIAL = 'Projeto iniciado';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cliente, subscription_id, external_reference } = body;

    // ============================================
    // 🔍 VALIDAÇÃO DOS DADOS
    // ============================================
    if (!cliente) {
      return NextResponse.json(
        { error: 'Dados do cliente são obrigatórios.' },
        { status: 400 }
      );
    }

    const { nome, email, whatsapp, nomeBebe, dataNascimento, tema, observacoes } = cliente;

    if (!nome || !whatsapp) {
      return NextResponse.json(
        { error: 'Nome e WhatsApp são obrigatórios.' },
        { status: 400 }
      );
    }

    console.log('📨 Dados recebidos (Mêsversário):', JSON.stringify(body, null, 2));

    // ============================================
    // 1️⃣ CRIAR EMPRESA_LEAD
    // ============================================
    const { data: empresaLead, error: erroEmpresa } = await supabase
      .from('empresa_leads')
      .insert({
        nome: nomeBebe || nome, // Prioriza nome do bebê
        telefone: whatsapp,
        empresa_id: EMPRESA_ID,
        origem: 'Landing Page - Studio Invitare (Mêsversário)'
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
        nome: nome, // Nome dos pais
        email: email || null,
        telefone: whatsapp,
        contato_principal: true,
        empresa_id: EMPRESA_ID,
        origem: 'Landing Page - Studio Invitare (Mêsversário)'
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
    
    // Formatar data de nascimento
    const dataNascFormatada = dataNascimento 
      ? new Date(dataNascimento).toLocaleDateString('pt-BR')
      : 'Não informado';

    const descricaoProjeto = `
👶 NOME DO BEBÊ: ${nomeBebe || 'Não informado'}
🎂 DATA DE NASCIMENTO: ${dataNascFormatada}
🎨 TEMA PREFERIDO: ${tema || 'Não informado'}

👨‍👩‍👧 RESPONSÁVEL: ${nome}
📧 EMAIL: ${email || 'Não informado'}
📱 WHATSAPP: ${whatsapp}

💬 OBSERVAÇÕES:
${observacoes || 'Nenhuma observação.'}

🔄 ASSINATURA:
- ID da Assinatura: ${subscription_id || 'Não informado'}
- Referência Externa: ${external_reference || 'Não informado'}
- Valor: R$ 47,00/mês (12 meses)
- Total: R$ 564,00

🎨 PRODUTO: Assinatura Mêsversário
📅 ENTREGAS: 12 artes (1 por mês)
    `.trim();

    const { data: projeto, error: erroProjeto } = await supabase
      .from('projetos')
      .insert({
        nome: `Mêsversário - ${nomeBebe || nome}`,
        descricao: descricaoProjeto,
        empresa_id: EMPRESA_ID,
        funil_projeto_id: FUNIL_MESVERSARIO,
        etapa: ETAPA_INICIAL,
        status: 'ativo',
        origem: 'Landing Page - Studio Invitare',
        valor: 564.00 // Valor total da assinatura (12 x R$47)
      })
      .select()
      .single();

    if (erroProjeto) {
      console.error('❌ Erro ao criar projeto:', erroProjeto);
      throw new Error(`Erro ao criar projeto: ${erroProjeto.message}`);
    }

    console.log('✅ Projeto criado:', projeto.id);

    // ============================================
    // ✅ RESPOSTA DE SUCESSO
    // ============================================
    return NextResponse.json({
      success: true,
      message: 'Assinatura Mêsversário criada com sucesso no CRM!',
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
