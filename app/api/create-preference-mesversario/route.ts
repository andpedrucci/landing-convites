import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, PreApproval } from 'mercadopago';
import { AVAILABLE_COUPONS } from '@/lib/cupons';

export async function POST(request: NextRequest) {
  try {
    const client = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN!,
    });
    
    const preApproval = new PreApproval(client);
    const bodyData = await request.json().catch(() => ({}));

    // --- LÓGICA DE PREÇO E CUPOM ---
    let monthlyPrice = 47.00; // R$ 564 / 12 
    const couponCode = bodyData.couponCode?.trim().toUpperCase();
    
    if (couponCode) {
      const validCoupon = AVAILABLE_COUPONS.find(c => 
        c.code === couponCode && 
        c.isActive && 
        (c.allowedProduct === 'MESVERSARIO' || c.allowedProduct === 'ALL')
      );
      
      if (validCoupon) {
        monthlyPrice = monthlyPrice * (1 - validCoupon.discountPercentage / 100);
      }
    }
    // -------------------------------

    const externalReference = `MESVERSARIO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
    
    // Calcular data de início (próximo mês)
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() + 1);
    startDate.setDate(1); // Primeiro dia do próximo mês

    // Calcular data de fim (12 meses depois)
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 12);

    const result = await preApproval.create({
      body: {
        reason: 'Assinatura Mêsversário - 12 Artes Personalizadas',
        auto_recurring: {
          frequency: 1,
          frequency_type: 'months',
          transaction_amount: Number(monthlyPrice.toFixed(2)),
          currency_id: 'BRL',
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
        },
        back_url: `${siteUrl}/sucesso/mesversario`,
        payer_email: bodyData.email || 'cliente@studioinvitare.com.br',
        external_reference: externalReference,
        status: 'pending',
      },
    });

    return NextResponse.json({ 
      id: result.id, 
      init_point: result.init_point,
      external_reference: externalReference,
      subscription_id: result.id
    });
  } catch (error: any) {
    console.error('❌ Erro MP Assinatura:', error.api_response?.body || error.message);
    return NextResponse.json({ 
      error: 'Erro ao processar assinatura',
      details: error.api_response?.body || error.message 
    }, { status: 500 });
  }
}
