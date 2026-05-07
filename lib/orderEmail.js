import { fmtINR } from './email'

export function renderOrderEmail({ orderId, items, address, payment, totals, etaText }) {
  const rows = items
    .map((it) => {
      const lineTotal = it.price * it.qty
      const onSale = it.originalPrice && it.originalPrice > it.price
      const lineMrp = onSale ? it.originalPrice * it.qty : null
      return `
      <tr>
        <td style="padding:14px 0;border-bottom:1px solid #ece4d6;width:80px">
          <img src="${it.image}" alt="" width="64" height="80" style="display:block;width:64px;height:80px;object-fit:cover;border-radius:2px" />
        </td>
        <td style="padding:14px 16px;border-bottom:1px solid #ece4d6;vertical-align:top">
          <div style="font-family:Georgia, 'Times New Roman', serif;font-size:18px;color:#0a0a0a;letter-spacing:0.02em">${escape(it.name)}</div>
          <div style="font-size:12px;color:#7a7060;margin-top:6px;letter-spacing:0.06em">${escape(it.color || '')} · Size ${escape(it.size || '')} · ×${it.qty}</div>
        </td>
        <td style="padding:14px 0;border-bottom:1px solid #ece4d6;text-align:right;vertical-align:top;white-space:nowrap">
          ${onSale ? `<div style="font-size:12px;color:#9c9080;text-decoration:line-through;margin-bottom:2px">${fmtINR(lineMrp)}</div>` : ''}
          <div style="font-size:14px;color:#0a0a0a">${fmtINR(lineTotal)}</div>
        </td>
      </tr>`
    })
    .join('')

  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Your Shanky order ${escape(orderId)}</title></head>
<body style="margin:0;padding:0;background:#f5f0e8;font-family:Helvetica,Arial,sans-serif;color:#0a0a0a">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;padding:32px 12px">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #ece4d6">
        <tr>
          <td style="padding:36px 36px 24px;background:#0a0a0a;color:#f5f0e8">
            <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-weight:700;font-size:28px;letter-spacing:0.18em;text-transform:uppercase">
              SHAN<span style="color:#c94f2a">KY</span>
            </div>
            <div style="margin-top:6px;font-size:11px;letter-spacing:0.32em;text-transform:uppercase;color:#c94f2a">Order Confirmed</div>
          </td>
        </tr>
        <tr>
          <td style="padding:36px">
            <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:34px;line-height:1.1;color:#0a0a0a;font-weight:400">
              Thank you. <span style="color:#c94f2a">Truly.</span>
            </h1>
            <p style="margin:16px 0 0;color:#7a7060;font-size:14px;line-height:1.7">
              Your order has been placed and our atelier is folding it by hand right now.
              Below is everything you need.
            </p>

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0 0">
              <tr>
                <td style="padding:18px;background:#f5f0e8">
                  <div style="font-size:10px;letter-spacing:0.32em;text-transform:uppercase;color:#7a7060">Order ID</div>
                  <div style="font-size:18px;letter-spacing:0.12em;margin-top:6px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-weight:700">${escape(orderId)}</div>
                </td>
                <td style="padding:18px;background:#f5f0e8;border-left:1px solid #ece4d6">
                  <div style="font-size:10px;letter-spacing:0.32em;text-transform:uppercase;color:#7a7060">Total</div>
                  <div style="font-size:18px;letter-spacing:0.12em;margin-top:6px;color:#c94f2a;font-weight:700">${fmtINR(totals.total)}</div>
                </td>
              </tr>
              <tr>
                <td style="padding:18px;background:#f5f0e8;border-top:1px solid #ece4d6">
                  <div style="font-size:10px;letter-spacing:0.32em;text-transform:uppercase;color:#7a7060">Estimated Delivery</div>
                  <div style="font-size:14px;margin-top:6px">${escape(etaText)}</div>
                </td>
                <td style="padding:18px;background:#f5f0e8;border-top:1px solid #ece4d6;border-left:1px solid #ece4d6">
                  <div style="font-size:10px;letter-spacing:0.32em;text-transform:uppercase;color:#7a7060">Payment</div>
                  <div style="font-size:14px;margin-top:6px">${escape(payment)}</div>
                </td>
              </tr>
            </table>

            <h2 style="font-family:Georgia,'Times New Roman',serif;font-size:18px;font-weight:400;letter-spacing:0.04em;color:#0a0a0a;margin:36px 0 12px;border-bottom:1px solid #ece4d6;padding-bottom:8px">Your items</h2>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:18px">
              ${totals.savings > 0 ? `
              <tr><td style="padding:6px 0;color:#2a2a2a;font-size:14px">MRP Total</td><td style="padding:6px 0;text-align:right;font-size:14px;color:#9c9080;text-decoration:line-through">${fmtINR(totals.subtotal + totals.savings)}</td></tr>
              <tr><td style="padding:6px 0;color:#c94f2a;font-size:14px;font-weight:600">Sale Savings</td><td style="padding:6px 0;text-align:right;font-size:14px;color:#c94f2a;font-weight:600">− ${fmtINR(totals.savings)}</td></tr>` : ''}
              <tr><td style="padding:6px 0;color:#2a2a2a;font-size:14px">Subtotal</td><td style="padding:6px 0;text-align:right;font-size:14px">${fmtINR(totals.subtotal)}</td></tr>
              <tr><td style="padding:6px 0;color:#2a2a2a;font-size:14px">Shipping</td><td style="padding:6px 0;text-align:right;font-size:14px;color:${totals.shipping === 0 ? '#c94f2a' : '#0a0a0a'}">${totals.shipping === 0 ? 'Free' : fmtINR(totals.shipping)}</td></tr>
              <tr><td colspan="2" style="border-top:1px solid #ece4d6;padding-top:6px"></td></tr>
              <tr>
                <td style="padding:8px 0;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;font-size:14px">Total</td>
                <td style="padding:8px 0;text-align:right;font-weight:700;font-size:18px;color:#c94f2a">${fmtINR(totals.total)}</td>
              </tr>
              ${totals.savings > 0 ? `
              <tr><td colspan="2" style="padding:10px 0 0;text-align:right;font-size:12px;color:#c94f2a;font-style:italic">You saved ${fmtINR(totals.savings)} on this order ✦</td></tr>` : ''}
            </table>

            <h2 style="font-family:Georgia,'Times New Roman',serif;font-size:18px;font-weight:400;letter-spacing:0.04em;color:#0a0a0a;margin:36px 0 12px;border-bottom:1px solid #ece4d6;padding-bottom:8px">Shipping to</h2>
            <p style="margin:0;color:#2a2a2a;font-size:14px;line-height:1.85">
              <strong>${escape(address.fullName)}</strong><br>
              ${escape(address.address)}${address.address2 ? '<br>' + escape(address.address2) : ''}<br>
              ${escape(address.city)}, ${escape(address.state)} ${escape(address.pincode)}<br>
              ${escape(address.phone)}
            </p>

            <div style="margin-top:36px;padding:18px;background:#f5f0e8;border-left:3px solid #c94f2a">
              <div style="font-size:10px;letter-spacing:0.32em;text-transform:uppercase;color:#c94f2a;font-weight:700">Lifetime Mend</div>
              <p style="margin:8px 0 0;font-size:13px;color:#2a2a2a;line-height:1.7">
                Tear a seam, lose a button, blow out a heel — send it back, we mend it. Free, forever.
              </p>
            </div>

            <p style="margin:36px 0 0;color:#7a7060;font-size:13px;line-height:1.7">
              Questions? Reply to this email or write to <a href="mailto:hello@shanky.in" style="color:#c94f2a">hello@shanky.in</a>. A real human reads every message.
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 36px;background:#0a0a0a;color:#7a7060;font-size:11px;letter-spacing:0.1em;text-align:center">
            © ${new Date().getFullYear()} SHANKY · Made with intention in Bengaluru
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body></html>`
}

export function renderOtpEmail(code) {
  return `<!doctype html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f5f0e8;font-family:Helvetica,Arial,sans-serif;color:#0a0a0a">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 12px">
    <tr><td align="center">
      <table role="presentation" width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;background:#ffffff;border:1px solid #ece4d6">
        <tr><td style="padding:32px;background:#0a0a0a;color:#f5f0e8">
          <div style="font-weight:700;font-size:24px;letter-spacing:0.18em;text-transform:uppercase">SHAN<span style="color:#c94f2a">KY</span></div>
          <div style="font-size:11px;letter-spacing:0.32em;text-transform:uppercase;color:#c94f2a;margin-top:6px">Verify your email</div>
        </td></tr>
        <tr><td style="padding:36px">
          <h1 style="margin:0;font-family:Georgia,serif;font-size:28px;font-weight:400;line-height:1.2">Your verification code</h1>
          <p style="margin:14px 0 28px;color:#7a7060;font-size:14px;line-height:1.7">Enter this code on the Shanky checkout page to confirm your email. The code expires in 10 minutes.</p>
          <div style="background:#f5f0e8;padding:24px;text-align:center;border:1px dashed #c94f2a">
            <div style="font-family:'Courier New',monospace;font-size:36px;letter-spacing:0.5em;color:#c94f2a;font-weight:700">${escape(code)}</div>
          </div>
          <p style="margin:24px 0 0;color:#7a7060;font-size:12px;line-height:1.7">Didn't request this? You can safely ignore this email.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`
}

function escape(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
