import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

export async function POST(request: NextRequest) {
  try {
    const client = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN!,
    });

    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: [
          {
            id: 'templates-digitais',
            title: '5 Templates Digitais Premium',
            quantity: 1,
            unit_price: 47.00,
            currency_id: 'BRL',
          },
        ],
        payment_methods: {
          excluded_payment_types: [],
          installments: 12,
        },
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_SITE_URL}/sucesso/templates`,
          failure: `${process.env.NEXT_PUBLIC_SITE_URL}/falha`,
          pending: `${process.env.NEXT_PUBLIC_SITE_URL}/pendente`,
        },
        auto_return: 'approved',
        statement_descriptor: 'Studio Invitare',
      },
    });

    return NextResponse.json({ 
      id: result.id,
      init_point: result.init_point 
    });

  } catch (error) {
    console.error('Erro ao criar preferência:', error);
    return NextResponse.json(
      { error: 'Erro ao processar pagamento' },
      { status: 500 }
    );
  }
}
