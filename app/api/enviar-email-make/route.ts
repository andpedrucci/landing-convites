import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { produto, preco, cliente, detalhes, tipoEvento, datamind } = body;

    // ============================================
    // 🔍 VALIDAÇÃO DOS DADOS
    // ============================================
    if (!produto || !preco || !cliente) {
      return NextResponse.json(
        { error: 'Dados incompletos para envio de email.' },
        { status: 400 }
      );
    }

    // ============================================
    // 📧 PREPARAR DADOS PARA O MAKE
    // ============================================
    const dadosParaMake = {
      titulo: 'Nova Venda - Studio Invitare',
      produto: produto, // "Templates Digitais" ou "Personalizado"
      preco: preco, // 47.00 ou 147.00
      cliente: {
        nome: cliente.nome,
        email: cliente.email || 'Não informado',
        whatsapp: cliente.whatsapp
      },
      tipoEvento: tipoEvento || 'Não informado',
      detalhes: detalhes, // Templates selecionados OU observações do cliente
      datamind: datamind || {}, // IDs do CRM (empresa_lead_id, contato_id, projeto_id)
      dataHora: new Date().toISOString()
    };

    console.log('📧 Enviando email via Make:', dadosParaMake);

    // ============================================
    // 🚀 ENVIAR PARA O WEBHOOK DO MAKE
    // ============================================
    const webhookUrl = process.env.MAKE_WEBHOOK_URL;

    if (!webhookUrl) {
      console.warn('⚠️ MAKE_WEBHOOK_URL não configurado no .env');
      return NextResponse.json({
        success: true,
        message: 'Email não enviado (webhook não configurado)',
        sent: false
      });
    }

    const responseMake = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dadosParaMake),
    });

    if (!responseMake.ok) {
      console.error('❌ Erro ao enviar para Make:', responseMake.statusText);
      throw new Error('Falha ao enviar email via Make');
    }

    const resultadoMake = await responseMake.json();
    console.log('✅ Email enviado com sucesso via Make');

    // ============================================
    // ✅ RESPOSTA DE SUCESSO
    // ============================================
    return NextResponse.json({
      success: true,
      message: 'Email enviado com sucesso!',
      sent: true,
      data: resultadoMake
    });

  } catch (erro: any) {
    console.error('❌ Erro ao enviar email via Make:', erro);
    
    return NextResponse.json(
      { 
        success: false,
        error: erro.message || 'Erro ao enviar email',
        sent: false
      },
      { status: 500 }
    );
  }
}
