// ============================================
// 📁 ARQUIVO: /app/api/create-preference-mesversario/route.ts
// 📝 FUNÇÃO: Criar ASSINATURA RECORRENTE para MÊSVERSÁRIO
// 💰 PREÇO: R$ 47,00/mês (12 meses = R$ 564 total)
// 🔗 SUCESSO: /sucesso/mesversario
// ⚠️ USA: PreApproval (não Preference!)
// ============================================

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

    // ============================================
    // 💰 LÓGICA DE PREÇO E CUPOM
    // ============================================
    let monthlyPrice = 47.00;
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

    // ============================================
    // 📦 PREPARAR METADATA (DADOS DO CLIENTE)
    // ============================================
    const metadata = bodyData.metadata || {};
    const externalReference = `MESVERSARIO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
    
    console.log('📦 Metadata enviado:', JSON.stringify(metadata, null, 2));

    // ============================================
    // 📅 CALCULAR DATAS DA ASSINATURA
    // ============================================
    // Início: próximo mês (dia 1)
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() + 1);
    startDate.setDate(1);

    // Fim: 12 meses depois
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 12);

    // ============================================
    // 🎯 CRIAR ASSINATURA NO MERCADO PAGO
    // ============================================
    const result = await preApproval.create({
      body: {
        reason: 'Assinatura Mêsversário - 1 Arte Personalizada por Mês',
        auto_recurring: {
          frequency: 1,
          frequency_type: 'months',
          transaction_amount: Number(monthlyPrice.toFixed(2)),
          currency_id: 'BRL',
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
        },
        back_url: `${siteUrl}/sucesso/mesversario`,
        payer_email: metadata.cliente?.email || 'cliente@studioinvitare.com.br',
        external_reference: externalReference,
        status: 'pending',
        
        // ⚠️ ATENÇÃO: PreApproval NÃO suporta metadata!
        // Os dados precisam ser salvos no webhook via external_reference
      },
    });

    console.log('✅ Assinatura criada:', result.id);
    console.log('🔗 External Reference:', externalReference);

    return NextResponse.json({ 
      id: result.id, 
      init_point: result.init_point,
      external_reference: externalReference,
      subscription_id: result.id,
      // 🔑 IMPORTANTE: Enviar metadata separadamente para salvar localmente
      metadata: {
        produto: 'MESVERSARIO',
        cliente: metadata.cliente || {},
        coupon_applied: couponCode || null,
        original_price: 47.00,
        final_price: monthlyPrice
      }
    });
  } catch (error: any) {
    console.error('❌ Erro MP Assinatura:', error.api_response?.body || error.message);
    return NextResponse.json({ 
      error: 'Erro ao processar assinatura',
      details: error.api_response?.body || error.message 
    }, { status: 500 });
  }
}
