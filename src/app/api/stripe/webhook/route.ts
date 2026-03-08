import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { sql } from "@/lib/db";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event: Stripe.Event;

  if (process.env.STRIPE_WEBHOOK_SECRET && sig) {
    try {
      event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
  } else {
    event = JSON.parse(body) as Stripe.Event;
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const clerkUserId = session.metadata?.user_id;
      const plan = session.metadata?.plan;

      if (clerkUserId && plan && session.subscription) {
        const sub = await stripe.subscriptions.retrieve(
          session.subscription as string
        ) as unknown as {
          id: string;
          current_period_start: number;
          current_period_end: number;
        };

        await sql`
          INSERT INTO subscriptions (id, user_id, stripe_customer_id, stripe_subscription_id, plan, status, current_period_start, current_period_end)
          VALUES (
            ${`sub_${Date.now()}`},
            ${clerkUserId},
            ${session.customer as string},
            ${sub.id},
            ${plan},
            'active',
            ${new Date(sub.current_period_start * 1000).toISOString()},
            ${new Date(sub.current_period_end * 1000).toISOString()}
          )
          ON CONFLICT (user_id) DO UPDATE SET
            stripe_subscription_id = ${sub.id},
            plan = ${plan},
            status = 'active',
            current_period_start = ${new Date(sub.current_period_start * 1000).toISOString()},
            current_period_end = ${new Date(sub.current_period_end * 1000).toISOString()},
            updated_at = NOW()
        `;
      }
      break;
    }

    case "customer.subscription.updated": {
      const sub = event.data.object as unknown as {
        customer: string;
        status: string;
        current_period_start: number;
        current_period_end: number;
      };

      await sql`
        UPDATE subscriptions SET
          status = ${sub.status === "active" ? "active" : "inactive"},
          current_period_start = ${new Date(sub.current_period_start * 1000).toISOString()},
          current_period_end = ${new Date(sub.current_period_end * 1000).toISOString()},
          updated_at = NOW()
        WHERE stripe_customer_id = ${sub.customer}
      `;
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as unknown as { customer: string };

      await sql`
        UPDATE subscriptions SET
          plan = 'free',
          status = 'active',
          stripe_subscription_id = NULL,
          current_period_start = NULL,
          current_period_end = NULL,
          updated_at = NOW()
        WHERE stripe_customer_id = ${sub.customer}
      `;
      break;
    }
  }

  return NextResponse.json({ received: true });
}
