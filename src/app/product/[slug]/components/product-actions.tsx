"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import AddToCartButton from "./add-to-cart-button";

interface Size {
  id: string;
  value: string;
  stockId: string;
}

interface ProductActionProps {
  productVariantId: string;
  availableSizes: Size[];
}

const ProductActions = ({ productVariantId, availableSizes }: ProductActionProps) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(null);

  const handleDecrement = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const selectedProductStock = availableSizes.find((size) => size.id === selectedSizeId);
  const selectedProductStockId = selectedProductStock?.stockId || null;

  const isAddToCartDisabled = !selectedProductStockId;

  return (
    <>
      <div className="px-5">
        <div className="  space-y-4">
          <h3 className="font-medium">Tamanho</h3>
          <div className="flex items-center gap-2 flex-wrap">
            {availableSizes.map((size) => (
              <Button
                key={size.id}
                variant="ghost"
                className={`flex justify-center items-center border-2 h-[40px] ${
                  selectedSizeId === size.id ? "border-primary" : ""
                }`}
                onClick={() => setSelectedSizeId(size.id)}
              >
                {size.value}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-4">
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
        <AddToCartButton productStockId={selectedProductStockId} quantity={quantity} disabled={isAddToCartDisabled} />
        <Button className="rounded-full" size="lg">
          Comprar agora
        </Button>
      </div>
    </>
  );
};

export default ProductActions;
