"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import AddToCartButton from "./add-to-cart-button";

interface ProductActionProps {
  productVariantId: string;
}

const ProductActions = ({ productVariantId }: ProductActionProps) => {
  const [quantity, setQuantity] = useState(1);

  const handleDecrement = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  return (
    <>
      <div className="px-5">
        <div className="space-y-4">
          <h3 className="font-medium">Quantidade</h3>
          <div className="w-[100px] flex justify-between items-center border rounded-full">
            <Button size="icon" variant="ghost" onClick={handleDecrement} className="rounded-full">
              <MinusIcon />
            </Button>
            <p>{quantity}</p>
            <Button size="icon" variant="ghost" onClick={handleIncrement} className="rounded-full">
              <PlusIcon />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col px-5 space-y-4">
        <AddToCartButton productVariantId={productVariantId} quantity={quantity} />
        <Button className="rounded-full" size="lg">
          Comprar agora
        </Button>
      </div>
    </>
  );
};

export default ProductActions;
