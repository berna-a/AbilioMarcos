## Objectivo

Garantir que TODO o conteúdo público é apresentado na língua activa (PT/EN/FR/DE/ES), incluindo dados editáveis pelo cliente (títulos de obras, descrições, secções "Sobre"). Tradução feita automaticamente via Lovable AI Gateway quando o cliente grava no admin — sem precisar de preencher 5 idiomas à mão.

---

## 1. Tradução automática de conteúdo do CRM

### Schema (migrações)

Adicionar colunas `jsonb` para guardar traduções, formato `{ en, fr, de, es }`. PT é sempre o original.

- `artworks.title_translations jsonb`
- `artworks.description_translations jsonb`
- `about_content.title_translations jsonb`
- `about_content.content_translations jsonb`

### Edge Function `translate-content`

Nova função em `supabase/functions/translate-content/`. Recebe `{ text, sourceLang: 'pt', targetLangs: ['en','fr','de','es'], context?: 'artwork_title'|'artwork_description'|'about_section' }`. Chama o Lovable AI Gateway (modelo `google/gemini-2.5-flash`) com prompt que preserva nomes próprios, datas, anos e formatação. Devolve `{ en, fr, de, es }`.

### Hooks no admin

- `ArtworkForm.tsx`: ao gravar, se `title` ou `description` mudou, chamar a função e popular as colunas `*_translations`. Mostrar pequeno indicador "A traduzir…" e botão "Regenerar traduções" para forçar.
- `AboutContent.tsx` (admin): mesmo padrão para `title` + `content`.

### UI pública

- Helper `tField(row, field, locale)` que devolve `row[field+'_translations']?.[locale] ?? row[field]` (fallback PT).
- Aplicar em `ArtworkDetail`, `AllWorks`, `FeaturedWorks`, `Index`, `About` e qualquer outro sítio que mostre `artwork.title`, `artwork.description`, `about_content.title`, `about_content.content`.

---

## 2. Auditoria i18n completa

Percorrer todas as páginas/componentes públicos e identificar strings hardcoded ainda em PT (ou inglês). Áreas conhecidas a verificar:

- `CV.tsx` — exposições e educação têm placeholders em inglês ("Solo Exhibition — Gallery Name")
- `Contact.tsx` — endereço do atelier hardcoded em PT (provavelmente OK, mas confirmar labels)
- `WhatsAppFloat.tsx`, `CookieConsent.tsx`, `InquiryModal.tsx`, `CollectorSignup.tsx`
- `ArtworkCommerceCTA.tsx`, `ArtworkTrustInfo.tsx` (mensagem de certificado)
- Footer: descrição, copyright, NIF (NIF mantém-se igual)
- Mensagens de erro/sucesso em formulários
- Páginas legais (`legal/*.tsx`) — hoje em PT; decidir se mantêm-se só em PT (geralmente prática aceitável) ou traduzem

Corrigir adicionando chaves novas em `src/i18n/types.ts` e nos 5 ficheiros (`pt.ts`, `en.ts`, `fr.ts`, `de.ts`, `es.ts`).

---

## 3. Backfill das obras existentes

Script único (admin → botão "Traduzir todas as obras existentes" ou one-shot via SQL+function) que percorre `artworks` e `about_content` sem traduções e popula. Permite ter o site multilingue sem o cliente abrir cada obra.

---

## Detalhes técnicos

- Modelo AI: `google/gemini-2.5-flash` (rápido, barato, óptimo para tradução curta).
- Prompt: instrução para tradutor profissional de arte, manter títulos poéticos/abstractos como tal, não traduzir nomes próprios.
- Em caso de falha do gateway, mantém-se o original em PT (fallback nunca quebra a UI).
- Páginas legais: proponho mantê-las só em PT (jurisdição PT) com nota de "Documentos legais em português" — confirma se concordas.

---

## Ordem de execução

1. Migração SQL (4 colunas jsonb)
2. Edge function `translate-content` + deploy
3. Helper `tField` + atualizar todas as views públicas
4. Hooks de tradução automática nos formulários admin (artworks + about)
5. Botão "Backfill traduções" no admin
6. Auditoria + correcção de strings hardcoded restantes
7. QA manual em PT/EN/FR/DE/ES nas páginas principais

---

## Pergunta antes de começar

Confirmas que posso usar o **Lovable AI Gateway** (Gemini Flash) para a tradução automática? Tem custo por chamada mas é o mais simples — alternativa seria DeepL/Google Translate API com chave própria.
