import { ShoppingBasketIcon } from "lucide-react";

import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { useQuery } from "@tanstack/react-query";
import { getCart } from "@/actions/get-cart";
import CartItem from "./cart-item";

export const Cart = () => {
  const { data: cart, isPending: cartIsLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: () => getCart(),
  });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"outline"} size={"icon"}>
          <ShoppingBasketIcon />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Carrinho</SheetTitle>
        </SheetHeader>
        <div className="px-5 space-y-4">
          {cartIsLoading && <p>Carregando...</p>}
          {!cartIsLoading && cart?.items.length === 0 && <p>Seu carrinho está vazio</p>}
          {cart?.items.map((item) => (
            <CartItem
              key={item.id}
              id={item.id}
              productName={item.productVariant.product.name}
              productVariantName={item.productVariant.name}
              productVariantImageUrl={item.productVariant.imageUrl}
              productVariantPriceInCents={item.productVariant.priceInCents}
              quantity={item.quantity}
            />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
