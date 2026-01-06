// ============================================
// 📁 ARQUIVO: /app/api/webhook-mercadopago/route.ts
// 📝 FUNÇÃO: Receber notificações do Mercado Pago
// 🎯 AÇÃO: Quando pagamento aprovado, chama API de envio para CRM
// 🔗 CHAMADO POR: Mercado Pago (automático)
// ✨ ATUALIZADO: Passa metadata flat corretamente
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment, PreApproval } from 'mercadopago';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('🔔 Webhook recebido:', JSON.stringify(body, null, 2));

    // ============================================
    // 🔍 IDENTIFICAR TIPO DE NOTIFICAÇÃO
    // ============================================
    
    // CASO 1: Notificação de PAGAMENTO (Templates e Personalizado)
    if (body.type === 'payment' && body.data?.id) {
      await processarPagamento(body.data.id);
    }
    
    // CASO 2: Notificação de ASSINATURA (Mêsversário)
    if (body.type === 'subscription_preapproval' && body.data?.id) {
      await processarAssinatura(body.data.id);
    }

    return NextResponse.json({ received: true }, { status: 200 });
    
  } catch (error: any) {
    console.error('❌ Erro no Webhook:', error.message);
    // SEMPRE retorna 200 para o MP não ficar reenviando
    return NextResponse.json({ success: false }, { status: 200 });
  }
}

// ============================================
// 💳 PROCESSAR PAGAMENTO (Templates/Personalizado)
// ============================================
async function processarPagamento(paymentId: string) {
  try {
    const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });
    const payment = new Payment(client);

    // Buscar dados do pagamento
    const pData = await payment.get({ id: paymentId });

    console.log('💳 Status do pagamento:', pData.status);
    console.log('🔗 External Reference:', pData.external_reference);

    // ============================================
    // 🔍 LOGS DE DEBUG DO METADATA
    // ============================================
    console.log('📦 METADATA RETORNADO PELO MP:', JSON.stringify(pData.metadata, null, 2));
    console.log('📦 TIPO DO METADATA:', typeof pData.metadata);
    console.log('📦 KEYS DO METADATA:', Object.keys(pData.metadata || {}));

    // ============================================
    // ✅ SÓ PROCESSA SE APROVADO
    // ============================================
    if (pData.status === 'approved') {
      console.log(`✅ PAGAMENTO APROVADO: ${paymentId}`);
      
      const externalRef = pData.external_reference || '';
      const metadata = pData.metadata || {};

      // ============================================
      // 🎯 IDENTIFICAR TIPO DE PRODUTO
      // ============================================
      
      // TEMPLATES
      if (externalRef.startsWith('TEMPLATE-')) {
        console.log('📦 Produto identificado: TEMPLATES');
        console.log('📤 Enviando metadata FLAT para /api/enviar-templates...');
        
        // 🔥 PASSA O METADATA FLAT DIRETO (sem aninhar em "cliente" e "templates")
        await chamarAPIEnvio('/api/enviar-templates', metadata);
      }
      
      // PERSONALIZADO
      else if (externalRef.startsWith('PERSONALIZADO-')) {
        console.log('📦 Produto identificado: PERSONALIZADO');
        
        // Para personalizado, mantém compatibilidade
        await chamarAPIEnvio('/api/enviar-personalizado', {
          cliente: metadata.cliente || metadata || {}
        });
      }
      
      else {
        console.warn('⚠️ External reference não reconhecida:', externalRef);
      }
    }
    
  } catch (error: any) {
    console.error('❌ Erro ao processar pagamento:', error.message);
  }
}

// ============================================
// 🔄 PROCESSAR ASSINATURA (Mêsversário)
// ============================================
async function processarAssinatura(subscriptionId: string) {
  try {
    const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });
    const preApproval = new PreApproval(client);

    // Buscar dados da assinatura
    const sData = await preApproval.get({ id: subscriptionId });

    console.log('🔄 Status da assinatura:', sData.status);
    console.log('🔗 External Reference:', sData.external_reference);

    // ============================================
    // ✅ SÓ PROCESSA SE AUTORIZADA
    // ============================================
    if (sData.status === 'authorized') {
      console.log(`✅ ASSINATURA APROVADA: ${subscriptionId}`);
      
      const externalRef = sData.external_reference || '';

      // ============================================
      // 🎯 MÊSVERSÁRIO
      // ============================================
      if (externalRef.startsWith('MESVERSARIO-')) {
        console.log('📦 Produto identificado: MÊSVERSÁRIO');
        
        // ⚠️ PreApproval não tem metadata, então precisamos buscar de outra forma
        // OPÇÃO 1: Salvar em banco temporário quando criar a preferência
        // OPÇÃO 2: Extrair do email do payer
        
        await chamarAPIEnvio('/api/enviar-mesversario', {
          cliente: {
            email: sData.payer_email || '',
            // Outros dados precisam vir de outro lugar
          },
          subscription_id: subscriptionId,
          external_reference: externalRef
        });
      }
    }
    
  } catch (error: any) {
    console.error('❌ Erro ao processar assinatura:', error.message);
  }
}

// ============================================
// 📤 CHAMAR API DE ENVIO PARA O CRM
// ============================================
async function chamarAPIEnvio(endpoint: string, dados: any) {
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const url = `${siteUrl}${endpoint}`;
    
    console.log(`📤 Chamando ${endpoint}...`);
    console.log('📦 Dados sendo enviados:', JSON.stringify(dados, null, 2));
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Dados salvos no CRM:', result);
    } else {
      const error = await response.text();
      console.error('❌ Erro ao salvar no CRM:', error);
    }
    
  } catch (error: any) {
    console.error('❌ Erro ao chamar API de envio:', error.message);
  }
}
