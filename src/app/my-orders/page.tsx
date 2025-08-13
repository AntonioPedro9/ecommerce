import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";

import { Header } from "@/components/common/header";
import { db } from "@/db";
import { orderTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import Orders from "./components/orders";

const MyOrderPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) throw new Error("Unauthorized");

  const orders = await db.query.orderTable.findMany({
    where: eq(orderTable.userId, session.user.id),
    with: {
      items: {
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
      },
    },
    orderBy: [desc(orderTable.createdAt)],
  });

  return (
    <>
      <Header />
      <div className="px-5">
        <Orders
          orders={orders.map((order) => ({
            id: order.id,
            orderNumber: order.orderNumber,
            totalPriceInCents: order.totalPriceInCents,
            status: order.status,
            createdAt: order.createdAt,
            items: order.items.map((item) => ({
              id: item.id,
              imageUrl: item.productStock.productVariant.imageUrl,
              productName: item.productStock.productVariant.product.name,
              productVariantName: `${item.productStock.productVariant.name} - ${item.productStock.productSize.value}`,
              priceInCents: item.productStock.productVariant.priceInCents,
              quantity: item.quantity,
            })),
          }))}
        />
      </div>
    </>
  );
};

export default MyOrderPage;
