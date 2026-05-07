import { Resend } from 'resend'

const KEY = process.env.RESEND_API_KEY
const FROM = process.env.EMAIL_FROM || 'Shanky <onboarding@resend.dev>'

const resend = KEY ? new Resend(KEY) : null

export async function sendEmail({ to, subject, html, text }) {
  if (!resend) {
    // Dev fallback: log instead of crashing when no API key configured.
    console.log('\n📧 [DEV] Email skipped (no RESEND_API_KEY).')
    console.log('   To     :', to)
    console.log('   Subject:', subject)
    if (text) console.log('   Body   :', text.slice(0, 400))
    return { ok: true, dev: true }
  }
  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text,
    })
    if (error) {
      console.error('Resend error:', error)
      return { ok: false, error: error.message || 'Email send failed' }
    }
    return { ok: true, id: data?.id }
  } catch (e) {
    console.error('Resend threw:', e)
    return { ok: false, error: e.message || 'Email send failed' }
  }
}

export const fmtINR = (n) =>
  '₹ ' + Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })
