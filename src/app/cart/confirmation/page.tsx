import { headers } from "next/headers";
import { redirect } from "next/navigation";

import Footer from "@/components/common/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { auth } from "@/lib/auth";

import CartSummary from "../components/cart-summary";
import { formatAddress } from "../helpers/address";
import FinishOrderButton from "./components/finish-order-button";

const ConfirmationPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user.id) redirect("/");

  const cart = await db.query.cartTable.findFirst({
    where: (cart, { eq }) => eq(cart.userId, session.user.id),
    with: {
      shippingAddress: true,
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
  });
  if (!cart || cart?.items.length === 0) redirect("/");

  const cartTotalInCents = cart.items.reduce(
    (acc, item) => acc + item.productStock.productVariant.priceInCents * item.quantity,
    0
  );
  if (!cart.shippingAddress) redirect("/cart/identification");

  return (
    <>
      <div className="space-y-4 px-5">
        <Card>
          <CardHeader>
            <CardTitle>Identificação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Card>
              <CardContent>
                <p className="text-sm font-semibold">{cart.shippingAddress.recipientName}</p>
                <pre className="text-sm text-muted-foreground">{formatAddress(cart.shippingAddress)}</pre>
              </CardContent>
            </Card>
            <FinishOrderButton />
          </CardContent>
        </Card>
        <CartSummary
          subtotalInCents={cartTotalInCents}
          totalInCents={cartTotalInCents}
          products={cart.items.map((item) => ({
            id: item.productStock.productVariant.id,
            name: item.productStock.productVariant.product.name,
            variantName: item.productStock.productVariant.name,
            size: item.productStock.productSize.value,
            quantity: item.quantity,
            priceInCents: item.productStock.productVariant.priceInCents,
            imageUrl: item.productStock.productVariant.imageUrl,
          }))}
        />
      </div>
      <div className="mt-12">
        <Footer />
      </div>
    </>
  );
};

export default ConfirmationPage;
