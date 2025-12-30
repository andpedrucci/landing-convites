// ============================================
// 📁 ARQUIVO: /app/api/create-preference-personalizado/route.ts
// 📝 FUNÇÃO: Criar preferência de pagamento para PERSONALIZADO
// 💰 PREÇO: R$ 89,00 (até 6x sem juros)
// 🔗 SUCESSO: /sucesso/personalizado
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
    let unitPrice = 89.00;
    const couponCode = bodyData.couponCode?.trim().toUpperCase();

    if (couponCode) {
      const validCoupon = AVAILABLE_COUPONS.find(c => 
        c.code === couponCode && 
        c.isActive && 
        (c.allowedProduct === 'PERSONALIZADO' || c.allowedProduct === 'ALL')
      );
      
      if (validCoupon) {
        unitPrice = unitPrice * (1 - validCoupon.discountPercentage / 100);
      }
    }

    // ============================================
    // 📦 PREPARAR METADATA (DADOS DO CLIENTE)
    // ============================================
    const metadata = bodyData.metadata || {};
    const externalReference = `PERSONALIZADO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
    const notificationUrl = siteUrl.includes('localhost') 
      ? undefined 
      : `${siteUrl}/api/webhook-mercadopago`;

    console.log('📦 Metadata enviado:', JSON.stringify(metadata, null, 2));

    // ============================================
    // 🎯 CRIAR PREFERÊNCIA NO MERCADO PAGO
    // ============================================
    const result = await preference.create({
      body: {
        items: [
          {
            id: 'convite-personalizado',
            title: 'Convite Digital Personalizado',
            description: 'Convite digital exclusivo criado especialmente para você, com design único e personalizado',
            quantity: 1,
            unit_price: Number(unitPrice.toFixed(2)),
            currency_id: 'BRL',
          },
        ],
        payer: {
          email: metadata.cliente?.email || 'cliente@studioinvitare.com.br',
        },
        payment_methods: {
          excluded_payment_methods: [],
          excluded_payment_types: [],
          installments: 6,
        },
        back_urls: {
          success: `${siteUrl}/sucesso/personalizado`,
          failure: `${siteUrl}/falha`,
          pending: `${siteUrl}/pendente`,
        },
        auto_return: 'approved',
        external_reference: externalReference,
        statement_descriptor: 'STUDIOINVITAR', 
        notification_url: notificationUrl,
        binary_mode: true,

        // ============================================
        // 🔑 METADATA - DADOS SALVOS AQUI!
        // ============================================
        metadata: {
          produto: 'PERSONALIZADO',
          cliente: metadata.cliente || {},
          coupon_applied: couponCode || null,
          original_price: 89.00,
          final_price: unitPrice
        }
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
    console.error('❌ Erro MP:', error.api_response?.body || error.message);
    return NextResponse.json({ error: 'Erro ao processar pagamento' }, { status: 500 });
  }
}
