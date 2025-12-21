import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

export async function POST(request: NextRequest) {
  try {
    const client = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN!,
    });

    const preference = new Preference(client);

    // ✅ REFERÊNCIA EXTERNA - OBRIGATÓRIO (17 pontos)
    const externalReference = `PERSONALIZADO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const result = await preference.create({
      body: {
        items: [
          {
            id: 'convite-personalizado',
            title: 'Convite Digital Personalizado',
            // ✅ DESCRIÇÃO DO ITEM - RECOMENDADO (3 pontos)
            description: 'Convite digital exclusivo criado especialmente para você, com design único e personalizado',
            // ✅ CATEGORIA DO ITEM - RECOMENDADO (4 pontos)
            category_id: 'services', // Categoria: Serviços
            quantity: 1,
            unit_price: 147.00,
            currency_id: 'BRL',
          },
        ],
        payment_methods: {
          excluded_payment_methods: [],
          excluded_payment_types: [],
          installments: 12,
          default_payment_method_id: null,
          default_installments: null
        },
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_SITE_URL}/sucesso/personalizado`,
          failure: `${process.env.NEXT_PUBLIC_SITE_URL}/falha`,
          pending: `${process.env.NEXT_PUBLIC_SITE_URL}/pendente`,
        },
        auto_return: 'approved',
        // ✅ REFERÊNCIA EXTERNA - OBRIGATÓRIO (17 pontos)
        external_reference: externalReference,
        statement_descriptor: 'STUDIO INVITARE',
        // ✅ NOTIFICAÇÕES WEBHOOK - OBRIGATÓRIO (14 pontos)
        notification_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhook-mercadopago`,
        binary_mode: false,
        expires: false,
      },
    });

    console.log('✅ Preferência COMPLETA criada:', {
      id: result.id,
      external_reference: externalReference,
      init_point: result.init_point,
      notification_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhook-mercadopago`
    });

    return NextResponse.json({ 
      id: result.id,
      init_point: result.init_point,
      external_reference: externalReference
    });

  } catch (error: any) {
    console.error('❌ Erro ao criar preferência:', error);
    console.error('Detalhes:', error.message);
    
    return NextResponse.json(
      { 
        error: 'Erro ao processar pagamento',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
