import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { stripe, PLANS, PlanId } from "@/lib/stripe";
import { getStripeCustomerId } from "@/lib/usage";
import { sql } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan } = await req.json();
    if (!plan || !["pro", "api"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const planConfig = PLANS[plan as PlanId];
    if (!planConfig.priceId) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // Get or create Stripe customer
    let customerId = await getStripeCustomerId(userId);

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user?.email || undefined,
        metadata: { user_id: userId },
      });
      customerId = customer.id;

      // Create subscription record with free plan
      await sql`
        INSERT INTO subscriptions (id, user_id, stripe_customer_id, plan, status)
        VALUES (${`sub_${Date.now()}`}, ${userId}, ${customerId}, 'free', 'active')
        ON CONFLICT (user_id) DO UPDATE SET stripe_customer_id = ${customerId}
      `;
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: planConfig.priceId, quantity: 1 }],
      success_url: `${req.nextUrl.origin}/dashboard?upgraded=true`,
      cancel_url: `${req.nextUrl.origin}/pricing`,
      metadata: { user_id: userId, plan },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Failed to create checkout" }, { status: 500 });
  }
}
