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
    apiAccess: false,
  },
  starter: {
    name: "Starter",
    price: 2900, // £29 in pence
    reportsPerMonth: 20,
    priceId: process.env.STRIPE_STARTER_PRICE_ID!,
    apiAccess: false,
  },
  pro: {
    name: "Pro",
    price: 7900, // £79 in pence
    reportsPerMonth: 75,
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    apiAccess: false,
  },
  developer: {
    name: "Developer",
    price: 4900, // £49 in pence
    reportsPerMonth: 100,
    priceId: process.env.STRIPE_DEVELOPER_PRICE_ID!,
    apiAccess: true,
  },
  business: {
    name: "Business",
    price: 24900, // £249 in pence
    reportsPerMonth: 500,
    priceId: process.env.STRIPE_BUSINESS_PRICE_ID!,
    apiAccess: true,
  },
  growth: {
    name: "Growth",
    price: 49900, // £499 in pence
    reportsPerMonth: 1500,
    priceId: process.env.STRIPE_GROWTH_PRICE_ID!,
    apiAccess: true,
  },
} as const;

export type PlanId = keyof typeof PLANS;

export const API_PLANS: PlanId[] = ["developer", "business", "growth"];
export const CONSUMER_PLANS: PlanId[] = ["free", "starter", "pro"];
