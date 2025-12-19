import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { cliente, templates } = body;

    // Validações básicas
    if (!cliente || !templates || templates.length !== 5) {
      return NextResponse.json(
        { error: 'Dados inválidos' },
        { status: 400 }
      );
    }

    // Preparar dados para enviar
    const dadosParaEnviar = {
      cliente: {
        nome: cliente.nome,
        email: cliente.email,
        whatsapp: cliente.whatsapp,
        tipoEvento: cliente.tipoEvento || 'Não informado',
        observacoes: cliente.observacoes || ''
      },
      templates: templates.map((t: any, index: number) => ({
        ordem: index + 1,
        nome: t.nome,
        tema: t.tema,
        linkCanva: t.linkCanva
      })),
      dataHora: new Date().toISOString()
    };

    // TODO: Aqui você vai configurar o webhook do Make
    // Por enquanto, vamos apenas logar os dados
    console.log('📧 Dados recebidos para envio:', JSON.stringify(dadosParaEnviar, null, 2));

    // Quando você configurar o Make, descomente e configure o webhook:
    /*
    const webhookUrl = process.env.MAKE_WEBHOOK_URL;
    
    if (webhookUrl) {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosParaEnviar),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar para Make');
      }
    }
    */

    return NextResponse.json({
      success: true,
      message: 'Templates enviados com sucesso!',
      data: dadosParaEnviar
    });

  } catch (error) {
    console.error('❌ Erro ao processar envio:', error);
    return NextResponse.json(
      { error: 'Erro ao processar envio' },
      { status: 500 }
    );
  }
}
