"use strict";(()=>{var e={};e.id=8398,e.ids=[8398],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},57147:e=>{e.exports=require("fs")},71017:e=>{e.exports=require("path")},89750:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>w,patchFetch:()=>v,requestAsyncStorage:()=>y,routeModule:()=>m,serverHooks:()=>h,staticGenerationAsyncStorage:()=>x});var a={};r.r(a),r.d(a,{POST:()=>g,runtime:()=>u});var i=r(49303),o=r(88716),n=r(60670),s=r(87070),l=r(89484),d=r(16594),p=r(69806),c=r(24314),f=r(16328);let u="nodejs";async function g(e){let t;try{t=await e.json()}catch{return s.NextResponse.json({ok:!1,error:"Invalid request body"},{status:400})}let{email:r,items:a,address:i,payment:o,totals:n,couponCode:u}=t||{};if(!r||!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(r))return s.NextResponse.json({ok:!1,error:"A valid email is required."},{status:400});if(!(0,l.X8)(r))return s.NextResponse.json({ok:!1,error:"Please verify your email before placing the order."},{status:401});if(!Array.isArray(a)||0===a.length)return s.NextResponse.json({ok:!1,error:"Your bag is empty."},{status:400});if(!i?.fullName||!i?.address||!i?.city||!i?.pincode)return s.NextResponse.json({ok:!1,error:"Address is incomplete."},{status:400});let g="SHK-"+Math.random().toString(36).slice(2,8).toUpperCase(),m=new Date,y=new Date(m.getTime()+432e6),x=e=>e.toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}),h=`${x(m)} – ${x(y)}`,w=null,v=0;u&&((w=await (0,f.vQ)(u))&&w.active&&Number(n?.subtotal||0)>=w.minSubtotal?v=Math.round(Number(n?.subtotal||0)*(w.percent/100)):w=null);let b={subtotal:Number(n?.subtotal||0),shipping:Number(n?.shipping||0),total:Number(n?.total||0),savings:Number(n?.savings||0),discount:v,coupon:w?w.code:null},k=(0,p.W)({orderId:g,items:a,address:i,payment:o||"Online",totals:b,etaText:h});try{await (0,c.HT)({orderId:g,email:r.toLowerCase(),items:a,address:i,payment:o||"Online",totals:b,etaText:h,status:"placed"})}catch{}let S=await (0,d.y)({to:r,subject:`Your Shanky order ${g} is confirmed ✦`,html:k,text:`Your Shanky order ${g} has been confirmed. Total: ₹${n?.total}. Estimated delivery: ${h}.`});return S.ok?s.NextResponse.json({ok:!0,orderId:g,emailSent:!0,dev:!!S.dev}):s.NextResponse.json({ok:!0,orderId:g,emailSent:!1,warning:S.error||"Email could not be sent."})}let m=new i.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/place-order/route",pathname:"/api/place-order",filename:"route",bundlePath:"app/api/place-order/route"},resolvedPagePath:"/Users/bhavankumarganesan/sst-projetcs/void-store/app/api/place-order/route.js",nextConfigOutput:"",userland:a}),{requestAsyncStorage:y,staticGenerationAsyncStorage:x,serverHooks:h}=m,w="/api/place-order/route";function v(){return(0,n.patchFetch)({serverHooks:h,staticGenerationAsyncStorage:x})}},16328:(e,t,r)=>{r.d(t,{O5:()=>x,VW:()=>v,fL:()=>w,rK:()=>y,vQ:()=>h});var a=r(57147),i=r(71017),o=r.n(i);let n=o().join(process.cwd(),"data"),s=o().join(n,"coupons.json"),l="1"===process.env.VERCEL||null!=process.env.AWS_EXECUTION_ENV||"1"===process.env.READ_ONLY_FS,d=[{code:"VOID10",percent:10,description:"10% off \xb7 sitewide",active:!0,minSubtotal:0},{code:"FIRST15",percent:15,description:"15% off your first order",active:!0,minSubtotal:0}],p=null;function c(e){return{code:String(e.code||"").trim().toUpperCase(),percent:Math.max(0,Math.min(90,Number(e.percent)||0)),description:String(e.description||"").trim(),active:!1!==e.active,minSubtotal:Math.max(0,Number(e.minSubtotal)||0)}}async function f(){try{let e=await a.promises.readFile(s,"utf-8"),t=JSON.parse(e);return Array.isArray(t?.coupons)?t.coupons.map(c):null}catch{return null}}async function u(){if(l)return!1;try{await a.promises.mkdir(n,{recursive:!0});try{await a.promises.access(s)}catch{await a.promises.writeFile(s,JSON.stringify({coupons:d},null,2),"utf-8")}return!0}catch{return!1}}async function g(){let e=await f();return e||((await u(),e=await f())?e:(p||(p=d.map(c)),p))}async function m(e){if(p=e,l)throw Error("Read-only filesystem — coupon changes only persist locally.");if(!await u())throw Error("Filesystem is read-only — cannot persist coupons.");await a.promises.writeFile(s,JSON.stringify({coupons:e},null,2),"utf-8")}async function y(){return g()}async function x(){return(await g()).filter(e=>e.active)}async function h(e){let t=await g(),r=String(e||"").trim().toUpperCase();return t.find(e=>e.code===r)||null}async function w(e){let t=c(e);if(!t.code)throw Error("Code is required");if(!t.percent)throw Error("Percent must be > 0");let r=await g(),a=r.findIndex(e=>e.code===t.code),i=[...r];return -1===a?i.unshift(t):i[a]=t,await m(i),t}async function v(e){let t=String(e||"").trim().toUpperCase(),r=await g(),a=r.filter(e=>e.code!==t);if(a.length===r.length)throw Error("Coupon not found");await m(a)}},16594:(e,t,r)=>{r.d(t,{C:()=>l,y:()=>s});var a=r(82591);let i=process.env.RESEND_API_KEY,o=process.env.EMAIL_FROM||"Shanky <onboarding@resend.dev>",n=i?new a.R(i):null;async function s({to:e,subject:t,html:r,text:a}){if(!n)return console.log("\n\uD83D\uDCE7 [DEV] Email skipped (no RESEND_API_KEY)."),console.log("   To     :",e),console.log("   Subject:",t),a&&console.log("   Body   :",a.slice(0,400)),{ok:!0,dev:!0};try{let{data:i,error:s}=await n.emails.send({from:o,to:Array.isArray(e)?e:[e],subject:t,html:r,text:a});if(s)return console.error("Resend error:",s),{ok:!1,error:s.message||"Email send failed"};return{ok:!0,id:i?.id}}catch(e){return console.error("Resend threw:",e),{ok:!1,error:e.message||"Email send failed"}}}let l=e=>"₹ "+Number(e||0).toLocaleString("en-IN",{maximumFractionDigits:0})},69806:(e,t,r)=>{r.d(t,{F:()=>o,W:()=>i});var a=r(16594);function i({orderId:e,items:t,address:r,payment:i,totals:o,etaText:s}){let l=t.map(e=>{let t=e.price*e.qty,r=e.originalPrice&&e.originalPrice>e.price,i=r?e.originalPrice*e.qty:null;return`
      <tr>
        <td style="padding:14px 0;border-bottom:1px solid #ece4d6;width:80px">
          <img src="${e.image}" alt="" width="64" height="80" style="display:block;width:64px;height:80px;object-fit:cover;border-radius:2px" />
        </td>
        <td style="padding:14px 16px;border-bottom:1px solid #ece4d6;vertical-align:top">
          <div style="font-family:Georgia, 'Times New Roman', serif;font-size:18px;color:#0a0a0a;letter-spacing:0.02em">${n(e.name)}</div>
          <div style="font-size:12px;color:#7a7060;margin-top:6px;letter-spacing:0.06em">${n(e.color||"")} \xb7 Size ${n(e.size||"")} \xb7 \xd7${e.qty}</div>
        </td>
        <td style="padding:14px 0;border-bottom:1px solid #ece4d6;text-align:right;vertical-align:top;white-space:nowrap">
          ${r?`<div style="font-size:12px;color:#9c9080;text-decoration:line-through;margin-bottom:2px">${(0,a.C)(i)}</div>`:""}
          <div style="font-size:14px;color:#0a0a0a">${(0,a.C)(t)}</div>
        </td>
      </tr>`}).join("");return`<!doctype html>
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
                  <div style="font-size:18px;letter-spacing:0.12em;margin-top:6px;color:#c94f2a;font-weight:700">${(0,a.C)(o.total)}</div>
                </td>
              </tr>
              <tr>
                <td style="padding:18px;background:#f5f0e8;border-top:1px solid #ece4d6">
                  <div style="font-size:10px;letter-spacing:0.32em;text-transform:uppercase;color:#7a7060">Estimated Delivery</div>
                  <div style="font-size:14px;margin-top:6px">${n(s)}</div>
                </td>
                <td style="padding:18px;background:#f5f0e8;border-top:1px solid #ece4d6;border-left:1px solid #ece4d6">
                  <div style="font-size:10px;letter-spacing:0.32em;text-transform:uppercase;color:#7a7060">Payment</div>
                  <div style="font-size:14px;margin-top:6px">${n(i)}</div>
                </td>
              </tr>
            </table>

            <h2 style="font-family:Georgia,'Times New Roman',serif;font-size:18px;font-weight:400;letter-spacing:0.04em;color:#0a0a0a;margin:36px 0 12px;border-bottom:1px solid #ece4d6;padding-bottom:8px">Your items</h2>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${l}</table>

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:18px">
              ${o.savings>0?`
              <tr><td style="padding:6px 0;color:#2a2a2a;font-size:14px">MRP Total</td><td style="padding:6px 0;text-align:right;font-size:14px;color:#9c9080;text-decoration:line-through">${(0,a.C)(o.subtotal+o.savings)}</td></tr>
              <tr><td style="padding:6px 0;color:#c94f2a;font-size:14px;font-weight:600">Sale Savings</td><td style="padding:6px 0;text-align:right;font-size:14px;color:#c94f2a;font-weight:600">− ${(0,a.C)(o.savings)}</td></tr>`:""}
              <tr><td style="padding:6px 0;color:#2a2a2a;font-size:14px">Subtotal</td><td style="padding:6px 0;text-align:right;font-size:14px">${(0,a.C)(o.subtotal)}</td></tr>
              <tr><td style="padding:6px 0;color:#2a2a2a;font-size:14px">Shipping</td><td style="padding:6px 0;text-align:right;font-size:14px;color:${0===o.shipping?"#c94f2a":"#0a0a0a"}">${0===o.shipping?"Free":(0,a.C)(o.shipping)}</td></tr>
              <tr><td colspan="2" style="border-top:1px solid #ece4d6;padding-top:6px"></td></tr>
              <tr>
                <td style="padding:8px 0;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;font-size:14px">Total</td>
                <td style="padding:8px 0;text-align:right;font-weight:700;font-size:18px;color:#c94f2a">${(0,a.C)(o.total)}</td>
              </tr>
              ${o.savings>0?`
              <tr><td colspan="2" style="padding:10px 0 0;text-align:right;font-size:12px;color:#c94f2a;font-style:italic">You saved ${(0,a.C)(o.savings)} on this order ✦</td></tr>`:""}
            </table>

            <h2 style="font-family:Georgia,'Times New Roman',serif;font-size:18px;font-weight:400;letter-spacing:0.04em;color:#0a0a0a;margin:36px 0 12px;border-bottom:1px solid #ece4d6;padding-bottom:8px">Shipping to</h2>
            <p style="margin:0;color:#2a2a2a;font-size:14px;line-height:1.85">
              <strong>${n(r.fullName)}</strong><br>
              ${n(r.address)}${r.address2?"<br>"+n(r.address2):""}<br>
              ${n(r.city)}, ${n(r.state)} ${n(r.pincode)}<br>
              ${n(r.phone)}
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
</body></html>`}function o(e){return`<!doctype html>
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
</body></html>`}function n(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}},24314:(e,t,r)=>{r.d(t,{E7:()=>h,HR:()=>m,HT:()=>g,co:()=>x,zk:()=>y});var a=r(57147),i=r(71017),o=r.n(i);let n=o().join(process.cwd(),"data"),s=o().join(n,"orders.json"),l="1"===process.env.VERCEL||null!=process.env.AWS_EXECUTION_ENV||"1"===process.env.READ_ONLY_FS,d=null;async function p(){try{let e=await a.promises.readFile(s,"utf-8"),t=JSON.parse(e);return Array.isArray(t?.orders)?t.orders:null}catch{return null}}async function c(){if(l)return!1;try{await a.promises.mkdir(n,{recursive:!0});try{await a.promises.access(s)}catch{await a.promises.writeFile(s,JSON.stringify({orders:[]},null,2),"utf-8")}return!0}catch{return!1}}async function f(){let e=await p();return e||((await c(),e=await p())?e:(d||(d=[]),d))}async function u(e){d=e,!l&&await c()&&await a.promises.writeFile(s,JSON.stringify({orders:e},null,2),"utf-8")}async function g(e){let t=await f(),r=[{...e,createdAt:e.createdAt||Date.now()},...t];return await u(r),r[0]}async function m(e){if(!e)return[];let t=await f(),r=e.toLowerCase();return t.filter(e=>(e.email||"").toLowerCase()===r)}async function y(){return f()}async function x(e){return(await f()).find(t=>t.orderId===e)||null}async function h(e,t){let r=await f(),a=r.findIndex(t=>t.orderId===e);if(-1===a)throw Error("Order not found");let i=[...r];return i[a]={...i[a],status:t,updatedAt:Date.now()},await u(i),i[a]}},89484:(e,t,r)=>{r.d(t,{KU:()=>s,Mu:()=>l,X8:()=>p,aB:()=>d});let a=globalThis;a.__shankyOtp||(a.__shankyOtp=new Map),a.__shankyVerified||(a.__shankyVerified=new Map);let i=a.__shankyOtp,o=a.__shankyVerified,n=e=>String(e||"").trim().toLowerCase();function s(e){let t=String(Math.floor(1e5+9e5*Math.random()));return i.set(n(e),{code:t,expires:Date.now()+6e5,attempts:0}),t}function l(e,t){let r=n(e),a=i.get(r);return a?Date.now()>a.expires?(i.delete(r),{ok:!1,reason:"Code expired. Request a new one."}):(a.attempts+=1,a.attempts>6)?(i.delete(r),{ok:!1,reason:"Too many attempts. Request a new code."}):a.code!==String(t).trim()?{ok:!1,reason:"Incorrect code."}:(i.delete(r),{ok:!0}):{ok:!1,reason:"No code requested for this email."}}function d(e){o.set(n(e),Date.now()+18e5)}function p(e){let t=n(e),r=o.get(t);return!!r&&(!(Date.now()>r)||(o.delete(t),!1))}}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),a=t.X(0,[1633,5972,2591],()=>r(89750));module.exports=a})();