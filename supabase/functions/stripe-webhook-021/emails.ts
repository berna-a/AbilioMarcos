// Email templates + sender for the purchase journey (project 021 — Abílio Marcos).
// Tone mirrors the on-site "Obrigado" page: sober, serif headings, PT-PT, warm but restrained.

const BRAND = {
  red: "#9a3f1e", // terracotta accent, drawn from the AM logo
  ink: "#1a1a1a",
  muted: "#6b6b6b",
  hairline: "#e4e1da",
  paper: "#f7f6f3",
};

export interface OrderEmailData {
  artworkTitle: string;
  artworkSlug: string | null;
  imageUrl: string | null;
  technique: string | null;
  widthCm: number | null;
  heightCm: number | null;
  amount: number; // in euros
  currency: string;
  customerEmail: string | null;
  sessionId: string;
  siteUrl: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatMoney(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("pt-PT", {
      style: "currency",
      currency: (currency || "eur").toUpperCase(),
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} €`;
  }
}

function formatDimensions(width: number | null, height: number | null): string | null {
  if (width == null && height == null) return null;
  if (width != null && height != null) return `${width} × ${height} cm`;
  return `${width ?? height} cm`;
}

// Shared wordmark header (text-based — no external logo dependency).
function header(): string {
  return `
    <tr>
      <td style="padding:40px 40px 8px;text-align:center;">
        <span style="font-family:Georgia,'Times New Roman',serif;font-size:24px;letter-spacing:0.5px;color:${BRAND.ink};">Abílio Marcos</span>
      </td>
    </tr>`;
}

function footer(siteUrl: string): string {
  return `
    <tr>
      <td style="padding:24px 40px 40px;border-top:1px solid ${BRAND.hairline};">
        <p style="margin:16px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:${BRAND.muted};text-align:center;">
          Em caso de dúvida, responda a este email ou contacte
          <a href="mailto:marcos4011@gmail.com" style="color:${BRAND.red};text-decoration:none;">marcos4011@gmail.com</a>.<br/>
          <a href="${escapeHtml(siteUrl)}" style="color:${BRAND.muted};text-decoration:none;">abiliomarcos.com</a>
        </p>
      </td>
    </tr>`;
}

function shell(inner: string): string {
  return `<!DOCTYPE html>
<html lang="pt"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:${BRAND.paper};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.paper};padding:24px 0;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid ${BRAND.hairline};border-radius:6px;overflow:hidden;">
        ${inner}
      </table>
    </td></tr>
  </table>
</body></html>`;
}

// ── Customer confirmation ─────────────────────────────────────────────
export function customerConfirmationEmail(data: OrderEmailData): { subject: string; html: string } {
  const title = escapeHtml(data.artworkTitle || "a sua obra");
  const dims = formatDimensions(data.widthCm, data.heightCm);
  const meta = [data.technique ? escapeHtml(data.technique) : null, dims]
    .filter(Boolean)
    .join(" · ");
  const money = formatMoney(data.amount, data.currency);

  const artworkBlock = `
    <tr>
      <td style="padding:8px 40px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.paper};border-radius:6px;">
          ${
            data.imageUrl
              ? `<tr><td style="padding:0;"><img src="${escapeHtml(data.imageUrl)}" alt="${title}" width="100%" style="display:block;width:100%;max-width:480px;border-radius:6px 6px 0 0;"/></td></tr>`
              : ""
          }
          <tr>
            <td style="padding:20px 24px;">
              <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:18px;color:${BRAND.ink};">${title}</p>
              ${meta ? `<p style="margin:6px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${BRAND.muted};">${meta}</p>` : ""}
              <p style="margin:14px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:${BRAND.ink};"><strong>Montante pago:</strong> ${money}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>`;

  const inner = `
    ${header()}
    <tr>
      <td style="padding:8px 40px 0;text-align:center;">
        <h1 style="margin:16px 0 0;font-family:Georgia,'Times New Roman',serif;font-weight:normal;font-size:34px;color:${BRAND.ink};">Obrigado</h1>
        <p style="margin:16px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.7;color:${BRAND.ink};">
          A sua aquisição foi confirmada. Abaixo encontra os detalhes da obra.
        </p>
      </td>
    </tr>
    <tr><td style="height:8px;"></td></tr>
    ${artworkBlock}
    <tr>
      <td style="padding:24px 40px 0;">
        <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.7;color:${BRAND.ink};">
          <strong style="color:${BRAND.red};">Próximos passos</strong><br/>
          Entraremos em contacto consigo nos próximos dias para combinar os detalhes de <strong>envio e entrega</strong> da obra. Cada quadro é embalado individualmente e com cuidado.
        </p>
      </td>
    </tr>
    <tr><td style="height:24px;"></td></tr>
    ${footer(data.siteUrl)}`;

  return {
    subject: `Obrigado pela sua aquisição — ${data.artworkTitle}`,
    html: shell(inner),
  };
}

// ── Owner / ARDO notification ─────────────────────────────────────────
export function ownerNotificationEmail(data: OrderEmailData): { subject: string; html: string } {
  const title = escapeHtml(data.artworkTitle || "—");
  const dims = formatDimensions(data.widthCm, data.heightCm);
  const money = formatMoney(data.amount, data.currency);
  const customer = data.customerEmail ? escapeHtml(data.customerEmail) : "—";
  const artworkUrl = data.artworkSlug
    ? `${data.siteUrl.replace(/\/+$/, "")}/obra/${escapeHtml(data.artworkSlug)}`
    : data.siteUrl;

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:8px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${BRAND.muted};width:140px;vertical-align:top;">${label}</td>
      <td style="padding:8px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:${BRAND.ink};">${value}</td>
    </tr>`;

  const inner = `
    <tr>
      <td style="padding:32px 40px 0;">
        <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;letter-spacing:1px;text-transform:uppercase;color:${BRAND.red};">Nova encomenda</p>
        <h1 style="margin:8px 0 0;font-family:Georgia,'Times New Roman',serif;font-weight:normal;font-size:26px;color:${BRAND.ink};">${title}</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:20px 40px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          ${row("Obra", `${title}${dims ? ` (${dims})` : ""}`)}
          ${row("Montante", `<strong>${money}</strong>`)}
          ${row("Comprador", `<a href="mailto:${customer}" style="color:${BRAND.red};text-decoration:none;">${customer}</a>`)}
          ${row("Página da obra", `<a href="${artworkUrl}" style="color:${BRAND.red};text-decoration:none;">${escapeHtml(artworkUrl)}</a>`)}
          ${row("Stripe session", `<span style="font-family:monospace;font-size:12px;color:${BRAND.muted};">${escapeHtml(data.sessionId)}</span>`)}
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:24px 40px 0;">
        <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.7;color:${BRAND.ink};">
          A obra foi marcada automaticamente como <strong>vendida</strong>. Combine com o comprador o envio e a entrega.
        </p>
      </td>
    </tr>
    <tr><td style="height:24px;"></td></tr>
    ${footer(data.siteUrl)}`;

  return {
    subject: `🟢 Nova encomenda: ${data.artworkTitle} — ${money}`,
    html: shell(inner),
  };
}

// ── Resend sender ─────────────────────────────────────────────────────
export async function sendEmail(opts: {
  apiKey: string;
  from: string;
  to: string[];
  replyTo?: string;
  subject: string;
  html: string;
}): Promise<{ ok: boolean; status: number; body: string }> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${opts.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: opts.from,
      to: opts.to,
      ...(opts.replyTo ? { reply_to: opts.replyTo } : {}),
      subject: opts.subject,
      html: opts.html,
    }),
  });
  const body = await res.text();
  return { ok: res.ok, status: res.status, body };
}
