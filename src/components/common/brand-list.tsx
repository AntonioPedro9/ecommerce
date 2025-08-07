import Image from "next/image";

import { Card } from "../ui/card";

const BrandList = () => {
  return (
    <div className="space-y-6">
      <h3 className="px-5 font-semibold">Marcas parceiras</h3>

      <div className="flex w-full gap-4 overflow-x-auto px-5 [&::-webkit-scrollbar]:hidden">
        <div className="flex flex-col items-center space-y-6">
          <Card className="flex justify-center items-center w-[80px] rounded-3xl">
            <Image src="/simple-icons_nike.svg" alt="Nike" width={32} height={32} className="rounded-3xl" />
          </Card>
          <p className="truncate text-sm font-medium">Nike</p>
        </div>

        <div className="flex flex-col items-center space-y-6">
          <Card className="flex justify-center items-center w-[80px] rounded-3xl">
            <Image src="/simple-icons_adidas.svg" alt="Adidas" width={32} height={32} className="rounded-3xl" />
          </Card>
          <p className="truncate text-sm font-medium">Adidas</p>
        </div>

        <div className="flex flex-col items-center space-y-6">
          <Card className="flex justify-center items-center w-[80px] rounded-3xl">
            <Image src="/simple-icons_puma.svg" alt="Puma" width={32} height={32} className="rounded-3xl" />
          </Card>
          <p className="truncate text-sm font-medium">Puma</p>
        </div>

        <div className="flex flex-col items-center space-y-6">
          <Card className="flex justify-center items-center w-[80px] rounded-3xl">
            <Image
              src="/simple-icons_newbalance.svg"
              alt="New Balance"
              width={32}
              height={32}
              className="rounded-3xl"
            />
          </Card>
          <p className="truncate text-sm font-medium">New Balance</p>
        </div>
      </div>
    </div>
  );
};

export default BrandList;
