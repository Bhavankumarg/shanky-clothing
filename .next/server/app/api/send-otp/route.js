"use strict";(()=>{var e={};e.id=984,e.ids=[984],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},11864:(e,t,a)=>{a.r(t),a.d(t,{originalPathname:()=>u,patchFetch:()=>y,requestAsyncStorage:()=>x,routeModule:()=>f,serverHooks:()=>h,staticGenerationAsyncStorage:()=>m});var i={};a.r(i),a.d(i,{POST:()=>g,runtime:()=>c});var o=a(49303),r=a(88716),n=a(60670),s=a(87070),d=a(89484),l=a(16594),p=a(69806);let c="nodejs";async function g(e){let t;try{t=await e.json()}catch{return s.NextResponse.json({ok:!1,error:"Invalid request body"},{status:400})}let a=String(t?.email||"").trim();if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(a))return s.NextResponse.json({ok:!1,error:"Please enter a valid email."},{status:400});let i=(0,d.KU)(a),o=await (0,l.y)({to:a,subject:`Your Shanky verification code \xb7 ${i}`,html:(0,p.F)(i),text:`Your Shanky verification code is ${i}. It expires in 10 minutes.`});return o.ok?s.NextResponse.json({ok:!0,dev:!!o.dev,devCode:o.dev?i:void 0}):s.NextResponse.json({ok:!1,error:o.error},{status:502})}let f=new o.AppRouteRouteModule({definition:{kind:r.x.APP_ROUTE,page:"/api/send-otp/route",pathname:"/api/send-otp",filename:"route",bundlePath:"app/api/send-otp/route"},resolvedPagePath:"/Users/bhavankumarganesan/sst-projetcs/void-store/app/api/send-otp/route.js",nextConfigOutput:"",userland:i}),{requestAsyncStorage:x,staticGenerationAsyncStorage:m,serverHooks:h}=f,u="/api/send-otp/route";function y(){return(0,n.patchFetch)({serverHooks:h,staticGenerationAsyncStorage:m})}},16594:(e,t,a)=>{a.d(t,{C:()=>d,y:()=>s});var i=a(82591);let o=process.env.RESEND_API_KEY,r=process.env.EMAIL_FROM||"Shanky <onboarding@resend.dev>",n=o?new i.R(o):null;async function s({to:e,subject:t,html:a,text:i}){if(!n)return console.log("\n\uD83D\uDCE7 [DEV] Email skipped (no RESEND_API_KEY)."),console.log("   To     :",e),console.log("   Subject:",t),i&&console.log("   Body   :",i.slice(0,400)),{ok:!0,dev:!0};try{let{data:o,error:s}=await n.emails.send({from:r,to:Array.isArray(e)?e:[e],subject:t,html:a,text:i});if(s)return console.error("Resend error:",s),{ok:!1,error:s.message||"Email send failed"};return{ok:!0,id:o?.id}}catch(e){return console.error("Resend threw:",e),{ok:!1,error:e.message||"Email send failed"}}}let d=e=>"₹ "+Number(e||0).toLocaleString("en-IN",{maximumFractionDigits:0})},69806:(e,t,a)=>{a.d(t,{F:()=>r,W:()=>o});var i=a(16594);function o({orderId:e,items:t,address:a,payment:o,totals:r,etaText:s}){let d=t.map(e=>`
      <tr>
        <td style="padding:14px 0;border-bottom:1px solid #ece4d6;width:80px">
          <img src="${e.image}" alt="" width="64" height="80" style="display:block;width:64px;height:80px;object-fit:cover;border-radius:2px" />
        </td>
        <td style="padding:14px 16px;border-bottom:1px solid #ece4d6;vertical-align:top">
          <div style="font-family:Georgia, 'Times New Roman', serif;font-size:18px;color:#0a0a0a;letter-spacing:0.02em">${n(e.name)}</div>
          <div style="font-size:12px;color:#7a7060;margin-top:6px;letter-spacing:0.06em">${n(e.color||"")} \xb7 Size ${n(e.size||"")} \xb7 \xd7${e.qty}</div>
        </td>
        <td style="padding:14px 0;border-bottom:1px solid #ece4d6;text-align:right;vertical-align:top;font-size:14px;color:#0a0a0a;white-space:nowrap">
          ${(0,i.C)(e.price*e.qty)}
        </td>
      </tr>`).join("");return`<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Your Shanky order ${n(e)}</title></head>
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
                  <div style="font-size:18px;letter-spacing:0.12em;margin-top:6px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-weight:700">${n(e)}</div>
                </td>
                <td style="padding:18px;background:#f5f0e8;border-left:1px solid #ece4d6">
                  <div style="font-size:10px;letter-spacing:0.32em;text-transform:uppercase;color:#7a7060">Total</div>
                  <div style="font-size:18px;letter-spacing:0.12em;margin-top:6px;color:#c94f2a;font-weight:700">${(0,i.C)(r.total)}</div>
                </td>
              </tr>
              <tr>
                <td style="padding:18px;background:#f5f0e8;border-top:1px solid #ece4d6">
                  <div style="font-size:10px;letter-spacing:0.32em;text-transform:uppercase;color:#7a7060">Estimated Delivery</div>
                  <div style="font-size:14px;margin-top:6px">${n(s)}</div>
                </td>
                <td style="padding:18px;background:#f5f0e8;border-top:1px solid #ece4d6;border-left:1px solid #ece4d6">
                  <div style="font-size:10px;letter-spacing:0.32em;text-transform:uppercase;color:#7a7060">Payment</div>
                  <div style="font-size:14px;margin-top:6px">${n(o)}</div>
                </td>
              </tr>
            </table>

            <h2 style="font-family:Georgia,'Times New Roman',serif;font-size:18px;font-weight:400;letter-spacing:0.04em;color:#0a0a0a;margin:36px 0 12px;border-bottom:1px solid #ece4d6;padding-bottom:8px">Your items</h2>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${d}</table>

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:18px">
              <tr><td style="padding:6px 0;color:#2a2a2a;font-size:14px">Subtotal</td><td style="padding:6px 0;text-align:right;font-size:14px">${(0,i.C)(r.subtotal)}</td></tr>
              <tr><td style="padding:6px 0;color:#2a2a2a;font-size:14px">Shipping</td><td style="padding:6px 0;text-align:right;font-size:14px;color:${0===r.shipping?"#c94f2a":"#0a0a0a"}">${0===r.shipping?"Free":(0,i.C)(r.shipping)}</td></tr>
              <tr><td colspan="2" style="border-top:1px solid #ece4d6;padding-top:6px"></td></tr>
              <tr>
                <td style="padding:8px 0;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;font-size:14px">Total</td>
                <td style="padding:8px 0;text-align:right;font-weight:700;font-size:18px;color:#c94f2a">${(0,i.C)(r.total)}</td>
              </tr>
            </table>

            <h2 style="font-family:Georgia,'Times New Roman',serif;font-size:18px;font-weight:400;letter-spacing:0.04em;color:#0a0a0a;margin:36px 0 12px;border-bottom:1px solid #ece4d6;padding-bottom:8px">Shipping to</h2>
            <p style="margin:0;color:#2a2a2a;font-size:14px;line-height:1.85">
              <strong>${n(a.fullName)}</strong><br>
              ${n(a.address)}${a.address2?"<br>"+n(a.address2):""}<br>
              ${n(a.city)}, ${n(a.state)} ${n(a.pincode)}<br>
              ${n(a.phone)}
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
            \xa9 ${new Date().getFullYear()} SHANKY \xb7 Made with intention in Bengaluru
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body></html>`}function r(e){return`<!doctype html>
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
            <div style="font-family:'Courier New',monospace;font-size:36px;letter-spacing:0.5em;color:#c94f2a;font-weight:700">${n(e)}</div>
          </div>
          <p style="margin:24px 0 0;color:#7a7060;font-size:12px;line-height:1.7">Didn't request this? You can safely ignore this email.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`}function n(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}},89484:(e,t,a)=>{a.d(t,{KU:()=>s,Mu:()=>d,X8:()=>p,aB:()=>l});let i=globalThis;i.__shankyOtp||(i.__shankyOtp=new Map),i.__shankyVerified||(i.__shankyVerified=new Map);let o=i.__shankyOtp,r=i.__shankyVerified,n=e=>String(e||"").trim().toLowerCase();function s(e){let t=String(Math.floor(1e5+9e5*Math.random()));return o.set(n(e),{code:t,expires:Date.now()+6e5,attempts:0}),t}function d(e,t){let a=n(e),i=o.get(a);return i?Date.now()>i.expires?(o.delete(a),{ok:!1,reason:"Code expired. Request a new one."}):(i.attempts+=1,i.attempts>6)?(o.delete(a),{ok:!1,reason:"Too many attempts. Request a new code."}):i.code!==String(t).trim()?{ok:!1,reason:"Incorrect code."}:(o.delete(a),{ok:!0}):{ok:!1,reason:"No code requested for this email."}}function l(e){r.set(n(e),Date.now()+18e5)}function p(e){let t=n(e),a=r.get(t);return!!a&&(!(Date.now()>a)||(r.delete(t),!1))}}};var t=require("../../../webpack-runtime.js");t.C(e);var a=e=>t(t.s=e),i=t.X(0,[948,972,591],()=>a(11864));module.exports=i})();