import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { db } from "@/db";
import { orderTable, productStockTable } from "@/db/schema";

export const POST = async (request: Request) => {
  const signature = request.headers.get("stripe-signature");
  if (!signature) return new NextResponse("No signature", { status: 400 });

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY!;
  if (!stripeSecretKey) throw new Error("Stripe secret key is not set");

  const stripeWebhookKey = process.env.STRIPE_WEBHOOK_SECRET!;
  if (!stripeWebhookKey) throw new Error("Stripe webhook key is not set");

  const text = await request.text();
  const stripe = new Stripe(stripeSecretKey);

  try {
    const event = stripe.webhooks.constructEvent(text, signature, stripeWebhookKey);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const orderId = session.metadata?.orderId;

      if (!orderId) {
        console.error("❌ Order ID not found in metadata", { orderId, sessionId: session.id });
        return new NextResponse("Order ID not found in metadata", { status: 400 });
      }

      console.log("✅ Processing checkout completion", { orderId, sessionId: session.id });

      await db.transaction(async (tx) => {
        // Busca o pedido e seus itens com o respectivo estoque
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
        if (!order) throw new Error(`Order not found in database: ${orderId}`);

        // Valida se o pedido já foi processado
        if (order.status === "paid") {
          console.log("⚠️ Order already processed", { orderId, status: order.status });
          return;
        }

        // Valida se há estoque suficiente antes de abater
        for (const item of order.items) {
          if (!item.productStock) {
            throw new Error(`Product stock not found for order item ${item.id}`);
          }
          if (item.productStock.quantity < item.quantity) {
            throw new Error(
              `Insufficient stock for product ${item.productStock.id}. Required: ${item.quantity}, Available: ${item.productStock.quantity}`
            );
          }
        }

        // Abate a quantidade de cada produto no estoque
        for (const item of order.items) {
          const newQuantity = item.productStock.quantity - item.quantity;

          await tx
            .update(productStockTable)
            .set({
              quantity: newQuantity,
              updatedAt: new Date(),
            })
            .where(eq(productStockTable.id, item.productStock.id));

          console.log("📦 Stock updated", {
            productStockId: item.productStock.id,
            oldQuantity: item.productStock.quantity,
            newQuantity,
            quantityReduced: item.quantity,
          });
        }

        // Atualiza o status do pedido para "paid"
        await tx
          .update(orderTable)
          .set({
            status: "paid",
          })
          .where(eq(orderTable.id, orderId));

        console.log("✅ Order marked as paid", { orderId });
      });
    }

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("❌ Stripe webhook error", {
      error: errorMessage,
      eventType: event?.type,
      timestamp: new Date().toISOString(),
    });
    return new NextResponse(`Webhook Error: ${errorMessage}`, { status: 400 });
  }
};
