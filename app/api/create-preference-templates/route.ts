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

    // --- LÓGICA DE PREÇO E CUPOM ---
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
    // -------------------------------

    const externalReference = `TEMPLATE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
    const isLocalhost = siteUrl.includes('localhost');
    const notificationUrl = isLocalhost 
      ? undefined 
      : `${siteUrl}/api/webhook-mercadopago`;

    const result = await preference.create({
      body: {
        items: [
          {
            id: 'templates-digitais',
            title: 'Convite Digital - 2 Templates',
            description: 'Pacote com 2 templates digitais editáveis do mesmo tema para seu evento especial',
            quantity: 1,
            unit_price: Number(unitPrice.toFixed(2)),
            currency_id: 'BRL',
          },
        ],
        payer: {
          email: bodyData.email || 'cliente@email.com.br', 
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
      },
    });

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
