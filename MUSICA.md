# 🎵 Como adicionar a música "You Are My Sunshine"

## PASSO A PASSO:

### 1. Baixar o áudio do YouTube

Você precisa baixar o áudio deste link:
https://www.youtube.com/watch?v=4Oc6PTtcthA

**Como baixar:**

**OPÇÃO A - Site online (mais fácil):**
1. Acesse: https://ytmp3.nu/
2. Cole o link do YouTube: https://www.youtube.com/watch?v=4Oc6PTtcthA
3. Clica em "Convert"
4. Baixa o arquivo MP3

**OPÇÃO B - Aplicativo:**
1. Usa 4K Video Downloader ou similar
2. Cola o link
3. Seleciona "Extract Audio" → MP3
4. Baixa

### 2. Renomear o arquivo

Depois de baixar, renomeie o arquivo para:
```
sunshine.mp3
```

### 3. Adicionar ao projeto

1. Coloca o arquivo `sunshine.mp3` na pasta `public/` do projeto
2. No GitHub:
   - Vai no repositório
   - Clica na pasta `public/`
   - Clica em "Add file" → "Upload files"
   - Arrasta o `sunshine.mp3`
   - Commit changes

### 4. Atualizar o código

No arquivo `app/components/InteractivePhotos.tsx`, linha 58:

**TROCA ISSO:**
```typescript
audioRef.current = new Audio('https://cdn.pixabay.com/audio/2022/05/13/audio_2c4d748813.mp3');
```

**POR ISSO:**
```typescript
audioRef.current = new Audio('/sunshine.mp3');
```

### 5. Fazer commit

No GitHub, edita o arquivo e salva. O Vercel vai atualizar sozinho!

---

## ✅ PRONTO!

A música vai tocar quando o usuário interagir com os templates!

---

**IMPORTANTE:** 
- O arquivo precisa estar em formato MP3
- Não pode ser muito pesado (idealmente até 5MB)
- Se o arquivo for muito grande, considere comprimir em: https://www.freeconvert.com/audio-compressor
