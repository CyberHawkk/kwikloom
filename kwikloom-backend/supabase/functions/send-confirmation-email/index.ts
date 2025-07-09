// Supabase Edge Function: send-confirmation-email/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Only POST allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { email, referralCode, currency } = await req.json();

    if (!email || !currency || !referralCode) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const RESEND_ENDPOINT = "https://api.resend.com/emails";

    const emailBody = `
      <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.6;">
        <h2>✅ BTC Payment Confirmation</h2>
        <p>Hi there,</p>
        <p>Thank you for activating your KwikEarn account with a BTC payment.</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Amount:</strong> ${currency}</p>
        <p><strong>Referral Code:</strong> ${referralCode}</p>
        <br />
        <p>We’ll verify and activate your account shortly.</p>
        <p>— The KwikEarn Team 🚀</p>
      </div>
    `;

    const resendRes = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "KwikEarn <noreply@resend.dev>",
        to: email,
        subject: "✅ KwikEarn Payment Received",
        html: emailBody,
      }),
    });

    const result = await resendRes.json();

    if (!resendRes.ok) {
      return new Response(
        JSON.stringify({ error: "Email sending failed", details: result }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify({ success: true, data: result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Unexpected error", message: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
