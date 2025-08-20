"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/components/ui/dialog";

const CheckoutSuccessPage = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="text-center [&>button]:hidden">
          <DialogTitle className="mt-4 text-2xl">Pedido efetuado!</DialogTitle>
          <DialogDescription className="font-medium">
            Você pode visualizar em &quot;Meus Pedidos&quot;.
          </DialogDescription>
          <Image src="/order-confirmed.svg" alt="Success" width={100} height={20} className="mx-auto" />
          <DialogFooter className="gap-2">
            <Button className="rounded-full" size="lg" asChild>
              <Link href="/my-orders">Ver meus pedidos</Link>
            </Button>
            <Button className="rounded-full" variant="outline" size="lg" asChild>
              <Link href="/">Voltar para a loja</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CheckoutSuccessPage;
