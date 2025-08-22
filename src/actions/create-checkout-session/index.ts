"use server";

import { eq } from "drizzle-orm";
import Stripe from "stripe";

import { db } from "@/db";
import { orderItemTable, orderTable } from "@/db/schema";
import { requireUserAuth } from "@/lib/user-auth";

import { CreateCheckoutSessionSchema, createCheckoutSessionSchema } from "./schema";

export const createCheckoutSession = async (data: CreateCheckoutSessionSchema) => {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY!;
  if (!stripeSecretKey) throw new Error("Stripe secret key is not set");

  const user = await requireUserAuth();

  const { orderId } = createCheckoutSessionSchema.parse(data);

  const order = await db.query.orderTable.findFirst({
    where: eq(orderTable.id, orderId),
  });
  if (!order) throw new Error("Order not found");

  const orderDoesNotBelongToUser = order.userId !== user.id;
  if (orderDoesNotBelongToUser) throw new Error("Unauthorized");

  const orderItems = await db.query.orderItemTable.findMany({
    where: eq(orderItemTable.orderId, orderId),
    with: {
      productStock: {
        with: {
          productVariant: {
            with: {
              product: true,
            },
          },
          productSize: true,
        },
      },
    },
  });

  const stripe = new Stripe(stripeSecretKey);
  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
    metadata: {
      orderId,
    },
    line_items: orderItems.map((orderItem) => {
      const variant = orderItem.productStock.productVariant;
      const product = variant.product;
      const productSize = orderItem.productStock.productSize;

      return {
        price_data: {
          currency: "brl",
          product_data: {
            name: `${product.name} - ${variant.name} (${productSize.value})`,
            description: product.description,
            images: [variant.imageUrl],
          },
          unit_amount: orderItem.priceInCents,
        },
        quantity: orderItem.quantity,
      };
    }),
  });

  return checkoutSession;
};
