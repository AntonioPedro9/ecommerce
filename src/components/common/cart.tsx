import { ShoppingBasketIcon } from "lucide-react";

import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { getCart } from "@/actions/get-cart";

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
        <div>
          {cartIsLoading && <p>Carregando...</p>}
          {!cartIsLoading && cart?.items.length === 0 && <p>Seu carrinho está vazio</p>}
          {cart?.items.map((item) => (
            <div key={item.id}>
              <Image
                src={item.productVariant.imageUrl}
                alt={item.productVariant.product.name}
                width={100}
                height={100}
              />
              <h3></h3>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
