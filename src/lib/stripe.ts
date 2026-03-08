import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
});

export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    reportsPerMonth: 3,
    priceId: null,
  },
  starter: {
    name: "Starter",
    price: 2900, // £29 in pence
    reportsPerMonth: 20,
    priceId: process.env.STRIPE_STARTER_PRICE_ID!,
  },
  pro: {
    name: "Pro",
    price: 7900, // £79 in pence
    reportsPerMonth: 75,
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
  },
  business: {
    name: "Business",
    price: 24900, // £249 in pence
    reportsPerMonth: 300,
    priceId: process.env.STRIPE_BUSINESS_PRICE_ID!,
  },
} as const;

export type PlanId = keyof typeof PLANS;
