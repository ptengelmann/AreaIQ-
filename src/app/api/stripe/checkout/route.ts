import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { stripe, PLANS, PlanId } from "@/lib/stripe";
import { getStripeCustomerId } from "@/lib/usage";
import { sql } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
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
      const user = await currentUser();
      const customer = await stripe.customers.create({
        email: user?.emailAddresses[0]?.emailAddress,
        metadata: { clerk_user_id: userId },
      });
      customerId = customer.id;

      // Create subscription record with free plan
      await sql`
        INSERT INTO subscriptions (id, user_id, stripe_customer_id, plan, status)
        VALUES (${`sub_${Date.now()}`}, ${userId}, ${customerId}, 'free', 'active')
        ON CONFLICT (user_id) DO UPDATE SET stripe_customer_id = ${customerId}
      `;
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: planConfig.priceId, quantity: 1 }],
      success_url: `${req.nextUrl.origin}/dashboard?upgraded=true`,
      cancel_url: `${req.nextUrl.origin}/pricing`,
      metadata: { clerk_user_id: userId, plan },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Failed to create checkout" }, { status: 500 });
  }
}
