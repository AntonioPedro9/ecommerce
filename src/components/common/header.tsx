"use client";

import { HomeIcon, LogInIcon, LogOutIcon, MenuIcon, ShoppingBasketIcon, TruckIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { authClient } from "@/lib/auth-client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Cart } from "./cart";

export const Header = () => {
  const { data: session } = authClient.useSession();

  return (
    <header className="flex justify-between items-center p-5">
      <Link href="/">
        <Image src="/logo.svg" alt="Beware logo" width={100} height={26.14} />
      </Link>

      <div className="flex items-center gap-3">
        <Cart />
        <Sheet>
          <SheetTrigger asChild>
            <Button variant={"outline"} size={"icon"}>
              <MenuIcon />
            </Button>
          </SheetTrigger>

          <SheetContent>
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="px-5">
              {session?.user ? (
                <>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={session?.user?.image as string | undefined} />
                        <AvatarFallback>
                          {session?.user?.name?.split(" ")?.[0]?.[0]}
                          {session?.user?.name?.split(" ")?.[1]?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{session?.user?.name}</h3>
                        <span className="text-muted-foreground block text-xs">{session?.user?.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="px-5 my-5">
                    <Separator />
                  </div>

                  <ul className="flex flex-col gap-4 px-5">
                    <li className="flex items-center gap-2">
                      <HomeIcon size="16" />
                      <Link href="/">Início</Link>
                    </li>

                    <li className="flex items-center gap-2">
                      <TruckIcon size="16" />
                      <Link href="/my-orders">Meus pedidos</Link>
                    </li>

                    <li className="flex items-center gap-2" onClick={() => authClient.signOut()}>
                      <LogOutIcon size="16" />
                      <Link href="/authentication">Sair da conta</Link>
                    </li>
                  </ul>
                </>
              ) : (
                <div className="flex justify-between items-center">
                  <h2 className="font-semibold">Olá, Faça seu login!</h2>
                  <Button size={"icon"} asChild variant={"outline"}>
                    <Link href="/authentication">
                      <LogInIcon />
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};
