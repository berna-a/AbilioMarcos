# ESTADO — Site Abílio Marcos (fonte de verdade única)

> **Qualquer sessão Claude Code lê este ficheiro ANTES de mexer.** Atualiza-o ao fim de mudanças relevantes.
> Última atualização: 22-06-2026.

## 🔴 Upload de imagens — bug crítico corrigido (22-06, LIVE)
- **O upload do admin NUNCA funcionou** (o Abílio foi o 1.º a usá-lo a sério). 3 causas:
  1. `ArtworkForm` gravava no bucket **`artworks` (inexistente)** → corrigido para **`cliente-021`** (o bucket real onde vivem as obras). ⚠️ **NUNCA voltar a `artworks`.**
  2. O bucket `cliente-021` **não tinha políticas de Storage** (só avatars/logos/documents tinham) → criadas `Staff upload/update/delete cliente-021` em `storage.objects` com `cliente_021.is_staff()`.
  3. Fotos **HEIC** do iPhone → `imageCompression` agora força `fileType:'image/jpeg'` (HEIC→JPEG universal).
- As obras antigas vieram da migração WooCommerce (service_role, sem RLS) — por isso o bug passou despercebido.

## ⚡ Performance hero — LCP 13,6s → 5,3s (22-06, LIVE)
- **Favicon** `public/favicon.png` tinha **1 MB** → reduzido para **192px / 29 KB**.
- **Vídeo hero (5,5 MB mobile) descarregava no LCP** apesar de `preload="none"` (o `autoPlay` ignora-o). Agora o `<video>` só é **montado após `requestIdleCallback`** (HeroSection.tsx) — o poster (96 KB) é o LCP; com `reduced-motion` o vídeo nunca carrega. Gradiente do hero reforçado para o texto ler sobre o poster claro.
- Lighthouse mobile (live): Performance 56→**70**, LCP 13,6→**5,3s**, TBT 220→60ms, CLS 0.

## 🔒 Segurança (22-06, LIVE)
- **Security headers** no `vercel.json` (HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy).
- **CSP em `Content-Security-Policy-Report-Only`** (NÃO bloqueia, só regista). Origens permitidas: Supabase, images.weserv.nl, fonts Google, connect.facebook.net, clarity.ms, flagcdn. **Para enforçar:** abrir o site no browser, aceitar cookies, navegar + checkout, e confirmar 0 violações "Content Security Policy" na consola → trocar o header para `Content-Security-Policy`.
- RPCs `cliente_021.dashboard_*` deixaram de ser executáveis por `anon` (mantêm `authenticated`).

## ♿ Acessibilidade + contraste (22-06, LIVE)
- **Skip-link** "Saltar para o conteúdo" (i18n 5 línguas) + `<main id="content">` (já existia via `motion.main`, faltava o id).
- **InquiryModal:** `role="dialog"` + `aria-modal`, fecha com **Escape**, bloqueio de scroll, foco entra no modal.
- **Contraste:** `--muted-foreground` 45%→**40%** (4.41→~5.3:1, passa WCAG AA em texto pequeno; cobre 39 usos). `text-foreground/50` restante = ícone do toast (não-texto, OK).

## ⚠️ Regras de ouro
1. **Deploy SÓ desta pasta:** `~/Developer/AbilioMarcos-real` (branch `migracao-aos-redesign`) → `vercel deploy --prod`.
   **NUNCA** deployar de `~/Developer/abilio-marcos` (repo ANTIGO/inglês, `.vercel` desativado, marcado `⛔️_NAO_DEPLOYAR`). Foi o que partiu produção em 19-06.
2. **Divisão de sessões:** a sessão de **DESENVOLVIMENTO** é a única que mexe em código/deploys. A sessão de **META ADS** trata só do Ads Manager (campanhas, públicos, orçamentos) — **zero deploys/código**.
3. Produção atual: `abiliomarcos.com` → Vercel (team `ardovc`), versão PT redesenhada.

## 🧱 Stack
React + Vite + TS + Tailwind + shadcn · React Router (SPA) · **Supabase** (projeto AOS `hwpixsuovwxgilyfoszw`, gaveta `cliente_021`) · **Stripe** (conta própria do Abílio) · **Vercel** · imagens otimizadas via weserv.nl.

## 🌍 Checkout multilíngue + bug fix (21-06, LIVE)
- **Descrição do produto no Stripe** estava em inglês fixo (`description: "Original oil on canvas"`). Agora a `create-checkout-021` (v12) constrói a descrição no **idioma de navegação**: lê `lang` do body + traduz a técnica (mapa espelhado de `src/i18n/techniques.ts`) → ex. PT "Pintura original — Óleo sobre tela", EN "Original painting — Oil on canvas". Fallback: PT.
- **Frontend** passa o `locale` do i18n: `checkout.ts` (body `{artwork_id, lang}`) + `ArtworkCommerceCTA.tsx`.
- 🐛 **Bug latente corrigido:** a v10 tinha `automatic_payment_methods` (inválido p/ Checkout Sessions → erro 500). **O checkout podia estar partido.** Removido — o Checkout mostra os métodos do dashboard por defeito. v12 testada (HTTP 200 em EN+PT).
- ⚠️ **Fonte local desalinhada:** `supabase/functions/create-checkout/` é OUTRA função (sem segredos `_021`) — NÃO deployar essa. A fonte real da `create-checkout-021` foi recriada em `supabase/functions/create-checkout-021/`. Deploy via **MCP** (`verify_jwt:false`), NÃO pela CLI (config.toml aponta p/ projeto errado).

## 💳 Backend Stripe + Meta CAPI (LIVE no Supabase do AOS)
- `create-checkout-021` (v7): cria sessão Stripe. `success_url` leva `session_id` + `value`; `metadata` inclui `artwork_reference` e `event_source_url`. (verify_jwt=false, só cartão, limite 2999€.)
- `stripe-webhook-021` (v5): cria encomenda + marca obra "vendida" + **Purchase via Meta CAPI** (server-side), `event_id = purchase_<session.id>`, email com hash SHA-256.
- ⚠️ A `stripe-webhook` (SEM `-021`) é a **faturação do AOS** — **NÃO TOCAR**.

## 🎯 Tracking Meta (frontend, neste repo)
- Pixel com consentimento RGPD (carrega só após cookies marketing).
- Eventos: PageView, ViewContent (obra), Contact (clique WhatsApp via listener global), Lead (formulários), **Purchase deduplicado**.
- **Contrato de dedup:** browser dispara `Purchase` com `eventID = purchase_<session_id>` (CheckoutSuccess lê da URL) = `event_id` do CAPI no servidor → o Meta funde os dois num só.

## ✅ Feito
- Site live (PT, SSL), SEO, legais, otimização de imagens, admin (Bernardo+Eduardo+Abílio), Pixel+domínio verificado, domínio email Stripe verificado, checkout ligado, WhatsApp CTA, Purchase deduplicado.

## 🎯 Consentimento + Analytics (19-06)
- Banner RGPD (`CookieConsent.tsx`): Aceitar/Recusar, expira aos **12 meses**, i18n.
- **Pixel** carrega só com consentimento **marketing**; **Microsoft Clarity** (`src/lib/clarity.ts`, loader dinâmico) só com consentimento **analytics**. (Clarity NÃO usa snippet estático no index.html — seria pré-consentimento, viola RGPD.)
- Clarity lê `VITE_CLARITY_ID` (env). Sem ID → no-op seguro.

## 🔴 Pendente
1. **Stripe — ativação:** falta o documento de identidade do Abílio → `charges_enabled` ainda `false` (não cobra a sério até ativar). Só então se testa o Purchase+dedup (4242 não funciona em modo live).
2. **Migração futura Supabase→Convex:** só quando o AOS entrar nas campanhas (ver memória).

## ✅ Microsoft Clarity (19-06)
Conta criada (projeto "021 Abílio Marcos"). `VITE_CLARITY_ID=x9kv43muxr` no `.env.local` + Vercel (Production). Confirmado LIVE: carrega só com consentimento de analytics. Masking de dados sensíveis ON por defeito.
Página de Métricas (`/admin/analytics`, admin-only) tem um **card com deep-link** ao dashboard do Clarity. ⚠️ Clarity **não permite embed/iframe** (`X-Frame-Options: SAMEORIGIN`) — por isso é link, não iframe. Os heatmaps/gravações vivem só em clarity.microsoft.com.

## ⚡ Performance / conversão (19-06)
- **Hero (`HeroSection.tsx`):** poster como camada de fundo **sempre visível** (LCP rápido) + vídeo faz fade-in por cima. Vídeo `preload="none"` mobile / `"metadata"` desktop, `fetchpriority="low"`. Poster com `<link rel="preload">` no `index.html` (`fetchpriority="high"`). Fontes com `display=swap`.
- **Intro (`IntroAnimation.tsx`):** duração 2000→**800ms** (assinatura SVG 2s→0.8s). **Salta a intro** se vier de anúncio (`utm_source=facebook` / `utm_medium=paid` / referrer facebook/instagram). `sessionStorage` "intro_seen" mantido.

## 🏛️ /sobre CMS + redesign — 21-06 (✅ LIVE)
- **FASE 1 ✅:** tabela `cliente_021.about_exhibitions` (kind individual/collective/collection, year, title, city, country, description, display_order, published) + RLS + **GRANTs** (anon SELECT, authenticated CRUD — sem o grant dava "permission denied"). Migradas **153 entradas** (81+68+4) dos blocos de `about_content`, zero perdas (verificado). Blocos originais ficam de backup; o admin de bio filtra-os (só mostra biografia/pratica).
- **Data layer:** `src/lib/about-exhibitions.ts` (get público/admin, create/update/delete/reorder, groupByYear).
- **Admin:** `/admin/sobre` com separadores **Biografia | Exposições**; gestor (`AboutExhibitionsManager.tsx`) com 3 tabs (Individuais/Colectivas/Colecções), add/editar/apagar/reordenar + toggle Visível, auto-save. Testado live (add 81→82, apagado).
- **FASE 2 ✅ redesign `/sobre`:** lê da tabela estruturada; **hierarquia ano→entradas** (ano serif 25px opacity 1, entradas 16px 70% indentadas), secções separadas (Bio / Individuais / Colectivas / Colecções), AboutHero já tem retrato. Multilingue nos headers (PT/EN/FR/DE/ES). Verificado desktop ✅.
- ⚠️ **Pendente menor:** confirmação visual a **375px exatos** (o tooling não emula mobile; sem overflow horizontal detetado, layout responsive-by-design) — vale um relance no telemóvel.

## 📊 Painel admin redesenhado — 21-06 (LIVE)
`Dashboard.tsx` reescrito: 4 métricas-chave (Visitas 30d, Leads ativas, Obras vendidas, Interesse de compra=cliques Adquirir) + **Obras mais vistas** (top 5 com miniatura+barra) + **gráfico de visitas** (recharts area, 30d) + **Leads recentes**. Dados via 2 RPCs novas `cliente_021.dashboard_top_artworks()` e `dashboard_daily_visits()` (SECURITY DEFINER + guarda `is_staff()`). Substituiu os 6 quadrados de números.

## 📦 Gestão de encomendas + estado exhibition — 21-06 (LIVE)
- **`/admin/orders`** (novo, `src/pages/admin/Orders.tsx`): lista da tabela `cliente_021.orders` (data, obra, comprador, montante, pagamento) + **dropdown de envio** editável. Coluna nova `shipping_status` (default `aguarda_envio` → `enviado` → `entregue`). Filtros: pesquisa + estado de envio. RLS: adicionada política `staff update orders` (já tinha read).
- **Menu "Encomendas"** reaproveitado: aponta agora para `/admin/orders` (antes ia para o placeholder vazio Commissions, que fica órfão).
- **Estado `availability: 'exhibition'`** ('Em exposição'): adicionado ao union (`types.ts`), aos selects (lista + form), labels (admin-pt + statusDisplay público). Bloqueia checkout automaticamente (eligibilidade exige `available`).
- ✅ **DECISÃO TOMADA (21-06): exhibition VISÍVEL no site, sem compra.** `getPublishedArtworks` + `getRecentArtworks` incluem `exhibition` (`.in('availability',['available','exhibition'])`). Obra em exposição aparece na galeria, mostra status "Em exposição" + linha "Exposição: {nome}" no detalhe, **sem botão Adquirir** (checkout bloqueado), WhatsApp/inquiry disponível.
- **Campo `exhibition_name`** (coluna nova): no `ArtworkForm` aparece um input "Nome da exposição" **só quando availability='exhibition'**; mostrado no detalhe público. O toggle rápido da lista muda o estado; o NOME põe-se no formulário.
- ⚠️ **CHECK constraint corrigido:** `artworks_availability_check` só permitia available/sold/not_for_sale → adicionado `exhibition` (senão gravar exhibition dava erro de constraint).
- Briefing "criar form de obras" estava DESATUALIZADO — o `ArtworkForm` já existe e está completo.

## 🛠️ Auditoria + melhorias do admin de obras — 21-06
- **Segurança OK:** RLS ligado; escrita exige `is_staff()` → tabela `cliente_021.user_roles` (4 admins: Bernardo ×2, Eduardo, Abílio). Leitura pública só `published`.
- **"Bug das dimensões" = FALSO ALARME:** a coluna `width_cm`/`height_cm` **não existe em produção** (só `custom_width_cm/height_cm`). O form escreve nas reais; o código lê `width_cm ?? custom_*` mas `width_cm` é sempre `undefined` → usa sempre custom_*. Tudo consistente. **NÃO aplicar** as migrações de dimensões (foot-gun) — foram **apagadas** do repo (`20260427120000` + `…183000`) para ninguém as correr (criariam `width_cm` vazio e partiam as dimensões no site).
- **UX admin (LIVE):** `Artworks.tsx` — **dropdown de disponibilidade** + **★ destaque** editáveis direto na lista (sem abrir a obra); toasts "Atualizado ✓". `ArtworkForm.tsx` — toast "Guardado ✓"/"Obra criada ✓" ao gravar. ⚠️ Fluxos logados ainda por validar ao vivo (precisa de login admin).
- Gaps por fazer (futuro): soft-delete/lixeira, apagar imagens órfãs do Storage, edição manual de traduções, progresso/compressão de upload, técnica livre. Commissions/SiteSettings = placeholders vazios.

## 🧹 Finalização auditoria — bloco 21-06 (LIVE)
- **Meta por página:** novo hook `src/hooks/usePageMeta.ts` (title/description/OG/Twitter/canonical, restaura no unmount). Aplicado a About, Contact, Collections, AllWorks e 5 páginas legais. Títulos PT (não localizados por idioma — PT é o canónico).
- **Canonical das obras corrigido:** `ArtworkDetail` punha `canonical = homepage` (todas as 92 obras como "duplicado da homepage" — risco de deus-indexação). Agora aponta para `/obra/:slug`.
- **Hero warning silenciado:** `HeroSection` já não faz `console.warn("Hero video failed to load")` (falha transitória de autoplay; poster cobre). Lógica de carregamento intacta.
- **/colecoes:** NÃO está ligada em nenhum menu (header/footer/homepage) — só a rota + página com `placeholderCollections` (dados falsos). Nada a esconder; rota/página intactas. (Futuro: popular coleções reais ou remover a página órfã.)
- **Lazy-loading:** já estava feito (App.tsx, 22 `lazy()`), nada a mudar.
- **11 obras sem técnica** (p/ preencher no admin): 346 Tufão, 347 Mancha vermelha, 351 Passagem, 355 Tsunami, 360 Vestígios de terra, 407 A baía, 408 O caos, 481 Navegando nas nuvens, 492 Tons da terra II, 493 Tons da terra III, 507 Elevação vermelha.

## ⚡ Performance — bloco 21-06 (LIVE)
- **Cache vídeo:** `vercel.json` → `headers` p/ `/video/*` = `max-age=31536000, immutable` (era `max-age=0`).
- **srcset responsivo:** `thumbSrcSet()` em `images.ts`; usado na grelha (`ArtworkPreviewImage`) e na imagem de detalhe (`ArtworkDetail`) → mobile baixa larguras menores (600w vs 1400 fixo).
- **CLS da página de obra 0,7 → 0:** era a transição *"A carregar…" → conteúdo*. Substituído por **skeleton** que reserva o layout (img 4/5 capada + metadados) em `ArtworkDetail.tsx:98`. Também `width/height`+aspect-ratio na imagem.
- **Erro JS ~5% corrigido:** `analytics.ts` com `safeUUID()` (fallback p/ `crypto.randomUUID`) + `safeSessionGet/Set` (try/catch) — in-app browsers Meta / modo privado já não rebentam o `track()`.
- **Lighthouse mobile:** Home 42→**64** (LCP 14,5→6,5s, TBT 790→190ms); Obra 37→**59** (CLS 0,7→**0**).
- 🔴 **Pendente (arquitetural):** LCP da obra ~12s em 4G-lab (cascata SPA: JS→fetch Supabase→imagem). Em wifi real ~2-3s. Só baixa com **pré-renderização (SSG)** das páginas de obra — projeto dedicado, NÃO feito.

## 🔎 SEO — redirects + sitemap (21-06)
- **`vercel.json`:** redirects **308** dos URLs WooCommerce antigos (`/produto/*`, `/product/*`, `/loja*`, `/pinturas*`, `/shop*`) → `/obras`. Usa regex `(.*)` (apanha barra final — os URLs indexados do Google têm `/` no fim). Os slugs antigos NÃO batem com os novos (ex.: `espaco-verde` → `espaco-verde-45`), por isso vai p/ catálogo, não deep-link.
- **Sitemap (`scripts/generate-sitemap.mjs`):** estava a apontar p/ projeto Supabase ERRADO (`hbrvappgklorjxojyvqz`/schema public) → devolvia vazio (só 4 URLs). Corrigido: projeto `hwpixsuovwxgilyfoszw` + header `Accept-Profile: cliente_021` + key publishable. Agora **96 URLs (92 obras)**. Falha o build se vier 0 obras (anti-regressão).
- ⚠️ **Auditoria 21-06 — pendente (NÃO corrigido):** performance mobile (Lighthouse LCP ~14s lab; vídeo hero 5,5MB sem cache, imagens sem srcset, bundle 786KB), CLS 0,7 na página de obra, `crypto.randomUUID()` sem fallback (`analytics.ts:131` — provável erro JS em ~5% in-app browsers), `/colecoes` quase vazia, `<title>` genéricos fora das obras.

## ⚡ Code-splitting (19-06)
`App.tsx` usa `React.lazy()` + `Suspense` para todas as rotas EXCETO as críticas (Index, AllWorks, ArtworkDetail). Bundle inicial 1.294→**786 KB**. Admin/legal/checkout em chunks separados (ex.: Analytics ~396 KB só carrega no admin). Guards `typeof window.fbq === 'function'` em todas as chamadas ao Pixel.

## ✅ Meta CAPI completo (19-06)
Segredos `META_PIXEL_ID` + `META_CAPI_ACCESS_TOKEN` gravados no AOS Supabase. Purchase server-side dispara (deduplicado com o browser pelo `event_id`). Ativado DEPOIS do deploy do frontend com dedup — ordem correta.
