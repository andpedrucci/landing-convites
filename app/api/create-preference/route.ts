import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, price } = body;

    const client = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN!,
    });

    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: [
          {
            id: 'template-pronto',
            title: title,
            quantity: 1,
            unit_price: price,
            currency_id: 'BRL',
          },
        ],
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_SITE_URL}/sucesso`,
          failure: `${process.env.NEXT_PUBLIC_SITE_URL}/falha`,
          pending: `${process.env.NEXT_PUBLIC_SITE_URL}/pendente`,
        },
        auto_return: 'approved',
        notification_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhook`,
        statement_descriptor: 'Momentos Únicos',
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
