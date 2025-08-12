import Image from "next/image";
import Link from "next/link";

import { productVariantTable } from "@/db/schema";

interface VariantSelectorProps {
  variants: (typeof productVariantTable.$inferSelect)[];
  selectedVariantSlug?: string;
}

const VariantSelector = ({ variants, selectedVariantSlug }: VariantSelectorProps) => {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-medium">Cores e modelos</h3>
      <div className="flex items-center gap-4">
        {variants.map((variant) => (
          <Link
            key={variant.id}
            href={`/product/${variant.slug}`}
            className={selectedVariantSlug === variant.slug ? "border-2 border-primary rounded-xl" : ""}
          >
            <Image width={68} height={68} src={variant.imageUrl} alt={variant.name} className="rounded-xl" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default VariantSelector;
