import { NextRequest, NextResponse } from 'next/server';

/**
 * ✅ WEBHOOK DO MERCADO PAGO
 * 
 * Este endpoint recebe notificações automáticas do Mercado Pago sobre
 * mudanças de status dos pagamentos (aprovado, pendente, cancelado, etc)
 * 
 * IMPORTANTE: Este endpoint ganha 14 pontos na saúde da integração!
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('📬 Webhook recebido do Mercado Pago:', {
      action: body.action,
      data_id: body.data?.id,
      type: body.type,
      timestamp: new Date().toISOString()
    });

    // Aqui você pode adicionar lógica para processar o webhook
    // Por exemplo: atualizar status do pedido no banco de dados
    
    // Tipos comuns de notificação:
    // - payment: Notificação de pagamento
    // - merchant_order: Notificação de ordem
    
    if (body.type === 'payment') {
      const paymentId = body.data?.id;
      
      console.log('💳 Notificação de pagamento:', paymentId);
      
      // TODO: Buscar detalhes do pagamento e atualizar banco de dados
      // const payment = await mercadopago.payment.get(paymentId);
      // await atualizarStatusPedido(payment);
    }

    // IMPORTANTE: Mercado Pago espera resposta 200 OK
    return NextResponse.json({ 
      success: true,
      received: true,
      timestamp: new Date().toISOString()
    }, { status: 200 });

  } catch (error: any) {
    console.error('❌ Erro ao processar webhook:', error);
    
    // Mesmo com erro, retorne 200 para o Mercado Pago não reenviar
    return NextResponse.json({ 
      success: false,
      error: error.message 
    }, { status: 200 });
  }
}

// Também aceita GET (Mercado Pago pode fazer teste de validação)
export async function GET(request: NextRequest) {
  console.log('🔍 Teste de validação do webhook');
  
  return NextResponse.json({ 
    status: 'Webhook ativo',
    endpoint: '/api/webhook-mercadopago',
    timestamp: new Date().toISOString()
  });
}
