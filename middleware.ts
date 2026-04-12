import { NextRequest, NextResponse } from 'next/server';

// ============================================================
// MIDDLEWARE — roteamento por subdomínio
//
// studioinvitare.com.br        → app/page.tsx (home institucional)
// convites.studioinvitare.com.br → app/convites/page.tsx
// ensaios.studioinvitare.com.br  → app/ensaios/page.tsx
// ============================================================

export function middleware(request: NextRequest) {
  const host     = request.headers.get('host') || '';
  const pathname = request.nextUrl.pathname;

  // Ignora arquivos estáticos e rotas de API — nunca redireciona esses
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Extrai o subdomínio
  // ex: "convites.studioinvitare.com.br" → "convites"
  // ex: "studioinvitare.com.br" → ""
  // ex: "www.studioinvitare.com.br" → "www"
  const subdomain = host.split('.')[0];

  // Em desenvolvimento local, usa o pathname diretamente
  const isLocalhost = host.includes('localhost');
  if (isLocalhost) return NextResponse.next();

  // Roteamento por subdomínio
  if (subdomain === 'convites') {
    // Reescreve internamente para /convites — sem redirecionar o usuário
    return NextResponse.rewrite(
      new URL(`/convites${pathname === '/' ? '' : pathname}`, request.url)
    );
  }

  if (subdomain === 'ensaios') {
    return NextResponse.rewrite(
      new URL(`/ensaios${pathname === '/' ? '' : pathname}`, request.url)
    );
  }

  // www ou raiz → home institucional (app/page.tsx)
  // Não precisa rewrite, já serve por padrão
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Aplica em todas as rotas exceto arquivos estáticos do Next.js
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
