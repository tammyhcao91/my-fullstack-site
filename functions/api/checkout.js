// Cloudflare Pages Function — POST /api/checkout
//
// Creates a Stripe Checkout Session and returns its hosted-page URL. Runs on
// the server (Cloudflare's edge), so the price is fixed here and can never be
// tampered with from the browser. The Stripe secret key comes from an
// environment binding (STRIPE_SECRET_KEY) — never from the client, never from
// source control.

// --- Fixed, server-side price. Change these two lines to adjust the offer. ---
const CURRENCY = "cad"; // vermazing.ca is a Canadian shop; switch to "usd" if preferred
const AMOUNT = 2500; // in cents → $25.00
const PRODUCT_NAME = "Vermazing Vegan Soap Gift Box";

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export async function onRequestPost(context) {
  const { request, env } = context;
  const secret = env.STRIPE_SECRET_KEY;

  if (!secret) {
    // Misconfiguration, not a client error — makes the missing-key case obvious.
    return json({ error: "Payments are not configured yet." }, 500);
  }

  const origin = new URL(request.url).origin;

  // Stripe's API is form-encoded. URLSearchParams handles the escaping.
  const params = new URLSearchParams();
  params.append("mode", "payment");
  params.append("line_items[0][quantity]", "1");
  params.append("line_items[0][price_data][currency]", CURRENCY);
  params.append("line_items[0][price_data][unit_amount]", String(AMOUNT));
  params.append("line_items[0][price_data][product_data][name]", PRODUCT_NAME);
  params.append("success_url", `${origin}/thanks`);
  params.append("cancel_url", `${origin}/`);

  let stripeRes;
  try {
    stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });
  } catch (err) {
    return json({ error: "Could not reach the payment provider." }, 502);
  }

  const data = await stripeRes.json();

  if (!stripeRes.ok) {
    // Log the real reason server-side; return something safe to the browser.
    console.error("[checkout] Stripe error:", data.error);
    return json({ error: data.error?.message || "Could not start checkout." }, 502);
  }

  return json({ url: data.url });
}
