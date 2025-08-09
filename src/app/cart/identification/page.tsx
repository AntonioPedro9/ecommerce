import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Header } from "@/components/common/header";
import { db } from "@/db";
import { auth } from "@/lib/auth";

import Addresses from "./components/addresses";

const Identification = async () => {
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
          productVariant: {
            with: {
              product: true,
            },
          },
        },
      },
    },
  });
  if (!cart || cart?.items.length === 0) redirect("/");

  return (
    <>
      <Header />
      <div className="px-5">
        <Addresses />
      </div>
    </>
  );
};

export default Identification;
