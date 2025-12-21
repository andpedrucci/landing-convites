import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

export async function POST(request: NextRequest) {
  try {
    const client = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN!,
    });

    const preference = new Preference(client);
    const bodyData = await request.json().catch(() => ({}));

    const externalReference = `PERSONALIZADO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
    
    // ✅ Evita erro de localhost e garante que a URL está correta
    const notificationUrl = siteUrl.includes('localhost') 
      ? undefined 
      : `${siteUrl}/api/webhook-mercadopago`;

    const result = await preference.create({
      body: {
        items: [
          {
            id: 'convite-personalizado',
            title: 'Convite Digital Personalizado',
            description: 'Convite digital exclusivo com design único',
            category_id: 'services',
            quantity: 1,
            unit_price: 147.00,
            currency_id: 'BRL',
          },
        ],
        payer: {
          email: bodyData.email || 'cliente@studioinvitare.com.br',
        },
        payment_methods: {
          excluded_payment_methods: [],
          excluded_payment_types: [],
          installments: 12,
        },
        back_urls: {
          success: `${siteUrl}/sucesso/personalizado`,
          failure: `${siteUrl}/falha`,
          pending: `${siteUrl}/pendente`,
        },
        auto_return: 'approved',
        external_reference: externalReference,
        // ✅ CORREÇÃO: Removido espaço e limitado a 13 caracteres
        statement_descriptor: 'STUDIOINVITAR', 
        notification_url: notificationUrl,
        binary_mode: false,
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
