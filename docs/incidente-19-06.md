# 📋 Relatório — Incidente & Recuperação (site Abílio + CAPI) · 19-06-2026

**Resumo:** A sessão do CAPI fez bom trabalho técnico, mas deployou da pasta errada e sobrepôs o site em produção. Já está tudo recuperado e reconciliado — nada se perdeu.

## 1. O que a sessão do CAPI fez bem ✅
- **Purchase server-side via Meta CAPI** (`stripe-webhook-021`), deduplicado com o pixel do browser por `event_id = purchase_<session_id>`. Bem desenhado.
- `create-checkout-021` v7: passa `value`/`session_id` + metadata, mantendo as correções existentes (verify_jwt off, cartão, limite 2999€).
- Componente **WhatsApp CTA** + Purchase deduplicado no frontend.

## 2. O que correu mal (causa-raiz) ⚠️
- Existiam **duas pastas locais** ligadas ao **mesmo projeto Vercel**: `AbilioMarcos-real` (correta) e `abilio-marcos` (antiga, versão inglesa).
- A sessão fez `vercel deploy --prod` **da pasta ANTIGA** → produção passou a servir o site antigo inglês. Os anúncios estavam a mandar tráfego para o site errado.
- **Causa sistémica:** sessões Claude Code são isoladas — a sessão não sabia qual a pasta certa, e a armadilha (2 pastas → 1 projeto) não estava sinalizada.

## 3. Recuperação ✅
- Redeploy da pasta correta → produção restaurada (versão PT). Verificado no browser.
- ⚠️ A sessão do CAPI, com informação desatualizada, ia fazer um "rollback" que teria revertido a correção e re-partido o site — foi travado a tempo.

## 4. Reconciliação (nada perdido) ✅
- Backend CAPI (edge functions) já estava live no AOS — mantido.
- Frontend portado adaptado ao repo correto: WhatsApp CTA, Purchase dedup, i18n (5 idiomas).
- Decisão técnica: o WhatsApp CTA não duplica o evento Contact (já há listener global).

## 5. CAPI completo ✅
- Segredos `META_PIXEL_ID` + `META_CAPI_ACCESS_TOKEN` gravados no AOS (token recuperado da transcrição da sessão).
- Ordem correta respeitada: segredos ativados só após o deploy do frontend com dedup (como a própria sessão tinha avisado).

## 6. Salvaguardas implementadas 🔐
- Pasta antiga desligada do Vercel (`.vercel.disabled`) + marcador `⛔️_NAO_DEPLOYAR`.
- **`ESTADO.md`** no repo `AbilioMarcos-real` = fonte de verdade única (regra de deploy, divisão de sessões, contrato CAPI).
- Memórias atualizadas.

## 7. Recomendações para orientar sessões futuras 🎯
1. Qualquer sessão que toque no site lê o `ESTADO.md` primeiro.
2. Deploy só de `~/Developer/AbilioMarcos-real` — nunca de `~/Developer/abilio-marcos`.
3. Sessões de marketing/ads não fazem deploys ao site (só Ads Manager).
4. Para edge functions no AOS (partilhado): sempre sufixo `-021` e buscar o código real via MCP antes de redeployar (nomes genéricos colidem com a faturação do ARDO).

## Estado atual
✅ Site live (PT) · ✅ CAPI completo · ✅ WhatsApp CTA · 🔴 único pendente: **ativação da conta Stripe** (doc de identidade do Abílio).
