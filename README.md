# 🎨 Landing Page - Convites Digitais

Landing page profissional para venda de convites digitais personalizados.

## 📦 O que tem aqui

- ✅ Landing page moderna e responsiva
- ✅ Design delicado com paleta aquarela (bege, rosa, dourado)
- ✅ 2 produtos: Template Pronto (R$ 47) e Personalizado (R$ 147)
- ✅ Integração com WhatsApp para conversão
- ✅ FAQ completo
- ✅ Seção de depoimentos
- ✅ Animações suaves

## 🚀 Como fazer deploy no Vercel (PASSO A PASSO)

### 1. Suba os arquivos pro GitHub

1. Acesse https://github.com/new
2. Crie um repositório chamado `landing-convites`
3. Não marque nenhuma opção (deixe em branco)
4. Clique em "Create repository"
5. Na próxima tela, role até "uploading an existing file"
6. Arraste TODOS os arquivos desta pasta
7. Clique em "Commit changes"

### 2. Deploy no Vercel

1. Acesse https://vercel.com
2. Faça login com sua conta GitHub
3. Clique em "Add New Project"
4. Selecione o repositório `landing-convites`
5. Clique em "Deploy"
6. Aguarde 2-3 minutos
7. PRONTO! Seu site está no ar! 🎉

## ⚙️ Configurações Importantes

### Trocar o número do WhatsApp

Abra o arquivo `app/page.tsx` e na linha 12, troque:

\`\`\`typescript
const whatsappNumber = "5511999999999"; // TROCAR AQUI
\`\`\`

Para o número real (com DDI 55 + DDD + número):
\`\`\`typescript
const whatsappNumber = "5521987654321"; // Exemplo
\`\`\`

### Trocar o nome (se quiser)

Procure por "Momentos Únicos" nos arquivos e substitua pelo nome escolhido.

## 🎨 Adicionar Imagens Reais dos Convites

1. Coloque as imagens na pasta `public/`
2. No arquivo `app/page.tsx`, procure por `/api/placeholder/600/800`
3. Substitua por `/nome-da-sua-imagem.jpg`

Exemplo:
\`\`\`tsx
<img src="/convite-cha-revelacao.jpg" alt="Chá Revelação" />
\`\`\`

## 📱 Testar localmente (opcional)

Se quiser testar antes de fazer deploy:

1. Instale Node.js: https://nodejs.org
2. Abra o terminal nesta pasta
3. Execute:
\`\`\`bash
npm install
npm run dev
\`\`\`
4. Abra http://localhost:3000

## 🆘 Precisa de Ajuda?

Se algo der errado, me chama! Mas basicamente é só:
1. Subir pro GitHub
2. Conectar no Vercel
3. Pronto!

---

Feito com 💕 para celebrar momentos especiais!
