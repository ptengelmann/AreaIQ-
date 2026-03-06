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
  pro: {
    name: "Pro",
    price: 3900, // £39 in pence
    reportsPerMonth: Infinity,
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
  },
  api: {
    name: "API",
    price: 7900, // £79 in pence
    reportsPerMonth: Infinity,
    priceId: process.env.STRIPE_API_PRICE_ID!,
  },
} as const;

export type PlanId = keyof typeof PLANS;
