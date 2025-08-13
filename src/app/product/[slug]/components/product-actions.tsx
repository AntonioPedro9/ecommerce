"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MinusIcon, PlusIcon } from "lucide-react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { addProductToCart } from "@/actions/add-cart-product";
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

const ProductActions = ({ availableSizes }: ProductActionProps) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (availableSizes.length === 1 && availableSizes[0].value === "Único") {
      setSelectedSizeId(availableSizes[0].id);
    }
  }, [availableSizes]);

  const handleDecrement = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const selectedProductStock = availableSizes.find((size) => size.id === selectedSizeId);
  const selectedProductStockId = selectedProductStock?.stockId || null;

  const handleBuyNow = () => {
    if (!selectedProductStockId) {
      toast.error("Por favor, selecione um tamanho para continuar.");
      return;
    }
    buyNowMutate();
  };

  const { mutate: buyNowMutate, isPending: isBuyNowPending } = useMutation({
    mutationFn: () =>
      addProductToCart({
        productStockId: selectedProductStockId!,
        quantity,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      router.push("/cart/identification");
    },
    onError: () => {
      toast.error("Erro ao adicionar o produto.");
    },
  });

  return (
    <>
      <div className="px-5">
        <div className="space-y-2">
          <h3 className="font-medium">Tamanho</h3>
          <div className="flex items-center gap-1 flex-wrap">
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

        <div className="flex flex-col space-y-2 mt-4">
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

      <div className="flex flex-col px-5 space-y-2">
        <AddToCartButton productStockId={selectedProductStockId} quantity={quantity} />
        <Button className="rounded-full" size="lg" disabled={isBuyNowPending} onClick={handleBuyNow}>
          {isBuyNowPending && <Loader2 className="animate-spin" />}
          Comprar agora
        </Button>
      </div>
    </>
  );
};

export default ProductActions;
