import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { db } from "@/db";
import { orderTable, productStockTable } from "@/db/schema";

export const POST = async (request: Request) => {
  const signature = request.headers.get("stripe-signature");
  if (!signature) return new NextResponse("No signature", { status: 400 });

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY!;
  if (!stripeSecretKey) throw new Error("Stripe secret key is not set");

  const stripeWeebhookKey = process.env.STRIPE_WEBHOOK_SECRET!;
  if (!stripeWeebhookKey) throw new Error("Stripe webhook key is not set");

  const text = await request.text();
  const stripe = new Stripe(stripeSecretKey);

  try {
    const event = stripe.webhooks.constructEvent(text, signature, stripeWeebhookKey);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const orderId = session.metadata?.orderId;

      if (!orderId) {
        return new NextResponse("Order ID not found in metadata", { status: 400 });
      }

      await db.transaction(async (tx) => {
        // 1. Busque o pedido e seus itens com o respectivo estoque
        const order = await tx.query.orderTable.findFirst({
          where: eq(orderTable.id, orderId),
          with: {
            items: {
              with: {
                productStock: true,
              },
            },
          },
        });

        if (!order) {
          throw new Error("Order not found in database.");
        }

        // 2. Abata a quantidade de cada produto no estoque
        for (const item of order.items) {
          if (!item.productStock) {
            throw new Error(`Product stock not found for order item ${item.id}`);
          }
          await tx
            .update(productStockTable)
            .set({
              quantity: sql`${productStockTable.quantity} - ${item.quantity}`,
              updatedAt: new Date(),
            })
            .where(eq(productStockTable.id, item.productStock.id));
        }

        // 3. Atualize o status do pedido para 'paid'
        await tx
          .update(orderTable)
          .set({
            status: "paid",
          })
          .where(eq(orderTable.id, orderId));
      });
    }

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error(`❌ Erro no Webhook do Stripe: ${errorMessage}`);
    return new NextResponse(`Webhook Error: ${errorMessage}`, { status: 400 });
  }
};
