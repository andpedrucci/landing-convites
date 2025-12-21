import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // O Mercado Pago envia o ID do pagamento dentro de data.id
    const paymentId = body.data?.id;

    if (body.type === 'payment' && paymentId) {
      const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });
      const payment = new Payment(client);

      // Busca o status real do pagamento
      const pData = await payment.get({ id: paymentId });

      if (pData.status === 'approved') {
        console.log(`✅ SUCESSO: O pagamento ${paymentId} foi aprovado!`);
        console.log(`🔗 Referência: ${pData.external_reference}`);
        
        // AQUI você pode chamar seu outro serviço (Make, enviar e-mail, etc)
        // fetch('SUA_URL_DO_MAKE', { method: 'POST', body: JSON.stringify(pData) });
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error('❌ Erro Webhook:', error.message);
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
