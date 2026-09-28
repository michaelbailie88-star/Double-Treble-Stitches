// Netlify trigger function: runs automatically after any Netlify Forms submission.
// Sends the branded customer thank-you email via the Emergent managed email proxy.
// Requires env vars (set in Netlify UI → Site configuration → Environment variables):
//   EMERGENT_EMAIL_KEY  (provided by your developer)
//   EMAIL_FROM_NAME     (e.g. "Double Treble Stitches")
//   EMAIL_REPLY_TO      (e.g. "doubletreblests@gmail.com")
// If EMERGENT_EMAIL_KEY is missing, this quietly does nothing — orders still
// arrive via Netlify form notifications.

const EMAIL_BASE_URL = "https://integrations.emergentagent.com";

const esc = (s) =>
  String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const row = (label, value) =>
  `<tr><td style="padding:7px 12px;font-weight:600;color:#6E6259;width:150px;vertical-align:top;font-size:14px">${esc(label)}</td>` +
  `<td style="padding:7px 12px;color:#2C2520;font-size:14px">${esc(value) || "—"}</td></tr>`;

exports.handler = async (event) => {
  const key = process.env.EMERGENT_EMAIL_KEY;
  if (!key) return { statusCode: 200 };
  try {
    const { payload } = JSON.parse(event.body || "{}");
    if (!payload || payload.form_name !== "order-request") return { statusCode: 200 };
    const d = payload.data || {};
    if (!d.email) return { statusCode: 200 };

    const fromName = process.env.EMAIL_FROM_NAME || "Double Treble Stitches";
    const recap = [
      row("Item", d.item),
      row("Size", d.size),
      row("Yarn colour", d.yarn_color),
      row("Quantity", d.quantity),
      row("Date needed by", d.date_needed),
    ].join("");

    const html =
      '<table role="presentation" width="100%" style="background:#F5F0E8;padding:24px 0">' +
      '<tr><td align="center">' +
      '<table role="presentation" width="560" style="background:#FDFBF7;border:1px solid #E6DFD5;' +
      'border-radius:12px;padding:28px;font-family:Arial,sans-serif">' +
      `<tr><td><p style="margin:0 0 4px;font-size:12px;letter-spacing:2px;color:#8C7A6B">ORDER REQUEST RECEIVED</p>` +
      `<h1 style="margin:0 0 12px;font-size:22px;color:#2C2520">Thank you, ${esc(d.name)}!</h1>` +
      `<p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#4A423A">Your request for a handmade ` +
      `<strong>${esc(d.item)}</strong> has landed in my inbox. I&apos;ll reply personally with your quote ` +
      "and next steps — keep an eye on your email.</p>" +
      '<h2 style="margin:0 0 4px;font-size:13px;color:#A35C45;letter-spacing:1px">YOUR REQUEST</h2>' +
      `<table role="presentation" width="100%">${recap}</table>` +
      '<h2 style="margin:16px 0 4px;font-size:13px;color:#A35C45;letter-spacing:1px">WHAT HAPPENS NEXT</h2>' +
      '<p style="margin:0;font-size:14px;line-height:1.7;color:#4A423A">' +
      "1. I&apos;ll email you a quote based on your size, design and yarn choices.<br/>" +
      "2. A 50% deposit (e-transfer, Square or PayPal) confirms your order and secures your spot in my queue.<br/>" +
      "3. Most pieces take 1–1.5 weeks to handcraft; throw blankets need a little extra time.<br/>" +
      "4. Pickup in the Guelph–Waterloo area, $5 flat local delivery, or shipping across Canada &amp; the US." +
      "</p>" +
      '<p style="margin:20px 0 0;font-size:13px;color:#6E6259">Questions in the meantime? Just reply to this ' +
      'email or write to <a href="mailto:doubletreblests@gmail.com" style="color:#A35C45">doubletreblests@gmail.com</a>.</p>' +
      `<p style="margin:16px 0 0;font-size:11px;color:#B4A794">Handmade with love · ${esc(fromName)}</p>` +
      "</td></tr></table></td></tr></table>";

    const res = await fetch(`${EMAIL_BASE_URL}/api/v1/email/send`, {
      method: "POST",
      headers: { "X-Email-Key": key, "Content-Type": "application/json" },
      body: JSON.stringify({
        to: [d.email],
        subject: `Thanks for your order request — ${fromName}`,
        html,
        from_name: fromName,
        contact_email: process.env.EMAIL_REPLY_TO || undefined,
      }),
    });
    if (!res.ok) console.error("Email proxy error", res.status, await res.text());
    return { statusCode: 200 };
  } catch (e) {
    console.error("submission-created error", e);
    return { statusCode: 200 };
  }
};
