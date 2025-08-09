import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { db } from "@/db";
import { orderTable } from "@/db/schema";

export const POST = async (request: Request) => {
  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.error();

  const text = await request.text();

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY!;
  if (!stripeSecretKey) throw new Error("Stripe secret key is not set");

  const stripeWeebhookKey = process.env.STRIPE_WEBHOOK_SECRET!;
  if (!stripeSecretKey) throw new Error("Stripe webhook key is not set");

  const stripe = new Stripe(stripeSecretKey);
  const event = stripe.webhooks.constructEvent(text, signature, stripeWeebhookKey);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;
    if (!orderId) return NextResponse.error();

    await db
      .update(orderTable)
      .set({
        status: "paid",
      })
      .where(eq(orderTable.id, orderId));
  }

  return NextResponse.json({ received: true });
};
