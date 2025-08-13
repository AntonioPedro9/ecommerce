"use client";

import { HomeIcon, LogInIcon, LogOutIcon, MenuIcon, TruckIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { categoryTable } from "@/db/schema";
import { authClient } from "@/lib/auth-client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Cart } from "./cart";

interface HeaderProps {
  categories: (typeof categoryTable.$inferSelect)[];
}

export const Header = ({ categories }: HeaderProps) => {
  const { data: session } = authClient.useSession();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const handleLogout = () => {
    authClient.signOut();
    setIsSheetOpen(false);
  };

  return (
    <header className="flex justify-between items-center p-5">
      <Link href="/">
        <Image src="/logo.svg" alt="Beware logo" width={100} height={26.14} />
      </Link>

      <div className="flex items-center gap-3">
        <Cart />
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
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
                  {/* Informações do usuário */}
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

                  <div className="px-5">
                    <Separator className="my-5" />

                    {/* Links de navegação principais */}
                    <ul className="flex flex-col gap-4">
                      <li className="flex items-center gap-2">
                        <HomeIcon size="16" />
                        <p className="text-sm font-medium">
                          <Link href="/" onClick={() => setIsSheetOpen(false)}>
                            Início
                          </Link>
                        </p>
                      </li>
                      <li className="flex items-center gap-2">
                        <TruckIcon size="16" />
                        <p className="text-sm font-medium">
                          <Link href="/my-orders" onClick={() => setIsSheetOpen(false)}>
                            Meus pedidos
                          </Link>
                        </p>
                      </li>
                    </ul>

                    <Separator className="my-5" />

                    {/* Links de categorias */}
                    <ul className="flex flex-col gap-4">
                      {categories.map((category) => (
                        <li key={category.id} className="flex items-center gap-2">
                          <p className="text-sm font-medium">
                            <Link href={`/category/${category.slug}`} onClick={() => setIsSheetOpen(false)}>
                              {category.name}
                            </Link>
                          </p>
                        </li>
                      ))}
                    </ul>

                    <Separator className="my-5" />

                    {/* Link de sair da conta */}
                    <ul className="flex flex-col">
                      <li className="flex items-center gap-2" onClick={handleLogout}>
                        <LogOutIcon size="16" />
                        <p className="text-sm font-medium">
                          <Link href="/authentication" onClick={() => setIsSheetOpen(false)}>
                            Sair da conta
                          </Link>
                        </p>
                      </li>
                    </ul>
                  </div>
                </>
              ) : (
                <>
                  {/* Menu para usuário deslogado */}
                  <div className="flex justify-between items-center">
                    <h2 className="font-semibold">Olá. Faça seu login!</h2>
                    <Button asChild className="rounded-full">
                      <Link href="/authentication" onClick={() => setIsSheetOpen(false)}>
                        Login
                        <LogInIcon />
                      </Link>
                    </Button>
                  </div>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};
