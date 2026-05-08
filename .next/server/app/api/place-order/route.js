"use strict";(()=>{var e={};e.id=8398,e.ids=[8398],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},6113:e=>{e.exports=require("crypto")},57147:e=>{e.exports=require("fs")},41808:e=>{e.exports=require("net")},22037:e=>{e.exports=require("os")},4074:e=>{e.exports=require("perf_hooks")},12781:e=>{e.exports=require("stream")},24404:e=>{e.exports=require("tls")},89750:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>b,patchFetch:()=>v,requestAsyncStorage:()=>x,routeModule:()=>g,serverHooks:()=>h,staticGenerationAsyncStorage:()=>y});var o={};r.r(o),r.d(o,{POST:()=>m,runtime:()=>f});var a=r(49303),n=r(88716),i=r(60670),l=r(87070),s=r(89484),d=r(16594),p=r(69806),c=r(24314),u=r(16328);let f="nodejs";async function m(e){let t;try{t=await e.json()}catch{return l.NextResponse.json({ok:!1,error:"Invalid request body"},{status:400})}let{email:r,items:o,address:a,payment:n,totals:i,couponCode:f}=t||{};if(!r||!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(r))return l.NextResponse.json({ok:!1,error:"A valid email is required."},{status:400});if(!(0,s.X8)(r))return l.NextResponse.json({ok:!1,error:"Please verify your email before placing the order."},{status:401});if(!Array.isArray(o)||0===o.length)return l.NextResponse.json({ok:!1,error:"Your bag is empty."},{status:400});if(!a?.fullName||!a?.address||!a?.city||!a?.pincode)return l.NextResponse.json({ok:!1,error:"Address is incomplete."},{status:400});let m="SHK-"+Math.random().toString(36).slice(2,8).toUpperCase(),g=new Date,x=new Date(g.getTime()+432e6),y=e=>e.toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}),h=`${y(g)} – ${y(x)}`,b=null,v=0;f&&((b=await (0,u.vQ)(f))&&b.active&&Number(i?.subtotal||0)>=b.minSubtotal?v=Math.round(Number(i?.subtotal||0)*(b.percent/100)):b=null);let w={subtotal:Number(i?.subtotal||0),shipping:Number(i?.shipping||0),total:Number(i?.total||0),savings:Number(i?.savings||0),discount:v,coupon:b?b.code:null},N=(0,p.W)({orderId:m,items:o,address:a,payment:n||"Online",totals:w,etaText:h});try{await (0,c.HT)({orderId:m,email:r.toLowerCase(),items:o,address:a,payment:n||"Online",totals:w,etaText:h,status:"placed"})}catch{}let A=await (0,d.y)({to:r,subject:`Your Shanky order ${m} is confirmed ✦`,html:N,text:`Your Shanky order ${m} has been confirmed. Total: ₹${i?.total}. Estimated delivery: ${h}.`});return A.ok?l.NextResponse.json({ok:!0,orderId:m,emailSent:!0,dev:!!A.dev}):l.NextResponse.json({ok:!0,orderId:m,emailSent:!1,warning:A.error||"Email could not be sent."})}let g=new a.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/place-order/route",pathname:"/api/place-order",filename:"route",bundlePath:"app/api/place-order/route"},resolvedPagePath:"/Users/bhavankumarganesan/sst-projetcs/void-store/app/api/place-order/route.js",nextConfigOutput:"",userland:o}),{requestAsyncStorage:x,staticGenerationAsyncStorage:y,serverHooks:h}=g,b="/api/place-order/route";function v(){return(0,i.patchFetch)({serverHooks:h,staticGenerationAsyncStorage:y})}},16328:(e,t,r)=>{r.d(t,{O5:()=>s,VW:()=>c,fL:()=>p,rK:()=>l,vQ:()=>d});var o=r(81445),a=r(57745),n=r(84191),i=r(54645);async function l(){return(0,n.zA)().select().from(i.coupons).orderBy((0,o.C)(i.coupons.code))}async function s(){return(0,n.zA)().select().from(i.coupons).where((0,a.eq)(i.coupons.active,!0)).orderBy((0,o.C)(i.coupons.code))}async function d(e){if(!e)return null;let t=(0,n.zA)(),r=String(e).trim().toUpperCase(),[o]=await t.select().from(i.coupons).where((0,a.eq)(i.coupons.code,r)).limit(1);return o||null}async function p(e){let t={code:String(e.code||"").trim().toUpperCase(),percent:Math.max(0,Math.min(90,Number(e.percent)||0)),description:String(e.description||"").trim(),active:!1!==e.active,minSubtotal:Math.max(0,Number(e.minSubtotal)||0)};if(!t.code)throw Error("Code is required");if(!t.percent)throw Error("Percent must be > 0");let r=(0,n.zA)(),[o]=await r.insert(i.coupons).values(t).onConflictDoUpdate({target:i.coupons.code,set:{percent:t.percent,description:t.description,active:t.active,minSubtotal:t.minSubtotal}}).returning();return o}async function c(e){let t=(0,n.zA)(),r=String(e||"").trim().toUpperCase();if(0===(await t.delete(i.coupons).where((0,a.eq)(i.coupons.code,r)).returning({code:i.coupons.code})).length)throw Error("Coupon not found")}},84191:(e,t,r)=>{r.d(t,{zA:()=>s});var o=r(48937),a=r(42474),n=r(54645);let i=null,l=null;function s(){return i||function(){let e=process.env.DATABASE_URL;if(!e)throw Error("DATABASE_URL is not set. Add it to .env (Supabase → Project Settings → Database → Connection string → Transaction pooler).");if(!/^postgres(ql)?:\/\//.test(e))throw Error("DATABASE_URL must start with postgres:// or postgresql://. Got: "+e.slice(0,40)+"...");l=(0,o.Z)(e,{prepare:!1,max:1,idle_timeout:20,connect_timeout:10}),i=(0,a.t)(l,{schema:n})}(),i}},16594:(e,t,r)=>{r.d(t,{C:()=>s,y:()=>l});var o=r(82591);let a=process.env.RESEND_API_KEY,n=process.env.EMAIL_FROM||"Shanky <onboarding@resend.dev>",i=a?new o.R(a):null;async function l({to:e,subject:t,html:r,text:o}){if(!i)return console.log("\n\uD83D\uDCE7 [DEV] Email skipped (no RESEND_API_KEY)."),console.log("   To     :",e),console.log("   Subject:",t),o&&console.log("   Body   :",o.slice(0,400)),{ok:!0,dev:!0};try{let{data:a,error:l}=await i.emails.send({from:n,to:Array.isArray(e)?e:[e],subject:t,html:r,text:o});if(l)return console.error("Resend error:",l),{ok:!1,error:l.message||"Email send failed"};return{ok:!0,id:a?.id}}catch(e){return console.error("Resend threw:",e),{ok:!1,error:e.message||"Email send failed"}}}let s=e=>"₹ "+Number(e||0).toLocaleString("en-IN",{maximumFractionDigits:0})},69806:(e,t,r)=>{r.d(t,{F:()=>n,W:()=>a});var o=r(16594);function a({orderId:e,items:t,address:r,payment:a,totals:n,etaText:l}){let s=t.map(e=>{let t=e.price*e.qty,r=e.originalPrice&&e.originalPrice>e.price,a=r?e.originalPrice*e.qty:null;return`
      <tr>
        <td style="padding:14px 0;border-bottom:1px solid #ece4d6;width:80px">
          <img src="${e.image}" alt="" width="64" height="80" style="display:block;width:64px;height:80px;object-fit:cover;border-radius:2px" />
        </td>
        <td style="padding:14px 16px;border-bottom:1px solid #ece4d6;vertical-align:top">
          <div style="font-family:Georgia, 'Times New Roman', serif;font-size:18px;color:#0a0a0a;letter-spacing:0.02em">${i(e.name)}</div>
          <div style="font-size:12px;color:#7a7060;margin-top:6px;letter-spacing:0.06em">${i(e.color||"")} \xb7 Size ${i(e.size||"")} \xb7 \xd7${e.qty}</div>
        </td>
        <td style="padding:14px 0;border-bottom:1px solid #ece4d6;text-align:right;vertical-align:top;white-space:nowrap">
          ${r?`<div style="font-size:12px;color:#9c9080;text-decoration:line-through;margin-bottom:2px">${(0,o.C)(a)}</div>`:""}
          <div style="font-size:14px;color:#0a0a0a">${(0,o.C)(t)}</div>
        </td>
      </tr>`}).join("");return`<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Your Shanky order ${i(e)}</title></head>
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
                  <div style="font-size:18px;letter-spacing:0.12em;margin-top:6px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-weight:700">${i(e)}</div>
                </td>
                <td style="padding:18px;background:#f5f0e8;border-left:1px solid #ece4d6">
                  <div style="font-size:10px;letter-spacing:0.32em;text-transform:uppercase;color:#7a7060">Total</div>
                  <div style="font-size:18px;letter-spacing:0.12em;margin-top:6px;color:#c94f2a;font-weight:700">${(0,o.C)(n.total)}</div>
                </td>
              </tr>
              <tr>
                <td style="padding:18px;background:#f5f0e8;border-top:1px solid #ece4d6">
                  <div style="font-size:10px;letter-spacing:0.32em;text-transform:uppercase;color:#7a7060">Estimated Delivery</div>
                  <div style="font-size:14px;margin-top:6px">${i(l)}</div>
                </td>
                <td style="padding:18px;background:#f5f0e8;border-top:1px solid #ece4d6;border-left:1px solid #ece4d6">
                  <div style="font-size:10px;letter-spacing:0.32em;text-transform:uppercase;color:#7a7060">Payment</div>
                  <div style="font-size:14px;margin-top:6px">${i(a)}</div>
                </td>
              </tr>
            </table>

            <h2 style="font-family:Georgia,'Times New Roman',serif;font-size:18px;font-weight:400;letter-spacing:0.04em;color:#0a0a0a;margin:36px 0 12px;border-bottom:1px solid #ece4d6;padding-bottom:8px">Your items</h2>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${s}</table>

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:18px">
              ${n.savings>0?`
              <tr><td style="padding:6px 0;color:#2a2a2a;font-size:14px">MRP Total</td><td style="padding:6px 0;text-align:right;font-size:14px;color:#9c9080;text-decoration:line-through">${(0,o.C)(n.subtotal+n.savings)}</td></tr>
              <tr><td style="padding:6px 0;color:#c94f2a;font-size:14px;font-weight:600">Sale Savings</td><td style="padding:6px 0;text-align:right;font-size:14px;color:#c94f2a;font-weight:600">− ${(0,o.C)(n.savings)}</td></tr>`:""}
              <tr><td style="padding:6px 0;color:#2a2a2a;font-size:14px">Subtotal</td><td style="padding:6px 0;text-align:right;font-size:14px">${(0,o.C)(n.subtotal)}</td></tr>
              <tr><td style="padding:6px 0;color:#2a2a2a;font-size:14px">Shipping</td><td style="padding:6px 0;text-align:right;font-size:14px;color:${0===n.shipping?"#c94f2a":"#0a0a0a"}">${0===n.shipping?"Free":(0,o.C)(n.shipping)}</td></tr>
              <tr><td colspan="2" style="border-top:1px solid #ece4d6;padding-top:6px"></td></tr>
              <tr>
                <td style="padding:8px 0;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;font-size:14px">Total</td>
                <td style="padding:8px 0;text-align:right;font-weight:700;font-size:18px;color:#c94f2a">${(0,o.C)(n.total)}</td>
              </tr>
              ${n.savings>0?`
              <tr><td colspan="2" style="padding:10px 0 0;text-align:right;font-size:12px;color:#c94f2a;font-style:italic">You saved ${(0,o.C)(n.savings)} on this order ✦</td></tr>`:""}
            </table>

            <h2 style="font-family:Georgia,'Times New Roman',serif;font-size:18px;font-weight:400;letter-spacing:0.04em;color:#0a0a0a;margin:36px 0 12px;border-bottom:1px solid #ece4d6;padding-bottom:8px">Shipping to</h2>
            <p style="margin:0;color:#2a2a2a;font-size:14px;line-height:1.85">
              <strong>${i(r.fullName)}</strong><br>
              ${i(r.address)}${r.address2?"<br>"+i(r.address2):""}<br>
              ${i(r.city)}, ${i(r.state)} ${i(r.pincode)}<br>
              ${i(r.phone)}
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
</body></html>`}function n(e){return`<!doctype html>
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
            <div style="font-family:'Courier New',monospace;font-size:36px;letter-spacing:0.5em;color:#c94f2a;font-weight:700">${i(e)}</div>
          </div>
          <p style="margin:24px 0 0;color:#7a7060;font-size:12px;line-height:1.7">Didn't request this? You can safely ignore this email.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`}function i(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}},24314:(e,t,r)=>{r.d(t,{E7:()=>u,HR:()=>d,HT:()=>s,co:()=>c,zk:()=>p});var o=r(57745),a=r(81445),n=r(84191),i=r(54645);function l(e){return e?{orderId:e.orderId,email:e.email,items:e.items||[],address:e.address||{},payment:e.payment||"Online",totals:e.totals||{},etaText:e.etaText||"",status:e.status||"placed",createdAt:Number(e.createdAt)||Date.now(),updatedAt:e.updatedAt?Number(e.updatedAt):null}:null}async function s(e){let t=(0,n.zA)(),r=Date.now(),o={orderId:e.orderId,email:(e.email||"").toLowerCase(),items:e.items||[],address:e.address||{},payment:e.payment||"Online",totals:e.totals||{},etaText:e.etaText||"",status:e.status||"placed",createdAt:e.createdAt||r,updatedAt:null},[a]=await t.insert(i.orders).values(o).returning();return l(a)}async function d(e){if(!e)return[];let t=(0,n.zA)();return(await t.select().from(i.orders).where((0,o.eq)(i.orders.email,e.toLowerCase())).orderBy((0,a.C)(i.orders.createdAt))).map(l)}async function p(){let e=(0,n.zA)();return(await e.select().from(i.orders).orderBy((0,a.C)(i.orders.createdAt))).map(l)}async function c(e){let t=(0,n.zA)(),[r]=await t.select().from(i.orders).where((0,o.eq)(i.orders.orderId,e)).limit(1);return l(r)}async function u(e,t){let r=(0,n.zA)(),[a]=await r.update(i.orders).set({status:t,updatedAt:Date.now()}).where((0,o.eq)(i.orders.orderId,e)).returning();if(!a)throw Error("Order not found");return l(a)}},89484:(e,t,r)=>{r.d(t,{KU:()=>l,Mu:()=>s,X8:()=>p,aB:()=>d});let o=globalThis;o.__shankyOtp||(o.__shankyOtp=new Map),o.__shankyVerified||(o.__shankyVerified=new Map);let a=o.__shankyOtp,n=o.__shankyVerified,i=e=>String(e||"").trim().toLowerCase();function l(e){let t=String(Math.floor(1e5+9e5*Math.random()));return a.set(i(e),{code:t,expires:Date.now()+6e5,attempts:0}),t}function s(e,t){let r=i(e),o=a.get(r);return o?Date.now()>o.expires?(a.delete(r),{ok:!1,reason:"Code expired. Request a new one."}):(o.attempts+=1,o.attempts>6)?(a.delete(r),{ok:!1,reason:"Too many attempts. Request a new code."}):o.code!==String(t).trim()?{ok:!1,reason:"Incorrect code."}:(a.delete(r),{ok:!0}):{ok:!1,reason:"No code requested for this email."}}function d(e){n.set(i(e),Date.now()+18e5)}function p(e){let t=i(e),r=n.get(t);return!!r&&(!(Date.now()>r)||(n.delete(t),!1))}},54645:(e,t,r)=>{r.r(t),r.d(t,{addresses:()=>u,coupons:()=>m,orders:()=>f,products:()=>p,theme:()=>g,users:()=>c});var o=r(19497),a=r(72140),n=r(12941),i=r(28680),l=r(1575),s=r(34566),d=r(98748);let p=(0,o.af)("products",{slug:(0,a.fL)("slug").primaryKey(),name:(0,a.fL)("name").notNull(),price:(0,n._L)("price").notNull(),originalPrice:(0,n._L)("original_price"),category:(0,a.fL)("category").notNull(),gender:(0,a.fL)("gender").notNull().default("Men"),badge:(0,a.fL)("badge"),colors:(0,i.JB)("colors").$type().notNull().default([]),sizes:(0,i.JB)("sizes").$type().notNull().default([]),material:(0,a.fL)("material").notNull().default(""),care:(0,a.fL)("care").notNull().default(""),description:(0,a.fL)("description").notNull().default(""),images:(0,i.JB)("images").$type().notNull().default([]),createdAt:(0,l.AB)("created_at",{withTimezone:!0}).defaultNow().notNull()}),c=(0,o.af)("users",{id:(0,a.fL)("id").primaryKey(),email:(0,a.fL)("email").notNull().unique(),name:(0,a.fL)("name").notNull(),passwordHash:(0,a.fL)("password_hash").notNull(),createdAt:(0,l.AB)("created_at",{withTimezone:!0}).defaultNow().notNull()}),u=(0,o.af)("addresses",{id:(0,a.fL)("id").primaryKey(),userId:(0,a.fL)("user_id").notNull().references(()=>c.id,{onDelete:"cascade"}),fullName:(0,a.fL)("full_name").notNull().default(""),phone:(0,a.fL)("phone").notNull().default(""),address:(0,a.fL)("address").notNull().default(""),address2:(0,a.fL)("address2").notNull().default(""),city:(0,a.fL)("city").notNull().default(""),state:(0,a.fL)("state").notNull().default(""),pincode:(0,a.fL)("pincode").notNull().default(""),label:(0,a.fL)("label").notNull().default("Home"),createdAt:(0,s.Kv)("created_at",{mode:"number"}).notNull()}),f=(0,o.af)("orders",{orderId:(0,a.fL)("order_id").primaryKey(),email:(0,a.fL)("email").notNull(),items:(0,i.JB)("items").$type().notNull(),address:(0,i.JB)("address").$type().notNull(),payment:(0,a.fL)("payment").notNull().default("Online"),totals:(0,i.JB)("totals").$type().notNull(),etaText:(0,a.fL)("eta_text").notNull().default(""),status:(0,a.fL)("status").notNull().default("placed"),createdAt:(0,s.Kv)("created_at",{mode:"number"}).notNull(),updatedAt:(0,s.Kv)("updated_at",{mode:"number"})}),m=(0,o.af)("coupons",{code:(0,a.fL)("code").primaryKey(),percent:(0,n._L)("percent").notNull(),description:(0,a.fL)("description").notNull().default(""),active:(0,d.O7)("active").notNull().default(!0),minSubtotal:(0,n._L)("min_subtotal").notNull().default(0)}),g=(0,o.af)("theme",{id:(0,n._L)("id").primaryKey().default(1),cream:(0,a.fL)("cream").notNull(),cream2:(0,a.fL)("cream2").notNull(),black:(0,a.fL)("black").notNull(),rust:(0,a.fL)("rust").notNull(),rustLight:(0,a.fL)("rust_light").notNull(),sand:(0,a.fL)("sand").notNull(),muted:(0,a.fL)("muted").notNull()})}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),o=t.X(0,[1633,2474,5972,2591],()=>r(89750));module.exports=o})();