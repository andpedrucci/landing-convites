import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const accessToken = process.env.MP_ACCESS_TOKEN;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'MP_ACCESS_TOKEN não configurado' },
        { status: 500 }
      );
    }

    // Buscar informações do usuário
    const response = await fetch('https://api.mercadopago.com/users/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { 
          error: 'Erro ao buscar informações da conta',
          details: errorData 
        },
        { status: response.status }
      );
    }

    const userData = await response.json();

    // Retornar informações relevantes
    return NextResponse.json({
      id: userData.id,
      nickname: userData.nickname,
      email: userData.email,
      first_name: userData.first_name,
      last_name: userData.last_name,
      site_id: userData.site_id,
      country_id: userData.country_id,
      registration_date: userData.registration_date,
      status: userData.status?.site_status,
    });

  } catch (error) {
    console.error('Erro ao buscar informações da conta MP:', error);
    return NextResponse.json(
      { error: 'Erro ao processar requisição' },
      { status: 500 }
    );
  }
}
