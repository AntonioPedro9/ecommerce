// add-to-cart-button.tsx
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { addProductToCart } from "@/actions/add-cart-product";
import { Button } from "@/components/ui/button";

interface AddToCartButtonProps {
  productStockId: string | null;
  quantity: number;
}

const AddToCartButton = ({ productStockId, quantity }: AddToCartButtonProps) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["addProductToCart", productStockId, quantity],
    mutationFn: () => {
      if (!productStockId) throw new Error("Tamanho não selecionado");
      return addProductToCart({
        productStockId,
        quantity,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Produto adicionado ao carrinho.");
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao adicionar produto.");
    },
  });

  const handleAddToCartClick = () => {
    if (!productStockId) {
      toast.error("Por favor, selecione um tamanho para continuar.");
      return;
    }
    mutate();
  };

  return (
    <Button className="rounded-full" size="lg" variant="outline" disabled={isPending} onClick={handleAddToCartClick}>
      {isPending && <Loader2 className="animate-spin" />}
      Adicionar ao carrinho
    </Button>
  );
};

export default AddToCartButton;
