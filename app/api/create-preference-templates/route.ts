import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

export async function POST(request: NextRequest) {
  try {
    const client = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN!,
    });

    const preference = new Preference(client);

    // ✅ Tenta pegar dados do corpo da requisição se existirem
    const bodyData = await request.json().catch(() => ({}));

    // ✅ REFERÊNCIA EXTERNA
    const externalReference = `TEMPLATE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // ✅ VALIDAÇÃO DA URL DE NOTIFICAÇÃO (Não pode ser localhost)
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
            category_id: 'services',
            quantity: 1,
            unit_price: 47.00,
            currency_id: 'BRL',
          },
        ],
        payer: {
          // Se sua mulher for testar, peça para ela digitar o e-mail dela no checkout
          email: bodyData.email || 'cliente@email.com.br', 
        },
        payment_methods: {
          excluded_payment_methods: [],
          excluded_payment_types: [],
          installments: 12,
        },
        back_urls: {
          success: `${siteUrl}/sucesso/templates`,
          failure: `${siteUrl}/falha`,
          pending: `${siteUrl}/pendente`,
        },
        auto_return: 'approved',
        external_reference: externalReference,
        // ✅ CORREÇÃO: Máximo 13 caracteres para aparecer na fatura
        statement_descriptor: 'STUDIOINVITAR', 
        notification_url: notificationUrl,
        binary_mode: false,
      },
    });

    console.log('✅ Preferência criada com sucesso:', result.id);

    return NextResponse.json({ 
      id: result.id, 
      init_point: result.init_point,
      external_reference: externalReference 
    });

  } catch (error: any) {
    // Log detalhado para você ver no terminal da Vercel/Node o motivo real da falha
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
