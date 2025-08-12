import { headers } from "next/headers";
import { redirect } from "next/navigation";

import Footer from "@/components/common/footer";
import { Header } from "@/components/common/header";
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
    <div>
      <Header />
      <div className="space-y-4 px-5">
        <Card>
          <CardHeader>
            <CardTitle>Identificação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Card>
              <CardContent>
                <p className="text-sm">{formatAddress(cart.shippingAddress)}</p>
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
            name: `${item.productStock.productVariant.product.name} - ${item.productStock.productSize.value}`,
            variantName: item.productStock.productVariant.name,
            quantity: item.quantity,
            priceInCents: item.productStock.productVariant.priceInCents,
            imageUrl: item.productStock.productVariant.imageUrl,
          }))}
        />
      </div>
      <div className="mt-12">
        <Footer />
      </div>
    </div>
  );
};

export default ConfirmationPage;
