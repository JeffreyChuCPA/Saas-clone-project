"use server"

import { PaidTierNames, subscriptionTiers } from "@/data/subscriptionTiers";
import { currentUser, User } from "@clerk/nextjs/server";
import { getUserSubscription } from "../db/subscription";
import { redirect } from "next/navigation";
import { Stripe } from "stripe"
import { env as serverEnv } from "@/data/env/server"
import { env as clientEnv } from "@/data/env/client"

const stripe = new Stripe(serverEnv.STRIPE_SECRET_KEY)

export async function createCancelSession() {}

export async function createCustomerPortalSession() {}

export async function createCheckoutSession(tier: PaidTierNames) {
  const user = await currentUser()
  if (user == null) return { error: true }

  const subscription = await getUserSubscription(user.id)

  if (subscription == null) return { error: true }

  if (subscription.stripeCustomerId == null) {
    const url = await getCheckoutSession(tier, user);
    if (url == null) return { error: true };
    redirect(url);
  } else {
    const url = await getSubscriptionUpgradeSession(tier, subscription);
    redirect(url);
  }
}

async function getCheckoutSession(tier: PaidTierNames, user: User) {
  const session = await stripe.checkout.sessions.create({
    customer_email: user.primaryEmailAddress?.emailAddress,
    subscription_data: {
      metadata: {
        clerkUserId: user.id
      }
    },
    line_items: [
      {
        price: subscriptionTiers[tier].stripePriceId,
        quantity: 1
      }
    ],
    mode: "subscription",
    success_url: `${clientEnv.NEXT_PUBLIC_SERVER_URL}/dashboard/subscription`,
    cancel_url: `${clientEnv.NEXT_PUBLIC_SERVER_URL}/dashboard/subscription`
  });

  return session.url;
}

function getSubscriptionUpgradeSession ( tier: string, subscription: { id: string; clerkUserId: string; createdAt: Date; updatedAt: Date; tier: "Free" | "Basic" | "Standard" | "Premium"; stripeSubscriptionItemId: string | null; stripeSubscriptionId: string | null; stripeCustomerId: string | null; } ) {
  throw new Error( "Function not implemented." );
}
