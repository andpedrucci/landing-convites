// ============================================
// 📁 ARQUIVO: /app/api/create-preference-templates/route.ts
// 📝 FUNÇÃO: Criar preferência de pagamento para TEMPLATES
// 💰 PREÇO: R$ 20,00 (até 3x sem juros)
// 🔗 SUCESSO: /sucesso/templates
// ✨ ATUALIZADO: Metadata simplificado + novos campos
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { AVAILABLE_COUPONS } from '@/lib/cupons';

export async function POST(request: NextRequest) {
  try {
    const client = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN!,
    });

    const preference = new Preference(client);
    const bodyData = await request.json().catch(() => ({}));

    // ============================================
    // 💰 LÓGICA DE PREÇO E CUPOM
    // ============================================
    let unitPrice = 20.00;
    const couponCode = bodyData.couponCode?.trim().toUpperCase();

    if (couponCode) {
      const validCoupon = AVAILABLE_COUPONS.find(c => 
        c.code === couponCode && 
        c.isActive && 
        (c.allowedProduct === 'TEMPLATE' || c.allowedProduct === 'ALL')
      );
      
      if (validCoupon) {
        unitPrice = unitPrice * (1 - validCoupon.discountPercentage / 100);
      }
    }

    // ============================================
    // 📦 PREPARAR METADATA SIMPLIFICADO
    // ============================================
    const metadata = bodyData.metadata || {};
    const cliente = metadata.cliente || {};
    
    // Templates agora vem como array de strings (só os links)
    const templatesLinks = metadata.templates || [];

    const externalReference = `TEMPLATE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
    const isLocalhost = siteUrl.includes('localhost');
    const notificationUrl = isLocalhost 
      ? undefined 
      : `${siteUrl}/api/webhook-mercadopago`;

    // ============================================
    // 📊 LOGS DETALHADOS PARA DEBUG
    // ============================================
    console.log('📦 Metadata recebido do frontend:', JSON.stringify(metadata, null, 2));
    console.log('👤 Dados do cliente:', JSON.stringify(cliente, null, 2));
    console.log('🔗 Templates (só links):', templatesLinks);

    // ============================================
    // 🔥 METADATA ENXUTO PARA O MERCADO PAGO
    // ============================================
    const metadataEnxuto = {
      produto: 'TEMPLATE',
      // Dados do cliente simplificados
      nomeMae: cliente.nomeMae || '',
      nomeCrianca: cliente.nomeCrianca || '',
      idadeCrianca: cliente.idadeConvite || '',
      dataEvento: cliente.dataEvento || '',
      horarioEvento: cliente.horarioEvento || '',
      endereco: cliente.endereco || '',
      whatsapp: cliente.whatsapp || '',
      // Templates como array simples de strings
      template1: templatesLinks[0] || '',
      template2: templatesLinks[1] || '',
      // Info adicional
      coupon_applied: couponCode || null,
      original_price: 20.00,
      final_price: Number(unitPrice.toFixed(2))
    };

    console.log('🚀 Metadata ENXUTO enviado ao MP:', JSON.stringify(metadataEnxuto, null, 2));
    console.log('📏 Tamanho do metadata (bytes):', JSON.stringify(metadataEnxuto).length);

    // ============================================
    // 🎯 CRIAR PREFERÊNCIA NO MERCADO PAGO
    // ============================================
    const result = await preference.create({
      body: {
        items: [
          {
            id: 'templates-digitais',
            title: 'Convite Digital',
            description: 'Modelo de convite pronto (será enviado 2 modelos para escolha do seu preferido)',
            quantity: 1,
            unit_price: Number(unitPrice.toFixed(2)),
            currency_id: 'BRL',
          },
        ],
        payer: {
          email: cliente.email || 'cliente@email.com.br', 
        },
        payment_methods: {
          excluded_payment_methods: [],
          excluded_payment_types: [],
          installments: 3,
        },
        back_urls: {
          success: `${siteUrl}/sucesso/templates`,
          failure: `${siteUrl}/falha`,
          pending: `${siteUrl}/pendente`,
        },
        auto_return: 'approved',
        external_reference: externalReference,
        statement_descriptor: 'STUDIOINVITAR',
        notification_url: notificationUrl,
        binary_mode: true,
        
        // ============================================
        // 🔑 METADATA ENXUTO - SEM OBJETOS COMPLEXOS!
        // ============================================
        metadata: metadataEnxuto
      },
    });

    console.log('✅ Preferência criada:', result.id);
    console.log('🔗 External Reference:', externalReference);

    return NextResponse.json({ 
      id: result.id, 
      init_point: result.init_point,
      external_reference: externalReference 
    });

  } catch (error: any) {
    console.error('❌ Erro Mercado Pago:', error.api_response?.body || error.message);
    return NextResponse.json(
      { 
        error: 'Erro ao processar pagamento', 
        details: error.api_response?.body?.message || error.message 
      },
      { status: 500 }
    );
  }
}
