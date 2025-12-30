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
    let unitPrice = 47; // Preço da assinatura anual (12 artes)
    const couponCode = bodyData.couponCode?.trim().toUpperCase();
    
    if (couponCode) {
      const validCoupon = AVAILABLE_COUPONS.find(c => 
        c.code === couponCode && 
        c.isActive && 
        (c.allowedProduct === 'MESVERSARIO' || c.allowedProduct === 'ALL')
      );
      
      if (validCoupon) {
        unitPrice = unitPrice * (1 - validCoupon.discountPercentage / 100);
      }
    }
    // -------------------------------

    const externalReference = `MESVERSARIO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
    const notificationUrl = siteUrl.includes('localhost') 
      ? undefined 
      : `${siteUrl}/api/webhook-mercadopago`;

    const result = await preference.create({
      body: {
        items: [
          {
            id: 'assinatura-mesversario',
            title: 'Assinatura Mêsversário - 12 Artes',
            description: 'Assinatura mensal com 1 arte personalizadas por mês para o primeiro ano do bebê',
            quantity: 1,
            unit_price: Number(unitPrice.toFixed(2)),
            currency_id: 'BRL',
          },
        ],
        payer: {
          email: bodyData.email || 'cliente@studioinvitare.com.br',
        },
        payment_methods: {
          excluded_payment_methods: [],
          excluded_payment_types: [],
          installments: 6,
        },
        back_urls: {
          success: `${siteUrl}/sucesso/mesversario`,
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
    console.error('❌ Erro MP:', error.api_response?.body || error.message);
    return NextResponse.json({ error: 'Erro ao processar pagamento' }, { status: 500 });
  }
}
