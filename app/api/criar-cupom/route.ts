import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { codigo, tipo, valor, dataExpiracao, usosMaximos, produto } = body;

    // Validações
    if (!codigo || !valor) {
      return NextResponse.json(
        { error: 'Código e valor são obrigatórios' },
        { status: 400 }
      );
    }

    const accessToken = process.env.MP_ACCESS_TOKEN;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Token do Mercado Pago não configurado' },
        { status: 500 }
      );
    }

    // Preparar dados do cupom
    const cupomData: any = {
      name: codigo.toUpperCase(),
      valid: true,
    };

    // Desconto percentual ou valor fixo
    if (tipo === 'percent') {
      cupomData.percent_off = parseFloat(valor);
    } else {
      cupomData.amount_off = parseFloat(valor);
    }

    // Data de expiração (se fornecida)
    if (dataExpiracao) {
      // Converter para ISO 8601 com timezone
      const dataExpIso = new Date(dataExpiracao + 'T23:59:59-03:00').toISOString();
      cupomData.valid_until = dataExpIso;
    }

    // Número máximo de usos
    if (usosMaximos) {
      cupomData.max_uses = parseInt(usosMaximos);
    }

    console.log('📋 Criando cupom:', cupomData);

    // Chamar API do Mercado Pago
    const response = await fetch('https://api.mercadopago.com/v1/discount_campaigns', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cupomData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Erro do Mercado Pago:', errorData);
      
      // Tratamento de erros específicos
      if (errorData.message?.includes('already exists')) {
        return NextResponse.json(
          { error: 'Esse código de cupom já existe. Escolha outro código.' },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { 
          error: errorData.message || 'Erro ao criar cupom no Mercado Pago',
          detalhes: errorData 
        },
        { status: response.status }
      );
    }

    const cupomCriado = await response.json();
    console.log('✅ Cupom criado com sucesso:', cupomCriado);

    return NextResponse.json({
      success: true,
      message: 'Cupom criado com sucesso!',
      cupom: cupomCriado,
      produto: produto
    });

  } catch (error: any) {
    console.error('❌ Erro ao criar cupom:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao processar requisição' },
      { status: 500 }
    );
  }
}
