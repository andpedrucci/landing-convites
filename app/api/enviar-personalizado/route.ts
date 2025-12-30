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
const FUNIL_PERSONALIZADOS = '91b38814-ba8c-4cbc-b2a7-ff777a18923f';
const ETAPA_INICIAL = 'Projeto iniciado';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cliente } = body;

    // ============================================
    // 🔍 VALIDAÇÃO DOS DADOS
    // ============================================
    if (!cliente) {
      return NextResponse.json(
        { error: 'Dados do cliente são obrigatórios.' },
        { status: 400 }
      );
    }

    const { nome, email, whatsapp, tipoEvento, observacoes } = cliente;

    if (!nome || !whatsapp) {
      return NextResponse.json(
        { error: 'Nome e WhatsApp são obrigatórios.' },
        { status: 400 }
      );
    }

    console.log('📨 Dados recebidos (Personalizado):', JSON.stringify(body, null, 2));

    // ============================================
    // 1️⃣ CRIAR EMPRESA_LEAD
    // ============================================
    const { data: empresaLead, error: erroEmpresa } = await supabase
      .from('empresa_leads')
      .insert({
        nome: nome,
        telefone: whatsapp,
        empresa_id: EMPRESA_ID,
        origem: 'Landing Page - Studio Invitare (Personalizado)'
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
        nome: nome,
        email: email || null,
        telefone: whatsapp,
        contato_principal: true,
        empresa_id: EMPRESA_ID,
        origem: 'Landing Page - Studio Invitare (Personalizado)'
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
    
    const descricaoProjeto = `
📋 TIPO DE EVENTO: ${tipoEvento || 'Não informado'}

💬 OBSERVAÇÕES DO CLIENTE:
${observacoes || 'Nenhuma observação.'}

🎨 PRODUTO: Convite Digital Personalizado
💰 VALOR: A ser cotado (R$ 147,00)
    `.trim();

    const { data: projeto, error: erroProjeto } = await supabase
      .from('projetos')
      .insert({
        nome: `Personalizado - ${nome}`,
        descricao: descricaoProjeto,
        empresa_id: EMPRESA_ID,
        funil_projeto_id: FUNIL_PERSONALIZADOS,
        etapa: ETAPA_INICIAL,
        status: 'ativo',
        origem: 'Landing Page - Studio Invitare',
        valor: null // Será definido após cotação
      })
      .select()
      .single();

    if (erroProjeto) {
      console.error('❌ Erro ao criar projeto:', erroProjeto);
      throw new Error(`Erro ao criar projeto: ${erroProjeto.message}`);
    }

    console.log('✅ Projeto criado:', projeto.id);

    // ============================================
    // 4️⃣ CHAMAR API DO MAKE (ENVIAR EMAIL)
    // ============================================
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/enviar-email-make`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          produto: 'Personalizado',
          preco: 147.00,
          cliente: {
            nome,
            email: email || '',
            whatsapp
          },
          detalhes: observacoes || 'Sem observações',
          tipoEvento: tipoEvento || 'Não informado',
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
      message: 'Projeto personalizado criado com sucesso!',
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
