"use client";

import { ShoppingBasketIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { formatCentsToBRL } from "@/helpers/money";
import { useCart } from "@/hooks/queries/use-cart";

import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import CartItem from "./cart-item";

export const Cart = () => {
  const { data: cart } = useCart();
  const hasItems = cart?.items && cart.items.length > 0;
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <ShoppingBasketIcon />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Carrinho</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>

        <div className="flex h-full flex-col px-5 pb-5">
          {hasItems ? (
            <>
              <div className="flex h-full max-h-full flex-col overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="flex h-full flex-col gap-8">
                    {cart?.items.map((item) => (
                      <CartItem
                        key={item.id}
                        id={item.id}
                        productName={item.productStock.productVariant.product.name}
                        productVariantName={item.productStock.productVariant.name}
                        productVariantImageUrl={item.productStock.productVariant.imageUrl}
                        productVariantPriceInCents={item.productStock.productVariant.priceInCents}
                        quantity={item.quantity}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </div>
              <div className="flex flex-col gap-4">
                <Separator />

                <div className="flex items-center justify-between text-xs font-medium">
                  <p>Total</p>
                  <p>{formatCentsToBRL(cart?.totalPriceInCents ?? 0)}</p>
                </div>

                <Button className="mt-5 rounded-full" size="lg" asChild>
                  <Link href="/cart/identification" onClick={() => setOpen(false)}>
                    Finalizar compra
                  </Link>
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center gap-4 py-4 text-center">
              <p className="text-muted-foreground">Seu carrinho está vazio.</p>
              <Image src="/empty-cart.svg" alt="Carrinho vazio" width={100} height={20} />
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
